const  express = require('express');
const router = express.Router();
const roomController= require("../controllers/roomController");


router.get('/get-room/:date', roomController.getRoom);
module.exports = router;