const orderController = require('../controllers/orderPartyController');
const  express = require('express');
const router = express.Router();
const upload = require("../config/configMulter")


router.get('/get-pending-order',orderController.getUnConfirmedOrders);
router.post('/confirm-order',orderController.confirmOrder);
router.get('/',orderController.orderParty);
router.get("/get-order/:orderID",orderController.getOrder);
router.get("/delete-order/:id",orderController.deleteOrder);
router.get('/search',orderController.searchOrder);
router.get("/update-order/:id",orderController.updateOrder);
router.post("/update-order",upload.none(),orderController.update);
module.exports = router;