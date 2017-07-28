import { LlyjPcPage } from './app.po';

describe('llyj-pc App', () => {
  let page: LlyjPcPage;

  beforeEach(() => {
    page = new LlyjPcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
