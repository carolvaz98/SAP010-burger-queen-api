const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.get('/', userController.listUsers);
router.post('/create', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
