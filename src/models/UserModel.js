const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

UserSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch(err) {
        next(err)
    }

})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;