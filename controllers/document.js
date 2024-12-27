const Document = require('../models/Document');

// Get all documents for the logged-in user
exports.getAll = async (req, res) => {
    try {
        // const documents = await Document.find({ owner: req.user.id });
        const documents = await Document.find({});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single document by ID
exports.getById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // if (document.owner.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Not authorized' });
        // }
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new document
exports.create = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newDocument = await Document.create({
            title,
            content,
            owner: req.user.id,
        });
        res.json(newDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a document
exports.update = async (req, res) => {
    const { title, content } = req.body;
    try {
        const updatedDocument = await Document.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a document
exports.delete = async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};