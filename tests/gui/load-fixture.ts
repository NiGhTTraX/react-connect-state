import { bindBrowser, Browser, setViewportSize } from 'tdd-buffet/suite/gui';

const loadFixture = bindBrowser(async (
  browser: Browser,
  componentPath: string,
  fixturePath: string
) => {
  await browser.url(
    'http://playground:8989/'
    + `?component=${encodeURIComponent(componentPath)}`
    + `&fixture=${encodeURIComponent(fixturePath)}`
    + '&fullScreen=true'
  );

  const container = await browser.$('[class^=index__container]');
  await container.waitForDisplayed(5 * 1000);

  await setViewportSize(1024, 768);

  const iframe = await browser.$('[class^=index__container] iframe');
  await browser.switchToFrame(iframe);
});

export { loadFixture };
