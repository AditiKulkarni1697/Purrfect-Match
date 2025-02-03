const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        required: true
    },
    interestedIn: {
        type: [String],
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        required: true
    },
    lookingFor: {
        type: String,
        enum: ['Long Term', 'Short Term', 'Pen Pal'],
        required: true
    },
    interests: {
        type: [String]
    },
}, {timestamps: true});

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};