const express = require('express');
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());


const JWT_SECRET = 'taskflow_secret_key';


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lyneassaad2005$$',
    database: 'taskflow'
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
        return res.send('Access denied. No token provided.');
    }

    try {

        const verified = jwt.verify(token, JWT_SECRET);

        req.user = verified;

        next();

    } catch (err) {

        res.send('Invalid token');

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



app.post('/projects', (req, res) => {

    const { Name, Description, User_id } = req.body;


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



app.put('/projects/:id', (req, res) => {

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



app.delete('/projects/:id', (req, res) => {

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


app.post('/tasks', (req, res) => {

    const { Title, Description, Status, Project_id, User_id } = req.body;


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

                res.send('Error creating task');

            } else {

                res.send('Task created successfully');

            }

        }
    );

});



app.put('/tasks/:id', (req, res) => {

    const { Title, Description, Status } = req.body;

    const id = req.params.id;


    const sql = `
        UPDATE Task
        SET Title = ?, Description = ?, Status = ?
        WHERE Task_id = ?
    `;


    db.query(
        sql,
        [Title, Description, Status, id],
        (err) => {

            if (err) {

                res.send('Error updating task');

            } else {

                res.send('Task updated successfully');

            }

        }
    );

});



app.delete('/tasks/:id', (req, res) => {

    const id = req.params.id;


    const sql = `
        DELETE FROM Task
        WHERE Task_id = ?
    `;


    db.query(sql, [id], (err) => {

        if (err) {

            res.send('Error deleting task');

        } else {

            res.send('Task deleted successfully');

        }

    });

});

app.post('/register', async (req, res) => {

    const { Name, Email, Password } = req.body;


    const hashedPassword = await bcrypt.hash(Password, 10);


    const sql = `
        INSERT INTO User (Name, Email, Password, Created_at)
        VALUES (?, ?, ?, NOW())
    `;


    db.query(
        sql,
        [Name, Email, hashedPassword],
        (err) => {

            if (err) {

                res.send('Error registering user');

            } else {

                res.send('User registered successfully');

            }

        }
    );

});




app.post('/login', (req, res) => {

    const { Email, Password } = req.body;


    const sql = "SELECT * FROM User WHERE Email = ?";


    db.query(sql, [Email], async (err, results) => {


        if (err) {

            return res.send('Error logging in');

        }


        if (results.length === 0) {

            return res.send('User not found');

        }


        const user = results[0];


        const isMatch = await bcrypt.compare(
            Password,
            user.Password
        );


        if (!isMatch) {

            return res.send('Wrong password');

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


        res.json({

            message: 'Login successful',

            token: token

        });


    });

});



app.listen(3000, () => {

    console.log('Server is running on port 3000');

});