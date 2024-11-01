const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await UserModel.findOne({ email }).exec()

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = {
            email: user.email,
            name: user.name,
            userId: user._id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 1000
        }).json({ message: "Login Success" });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    const user = await UserModel({ name, email, password })

    try {

        const verifyExistingEmail = await UserModel.findOne({ email: email })

        if (verifyExistingEmail) {
            return res.status(400).json({ message: 'email already exist!' });
        }

        const newUser = await user.save();
        res.status(201).json(newUser);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find()

        res.json(users)
    } catch (error) {
        console.log(error)
    }
}