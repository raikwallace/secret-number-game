import GameController from './controllers/GameController';
import ServerInput from './ServerInput';
import ServerOutput from './ServerOutput';
import GamesManager from '../../services/GamesManager';
import WebController from './controllers/WebController';

import express from 'express';
import HighLowGameController from './controllers/HighLowGameController';

const router = express.Router();

const input = new ServerInput();
const output = new ServerOutput();
const gamesManager = new GamesManager();
const gameController = new GameController(gamesManager, input, output);
const webController = new WebController(gamesManager, input, output);
const highLowGameController = new HighLowGameController();

// /api/seceret-number-game
router.post('/api/secret-number-game/start', gameController.startGame.bind(gameController));
router.get('/api/secret-number-game/end', gameController.endGame.bind(gameController));
router.get('/api/secret-number-game/players', gameController.getPlayers.bind(gameController));
router.post('/api/secret-number-game/guess', gameController.setPlayerGuess.bind(gameController));
router.post('/api/secret-number-game/card', gameController.useCard.bind(gameController));

// webpage/secret-number-game
router.get('/', (req, res) => res.redirect('/secret-number-game'));
router.get('/secret-number-game/', webController.getPage.bind(webController));
router.post('/secret-number-game/startGame', webController.startGame.bind(webController));
router.post('/secret-number-game/registerPlayer', webController.registerPlayer.bind(webController));
router.post('/secret-number-game/play', webController.play.bind(webController));
router.post('/secret-number-game/selectPlayerTwo', webController.selectPlayerTwo.bind(webController));
router.post('/secret-number-game/useCard', webController.useCard.bind(webController));
router.post('/secret-number-game/acceptUseCard', webController.acceptUseCard.bind(webController));
router.get('/secret-number-game/setPlayersGuess', webController.getSetPlayersGuessPage.bind(webController));
router.post('/secret-number-game/setPlayersGuess', webController.setPlayersGuess.bind(webController));
router.get('/secret-number-game/results', webController.endGame.bind(webController));
router.get('/secret-number-game/endGame', webController.getEndGamePage.bind(webController));
router.get('/secret-number-game/removeAllGames', webController.removeAllGames.bind(webController));

// /api/high-low-game
router.get('/api/high-low-game/', highLowGameController.getGames.bind(highLowGameController));
router.post('/api/high-low-game/start', highLowGameController.startGame.bind(highLowGameController));

export default router;
