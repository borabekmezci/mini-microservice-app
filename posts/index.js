const express = require("express");
const { randomBytes } = require ("crypto");// this makes new id for Post request that users trying to generate.
const cors = require("cors");
const axios = require ("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req,res)=>{
    res.send(posts);
});
app.post("/posts", async (req,res) =>{
    //gives us random id. (hexadecimal)
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id]={
        id,
        title
    }
    
    await axios.post("http://localhost:4005/events",{
        type : 'PostCreated',
        data : {
            id,
            title
        }
    }).catch(e => {
        console.log(e);
    });

    res.status(201).send(posts[id]);
});

app.post("/events",(req,res)=>{
    console.log("Received Event",req.body.type);

    res.send({});
});

app.listen(4000,()=>{
    console.log("Listening on 4000!!");
});