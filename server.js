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
    const {
        fullname,
        phone_num = '',
        delivery_status = '',
        product_name = '',
        product_image = ''
    } = req.body;
    if (!fullname) {
        return res.status(400).json({message: 'Customer name is required'});
    }
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO deliveries (fullname, phone_num, delivery_status, product_name, product_image) VALUES (?, ?, ?, ?, ?)', [fullname, phone_num, delivery_status, product_name, product_image]);
        res.status(201).json({message: 'Delivery for ' + fullname + ' has been added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add Delivery for ' + fullname});
    }
});
app.put('/updateDeliveries/:id', async (req, res) => {
    const {id} = req.params;
    const {fullname, phone_num, delivery_status, product_name, product_image} = req.body;
    if (!id) {
        return res.status(400).json({message: 'Id must be provided'});
    }
    const updates = [];
    const values = [];
    if (fullname!==undefined) {
        updates.push('fullname = ?');
        values.push(fullname);
    }
    if (phone_num!==undefined) {
        updates.push('phone_num = ?');
        values.push(phone_num);
    }
    if (delivery_status!==undefined) {
        updates.push('delivery_status = ?');
        values.push(delivery_status);
    }
    if (product_name!==undefined) {
        updates.push('product_name = ?');
        values.push(product_name);
    }
    if (product_image!==undefined) {
        updates.push('product_image = ?');
        values.push(product_image);
    }
    if (updates.length===0) {
        return res.status(400).json({message: 'No updates were found'});
    }
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT fullname FROM deliveries WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'Delivery not found'});
        }
        const displayName = fullname || rows[0].fullname;
        values.push(id);
        const sql = `UPDATE deliveries SET ${updates.join(', ')} WHERE id = ?`;
        await connection.execute(sql, values);
        res.status(200).json({message: 'Delivery for ' + displayName + ' was updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not update Delivery'});
    }
});
app.delete('/deleteDeliveries/:id', async (req, res) => {
    const {id} = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT fullname FROM deliveries WHERE id = ?', [id]);
        const fullname = rows[0].fullname;
        await connection.execute('DELETE FROM deliveries WHERE id = ?', [id]);
        res.status(200).json({message: 'Delivery for ' + fullname + ' has been deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete Delivery'});
    }
});