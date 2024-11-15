const {processExcelFile,readExcelFile} = require('../utils/xlsxHandle')
const News = require('../models/newsModel');
const Services = require('../models/servicesModel');

//     GET /news
const Index = async (req,res,next)=>{
    const newsList = await News.getAllNews();
    if(newsList.length > 0)
        res.render('news',{newsList: newsList});
    else 
        res.render('news',null);
};
const getNewsAPI = async (req, res, next) => {
    const newsList = await News.getAllNews();
    if(newsList){
        res.send({newsList,status:200});
    } else {
        res.send({newsList:null,status:404});
    }
}
    
//GET /news/add-news
const addNews = (req, res, next)=>{
    Services.getAllServices().then((result) => {
        res.render('addNews',{serviceList:result});
    });
}
// POST /news/upload (ajax request)
const Upload = (req,res,next)=>{
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const filePath = req.file.path;
    const x = readExcelFile(filePath);
    res.send({ success: true });
}

// POST /news/add (ajax request)
const add = async (req, res,next)=>{
    newsItem = JSON.parse(req.body.news);
    newsItem.admin_id = req.session.admin_id;
    newsItem.image = req.file.originalname;
    newsItem.createAt = new Date();
    const result = await News.addNews(newsItem);
        res.send({ success: result });
}
// GET news/delete-news/:id
const removeNews = async (req,res,next) => {
    const targetID = req.query.target;
    console.log(targetID);
    let arrayId;
    if(targetID =="all") {
        arrayId =[];
    } else {
        arrayId = targetID.split('-');
    }
    const result = await News.removeNews(arrayId, arrayId.length == 0 ? true : false);
    if(result > 0){
        res.send({success: true, result: result});
    } else if(result === 0){
        res.send({success: false});
    } else {
        res.send({success: null});
    }
}
 // GET     news/detail-news/:id
const detailNews = (req,res,next)=>{
    News.getNewsById(req.params.id).then(result=>{
        if(result){
            res.render("detailNews",result);
        } else {
            res.status(404).send(result);
        }
    })
}
 // GET news/update-news/:id
const editNews  = (req,res,next)=>{
    let serviceList = null; // Not const. Unless, "Assignment to constant variable" 'll show
    Services.getAllServices(services =>{
        serviceList = services;
    })
    News.getNewsById(req.params.id).then(result=>{
        if(result){
            res.render("updateNews",{serviceList:serviceList,News:result});
        } else {
            res.redirect("/news");
        }
    });
}
const updateNews = (req,res,next)=>{
    const newsItem = JSON.parse(req.body.newsUpdated);
    req.file ==undefined ? newsItem.image = undefined :  newsItem.image = req.file.originalname;
    newsItem.createAt = new Date();
     News.getNewsById(newsItem.news_id).then(news=>{
        if(news){
            if(newsItem.image == undefined) newsItem.image = news.image;
            News.updateNews(newsItem).then(result=>{
                if(result >0){
                    res.send({success:true});
                    } else {
                        res.send({success:false});
                    }
            })
        }
     })
}
module.exports = {Index,Upload,addNews,add,removeNews,detailNews,updateNews,editNews,getNewsAPI};