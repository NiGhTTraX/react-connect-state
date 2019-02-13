import { remote, Client, RawResult } from 'webdriverio';
// @ts-ignore
import Mugshot from 'mugshot';
// @ts-ignore
import WebdriverIOAdapter from 'mugshot-webdriverio';
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import {
  runnerAfter,
  runnerBefore,
  runnerBeforeEach,
  runnerIt,
  runnerDescribe
} from '../mocha-runner';

export type TestDefinition = (browser: Client<RawResult<null>>) => Promise<any> | void;

const { BROWSER = 'chrome', SELENIUM_HOST = 'localhost' } = process.env;

enum TIMEOUT {
  // eslint-disable-next-line no-unused-vars
  FIXTURE_LOAD = 10 * 1000
}

let suiteNesting = 0;

// These will hold root suite level instances. Since most, if not all test
// runners run tests inside of a suite sequentially and since we only set
// up the browser once per root test suite, these should be "thread safe".
let rootSuiteBrowser: Client<RawResult<null>> & RawResult<null>, rootSuiteMugshot: any;

/**
 * Run your gui tests in a fresh Selenium session.
 *
 * Nested calls will preserve the root session.
 *
 * Tests and hooks will receive the browser instance.
 */
export function describe(name: string, definition: () => void) {
  suiteNesting++;

  runnerDescribe(name, function() {
    // We only want to set up hooks once - for the root suite.
    suiteNesting === 1 && setupHooks();

    definition();
  });

  suiteNesting--;
}

export function beforeEach(definition: TestDefinition) {
  runnerBeforeEach(function() {
    return definition(rootSuiteBrowser);
  });
}

/**
 * Run a test with optional coverage report.
 */
export function it(name: string, definition: TestDefinition = () => {}) {
  runnerIt(name, testName => {
    const promise = Promise.resolve(definition(rootSuiteBrowser));

    if (!process.env.COVERAGE) {
      return promise;
    }

    return promise.then(() => collectCoverage(testName));
  });
}

/**
 * Perform a visual test alongside a normal test.
 *
 * The visual test will not be performed if the test in `definition` fails.
 *
 * @param {String} name The name of the test. The screenshot will be taken under
 *   the full test name (including any parent suite's name(s)).
 * @param definition
 * @param selector
 */
export function vit(name: string, definition: TestDefinition, selector:string = '#root > *') {
  runnerIt(name, testName => {
    let promise = Promise.resolve(definition(rootSuiteBrowser));

    // Don't want to make debugging tests more noisy than it needs to be.
    if (!process.env.DEBUG) {
      promise = promise.then(() => checkForVisualChanges(testName, selector));
    }

    if (process.env.COVERAGE) {
      promise = promise.then(() => collectCoverage(testName));
    }

    return promise;
  });
}

export async function loadFixture(componentPath: string, fixturePath: string) {
  await rootSuiteBrowser.url(
    'http://playground:8989/'
    + `?component=${encodeURIComponent(componentPath)}`
    + `&fixture=${encodeURIComponent(fixturePath)}`
    + '&fullScreen=true'
  );

  await rootSuiteBrowser.setViewportSize({ width: 1024, height: 768 });

  await rootSuiteBrowser.waitForVisible('[class^=index__container]', TIMEOUT.FIXTURE_LOAD);

  const { value: iframe } = await rootSuiteBrowser.element('[class^=index__container] iframe');
  await rootSuiteBrowser.frame(iframe);
}

export { expect };

function checkForVisualChanges(name: string, selector:string = 'body > *') {
  return new Promise((resolve, reject) => {
    rootSuiteMugshot.test(
      { name: getSafeFilename(name), selector },
      (err: Error, result: { isEqual: boolean }) => {
        if (err) {
          return reject(err);
        }

        expect(result.isEqual, 'Visual changes detected. Check screenshots').to.be.true;

        return resolve();
      }
    );
  });
}

/**
 * @param {string} testName
 */
function collectCoverage(testName: string): Promise<void> {
  const safeTestName = getSafeFilename(testName);

  return Promise.resolve(rootSuiteBrowser.execute(function getCoverage() {
    // @ts-ignore
    return JSON.stringify(window.__coverage__);
  })).then(({ value: coverage }) => {
    fs.writeFileSync(
      path.join(__dirname, 'results', 'coverage', `${BROWSER}_${safeTestName}.json`),
      coverage
    );
  });
}

/**
 * Turn the given file name into something that's safe to save on the FS.
 */
function getSafeFilename(fileName: string): string {
  return fileName
    .replace(/\//g, '_')
    .replace(/ /g, '_')
    .toLowerCase();
}

function setupHooks() {
  runnerBefore(function connectToSelenium() {
    const options = {
      host: SELENIUM_HOST,
      desiredCapabilities: { browserName: BROWSER }
    };

    rootSuiteBrowser = remote(options).init();

    const adapter = new WebdriverIOAdapter(rootSuiteBrowser);

    rootSuiteMugshot = new Mugshot(adapter, {
      rootDirectory: path.join(__dirname, 'screenshots', BROWSER),
      acceptFirstBaseline: false
    });

    return rootSuiteBrowser;
  });

  runnerAfter(function endSession() {
    return rootSuiteBrowser.end();
  });
}
