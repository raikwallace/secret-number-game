import assert from "assert";
import { Page } from "puppeteer";

jest.setTimeout(60000)

describe('Basic gameplay', () => {
  let page1: Page;
  let page2: Page;
  beforeAll( async () => {
  // Set a definite size for the page viewport so view is consistent across browsers
    // page1 = await browser.newPage();
    // page2 = await browser.newPage();
    // await page1.setViewport( {
    //   width: 1366,
    //   height: 768,
    //   deviceScaleFactor: 1
    // } );	

    await page.goto('http://localhost:3000/');
    // await page2.goto('http://localhost:3000/');

    await page.waitForTimeout(3000);
    // await page2.waitForTimeout(5000);

    
    } );

  it( 'Should be truthy 1', async () => {
    await page.type('#playersNumber', '2')
    await page.type('#playerNameStartGame', 'Player1')
    await page.click('#startGame')
    await page.waitForTimeout(3000);

    let pageContent = await page.content();
    assert.ok(pageContent.includes('You are playing game 0 as Player1'));

    // page2.type('#gameId', '0')
    // page2.type('#playerName', 'Player2')
    // page2.click('Join Game')
  })	

  it( 'Should be truthy 2', async () => {
    expect( true ).toBeTruthy();
  })	
});
