const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
    getAll,
    getById,
    create,
    update,
    delete: deleteDocument,
} = require('../controllers/documentController');
const router = express.Router();

// Get all documents for the logged-in user
router.get('/', verifyToken, getAll);

// Get a single document by ID
router.get('/:id', verifyToken, getById);

// Create a new document
router.post('/', verifyToken, create);

// Update a document
router.put('/:id', verifyToken, update);

// Delete a document
router.delete('/:id', verifyToken, deleteDocument);

module.exports = router;
