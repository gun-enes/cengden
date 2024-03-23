const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const phoneSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    battery: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    cpu: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    storage: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    camera: {
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


module.exports = mongoose.model('phone', phoneSchema);