var db = require('../config/database');

class News {
    //TODO: contructors
    constructor(news_title, news_hastag, news_content, admin_id, serviceID, image, CreateAt=new Date(),news_id=undefined) {
        if(news_id!=undefined){
            this.news_id = news_id;
        };
        this.news_title = news_title;
        this.news_hastag = news_hastag;
        this.news_content = news_content;
        this.admin_id = admin_id;
        this.image = image;
        this.serviceID = serviceID;
        this.CreateAt = CreateAt;
    }
    //TODO:methods
    static async getAllNews() {
        try {
            const news = [];
            const [rows, fields] = await db.query('SELECT * from news');
            rows.forEach(item => {
                news.push(new News(
                    item.news_title,
                    item.news_hastag,
                    item.news_content,
                    item.admin_id,
                    item.serviceID,
                    item.image,
                    item.CreateAt,
                    item.news_id));
            });
            return news; // return array of class News
        } catch (error) {
            return null;
        }
    }
    static async getRandomNews() {
        try {
            const news = [];
            const [rows, fields] = await db.query('SELECT * from news ORDER BY RAND() LIMIT 5');
            rows.forEach(item => {
                news.push(new News(
                    item.news_title,
                    item.news_hastag,
                    item.news_content,
                    item.admin_id,
                    item.serviceID,
                    item.image,
                    item.CreateAt,
                    item.news_id));
            });
            return news; // return array of class News
        } catch (error) {
            return null;
        }
    }
    static async addNews(news) {
        try {
           const [result] = await db.execute('INSERT INTO news(news_title,news_hastag,news_content,admin_id,serviceID ,image,createAt) VALUES(?,?,?,?,?,?,?)',
            [news.news_title, news.news_hastag, news.news_content,news.admin_id,news.serviceID,news.image,news.createAt]);
            return result.affectedRows > 0 ? result.affectedRows: 0;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async removeNews(array, deleteAll = false){
        let queryString = "DELETE FROM `news`";
        if(deleteAll == false){
            queryString += " WHERE news_id IN (?)"
        }
        try {
            const [result]= await db.query(queryString, [array]);
            return result.affectedRows > 0 ? result.affectedRows: 0;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async updateNews(news) {
            try {
                const queryString = "UPDATE news SET news_title = ?, news_hastag= ?, news_content = ?, serviceID = ?, image = ?, createAt = ? WHERE news_id = ?;";
                const [result]= await db.query(queryString, [news.news_title, news.news_hastag, news.news_content, news.serviceID, news.image, news.createAt, news.news_id]);
                return result.affectedRows;
            } catch (error) {
                return error.message;
            }
    }
    static async getNewsById(id, callback) {
        try {
            const [result] = await db.query("SELECT * FROM news where news_id = ?", [id]);
            if(result){
                if(callback){
                    callback(result[0]);
                } else 
                    return result[0];
                
            }
        } catch (error) {
            console.log(error.message);
            return null;

        }
    }
    // static async getNewsById(id, callback) {
    //     try {
    //         const [result] = await db.query("SELECT * FROM news where news_id = ?", [id]);
    //         if(result){
    //             if(callback){
    //                 callback(result);
    //             }
    //             return result[0];
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //         return null;

    //     }
    // }
};
module.exports = News