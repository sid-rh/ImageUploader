const express=require('express');
const router=express.Router();
const passport=require('passport')
const isLoggedIn=require('../middleware/isLoggedIn');
require('../auth/auth');

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/failed',
    successRedirect:'/',
    }),
);

router.get('/failed',(req,res)=>{
    res.send("Login failed");
})

router.get('/auth/logout', (req, res) => {
    req.logout((err)=> {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });


module.exports=router;