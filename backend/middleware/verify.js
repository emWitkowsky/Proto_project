const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const neo4j = require('neo4j-driver');
dotenv.config();
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

const uri = "neo4j+s://345f71a0.databases.neo4j.io";
const user = "neo4j";
const password = "L7Jzs_9ZyG4H1jxvWGLvc2PNkfi-q6pzpXRStH-amss";

// const uri = process.env.URI;
// const user = process.env.USER;
// const password = process.env.PASSWORD;

//! possible next password
// L7Jzs_9ZyG4H1jxvWGLvc2PNkfi-q6pzpXRStH-amss

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));


module.exports = function(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(400).send('Invalid Token');
    }

    req.userId = decoded.id; // Add this line
    console.log(decoded.id, "decoded.id")
    next();
  });
};

async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        // console.log(authHeader); // works

        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

        console.log(cookie, "cookie"); // works
        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            // const { id } = decoded; // get user id from the decoded token
            console.log(decoded, "decoded")
            const userId = decoded.id;
            const userIdName = decoded.id.first_name;
            console.log(userId, "id")
            const session = driver.session();
            // const userQuery = `MATCH (u:User) WHERE u.id = ${id} RETURN u`
            const result = await session.run(
                'MATCH (u:User) WHERE u.first_name = $userIdName RETURN u',
                {userIdName: userIdName}
              );
            // const result = await session.run(userQuery);
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            if (!singleRecord) {
                // handle the case where no records were returned
                console.log('No user found with id:', userId);
                return;
              }
            const user = node.properties;
            // const user = await User.findById(id); // find user by that `id`
            const { password, ...data } = user;
            req.user = data;
            req.userId = userId;
            next();
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error Cookies not found",
        });
    }
}

module.exports = Verify;