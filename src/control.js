const express = require('express');
const axios = require('axios');

const router = express.Router();


router.post('/trigger', async (req, res) => {

    axios.post('http://localhost:3001/message/send', { idUser: req.body.idUser, message: req.body.message, type: req.body.type })
        .then(function (response) {
            console.log('send message with success')
        });

    return res.status(200).send({ message: 'Ok' });
});

module.exports = app => app.use('/control', router);