const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema({
    content : {type:String , required:true},
    post : {type: Schema.Types.ObjectId , ref:'Post' , required:true},
    name : {type: String , required:true },
   
    created_at :{type:Date , required:true}
});

module.exports = mongoose.model('Comment' , commentSchema); 