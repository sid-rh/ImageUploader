const isLoggedIn=(req,res,next)=>
{
    // console.log({req:req.user})
    req.user?next():res.sendStatus(401);
}

module.exports=isLoggedIn