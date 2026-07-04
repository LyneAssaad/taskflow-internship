const express = require('express');
const mysql = require('mysql2');
const app = express();
app.get('/test', (req, res) => {
    res.send('TEST ROUTE WORKING');
});

app.use(express.json());

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
app.get('/', (req, res) => {
    res.send('Hello World from TaskFlow Server');
});
app.get('/projects', (req, res) => {
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
app.get('/tasks', (req, res) => {
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
        INSERT INTO Task (Title, Description, Status, Created_at, Project_id, User_id)
        VALUES (?, ?, ?, NOW(), ?, ?)
    `;

    db.query(sql, [Title, Description, Status, Project_id, User_id], (err) => {
        if (err) {
            res.send('Error creating task');
        } else {
            res.send('Task created successfully');
        }
    });
});
app.put('/tasks/:id', (req, res) => {
    const { Title, Description, Status } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE Task
        SET Title = ?, Description = ?, Status = ?
        WHERE Task_id = ?
    `;

    db.query(sql, [Title, Description, Status, id], (err) => {
        if (err) {
            res.send('Error updating task');
        } else {
            res.send('Task updated successfully');
        }
    });
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
app.get('/test-create', (req, res) => {
    const sql = `
        INSERT INTO Project (Name, Description, Created_at, User_id)
        VALUES ('New Project', 'Created from Node test', NOW(), 1)
    `;

    db.query(sql, (err, result) => {
        if (err) {
            res.send('Error creating project');
        } else {
            res.send('Project created successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});