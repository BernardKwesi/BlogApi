const Post = require('../models/Post');
const Comment = require('../models/Comment');
const {body, validationResult} = require('express-validator');
const async  = require('async');


exports.index = (req,res) =>{
 //res.status(200).json({msg:'Welcome'});

     Post.find({}).populate('author','email').exec((err,posts)=>{
        if(err) 
        {
            return res.status(403).json({err});
    }
        if(posts.length == 0) {
           return res.status(200).json({message:" No posts Available"});
        }
      return  res.status(200).json({posts});
    });    
 
}

exports.store = [
body('title','The title field is required').trim().isLength({min:1}).escape(),
body('content','The content field is required').trim().isLength({min:1}).escape(),

function(req,res,next){

    let errors = validationResult(req);
console.log(req.body);
    let post = new Post({
        title: req.body.title,
        content : req.body.content,
        created_at :new Date,
        author : req.user,
        published: req.body.publish,
        
    });

    if(!errors.isEmpty()){
       return res.json({
            errors:errors.array(),
            post
        });

    }
    post.save((err,post)=>{
        if(err)  return res.status(403).json({err});

        return res.status(200).json({success: "Message Saved",post});
    })
    
    
}
] 

exports.update = (req,res,next)=>{
  
    console.log(req.body);
        let post = new Post({
            title: req.body.title,
            content : req.body.content,
            created_at :req.body.date,
            author : req.body.author,
            published: req.body.publish,
            _id : req.params.id
        });
    
        
       Post.findByIdAndUpdate(req.params.id,{},function(err,post){
           if(err) return next(err);

           res.status(200).json({
               message: "Post Updated",
               post
           });
       })     
}


exports.delete = (req,res,next)=>{
    Post.findByIdAndDelete(req.params.id,function(err){
        if(err) return next(err);

        res.status(200).json({message:"Post Deleted"});
    })
}


exports.show =(req,res,next)=>{
    async.parallel({
        post:function(cb){
            Post.findById(req.params.id).populate('author','email').exec(cb);
    },
    comments: function(cb){
        Comment.find({post: req.params.id}).exec(cb);
    }
    },(err,results)=>{
        if(err) return res.status(403).json({err});
        
        if(results.post.length == 0 ){
            return res.status(403).json({message:"Post Not Found"});
        }
        if(results.comments.length == 0){
            return res.status(200).json({post:results.post , comment : "No Comments Yet"});
        }
        return res.status(200).json({post:results.post , comment : results.comments});
    })
    

}

exports.update = (req,res,next)=>{

    let post = new Post({
        _id : req.params.id,
        title : req.body.title,
        content : req.body.content,
        timestamp : req.body.timestamp , 
        user : res.locals.currentUser
    });


    Post.findByIdAndUpdate(req.params.id, post,{}, (err)=>{
        if (err) res.status(403).json({err});
        res.json({message:"Post Updated Successfully"});
    })
}

exports.delete = (req,res,next)=>{
    Post.findByIdAndDelete(req.params.id, function(err){
        if(err)  res.status(403).json({err});
        res.status(200).json({message:"Post Delete"});
    });
}

