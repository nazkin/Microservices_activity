const express = require('express');
const app = express();
const port = process.env.PORT || 4003;
const axios = require('axios');
const { eventBus } = require('../util/services')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    const { id, comment, postId } = data;
    if(type === 'commentCreate') {
        const isEvilStatement = comment.includes('Manchester United');
        const moderatedStatus = isEvilStatement ? 'rejected' : 'approved';
        await axios.post(`${eventBus}/events`, {
            type: 'commentModerated',
            id: id,
            comment: comment,
            postId: postId,
            status: moderatedStatus
        });
    }
    console.log(moderatedStatus);
    res.json({
        status: 'OK',
        message: 'New comments moderations status is ' + moderatedStatus
    });

});

app.listen(port, () => {
    console.log('Comment moderation-service running on port ' + port);
})