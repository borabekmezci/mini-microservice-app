const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express ();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments",(req,res)=>{
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments",(req,res)=>{
    const commentId = randomBytes(4).toString("hex");//generated new id for comment
    const { content } = req.body;//created content for comment(which can mean that we write comment via post request)

    const comments = commentsByPostId[req.params.id] || [];//we took id number in the url as paramater

    comments.push({id : commentId , content});//we push our id(parameter in post request) and content to comments
    commentsByPostId[req.params.id] = comments;// comments we created is known via its id.commentsByPostId[req.params.id]
    res.status(201).send(comments);
});

app.listen(4001,()=>{
    console.log("Listening on 4001!");
});