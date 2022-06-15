const express = require('express');
const axios = require('axios')

const app = express();

app.get('/devices', (req, res) => {
    res.status(200).json([{message:'Device retrieve endpoint'}]);
});

app.post('/device/create', (req,res) => {
    res.status(200).send('Device create endpoint')
})

app.post('/device/update', (req,res) => {
    res.status(200).send('Device update endpoint')
})

app.post('/device/delete', (req,res) => {
    res.status(200).send('Device delete endpoint')
})

app.all('*',(req,res) => {
    res.status(404).send("Page not found!")
})

module.exports = app;