import express from 'express';
import GameController from './controllers/GameController';
import { SecretNumberGame } from '../../services/SecretNumberGame';
import ServerInput from './ServerInput';
import ServerOutput from './ServerOutput';

const router = express.Router();

const input = new ServerInput();
const output = new ServerOutput();
const gameController = new GameController(input, output);

router.post('/start', gameController.startGame);

router.get('/end', gameController.endGame);

router.get('/players', gameController.getPlayers);

router.post('/forecast', gameController.setPlayerForecast);

router.post('/card', gameController.useCard);

export default router;
