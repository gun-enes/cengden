const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    favorite: {
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
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    engine_displacement: {
        type: String,
        required: true
    },
    fuel_type: {
        type: String,
        required: true
    },
    transmission_type: {
        type: String,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('vehicle', VehicleSchema);