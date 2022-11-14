const mongoose = require('mongoose');
const objectId = mongoose.Schema.Type.objectId
const blogSchema = new mongoose.Schema( {
    title: {
        type: String,
        required:true
    },
    body: {
        type:String,
        required:true
    },
    authorId: {
        type:objectId,
        ref:authorModel,
        required:true
    },
    tags: {
        type:[String],  
    },
     category:{
         type:String,
         required:true
     },
     subcategory:{
        type:[String]
     },
     deletedAt:{
        type:Date
     },
      isDeleted: {
        type:Boolean,
        default: false
      },
       publishedAt: {
        type:Date
       }, 
       isPublished: {
        type:Boolean,
        default: false
    },
},
 { timestamps: true });

module.exports = mongoose.model('blog', blogSchema)