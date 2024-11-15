const billController = require('../controllers/billController');
const  express = require('express');
const router = express.Router();

router.post("/add-bill", billController.addBill);
module.exports = router;