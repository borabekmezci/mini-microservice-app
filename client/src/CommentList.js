
/* eslint-disable no-unused-vars */
import React from "react";

const CommentList = ({comments}) => {
   
    const renderedComments = comments.map (comment =>{
        return <li key ="{comment.id}">{comment.content}</li>//every comment we created has content property.
    });

    return <ul>{renderedComments}</ul>;
};
export default CommentList;