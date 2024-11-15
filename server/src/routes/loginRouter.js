const  express = require('express');
const router = express.Router();
const accountController = require("../controllers/accountController");


router.get("/logout", accountController.Logout);
router.use('/:redirect',accountController.redirectTo);
router.get('/',accountController.Index);
router.post('/',accountController.Check);
module.exports = router;