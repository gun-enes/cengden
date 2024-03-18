const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tutor: {
        type: String,
        required: true
    },
    lesson: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('lesson', lessonSchema);