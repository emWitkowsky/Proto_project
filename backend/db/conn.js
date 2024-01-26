const neo4j = require('neo4j-driver');
const uri = process.env.URI;
const user = process.env.USER;
const password = process.env.PASSWORD;

// const uri = "neo4j+s://345f71a0.databases.neo4j.io";
// const user = "neo4j";
// const password = "L7Jzs_9ZyG4H1jxvWGLvc2PNkfi-q6pzpXRStH-amss";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

var _db;

module.exports = {
  connectToServer: async function (callback) {
    try {
      _db = driver.session();
      console.log("Successfully connected to Neo4j database");
      callback(null);
    } catch (err) {
      console.error("Error connecting to Neo4j:", err);
      callback(err);
    }
  },

  getDb: function () {
    return _db;
  },

  closeConnection: function () {
    if (_db) {
      console.log("Closing Neo4j connection...");
      _db.close();
      driver.close();
    }
  }
};

//* error handler (securing the app crash after failed call)
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Tutaj zrobić coś z nieobsłużonym odrzuceniem Promise, np. zarejestrować go w logach błędów
  });
  
process.on('uncaughtException', (err, origin) => {
    console.log('Uncaught Exception thrown:', err, 'Exception origin:', origin);
    // Tutaj zrobić coś z nieobsłużonym wyjątkiem, np. zarejestrować go w logach błędów
});