import GameController from './controllers/GameController';
import ServerInput from './ServerInput';
import ServerOutput from './ServerOutput';
import GamesManager from '../../services/GamesManager';
import WebController from './controllers/WebController';

const express = require('express');

const router = express.Router();

const input = new ServerInput();
const output = new ServerOutput();
const gamesManager = new GamesManager();
const gameController = new GameController(gamesManager, input, output);
const webController = new WebController(gamesManager, input, output);

// /api
router.post('/api/start', gameController.startGame.bind(gameController));
router.get('/api/end', gameController.endGame.bind(gameController));
router.get('/api/players', gameController.getPlayers.bind(gameController));
router.post('/api/guess', gameController.setPlayerGuess.bind(gameController));
router.post('/api/card', gameController.useCard.bind(gameController));

// webpage
router.get('/', webController.getPage.bind(webController));
router.post('/startGame', webController.startGame.bind(webController));
router.post('/registerPlayer', webController.registerPlayer.bind(webController));
router.post('/play', webController.play.bind(webController));
router.post('/selectPlayerTwo', webController.selectPlayerTwo.bind(webController));
router.post('/useCard', webController.useCard.bind(webController));
router.post('/acceptUseCard', webController.acceptUseCard.bind(webController));
router.get('/setPlayersGuess', webController.getSetPlayersGuessPage.bind(webController));
router.post('/setPlayersGuess', webController.setPlayersGuess.bind(webController));
router.get('/results', webController.endGame.bind(webController));
router.get('/endGame', webController.getEndGamePage.bind(webController));
router.get('/removeAllGames', webController.removeAllGames.bind(webController));

export default router;
