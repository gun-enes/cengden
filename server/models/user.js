const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                return /@ceng.metu.edu.tr\s*$/.test(email);
            },
            message: props => `${props.value} is not a valid email. Only @ceng.metu.edu.tr emails are allowed.`
        }
    },
    password: {
        type: String,
        required: true
    },
    favorite: {
        type: [String],
        required: true

    }
})

module.exports = mongoose.model('user', UserSchema);