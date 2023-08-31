const express = require('express');
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware(), userController.listUsers);
router.get('/:id', authMiddleware(), userController.userById);
router.post('/create', userController.createUser);
router.patch('/:id', authMiddleware(), userController.updateUser);
router.delete('/:id', authMiddleware(), userController.deleteUser);

module.exports = router;
