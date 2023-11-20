const User=require('../models/User');
const Image=require('../models/Image');
const path = require('path'); 
const multer = require('multer');
const mongoose=require('mongoose');
const fs=require('fs').promises;
const sharp=require('sharp');
const storage = multer.diskStorage({
  destination: path.join(__dirname,'..', 'public', 'images'),
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).single('image');

const uploadImage=async(req,res)=>
{
    try {
        const user = await User.findById(req.user.id);
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
          }
      
          const fileName = req.file.filename;
          const pathName=`/images/${fileName}`;
      
          
          user.images.push({
            filename: fileName,
            path: pathName,
          });
          await user.save();

          const imageId = user.images.find(image => image.path === pathName)._id;
          res.status(201).json({ message: 'Image uploaded successfully.',path:pathName,id:imageId });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteImage=async(req,res)=>
{
    try {
        const user = await User.findById(req.user.id); 
        const imageId = req.body.imageId; 
        
        const imageIndex = user.images.findIndex((image) => {
          return image._id==imageId
        });
        
        if (imageIndex === -1) {
          return res.status(404).json({ message: 'Image not found.' });
        }
        
        const fileName = user.images[imageIndex].filename;
        
        user.images.splice(imageIndex, 1);
        
        const filePath = path.join(__dirname, '..', 'public', 'images', fileName);
        await fs.unlink(filePath);
        // fs.unlink(filePath, async(err) => {
        //   if (err) {
        //     console.error(`Error deleting file: ${err}`);
        //   } else {
            
        //     await user.save();
        //     res.status(200).json({ message: 'Image deleted successfully.' });
        //   }
        // });
        await user.save();
        res.status(200).json({ message: 'Image deleted successfully.' });
      } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

const performCroppingAndReplace=async(imagePath, cropData)=> {
  try {
    const imageBuffer = await fs.readFile(imagePath);

    // Use sharp to crop the image based on the crop data
    const croppedImageBuffer = await sharp(imageBuffer)
      .extract({
        left: cropData.x,
        top: cropData.y,
        width: cropData.width,
        height: cropData.height,
      })
      .toBuffer();

    // Overwrite the original image file with the cropped image
    await fs.writeFile(imagePath, croppedImageBuffer);

    return imagePath;
  } catch (error) {
    console.error('Error cropping and replacing image:', error);
    throw error;
  }
}

const editImage=async(req,res)=>
{
  try {

      const user = await User.findById(req.user.id);
      const imageId=req.body.imageId;

      const imageIndex = user.images.findIndex((image) => {
        return image._id==imageId
      });
      
      if (imageIndex === -1) {
        return res.status(404).json({ message: 'Image not found.' });
      }

      const relPath = user.images[imageIndex].path;
      const imagePath=path.join(__dirname,'..','public',relPath);

      const editedImagePath = await performCroppingAndReplace(imagePath, req.body.cropData);

      const idx = user.images.findIndex((image) => {
        return image._id==imageId
      });
      const newPath=user.images[idx].path;

      res.json({ message: 'Image edited and replaced successfully', imagePath:newPath });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports={uploadImage,upload,deleteImage,editImage};