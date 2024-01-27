// import cookieParser from "cookie-parser";
// import express from "express";
// import cors from "cors";
// import {configDotenv} from "dotenv";
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 5003;

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // replace with the domain of your client app
  credentials: true,
}));
app.use(express.json());
app.use(require("./routes/record.js"));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const Verify = require('./middleware/verify');

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const adminRoutes = require('./routes/admin');
app.use(adminRoutes);

const userRoutes = require('./routes/users');
app.use(userRoutes);

const playlistRoutes = require('./routes/playlist');
app.use(playlistRoutes);

const watchlistRoutes = require('./routes/watchlist');
app.use(watchlistRoutes);



app.get("/user", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
        message2: console.log(req.session, "req.session"),
    });
});

const dbo = require("./db/conn");
// import dbo from './db/conn';
// const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  next();
});

dbo.connectToServer(async function (err) {
  if (err) {
    process.exit(1);
  } else {
    const db = dbo.getDb();
    app.use(function(err, req, res, next) {
        console.error(err.stack); // loguje stos błędu do konsoli
        res.status(500).send('Internal Server Error');
      });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
    process.on('SIGINT', () => {
      dbo.closeConnection();
      process.exit(0);
    });
  }
});
