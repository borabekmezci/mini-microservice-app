const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require('axios');

const app = express ();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments",(req,res)=>{
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments",async (req,res)=>{
    const commentId = randomBytes(4).toString("hex");//generated new id for comment
    const { content } = req.body;//created content for comment(which can mean that we write comment via post request)

    const comments = commentsByPostId[req.params.id] || [];//we took id number in the url as paramater

    comments.push({id : commentId , content,status : "pending"});//we push our id(parameter in post request) and content to comments
    commentsByPostId[req.params.id] = comments;// comments we created is known via its id.commentsByPostId[req.params.id]

    await axios.post('http://localhost:4005/events',{
        type : 'CommentCreated',
        data : {
            id : commentId,
            content,
            postId : req.params.id,
            status : "pending"
        }
    }).catch(e => {
        console.log(e);
    });
    res.status(201).send(comments);
});

app.post("/events",async (req,res)=>{
    console.log("Event Received",req.body.type);

    const {type , data} = req.body;

    if(type ==='CommentModerated') {

        const {id,postId,status,content} = data ;
        const comments = commentsByPostId[postId];
        
        const comment = comments.find(comment => {
            return comment.id = id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events',{
            type : 'CommentUpdated',
            data : {
                id,
                content,
                status,
                postId,
            }
        }).catch(e => {
            console.log(e);
        });
    
    }

    res.send({});
});

app.listen(4001,()=>{
    console.log("Listening on 4001!");
});