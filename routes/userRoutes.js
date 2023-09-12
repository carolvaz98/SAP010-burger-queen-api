const express = require('express');
const userController = require('../controllers/userController');
const { requireAdmin, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAdmin, userController.listUsers);
router.get('/:id', requireAuth, userController.userById);
router.post('/create', requireAdmin, userController.createUser);
router.patch('/:id', requireAuth, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
