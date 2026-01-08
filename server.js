const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
const app = express();
app.use(express.json());
app.listen(port, () => {
    console.log('Server running on port', port);
});
// GET
app.get('/allDeliveries', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.deliveries');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allDeliveries'});
    }
});
// POST
app.post('/addDeliveries', async (req, res) => {
    const {fullname, phone_num, delivery_status} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO deliveries (fullname, phone_num, delivery_status) VALUES (?, ?, ?)', [fullname, phone_num, delivery_status]);
        res.status(201).json({message: 'Delivery for ' + fullname + ' has been added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add Delivery for ' + fullname});
    }
});
app.post('/updateDeliveries/:id', async (req, res) => {
    const {id} = req.params;
    const {delivery_status} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT fullname FROM deliveries WHERE id = ?', [id]);
        const fullname = rows[0].fullname;
        await connection.execute('UPDATE deliveries SET delivery_status = ? WHERE id = ?', [delivery_status, id]);
        res.status(200).json({message: 'Delivery for ' + fullname + ' was updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not update Delivery for ' + fullname});
    }
});
app.post('/deleteDeliveries/:id', async (req, res) => {
    const {id} = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT fullname FROM deliveries WHERE id = ?', [id]);
        const fullname = rows[0].fullname;
        await connection.execute('DELETE FROM deliveries WHERE id = ?', [id]);
        res.status(200).json({message: 'Delivery for ' + fullname + ' has been deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete Delivery for ' + fullname});
    }
});