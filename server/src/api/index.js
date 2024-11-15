const  express = require('express');
const router = express.Router();
const newsAPI = require("./newsAPI");
const menuAPI = require("./menuAPI");
const roomAPI = require("./roomAPI");
const servicesAPI = require("./servicesAPI");
const orderAPI = require("./orderAPI");


router.get('/get-news/:newsID', newsAPI.getDetailNewsAPI);
router.get('/get-news', newsAPI.getNewsAPI);
router.get("/get-all-news",newsAPI.getAllNewsAPI);
router.get('/get-menu',menuAPI.getMenuAPI);
router.get('/get-services',servicesAPI.getServicesAPI);
router.post('/get-room',roomAPI.getRoomAPI);
router.post('/add-order',orderAPI.addOrderAPI);
router.post("/delete-order",orderAPI.deleteOrderAPI);
router.post("/update-order",orderAPI.updateOrderAPI);
router.post('/delete-request',orderAPI.sendDeleteRequestAPI);
router.get('/get-order/:id',orderAPI.getOrderAPI);
module.exports = router;