const dotenv = require('dotenv');
const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const neo4j = require('neo4j-driver');
dotenv.config();
const uri = process.env.URI;
const userNeo = process.env.USERNEO;
const password = process.env.PASSWORD;
const { v4: uuidv4 } = require('uuid'); // swapped with APOC

// console.log(password)

// const isAdmin = require('../middleware/isAdmin');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const authRouter = require('../routes/auth');
app.use('/auth', authRouter);

const Verify = require('../middleware/verify');

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, password));

const session = require('../db/conn');

recordRoutes.route("/tracks").get(async function(req, res) {
  try {
    let session = dbo.getDb();
    let query = "MATCH (n:Track) RETURN n";

    // warunki filtrowania
    if (req.query.filter) {
      try {
        const filterObj = JSON.parse(req.query.filter);
        // Dodaj warunki filtrowania do zapytania Cypher
        // Zakładamy, że filterObj jest obiektem, gdzie klucze to nazwy właściwości, a wartości to oczekiwane wartości
        for (let key in filterObj) {
          query += ` WHERE n.${key} = '${filterObj[key]}'`;
        }
      } catch (error) {
        console.error("Error parsing filter:", error);
        return res.status(400).json({ error: "Invalid filter format" });
      }
    }

    // sortowanie
    if (req.query.sortBy && req.query.sortField) {
      query += ` ORDER BY n.${req.query.sortField} ${req.query.sortBy.toUpperCase()}`;
    }

    // query z uwzględnieniem filtrów i opcji sortowania
    let result = await session.run(query);
    let records = result.records.map(record => record.get('n').properties);

    res.json(records);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  } finally {
    session.close();
  }
});

recordRoutes.route("/all").get(async function (req, res) {
  let session = dbo.getDb();
  let query = "MATCH (n:Artist) RETURN n";

  try {
    // filtrowanie
    if (req.query.filter) {
      try {
        let filterObj = JSON.parse(req.query.filter);
        for (let key in filterObj) {
          query += ` WHERE n.${key} = '${filterObj[key]}'`;
        }
      } catch (error) {
        console.error("Error parsing filter:", error);
        return res.status(400).json({ error: "Invalid filter format" });
      }
    }

    // sortowanie
    if (req.query.sortBy && req.query.sortField) {
      query += ` ORDER BY n.${req.query.sortField} ${req.query.sortBy.toUpperCase()}`;
    }

    // query z uwzględnieniem filtrów i opcji sortowania
    let result = await session.run(query);
    let records = result.records.map(record => record.get('n').properties);

    res.json(records);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  } finally {
    session.close();
  }
});

recordRoutes.route("/allUsers").get(async function (req, res) {
    let query = "MATCH (u:User) RETURN u";
    
    try {
        // let session = dbo.getDb();
        let session = driver.session();
      // filtrowanie
      if (req.query.filter) {
        try {
          let filterObj = JSON.parse(req.query.filter);
          for (let key in filterObj) {
            query += ` WHERE u.${key} = '${filterObj[key]}'`;
          }
        } catch (error) {
          console.error("Error parsing filter:", error);
          return res.status(400).json({ error: "Invalid filter format" });
        }
      }
  
      // sortowanie
      if (req.query.sortBy && req.query.sortField) {
        query += ` ORDER BY u.${req.query.sortField} ${req.query.sortBy.toUpperCase()}`;
      }
  
      // query z uwzględnieniem filtrów i opcji sortowania
      let result = await session.run(query);
      let records = result.records.map(record => record.get('u').properties);
  
      res.json(records);
      session.close();
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
      if (session) {
        session.close();
      }
    }
});

// post request 
recordRoutes.route("/:trackId/comment").post(Verify, async function (req, res) {
  // console.log(password, uri, userNeo)
  const session = driver.session();
  try {
    const { text } = req.body;
    const userId2 = req.userId.email;
    const trackId = req.params.trackId;

    if (!userId2) {
      console.error('No user id in session');
      res.status(500).json({ error: "No user id in session" });
      return;
    }

    const query = `
      MATCH (u:User) WHERE u.email = $userId2
      MATCH (t:Track) WHERE t.id = $trackId
      CREATE (c:Comment {id: apoc.create.uuid(), text: $text, date: apoc.date.format(apoc.date.currentTimestamp(), 'ms', 'yyyy-MM-dd HH:mm:ss')})
      CREATE (u)-[:POSTED]->(c)
      CREATE (c)-[:COMMENTED]->(t)
      RETURN c
    `;
    const params = {userId2, text, trackId};
    const result = await session.run(query, params);
    if (result.records.length === 0) {
      res.status(404).json({ error: "No comment was created" });
      return;
    }
    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    res.json(node.properties);
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ error: "Error posting comment" });
  } finally {
    session.close();
  }
});

