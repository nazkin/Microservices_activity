const express = require('express');
const app = express();
const { randomBytes } = require('crypto');
const port = process.env.PORT || 4000;
const cors = require('cors');
const axios = require('axios');
const { eventBus } = require('../util/services');

const posts = {};

app.use(cors());
app.use(express.json()); //Parsing JSON bodies
app.use(express.urlencoded({ extended: true })); //Parsing URL-encoded bodies

app.get('/posts', (req,res) => {
    res.json({
        posts: posts
    });
});

app.post('/posts', async (req,res) => {

    try {
    const id = randomBytes(4).toString('hex');
    const title = req.body.title;

    posts[id] = {
        id: id,
        title: title
    }

    await axios.post(`${eventBus}/events`, {
        type: 'postCreate',
        data: {
            id: id,
            title: title
        }
    });

    res.status(201).send(`Post ${id} has been successfuly added`);

    } catch (error) {
        console.log(error);
    }

});

app.post('/events', (req, res) => {
    console.log(`Event ${req.body.type} received`);

    res.json({
        status: 'Event received'
    });
});

app.listen(port, () => console.log('Posts-service running on port '+ port));