const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
// const uri = "neo4j+s://345f71a0.databases.neo4j.io";
// const user = "neo4j";
// const password2 = "L7Jzs_9ZyG4H1jxvWGLvc2PNkfi-q6pzpXRStH-amss";
const uri = process.env.URI;
const userNeo = process.env.USERNEO;
const passwordNeo = process.env.PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(userNeo, passwordNeo));
const session = driver.session();


/**
 * @route POST auth/register
 * @desc Registers a user
 * @access Public
 */
async function Register(req, res) {

    const { first_name, last_name, email, password } = req.body;
    console.log(first_name, last_name, email, password, "hello");

    try {
        // console.log(first_name, last_name, email, password);
        const session = driver.session();

        if (!password) {
            return res.status(400).json({
                status: "failed",
                message: "Password is required",
            });
        }
        // Check if user already exists
        // const existingUser = await UserController.findUserByEmail(email)
        // const session = driver.session();
        const userQuery = 'MATCH (u:User {email: $email}) RETURN u';
        const resultIfExists = await session.run(userQuery, { email });
        const existingUser = resultIfExists.records.length > 0;

        if (existingUser)
            return res.status(400).json({
                status: "failed2",
                data: [],
                message: "It seems you already have an account, please log in instead.",
        });

        // console.log(typeof password, password);
        // const hashedPassword = await bcrypt.hash(password, 10);
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // let role = "user";

        // Create a new user in Neo4j
        const result = await session.run(
            'CREATE (a:User {first_name: $first_name, last_name: $last_name, email: $email, password: $password, role: $role, id: apoc.create.uuid()}) RETURN a',
            {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashedPassword,
                role: "User",
            }
        );

        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        const savedUser = node.properties;

        const { role, ...user_data } = savedUser;
        res.status(200).json({
            status: "success",
            data: [user_data],
            // data: savedUser,
        });
    } catch (error) {
        console.log(first_name, last_name, email, password, "yes");
        console.error('Error creating user:', error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    } finally {
        await session.close();
    }
}   

const jwt = require('jsonwebtoken');
// const SECRET_ACCESS_TOKEN = bec2daabbadedc1226d2d16c0152eca3c1e59868
// const dotenv = require('dotenv');
// dotenv.config();
// require('dotenv').config({ path: './.env' });
const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

function generateAccessJWT(userId) {
    let payload = {
        id: userId,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, { expiresIn: "20m" });
}

/**
 * @route POST v1/auth/login
 * @desc logs in a user
 * @access Public
 */
async function Login(req, res) {
    const { email } = req.body;
    console.log(email, "yes");
    try {
        console.log("Hello")
        console.log(email, "email")
        const result = await session.run(
            'MATCH (user:User {email: $email}) RETURN user',
            {email: email}
        );

        console.log("test")
        const user = result.records[0].get('user').properties;
        console.log(user, "user") // so far so good

        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password. Please try again with the correct credentials.",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );

        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
        });

        console.log("check") // we don't get here
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        const savedUser = node.properties;

        const { password, ...user_data } = savedUser;
        
        let options = {
            maxAge: 1000 * 60 * 20, // would expire after 24 hours
            httpOnly: true, 
            secure: true, 
            sameSite: "none", 
        };
        const token = generateAccessJWT(user_data);
        console.log("Yes")

        res.cookie("SessionID", token, options);

        res.status(200).json({
            status: "success",
            data: [user_data, token],
            message: "You have successfully logged in.",
        });

        // console.log(user, "user") // we don't get here
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
        // console.log(error, "error")
    }
    await session.close();
}

module.exports = {Login, Register};