const express = require('express');
const app = express();
const port = process.env.PORT || 4002;
const cors = require('cors');


app.use(cors());
app.use(express.json());                                //Parsing JSON bodies
app.use(express.urlencoded({ extended: true }));        //Parsing URL-encoded bodies

const postsInfo = {}

app.get('/posts', (req,res) => {
    res.json({
        posts: postsInfo
    });
});

app.post('/events', (req,res) => {
    const { type, data } = req.body;

    if(type === 'postCreate'){
        const { id, title } = data;
        postsInfo[id] = { id, title, comments: [] };

    }
    if(type === 'commentCreate'){
        const { id, comment, postId} = data;
        postsInfo[postId].comments.push({ id, comment })
    }
    console.log(postsInfo);
    res.json({
        status: 'OK',
        message: `${type} event has been successfully processed`
    })
});

app.listen(port, () => {
    console.log(`Query service listening on port ${port}`);
})