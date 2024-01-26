const dotenv = require('dotenv');
const express = require("express");
// const usersRoutes = express.Router();
const watchlistRoutes = express.Router();
const dbo = require("../db/conn");
const neo4j = require('neo4j-driver');
dotenv.config();
const uri = process.env.URI;
const userNeo = process.env.USERNEO;
const password = process.env.PASSWORD;

const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const authRouter = require('./auth');
app.use('/auth', authRouter);

const Verify = require('../middleware/verify');

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, password));

watchlistRoutes.post('/watchlists', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
      const { name } = req.body;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
  
      const query = `
        MATCH (u:User {email: $userEmail})
        CREATE (w:Watchlist {name: $name})<-[:OBSERVED]-(u)
        RETURN p
      `;
  
      const result = await session.run(query, { userEmail, name });
      const watchlist = result.records.map(record => record.get(0));
  
      res.json(watchlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ error: "Error creating playlist" });
    } finally {
      session.close();
    }
});

module.exports = watchlistRoutes;