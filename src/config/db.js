const mongoose = require('mongoose');
require('dotenv').config({ path: "../.env" })

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log("connected to mongodb")
        })
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDb;