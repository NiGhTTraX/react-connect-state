import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

declare global {
  namespace NodeJS {
    interface Global {
      window: any;
      fetch: any;
      document: any;
      navigator: any;
      requestAnimationFrame: any;
      cancelAnimationFrame: any;
      HTMLElement: any;
    }
  }
}

// React needs these.
global.window = new JSDOM('').window;
global.fetch = fetch;
global.document = global.window.document;
global.navigator = {
  userAgent: 'node.js'
};
global.requestAnimationFrame = (callback: () => void) => {
  setTimeout(callback, 0);
};
global.cancelAnimationFrame = () => {};

// SinonJS needs this.
global.HTMLElement = global.window.HTMLElement;

// wait-for-expect needs this
global.window.Date = Date;
