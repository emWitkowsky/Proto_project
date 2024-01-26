const dotenv = require('dotenv');
const express = require("express");
// const usersRoutes = express.Router();
const usersRoutes = express.Router();
const dbo = require("../db/conn");
const neo4j = require('neo4j-driver');
dotenv.config();
const uri = process.env.URI;
const userNeo = process.env.USERNEO;
const password = process.env.PASSWORD;

// const isAdmin = require('../middleware/isAdmin');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const authRouter = require('./auth');
app.use('/auth', authRouter);

const Verify = require('../middleware/verify');

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, password));



usersRoutes.put('/users/profile', Verify, async (req, res) => {
    const session = driver.session();
    try {
      // Get user email from session
      const userEmail = req.userId.email;
      const { first_name, last_name, email } = req.body;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const query = `
        MATCH (u:User {email: $userEmail})
        SET u.first_name = COALESCE($first_name, u.first_name), 
            u.last_name = COALESCE($last_name, u.last_name), 
            u.email = COALESCE($email, u.email)
        RETURN u
      `;
  
      const result = await session.run(query, { userEmail, first_name, last_name, email });
      const updatedUser = result.records[0]?.get(0).properties;
  
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Error updating user profile" });
    } finally {
      session.close();
    }
});

usersRoutes.get('/users/profile', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const query = `
        MATCH (u:User {email: $userEmail})
        RETURN u
      `;
  
      const result = await session.run(query, { userEmail });
      const user = result.records[0]?.get(0).properties;
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Error fetching user profile" });
    } finally {
      session.close();
    }
});

usersRoutes.route("/user/:id").get(async function (req, res) {
    const session = driver.session();
    try {
      const userId = req.params.id;
  
      const query = `
        MATCH (u:User)
        WHERE u.id = $userId
        RETURN u
      `;
      const params = {userId};
      const result = await session.run(query, params);
  
      if (result.records.length === 0) {
        res.status(404).json({ error: "No user found" });
        return;
      }
  
      const user = result.records[0].get(0).properties;
  
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Error getting user" });
    } finally {
      session.close();
    }
});

module.exports = usersRoutes;