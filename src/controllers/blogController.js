const { isValidObjectId } = require("mongoose");

const blogModel = require("../models/blogModel");

//---------------------Create Blog--------------------------------
const createBlog = async function (req, res) {
  try {
    const blog = req.body;
    const { title, body, authorId, category} = blog;
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
    const blogData = await blogModel.create(blog);

    return res.status(201).send({ status: true, data: blogData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//-------------------Get Blog----------------------------
const getBlogs = async function (req, res) {
  try {
    const { authorId, category, tags, subcategory } = req.query;
    let filter = { isDeleted: false, isPublished: true };

    if(!authorId && !category && !tags && !subcategory){
      const allBlog = await blogModel.find(filter);
            return res.status(200).send({ status: true, data: allBlog });
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

    const saveData = await blogModel.find(filter);
    if (saveData.length == 0) {
      return res.status(404).send({ status: false, msg: "Blog is not available" });
    } else {
      return res.status(200).send({ status: true, data: saveData });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
//-------------------Update Blog-----------------------

const updateBlog = async function(req,res){
  try{
  const Data = req.body;
  const blogId = req.params.blogId;

  if(!blogId){
      return res.status(400).send({status:false,msg:"BlogId is required"})
  }
  if(!isValidObjectId(blogId)){
      return res.status(404).send({ status: false, data: "please enter a valid blog id" })
  }

  const updateData = await blogModel.findOneAndUpdate(
      {_id:blogId,isDeleted:false},
      {
          $set:{title:Data.title, body:Data.body, isPublished:true, publishedAt:new Date()},
          $addToSet:{tags:Data.tags, subcategory:Data.subcategory}
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
    const blogId = req.params.blogId;

    if(!isValidObjectId(blogId)){
      return res.status(404).send({status:false,msg:"Blog id is not valid"})
  }
  const checkBlogId = await blogModel.findById(blogId);
 
    if (!checkBlogId || checkBlogId.isDeleted == true) {
      
      return res
        .status(404)
        .send({ status: false, msg: "Blog already deleted" });
    }
    const deleteBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      data: deleteBlog,
    });
  } catch (error) {
   return res.status(500).send({ status: false, msg: error.message });
  }
};
//------------------delete by query---
const deleteByQuery = async function(req,res){
  try{
     const data = req.query;
      const filterQuery = {isPublished:false,isDeleted:false}

      const {category,tags,subcategory,authorId} = data;

      if(Object.keys(data).length == 0){
          return res.status(400).send({status:false,msg:"Please Give at least One Query/filter"})
      }

      //authorisations --->
      if (authorId){
          if (authorId == req.decodeToken.userId){
             filterQuery.authorId = authorId
          } 
          else {
               return res.status(404).send({msg: "user is not authorised for this operation"})
              }
     } 
     else{
      filterQuery.authorId = req.decodeToken.userId
     }
     if(authorId){
      if(!isValidObjectId(authorId)){
          return res.status(400).send({status:false,msg:"Please enter a valid author id"})
      }
    }

    ///--->
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
          return res.status(404).send({msg:"Document not found"})
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

