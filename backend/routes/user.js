const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', auth, userCtrl.deleteUser);
router.get("/:id/profile", auth, userCtrl.profile);
router.put("/modify", auth, multer, userCtrl.modify);

module.exports = router;