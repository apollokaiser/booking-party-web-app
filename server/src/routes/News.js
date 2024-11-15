const  express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');
const upload = require('../config/configMulter')


router.post('/upload', NewsController.Upload);
router.get('/add-news',NewsController.addNews);
router.get('/update-news/:id',NewsController.editNews);
router.post('/update',upload.single("news-image"),NewsController.updateNews);
router.get('/detail-news/:id', NewsController.detailNews);
router.get('/delete-news',NewsController.removeNews);
router.post('/add',upload.single("news-image"),NewsController.add);
router.get('/', NewsController.Index);
module.exports = router;