const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String, 
    author: String,
    body: String,
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    likes: {
        type: Number,
        default: '0',
    }
});