const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const imageStorage = getPath(req,file,cb);
        cb(null, imageStorage);
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const getPath = (req,file,cb)=>{
    let url = req.originalUrl;
    let currentPath = path.resolve();
    if(url.includes("/news")){
        return path.join(currentPath,"../client/public/images/news");
    } else if(url.includes("/menu")){
        return path.join(currentPath,"..client/public/images/foods");
    }
};
const upload = multer({storage: storage})

module.exports = upload;