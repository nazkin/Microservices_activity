const express = require('express');
const app = express();
const port = process.env.PORT || 4002;
const cors = require('cors');


app.use(cors());
app.use(express.json());                                //Parsing JSON bodies
app.use(express.urlencoded({ extended: true }));        //Parsing URL-encoded bodies

app.get('/posts', (req,res) => {

});

app.post('/events', (req,res) => {

});

app.listen(port, () => {
    console.log(`Query service listening on port ${port}`);
})