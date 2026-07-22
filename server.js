const express = require('express');
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());


const JWT_SECRET = process.env.JWT_SECRET;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});


function verifyToken(req, res, next) {

    const token = req.headers['authorization'];

    if (!token) {

        return res.status(401).json({
            message: "Access denied. No token provided."
        });

    }

    try {

        const verified = jwt.verify(token, JWT_SECRET);

        req.user = verified;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        });

    }

}



app.get('/', (req, res) => {

    res.send('Hello World from TaskFlow Server');

});

app.get('/projects', verifyToken, (req, res) => {

    const sql = 'SELECT * FROM Project';

    db.query(sql, (err, results) => {

        if (err) {

            res.send('Error fetching projects');

        } else {

            res.json(results);

        }

    });

});
app.get('/projects/:id', verifyToken, (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT * FROM Project
        WHERE Project_id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {

            res.send('Error fetching project');

        } else {

            if (results.length === 0) {

              res.status(404).json({
               message: "Project not found"
            });

            } else {

                res.json(results[0]);

            }

        }

    });

});


app.post('/projects', verifyToken, (req, res) => {

     const { Name, Description } = req.body;

     const User_id = req.user.id;


    const sql = `
        INSERT INTO Project (Name, Description, Created_at, User_id)
        VALUES (?, ?, NOW(), ?)
    `;


    db.query(sql, [Name, Description, User_id], (err) => {

        if (err) {

            res.send('Error creating project');

        } else {

            res.send('Project created successfully');

        }

    });

});



app.put('/projects/:id', verifyToken, (req, res) => {

    const { Name, Description } = req.body;

    const id = req.params.id;


    const sql = `
        UPDATE Project
        SET Name = ?, Description = ?
        WHERE Project_id = ?
    `;


    db.query(sql, [Name, Description, id], (err) => {

        if (err) {

            res.send('Error updating project');

        } else {

            res.send('Project updated successfully');

        }

    });

});



app.delete('/projects/:id', verifyToken, (req, res) => {

    const id = req.params.id;


    const sql = `
        DELETE FROM Project
        WHERE Project_id = ?
    `;


    db.query(sql, [id], (err) => {

        if (err) {

            res.send('Error deleting project');

        } else {

            res.send('Project deleted successfully');

        }

    });

});


app.get('/tasks', verifyToken, (req, res) => {

    const sql = 'SELECT * FROM Task';


    db.query(sql, (err, results) => {

        if (err) {

            res.send('Error fetching tasks');

        } else {

            res.json(results);

        }

    });

});


app.post('/tasks', verifyToken, (req, res) => {

    const { Title, Description, Status, Project_id } = req.body;

    const User_id = req.user.id;


    const sql = `
        INSERT INTO Task 
        (Title, Description, Status, Created_at, Project_id, User_id)
        VALUES (?, ?, ?, NOW(), ?, ?)
    `;


    db.query(
        sql,
        [Title, Description, Status, Project_id, User_id],
        (err) => {

            if (err) {

    if (err.code === "ER_NO_REFERENCED_ROW_2") {

        return res.status(400).json({
            message: "Project does not exist"
        });

    }


    return res.status(500).json({
        message: "Error creating task"
    });

    } else {

                res.send('Task created successfully');

            }

        }
    );

});



app.put('/tasks/:id', verifyToken, (req, res) => {
     console.log("PUT TASK ROUTE REACHED");

    const { Title, Description, Status, Project_id } = req.body;

    console.log("Backend received:", req.body);

    const id = req.params.id;


    const sql = `
        UPDATE Task
        SET Title = ?, Description = ?, Status = ?, Project_id = ?
        WHERE Task_id = ?
    `;


    db.query(
        sql,
        [Title, Description, Status, Project_id, id],
        (err, result) => {

            if (err) {

                console.log(err);
                res.send('Error updating task');

            } else {

                console.log("Database update result:", result);
                res.send('Task updated successfully');

            }

        }
    );

});
app.delete('/tasks/:id', verifyToken, (req, res) =>  {

    const id = req.params.id;


    const sql = `
        DELETE FROM Task
        WHERE Task_id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).send('Error deleting task');

            } else {

                console.log("Delete result:", result);

                res.send('Task deleted successfully');

            }

        }
    );

});


app.post('/login', (req, res) => {

    const { Email, Password } = req.body;


    const sql = "SELECT * FROM User WHERE Email = ?";


    db.query(sql, [Email], async (err, results) => {

if (err) {

    return res.status(500).json({
        message: err.message,
        sql: err.sqlMessage
    });

}


        if (results.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        const user = results[0];


        const isMatch = await bcrypt.compare(
            Password,
            user.Password
        );


        if (!isMatch) {

            return res.status(401).json({
                message: "Wrong password"
            });

        }


        const token = jwt.sign(

            {
                id: user.User_id,
                email: user.Email
            },

            JWT_SECRET,

            {
                expiresIn: '1h'
            }

        );


        return res.json({

            message: "Login successful",

            token: token

        });


    });

});



app.listen(3000, () => {

    console.log('Server is running on port 3000');

});