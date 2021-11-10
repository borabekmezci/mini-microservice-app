const express = require("express");
const { randomBytes } = require ("crypto");// this makes new id for Post request that users trying to generate.

const app = express();
app.use(express.json());


const posts = {};

app.get("/posts", (req,res)=>{
    res.send(posts);
});
app.post("/posts", (req,res) =>{
    //gives us random id. (hexadecimal)
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id]={
        id,
        title
    }
    res.status(201).send(posts[id]);
});

app.listen(4000,()=>{
    console.log("Listening on 4000");
});