recordRoutes.route("/:trackId/comment/:commentId").delete(Verify, async function (req, res) {
  const session = driver.session();
  try {
    const { text } = req.body;
    const userId2 = req.userId.email;
    const trackId = req.params.trackId
    const commentId = req.params.commentId

    if (!userId2) {
      console.error('No user id in session');
      res.status(500).json({ error: "No user id in session" });
      return;
    }

    const query = `
      MATCH (u:User)-[r1:POSTED]->(c:Comment {id: $commentId})-[r2:COMMENTED]->(t:Track {id: $trackId})
      DELETE r1, r2, c
    `;
    const params = {userId2, text, trackId, commentId};
    const result = await session.run(query, params);
    const updates = result.summary.counters.updates();
    if (updates.nodesDeleted > 0) {
      res.json({message: "Comment deleted successfully"});
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  } finally {
    session.close();
  }
});

recordRoutes.route("/:trackId/comments").get(async function (req, res) {
  const session = driver.session();
  try {
    const trackId = req.params.trackId;

    const query = `
      MATCH (t:Track {id: $trackId})<-[:COMMENTED]-(c:Comment)
      RETURN c
    `;
    const params = {trackId};
    const result = await session.run(query, params);
    const comments = result.records.map(record => record.get(0).properties);

    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Error getting comments" });
  } finally {
    session.close();
  }
});

recordRoutes.route("/comment/:commentId/update").put(Verify, async function (req, res) {
  const session = driver.session();
  try {
    // const { id } = req.body;
    const { commentId } = req.params;
    const { text } = req.body;
    const userEmail = req.userId.email;

    const query = `
      MATCH (u:User)-[:POSTED]->(c:Comment)
      WHERE c.id = $commentId AND u.email = $userEmail
      SET c.text = $text
      RETURN c
    `;
    const params = {commentId, text, userEmail};
    const result = await session.run(query, params);
    if (result.records.length === 0) {
      res.status(404).json({ error: "No comment was updated" });
      return;
    }
    const updatedComment = result.records[0].get(0).properties;

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Error updating comment" });
  } finally {
    session.close();
  }
});

recordRoutes.get('/track/search', async (req, res) => {
  const session = driver.session();
  try {
    // const pattern = req.body.pattern;
    const pattern = req.query.q;

    const query = `
      MATCH (t:Track)
      WHERE t.name CONTAINS $pattern
      RETURN t
    `;
    const params = {pattern};
    const result = await session.run(query, params);
    const track = result.records.map(record => record.get(0).properties);

    res.json(track);
  } catch (error) {
    console.error("Error searching music:", error);
    res.status(500).json({ error: "Error searching music" });
  } finally {
    session.close();
  }
});

// @logout
recordRoutes.route("/logout").post(async function (req, res) {
  try {
    // res.cookie('SessionID', '', { expires: new Date(0) });
    res.clearCookie('SessionID');

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Error logging out" });
  }
});

recordRoutes.get('/tracks/popular', async (req, res) => {
  const session = driver.session();
  try {
    const query = `
      MATCH (t:Track)
      WHERE t.popular IS NOT NULL
      RETURN t
    `;

    const result = await session.run(query);
    const tracks = result.records.map(record => record.get(0).properties);

    res.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks with 'popular' key:", error);
    res.status(500).json({ error: "Error fetching tracks with 'popular' key" });
  } finally {
    session.close();
  }
});

recordRoutes.get('/tracks/:uuid', async (req, res) => {
  const session = driver.session();
  try {
    const trackUuid = req.params.uuid;

    const query = `
      MATCH (t:Track {uuid: $trackUuid})<-[r]-(n)
      WHERE type(r) = 'Recorded'
      RETURN t, r, n
    `;

    const result = await session.run(query, { trackUuid });
    const data = result.records.map(record => ({
      track: record.get(0).properties,
      relationship: record.get(1).type,
      recorded: record.get(2).properties
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching track data:", error);
    res.status(500).json({ error: "Error fetching track data" });
  } finally {
    session.close();
  }
});

recordRoutes.get('/genre', async (req, res) => {
  const session = driver.session();
  try {
    const query = `
      MATCH (t:Track)
      WHERE 'genre' IN keys(t) AND t.genre IS NOT NULL
      RETURN DISTINCT t.genre
    `;

    const result = await session.run(query);
    const genres = result.records.map(record => record.get(0));

    res.json(genres);
  } catch (error) {
    console.error("Error fetching track data:", error);
    res.status(500).json({ error: "Error fetching track data" });
  } finally {
    session.close();
  }
});

recordRoutes.put('/users/playlists/:playlistName', Verify, async (req, res) => {
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

recordRoutes.get('/recommendations/:userId', async (req, res) => {
  const session = driver.session();
  const userId = req.params.userId;

  try {
    const query1 = `
      MATCH (u:User)-[:OWNED]->(:Playlist)-[:PLAYLISTED]->(t:Track)
      WHERE u.id = $userId
      RETURN t
    `;

    const result1 = await session.run(query1, { userId });
    const userTracks = result1.records.map(record => record.get(0).properties);

    const genres = [...new Set(userTracks.map(track => track.genre))];

    console.log('genres:', genres);
    console.log('userTracks:', userTracks);

    const query2 = `
      MATCH (t:Track)
      RETURN t
    `;
    const result2 = await session.run(query2);
    const allTracks = result2.records.map(record => record.get(0).properties)
    const userTrackIds = allTracks.map(track => track.id);

    console.log('AllTracks:', userTrackIds);

    const query4 = `
    MATCH (track:Track)
    WHERE NOT track.id IN $userTrackIds
    RETURN track
    `;

    const result4 = await session.run(query4, { userTrackIds });
    const resultFinal = result4.records.map(record => record.get('track').properties)
    console.log(resultFinal)

    res.json(resultFinal);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Error generating recommendations" });
  } finally {
    session.close();
  }
});

// recordRoutes.get('/recommendations/:userId', async (req, res) => {
//   const session = driver.session();
//   try {
//     const userId = req.params.userId;

//     // Znajdź utwory, które użytkownik już ma
//     const userTracksQuery = `
//       MATCH (user:User {id: $userId})-[:OWNED]->(:Playlist)-[:PLAYLISTED]->(track:Track)
//       RETURN track.id as id
//     `;
//     const userTracksResult = await session.run(userTracksQuery, { userId });
//     const userTrackIds = userTracksResult.records.map(record => record.get('id'));

//     // Zapytanie do bazy danych
//     const query3 = `
//       MATCH (track:Track)
//       WHERE NOT track.id IN $userTrackIds
//       RETURN track
//     `;

//     // Wykonanie zapytania
//     const result = await session.run(query3, { userTrackIds });

//     // Przetworzenie wyników
//     const recommendedTracks = result.records.map(record => record.get('track').properties);

//     console.log('Recommended tracks:', recommendedTracks);
  
//     // Combine the tracks from the paths and the additional tracks
//     // const allRecommendations = [...recommendedTracks, ...additionalTracks];

//     // console.log('All recommendations:', allRecommendations);
//     res.json(recommendedTracks);
//   } catch (error) {
//     console.error("Error generating recommendations:", error);
//     res.status(500).json({ error: "Error generating recommendations" });
//   } finally {
//     session.close();
//   }
// });

// server.get('/track/page', (req, res) => {
//   return app.render(req, res, '/track/page', { name: req.query.name });
// });

recordRoutes.get('/track/:trackName', async (req, res) => {
  const session = driver.session();
  try {
    const trackName = req.params.trackName;
    const query = `
      MATCH (t:Track)
      WHERE t.name = $trackName
      RETURN t
    `;

    const result = await session.run(query, { trackName });
    const track = result.records.map(record => record.get(0).properties);

    res.json(track);
  } catch (error) {
    console.error(`Error fetching track:`, error);
    res.status(500).json({ error: `Error fetching track with name ${trackName}` });
  } finally {
    session.close();
  }
});

module.exports = recordRoutes;