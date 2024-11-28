const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes using GET: "/api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // Fetch all notes for the logged-in user
        const notes = await Contact.find({ user: req.user.id });

        // Send the notes as a JSON response
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

//ROUTE 2:  Add a new note using POST : "/api/notes/addnote" Login required
// ROUTE 2: Add a new note using POST : "/api/notes/addnote" Login required
router.post('/addnote', fetchuser, [
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('mobileno', 'Mobile number must be valid').isMobilePhone(), // Validates mobile number format
    body('email', 'Invalid email address').isEmail(), // Validates email format
], async (req, res) => {
    try {
        const { name, mobileno, email } = req.body;

        // If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new note object with name, mobileno, and email
        const note = new Contact({
            name,
            mobileno,
            email,
            user: req.user.id // Associating the note with the logged-in user
        });

        // Save the note to the database
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


//ROUTE 3: update a existing note using PUT "api/notes/updatenote".Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { name, mobileno, email } = req.body;

    // Create a new Note object with updated fields
    const newNote = {};
    if (name) { newNote.name = name; }
    if (mobileno) { newNote.mobileno = mobileno; }
    if (email) { newNote.email = email; }

    try {
        // Find the note to be updated and update it
        let note = await Contact.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow update only if the user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the note
        note = await Contact.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//ROUTE 4: delete an existing node using DELETE "api/notes/deletenote".Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Contact.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if the user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Delete the note
        await Contact.findByIdAndDelete(req.params.id);

        res.json({ success: "Contact has been deleted", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
