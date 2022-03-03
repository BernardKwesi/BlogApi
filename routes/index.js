var express = require('express');
var router = express.Router();
const  AuthController  = require('../controllers/AuthController');
const passport = require('passport');
const PostController = require('../controllers/PostController');
const CommentController = require('../controllers/CommentController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/api/register',passport.authenticate('signup',{session:false}),async (req,res,next)=>{
  res.json({
      message : 'Signup successful',
      user:req.user
  });
});
router.post('/api/login',AuthController.login);
router.get("/api/logout",AuthController.logout);

router.get('/api/posts',PostController.index);
router.post('/api/posts',passport.authenticate('jwt', { session: false }),PostController.store);
router.get('/api/posts/:id',PostController.show);
router.post("/api/comment",CommentController.create);
router.delete('/api/posts/:id/delete',PostController.delete);
router.put('/api/posts/:id/delete',PostController.update);


module.exports = router;
