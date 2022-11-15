const { isValidObjectId } = require("mongoose");

const blogModel = require("../models/blogModel");

const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    let { title, body, authorId, category, publishedAt, isPublished } = blog;
    if (!title) {
      return res.status(400).send({ status: false, msg: "title is mandatory" });
    }
    if (!body) {
      return res.status(400).send({ status: false, msg: "body is mandatory" });
    }
    if (!authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "author id  is a required field" });
    }
    if (!category) {
      return res
        .status(400)
        .send({ status: false, msg: "category is mandatory" });
    }
    if (!isValidObjectId(authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "auhtor id is not valid" });
    }
    let blogData = await blogModel.create(blog);

    return res.status(201).send({ status: true, data: blogData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//-------------------get blog-----
const getBlogs = async function (req, res) {
  try {
    let { authorId, category, tags, subcategory } = req.query;
    let filter = { isDeleted: false, isPublished: true };

    if (!authorId) {
      if (!category) {
        if (!tags) {
          if (!subcategory) {
            let allBlog = await blogModel.find();
            return res.status(300).send({ status: true, data: allBlog });
            //  return res.status(400).send({status:false,msg:'category,author id etc is mandatory'});
          }
        }
      }
    }
    if (authorId) {
      filter.authorId = authorId;
    }
    if (req.query.authorId) {
      if (!isValidObjectId(req.query.authorId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter a valid author id" });
      } else {
        req.query.authorId = authorId;
      }
    }
    if (category) {
      filter.category = category;
    }
    if (tags) {
      filter.tags = tags;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    let saveData = await blogModel.find(filter);
    if (saveData.length == 0) {
      return res.status(404).send({ status: false, msg: "blog not available" });
    } else {
      return res.status(200).send({ status: true, data: saveData });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//-------------------Update blog ----

const updateBlog = async function(req,res){
  try{
  const Data = req.body;
  const blog = req.params.blogId;

  if(!blog){
      return res.status(400).send({status:false,msg:"BlogId is required"})
  }
  if(!isValidObjectId(blog)){
      return res.status(404).send({ status: false, data: "Blog id is not found" })
  }

  const updateData = await blogModel.findOneAndUpdate(
      {_id:blog,isDeleted:false},
      {
          $set:{title:Data.title, body:Data.body, isPublished:true, publishedAt:new Date()},
          $push:{tags:Data.tags, subcategory:Data.subcategory}
      },
      {new:true}
  )
  return res.status(200).send({status:true,data:updateData})
  }
  catch (err) {
      return  res.status(500).send({ status: false, msg: err.message });
     }
}



//------------------path params-----
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    if(!isValidObjectId(blogId)){
      return res.status(404).send({status:false,msg:"blog id not found"})
  }

    let checkBlogId = await blogModel.findById(blogId);
    
    
    if (!checkBlogId || checkBlogId.isDeleted == true) {
      
      return res
        .status(404)
        .send({ status: false, msg: "Blog already deleted" });
    }

    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      msg: "Blog deleted sucessfully",
      data: deleteBlog,
    });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};
//------------------delet by query---
const deleteByQuery = async function(req,res){
  try{

      const data = req.query;
      const filterQuery = {isPublished:false,isDeleted:false}

      let {category,tags,subcategory,authorId} = data;

      if(Object.keys(data).length == 0){
          return res.status.send({status:false,msg:"Please Give at least One Query/filter"})
      }
      if (authorId){
           filterQuery.authorId=authorId
      }
      if(authorId){
      if(!isValidObjectId(authorId)){
          return res.status(400).send({status:false,msg:"please enter a valid author id"})
      }
      else {
          req.query.authorId=authorId
      }
    }
      if(category){
           filterQuery.category=category
      }
      if(tags){
          filterQuery.tags=tags
      }
      if(subcategory){
           filterQuery.subcategory=subcategory
          }

      const deleteData = await blogModel.updateMany(filterQuery,{$set:{isDeleted:true,deletedAt:new Date()}})
      
      if (deleteData.modifiedCount==0){
          return res.send({msg:"Document not found"})
      }
      
      return res.status(200).send({status:true,data:deleteData})
  }
  catch (err) {
      return  res.status(500).send({ status: false, msg: err.message });
     }

}



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;

module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;

