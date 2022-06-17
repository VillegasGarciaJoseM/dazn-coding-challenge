const express = require('express');
const axios = require('axios')
const app = express();
var bodyParser = require('body-parser')
const userService = require('./components/devices/userService.js')

var jsonParser = bodyParser.json()

app.get('/devices', (req, res) => {
    userService.findAllDevicesFromUser(req.query.userId)
        .then(({ code, devices, message }) => {
            if (code != 200) {
                res.status(code).json(message)
            }
            res.status(code).json(devices)
        })
        .catch(err => console.log(err))
});

app.post('/device/addDevice', jsonParser, (req, res) => {
    userService.addDevice(req.body.user, req.body.device)
        .then(({ code, message }) => {
            res.status(code).json(message)
        })
        .catch(({ message }) => {
            res.status(500).json(message)
        });
})

app.post('/device/updateDevice', jsonParser, (req, res) => {
    userService.updateDevice(req.body.user, req.body.device, req.body.activate)
        .then(({ code, message }) => {
            res.status(code).json(message)
        })
        .catch(({ code, message }) => {
            res.status(code).json(message)
        });
})

app.post('/device/delete', jsonParser, (req, res) => {
    userService.deleteDevice(req.body.user, req.body.device)
        .then(({ code, message }) => {
            res.status(code).json(message)
        })
        .catch(({message}) => {
            res.status(500).json(message)
        })
})

app.all('*', (req, res) => {
    res.status(404).send("Page not found!")
})

module.exports = app;