const express = require('express');
const app = express();
const { randomBytes } = require('crypto');
const port = process.env.PORT || 4001;
const cors = require('cors');
const axios = require('axios');
const { eventBus } = require('../util/services');

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

        const commentBody = req.body.comment;                   //Comment content from front-end

        const comment = {                                       //creating a comment object
            id: commentId,
            comment: commentBody,
            status: 'pending'
        }
        const postsComments = commentsPerPost[postId] || [];    //Fetch comments for specific postid, if undefined retrieve []
        postsComments.push(comment);                            //Add comment to comments array
        commentsPerPost[postId] = postsComments;                //Save comments array to the object

        await axios.post(`${eventBus}/events`, {
            type: "commentCreate",
            data: {
                id: commentId,
                comment: commentBody,
                postId: postId,
                status: 'pending'
            }
        });

        res.status(201).send(postsComments);
    } catch (error) {
        console.log(error);
    }

});

app.post('/events', async (req, res) => {
   const {type, data} = req.body;
   if(type === 'commentModerated') {
       const { id, postId, status, comment} = data;
       const commentsArr = commentsPerPost[postId];
       const moderatedComment = commentsArr.find(comment => comment.id === id);
       moderatedComment.status = status;

       await axios.post(`${eventBus}/events`, {
           type: 'commentUpdated',
           data: {
               id,
               comment,
               postId,
               status
           }
       });
   }

    res.json({
        status: 'Event received'
    });
});

app.listen(port, () => console.log('Comments-service running on port'+ port));