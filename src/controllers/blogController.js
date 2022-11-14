const { isValidObjectId } = require('mongoose');
const authorModel= require('../models/authorModel')
const blogModel = require('../models/blogModel')


const createBlog = async function(req,res){
    try{
        let blog=req.body;
        let{title,body,authorId,category}= blog;
        if(!title){
            return res.status(400).send({status:false,msg:'title is mandatory'});
        }
        if(!body){
            return res.status(400).send({status:false,msg:'body is mandatory'});
        }
        if(!authorId){
            return res.status(400).send({status:false,msg:'author id  is a required field'});
        }
        if(!category){
            return res.status(400).send({status:false,msg:'category is mandatory'});
        }
        if(!isValidObjectId(authorId)){
            return res.status(400).send({status:false,msg:'auhtor id is not valid'});
        }
    let blogData=await blogModel.create(blog);
    return res.status(201).send({status:true,msg:'blog has been created'});
  }
  catch(err){
    return res.status(500).send({status:false,msg:err.message});
  }
};

module.exports.createBlog=createBlog;

