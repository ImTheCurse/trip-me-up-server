// require('dotenv').config();
// const express = require('express');
// const expressWs = require('express-ws');
// const { mountWSRoute,tripRouter } = require('./routers/tripRouter.js')
import { mountWSRoute,tripRouter } from "./routers/tripRouter.js";
import { configDotenv } from "dotenv";
import express from "express"
import expressWs from "express-ws";
import postgres from "postgres";

configDotenv()
const app = express();
expressWs(app);
mountWSRoute();

const port = process.env.PORT || 8080;
export const sql = postgres(process.env.POSTGRES_DB)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
	res.set('Content-Type', 'application/json');
	next();
});

app.use('/api',tripRouter);
app.listen(port);
console.log(`listening on port ${port}`)
