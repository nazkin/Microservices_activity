const express = require('express');
const app = express();
const { randomBytes } = require('crypto');
const port = process.env.PORT || 4001;
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());                                //Parsing JSON bodies
app.use(express.urlencoded({ extended: true }));        //Parsing URL-encoded bodies


const commentsPerPost = {}
app.get('/posts/:id/comments', (req,res) => {

    const postId = req.params.id;

    res.json({
        comments: commentsPerPost[postId] || [],
        message: 'Retrieving all comments for post, success'
    });
});

app.post('/posts/:id/comments', async (req,res) => {
    try {
        const postId = req.params.id;
        const commentId = randomBytes(4).toString('hex');       //Generate random comment id

        const commentBody = req.body.comment;               //Comment content from front-end

        const comment = {                                       //creating a comment object
            id: commentId,
            comment: commentBody
        }
        const postsComments = commentsPerPost[postId] || [];    //Fetch comments for specific postid, if undefined retrieve []
        postsComments.push(comment);                            //Add comment to comments array
        commentsPerPost[postId] = postsComments;                //Save comments array to the object

        await axios.post('http://localhost:4005/events', {
            type: "commentCreate",
            data: {
                id: commentId,
                comment: commentBody,
                postId: postId
            }
        });

        res.status(201).send(postsComments);
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

app.listen(port, () => console.log('Comments-service running on port'+ port));