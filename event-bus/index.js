const express = require('express');
const app = express();
const port = process.env.PORT || 4005;
const axios = require('axios');
const { postsService, commentsService,queryService, moderationService } = require('../util/services')


app.use(express.json());                                //Parsing JSON bodies
app.use(express.urlencoded({ extended: true }));        //Parsing URL-encoded bodies

app.post('/events', (req,res) => {
    try {
        const receivedEvent = req.body;

        axios.post(`${postsService}/events`, receivedEvent);
        axios.post(`${commentsService}/events`, receivedEvent);
        axios.post(`${queryService}/events`, receivedEvent);
        axios.post(`${moderationService}/events`, receivedEvent);

        res.json({
            status: 'OK',
            message: 'Event received and transferred'
        });
    } catch (error) {
        console.log(error);
    }

})

app.listen(port, () => {
    console.log(`Event-bus listening on port ${port}`);
})