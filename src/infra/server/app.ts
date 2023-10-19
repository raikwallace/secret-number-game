import path from "path";

const express = require('express');

const app = express();


app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'pug'); 

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
