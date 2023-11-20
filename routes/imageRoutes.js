const express=require('express');
const router=express.Router();
const isLoggedIn=require('../middleware/isLoggedIn');

const{uploadImage,upload,deleteImage,editImage}=require('../controller/imageController');

router.post('/upload',isLoggedIn,upload,uploadImage);
router.post('/delete',isLoggedIn,deleteImage);
router.post('/edit',isLoggedIn,editImage);



module.exports=router;