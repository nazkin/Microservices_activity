const express = require('express');
const app = express();
const port = process.env.PORT || 4005;
const axios = require('axios');


app.use(express.json());                                //Parsing JSON bodies
app.use(express.urlencoded({ extended: true }));        //Parsing URL-encoded bodies

app.post('/events', (req,res) => {
    const receivedEvent = req.body;

    axios.post('http://localhost:4000/events', receivedEvent);
    axios.post('http://localhost:4001/events', receivedEvent);
    axios.post('http://localhost:4002/events', receivedEvent);

    res.json({
        status: 'OK',
        message: 'Event received and transferred'
    })
})

app.listen(port, () => {
    console.log(`Event-bus listening on port ${port}`);
})