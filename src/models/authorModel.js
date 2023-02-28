const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    title:{
        type: String,
        requried: true,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    email: {
        type: String,
        requried: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},{ timestamps: true })

module.exports  = mongoose.model('author', authorSchema)