const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    googleID:{
        type: String,
        required: true // If there are other auth methods this should not be required
    },
    email:{
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    }
});

// Create collection and Schema
mongoose.model('users', UserSchema);