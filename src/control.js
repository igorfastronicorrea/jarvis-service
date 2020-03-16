const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const ironMessageModel = require('./models/ironmessage');
const panteraMessageModel = require('./models/panteramessage');
const shieldModel = require('./models/shield');
const fs = require('fs')
const path = require('path')

const router = express.Router();
mongoose.connect('mongodb://localhost:27017/agendatest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


router.post('/trigger', async (req, res) => {

    var countMessageForUser = 0;
    await ironMessageModel.countDocuments({ 'userId': req.body.userId }, function (err, count) {
        countMessageForUser = count;
    })

    if (countMessageForUser === 0) {
        await ironMessageModel.create({ userId: req.body.userId, message: req.body.message, type: req.body.type })
        await axios.post('http://localhost:3001/message/send', { userId: req.body.userId, message: req.body.message, type: req.body.type })
            .then(function (response) {
                console.log('send message with success')
            });
    } else {
        await panteraMessageModel.create({ userId: req.body.userId, message: req.body.message, type: req.body.type })
    }


    return res.status(200).send({ message: 'Ok' });
});

router.post('/receiver', async (req, res) => {


    var file_id = req.body.voice.file_id;
    var file_path = '';
    var documentIronMessage = '';
    var documentPanteraMessage = '';

    await axios.get('https://api.telegram.org/bot939717366:AAFeud1CDabilFt5lp9VaLmsv5ERj-oA0u4/getFile?file_id=' + file_id).then(function (response) {
        file_path = response.data.result.file_path;
    });

    const url = "https://api.telegram.org/file/bot939717366:AAFeud1CDabilFt5lp9VaLmsv5ERj-oA0u4/" + file_path;

    const imagepath = path.resolve(__dirname, '../audio', file_id + '.oga')
    const writer = fs.createWriteStream(imagepath)
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    })

    await response.data.pipe(writer);


    await ironMessageModel.find({ 'userId': req.body.from.id }, function (err, docs) {
        documentIronMessage = docs;
        console.log(docs)
    });

    if (documentIronMessage !== '') {
        await shieldModel.create({
            userId: documentIronMessage[0].userId,
            message: documentIronMessage[0].message,
            audio: file_id + '.oga'
        });

        await ironMessageModel.deleteOne({ 'userId': req.body.from.id }, function (err) {
            if (err) {
                console.log('error deleting document');
            }
        });


        var panteraTODelete = await panteraMessageModel.findOne({ 'userId': req.body.from.id }, function (err, docs) {
            documentPanteraMessage = docs;
            console.log(docs)
        });


        await panteraTODelete.deleteOne();

        if (documentPanteraMessage !== '') {
            await ironMessageModel.create({
                userId: documentPanteraMessage.userId,
                message: documentPanteraMessage.message
            });
        }
    }


    return res.status(200).send({ message: 'Ok' });
});


module.exports = app => app.use('/control', router);