import { after, afterEach, before, beforeEach, describe, it } from 'mocha';

export function runnerIt(name: string, definition?: (testName: string) => Promise<any>|void) {
  it(name, definition ? function() {
    // @ts-ignore
    const testName = this.test.fullTitle();

    return definition(testName);
  } : undefined);
}

export {
  describe as runnerDescribe,
  beforeEach as runnerBeforeEach,
  afterEach as runnerAfterEach,
  before as runnerBefore,
  after as runnerAfter
};
