const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleSchema = new Schema({
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
    /*year: {

    },
    color: {

    },
    engine_displacement: {

    },
    fuel_type: {

    },
    transmission_type: {

    },
    mileage: {

    },
    price: {

    },
    image: {

    },
    description: {

    },*/
})

module.exports = mongoose.model('vehicle', VehicleSchema);