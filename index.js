// require('dotenv').config();
// const express = require('express');
// const expressWs = require('express-ws');
// const { mountWSRoute,tripRouter } = require('./routers/tripRouter.js')
import { mountWSRoute, tripRouter } from "./routers/tripRouter.js";
import { configDotenv } from "dotenv";
import express from "express";
import expressWs from "express-ws";
import postgres from "postgres";
import cookieParser from "cookie-parser";

configDotenv();
const app = express();
expressWs(app);
mountWSRoute();

const port = process.env.PORT || 8080;
export const sql = postgres(process.env.POSTGRES_DB);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000", // Frontend development port(not sure if needed...)
    "http://localhost:5173",
    `http://localhost:${port}`, // Local development
    "https://localhost:3000", // Frontend development port(not sure if needed...)
    "https://localhost:5173",
    `https://localhost:${port}`, // Local development
    `https://trip-me-up-client-cr26.onrender.com`,
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Content-Type", "application/json");
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api", tripRouter);
app.listen(port);
console.log(`listening on port ${port}`);

const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../trip-me-up-client/index.html')); 
});