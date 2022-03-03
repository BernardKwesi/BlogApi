const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = passport.authenticate('signup',{session:false},async (req,res,next)=>{
    res.json({
        message : 'Signup successful',
        user:req.user
    });
});

exports.login = async(req,res,next) =>{
    passport.authenticate('login', async(err,user,info)=>{
        try{
            if(err || !user){
                const error = new Error('An error occurred');
                return next(error);
            }
            req.login(
                user,{session:false},
                async(error)=>{
                    if(error) return next(error);

                    const body = {_id :user._id , email:user.email};
                    const token = jwt.sign({user:body},process.env.JWT_SECRET)
                    return res.json({token});
                }
            )
        }catch(error){
            return next(error);
        }
    })(req, res, next);
}

exports.logout = function(req, res){
    req.logout();
    res.status(200).json({message:"User Logged Out"});
}

exports.checkAuth =  function(req,res,next){
    if(!req.user){
         res.status(402).json({message:"You must be logged in to access this resource"});
    }
    next();
}