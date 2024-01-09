import assert from "assert";
import { Page } from "puppeteer";

jest.setTimeout(120000)

describe('Basic gameplay', () => {
  let page1: Page;
  let page2: Page;
  beforeAll( async () => {
  // Set a definite size for the page viewport so view is consistent across browsers
    page1 = await browser.newPage();
    page2 = await browser.newPage();
    // await page1.setViewport( {
    //   width: 1366,
    //   height: 768,
    //   deviceScaleFactor: 1
    // } );	

    await page1.goto('http://localhost:3000/');
    await page2.goto('http://localhost:3000/');

    await page1.waitForTimeout(3000);
    await page2.waitForTimeout(3000);

    
    } );

  it( 'Player 1 should enter the game', async () => {
    await page1.bringToFront();
    await page1.type('#playersNumber', '2')
    await page1.type('#playerNameStartGame', 'Player1')
    await page1.click('#startGame')
    await page1.waitForTimeout(3000);

    let pageContent = await page1.content();
    assert.ok(pageContent.includes('You are playing game 0 as Player1'));
  })	

  it( 'Player 2 should enter the game', async () => {
    await page2.bringToFront();
    await page2.type('#gameId', '0')
    await page2.type('#playerNameJoinGame', 'Player2')
    await page2.click('#joinGame')
    await page2.waitForTimeout(3000);

    let pageContent = await page2.content();
    assert.ok(pageContent.includes('You are playing game 0 as Player2'));
  })
  
  it( 'Player 1 should play the game and sum card', async () => {
    await page1.bringToFront();
    await page1.click('#play')
    await page1.waitForTimeout(3000);

    let pageContent = await page1.content();
    assert.ok(pageContent.includes('Sum'));
    assert.ok(pageContent.includes('Multiply'));
    assert.ok(pageContent.includes('Divide'));
    assert.ok(pageContent.includes('Number Of Zeros'));
    assert.ok(pageContent.includes('Play Card'));

    await page1.click('#Sum')
    await page1.click('#playCard')
    await page1.waitForTimeout(3000);
    pageContent = await page1.content();
    assert.ok(pageContent.includes('Select a player to play Sum card with'));


    await page1.click('#Player2')
    await page1.click('#selectPlayer')
    await page1.waitForTimeout(3000);
    pageContent = await page1.content();
    assert.ok(pageContent.includes('Waiting for Player2 to accept using Sum card...'));
  })
  
  it( 'Player 2 should play the game', async () => {
    await page2.bringToFront();
    await page2.click('#play')
    await page2.waitForTimeout(3000);

    let pageContent = await page2.content();
    assert.ok(pageContent.includes('Sum'));
    assert.ok(pageContent.includes('Multiply'));
    assert.ok(pageContent.includes('Divide'));
    assert.ok(pageContent.includes('Number Of Zeros'));
    assert.ok(pageContent.includes('Play Card'));
    assert.ok(pageContent.includes('Acept Use Card Sum With Player1'));

    await page2.click('#acceptSumCardPlayer1')
    await page2.waitForTimeout(3000);

    pageContent = await page2.content();
    assert.ok(pageContent.includes('You are playing game 0 as Player2'));
  })

  it( 'Player use Sum card together', async () => {
    page2.bringToFront();
    let pageContent = await page2.content();
    let resultIndex = pageContent.indexOf('Player2 plus Player1 :') + 1;
    let result2 = Number(pageContent.substring(resultIndex, resultIndex + 3));
    assert.ok(pageContent.includes('Player2 plus Player1 :'));

    page1.bringToFront();
    await page1.click('#refresh')
    await page1.waitForTimeout(3000);   

    pageContent = await page1.content();
    resultIndex = pageContent.indexOf('Player1 plus Player2 :') + 1;
    let result1 = Number(pageContent.substring(resultIndex, resultIndex + 3));
    assert.ok(pageContent.includes('Player2 plus Player1 :'));

    assert.equal(result1, result2);
  })

  it( 'Player1 should end the game and guess the number', async () => {
    await page1.bringToFront();
    await page1.click('#back');
    await page1.waitForTimeout(3000);

    let pageContent = await page1.content();
    assert.ok(pageContent.includes('Set your guess for the game'));

    await page1.click('#guess')
    await page1.waitForTimeout(3000);
    await page1.type('#Player1', '1');
    await page1.type('#Player2', '2');
    await page1.click('#setGuess')
    await page1.waitForTimeout(3000);
    pageContent = await page1.content();
    assert.ok(pageContent.includes('Waiting for other players to guess, please press Refresh when ready...'));
  })

  it( 'Player2 should end the game and guess the number', async () => {
    await page2.bringToFront();
    await page2.click('#back');
    await page2.waitForTimeout(3000);

    let pageContent = await page2.content();
    assert.ok(pageContent.includes('Set your guess for the game'));

    await page2.click('#guess')
    await page2.waitForTimeout(3000);
    await page2.type('#Player1', '1');
    await page2.type('#Player2', '2');
    await page2.click('#setGuess')
    await page2.waitForTimeout(3000);
    pageContent = await page2.content();
    assert.ok(pageContent.includes('Waiting for other players to guess, please press Refresh when ready...'));
  })

  it( 'Player1 should view results', async () => {
    await page1.bringToFront();
    await page1.click('#refresh');
    await page1.waitForTimeout(3000);

    let pageContent = await page1.content();
    assert.ok(pageContent.includes('Player1 has'));
    assert.ok(pageContent.includes('Player2 has'));
  })

  it( 'Player2 should view results and close game', async () => {
    await page2.bringToFront();
    await page2.click('#refresh');
    await page2.waitForTimeout(3000);

    let pageContent = await page2.content();
    assert.ok(pageContent.includes('Player1 has'));
    assert.ok(pageContent.includes('Player2 has'));

    await page2.click('#close')
    await page2.waitForTimeout(3000);
    pageContent = await page2.content();
    assert.ok(pageContent.includes('Right now there are 0 games open'));
  })
});
