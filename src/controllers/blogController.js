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
    return res.status(201).send({status:true,data:blogData});
  }
  catch(err){
    return res.status(500).send({status:false,msg:err.message});
  }
};


const getBlogs = async function (req, res) {
    try {
      let {authorId,category,tags,subcategory} = req.query;
      let filter={isDeleted:false,isPublished:true}
  
      //let blogsDetail = await blogModel.find({  $and: [allQuery, { isDeleted: false }, { isPublished: true }],});
      if(!authorId){
     if(!category){
      if(!tags){
         if(!subcategory){
        return res.status(400).send({status:false,msg:'category,author id etc is mandatory'});
    }
}
}}
      if (authorId){ filter.authorId=authorId}
      if(req.query.authorId){
        if(!isValidObjectId(req.query.authorId)){
            return res.status(400).send({status:false,msg:"please enter a valid author id"})
        }else {
            req.query.authorId=authorId
        }
      }
        if(category){ filter.category=category}
        if(tags){ filter.tags=tags}
        if(subcategory){ filter.subcategory=subcategory}

        let saveData=await blogModel.find(filter)
            if (saveData.length==0){
                return res.status(404).send({status:false, msg:"blog not available"})
            } else{
                return res.status(200).send({status:true, data:saveData})
            }
     
    } catch (err) {
     return  res.status(500).send({ status: false, msg: err.message });
    }
  };

module.exports.createBlog=createBlog;
module.exports.getBlogs=getBlogs;

