const  express = require('express');
const router = express.Router();
const menuController= require("../controllers/menuController");
const upload = require("../config/configMulter")


router.post('/addMenu',upload.none(), menuController.add);
router.post("/add-food",upload.single("food-image"), menuController.addFood);
router.get('/add-menu', menuController.addMenu);
router.post('/delete-menu', menuController.deleteMenu);
router.get('/update-menu/:id', menuController.updateMenu);
router.post('/update-menu',upload.none(), menuController.update);
router.get('/', menuController.Index);
module.exports = router;