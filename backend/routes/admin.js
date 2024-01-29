const dotenv = require('dotenv');
const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const neo4j = require('neo4j-driver');
dotenv.config();
const uri = process.env.URI;
const userNeo = process.env.USERNEO;
const password = process.env.PASSWORD;

const isAdmin = require('../middleware/isAdmin');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const authRouter = require('../routes/auth');
app.use('/auth', authRouter);

// const Verify = require('../middleware/verify');

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, password));

const session = require('../db/conn');

recordRoutes.route("/addTrack").post(isAdmin, async function (req, res) {
    const session = driver.session();
    try {
      const { title, name, popular, genre } = req.body;
      const result = await session.run(
        `
        MERGE (a:Artist {name: $name})
        MERGE (t:Track {name: $title, id: apoc.create.uuid(), popular: $popular, genre: $genre})
        MERGE (a)-[r:Recorded]->(t)
        RETURN a, t, r
        `,
        { name, title, popular, genre }
      );
      await session.close();
      res.json({ message: "Track and artist added successfully", result });
    } catch (error) {
      console.error("Error adding track and artist:", error);
      res.status(500).json({ error: "Error adding track and artist" });
    }
});

recordRoutes.route("/deleteTrack").delete(async function (req, res) {
    const session = driver.session();
    try {
      const { title } = req.body;
      const result = await session.run(
        `
        MATCH (t:Track {name: $title})
        DETACH DELETE t
        `,
        { title }
      );
      await session.close();
      res.json({ message: "Track deleted successfully", result });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ error: "Error deleting track" });
    }
});

recordRoutes.get('/admin/users', isAdmin, (req, res) => {
    const session = driver.session();
    const query = `
      MATCH (u:User)
      RETURN u
    `;
  
    session.run(query)
      .then(result => {
        const users = result.records.map(record => record.get(0));
        res.json(users);
        session.close();
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
        session.close();
      });
});

recordRoutes.put('/admin/tracks/:trackId', isAdmin, async (req, res) => {
    const session = driver.session();
    try {
      const { trackId } = req.params;
      const { name, genre, popular } = req.body;
  
      const query = `
        MATCH (t:Track {id: $trackId})
        SET t.name = COALESCE($name, t.name), t.genre = COALESCE($genre, t.genre), t.popular = COALESCE($popular, t.popular)
        RETURN t
      `;
  
      const result = await session.run(query, { trackId, name, genre, popular });
      const updatedTrack = result.records.map(record => record.get(0));
  
      res.json(updatedTrack);
    } catch (error) {
      console.error("Error updating track:", error);
      res.status(500).json({ error: "Error updating track" });
    } finally {
      session.close();
    }
});

recordRoutes.put('/user/:id/role',isAdmin, async (req, res) => {
  const session = driver.session();

  try {
    const userId = req.params.id;
    const newRole = req.body.role;

    const query = `
      MATCH (u:User {id: $userId})
      SET u.role = $newRole
      RETURN u
    `;
    const result = await session.run(query, { userId, newRole });
    const updatedUser = result.records.map(record => record.get(0));
    console.log(updatedUser)

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Error updating user role" });
  } finally {
    session.close();
  }
});

recordRoutes.route('/user/delete').delete(isAdmin, async (req, res) => {
  const session = driver.session();
  try {
    const email = req.body.email;
    const query = `
      MATCH (u:User)
      WHERE u.email = $email
      DETACH DELETE u
    `;

    await session.run(query, { email });

    console.log("User deleted successfully")
    res.json({ message: `User with email ${email} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting user:`, error);
    res.status(500).json({ error: `Error deleting user with email ${email}` });
  } finally {
    session.close();
  }
});

module.exports = recordRoutes;