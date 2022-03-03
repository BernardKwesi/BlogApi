const Comment = require('../models/Comment');
const Post = require('../models/Post');


exports.create = (req,res,next)=>{
    let comment = new Comment({
        post : req.body.post_id,
        content:req.body.content,
        name : req.body.name,
        created_at : new Date 
    });

    comment.save(function(err){
        if(err) res.status(403).json({err});

        res.json({message:"Post Saved", comment});
    })
}