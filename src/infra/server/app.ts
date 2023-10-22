import path from "path";
import routes from "./routes";

const express = require('express');

const app = express();

app.set('views', path.join(__dirname, '../../../views')); 
app.set('view engine', 'pug'); 

app.use(express.static(path.join(__dirname, '../../../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

export default app;
