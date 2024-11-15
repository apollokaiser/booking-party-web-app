
const News = require('../models/newsModel');
const Services = require('../models/servicesModel');

const getNewsAPI = async (req, res, next) => {
    const newsList = await News.getRandomNews();
    if(newsList){
        res.send({newsList,status:200});
    } else {
        res.send({newsList:null,status:404});
    }
}
const getAllNewsAPI = async (req, res, next) => {
    const newsList = await News.getAllNews();
    if(newsList){
        res.send({newsList,status:200});
    } else {
        res.send({newsList:null,status:404});
    }
}
const getDetailNewsAPI = async (req, res,next) => {
    const newsInfo = await News.getNewsById(req.params.newsID);
    if(newsInfo){
        res.send({newsInfo,status:200});
    } else {
        res.send({newsInfo:null,status:404});
    }
}
module.exports = {getNewsAPI,getDetailNewsAPI,getAllNewsAPI}