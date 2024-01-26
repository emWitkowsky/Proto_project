const dotenv = require('dotenv');
const express = require("express");
const playlistRoutes = express.Router();
// const dbo = require("../db/conn");
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

const authRouter = require('../routes/auth');
app.use('/auth', authRouter);

const Verify = require('../middleware/verify');

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, password));

playlistRoutes.get('/users/playlists/:playlistName/tracks', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
      const { playlistName } = req.params;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const query = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist {name: $playlistName})-[:PLAYLISTED]->(t:Track)
        RETURN t
      `;
  
      const result = await session.run(query, { userEmail, playlistName });
      const tracks = result.records.map(record => record.get(0));
  
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).json({ error: "Error fetching tracks" });
    } finally {
      session.close();
    }
});

playlistRoutes.post('/users/playlists/:trackName', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
      const playlistName = req.body.playlistName
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const { trackName } = req.params;
  
      const checkQuery = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist {name: $playlistName})-[:PLAYLISTED]->(t:Track {name: $trackName})
        RETURN t
      `;
  
      const checkResult = await session.run(checkQuery, { userEmail, playlistName, trackName });
  
      if (checkResult.records.length > 0) {
        res.status(400).json({ error: "Track is already in playlist" });
        return;
      }
  
      const query = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist {name: $playlistName}), (t:Track {name: $trackName})
        CREATE (p)-[:PLAYLISTED]->(t)
        RETURN p, t
      `;
  
      const result = await session.run(query, { userEmail, playlistName, trackName });
      const playlistAndTrack = result.records.map(record => ({ playlist: record.get(0), track: record.get(1) }));
  
      res.json(playlistAndTrack);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      res.status(500).json({ error: "Error adding track to playlist" });
    } finally {
      session.close();
    }
});

playlistRoutes.put('/users/playlists/:playlistName', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const { playlistName } = req.params;
      const { newName } = req.body;
  
      const query = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist {name: $playlistName})
        SET p.name = $newName
        RETURN p
      `;
  
      const result = await session.run(query, { userEmail, playlistName, newName });
      const updatedPlaylist = result.records.map(record => record.get(0));
  
      res.json(updatedPlaylist);
    } catch (error) {
      console.error("Error updating playlist name:", error);
      res.status(500).json({ error: "Error updating playlist name" });
    } finally {
      session.close();
    }
});

playlistRoutes.delete('/users/playlists/:playlistName', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const { playlistName } = req.params;
      const query = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist {name: $playlistName})
        DETACH DELETE p
      `;
  
      await session.run(query, { userEmail, playlistName });
  
      res.json({ message: `Playlist ${playlistName} deleted` });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      res.status(500).json({ error: "Error deleting playlist" });
    } finally {
      session.close();
    }
});

playlistRoutes.get('/users/playlists', Verify, async (req, res) => {
    const session = driver.session();
    try {
      const userEmail = req.userId.email;
  
      if (!userEmail) {
        console.error('No user email in session');
        res.status(500).json({ error: "No user email in session" });
        return;
      }
  
      const query = `
        MATCH (u:User {email: $userEmail})-[:OWNED]->(p:Playlist)
        RETURN p
      `;
  
      const result = await session.run(query, { userEmail });
      const playlists = result.records.map(record => record.get(0));
  
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Error fetching playlists" });
    } finally {
      session.close();
    }
});

playlistRoutes.post('/playlists', Verify, async (req, res) => {
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
        CREATE (p:Playlist {name: $name})<-[:OWNED]-(u)
        RETURN p
      `;
  
      const result = await session.run(query, { userEmail, name });
      const playlist = result.records.map(record => record.get(0));
  
      res.json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ error: "Error creating playlist" });
    } finally {
      session.close();
    }
});

module.exports = playlistRoutes;