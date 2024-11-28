const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactsSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        res:'user'
    },
    name: {
        type: String,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contacts', ContactsSchema); // Corrected here
