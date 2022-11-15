const express = require('express');
const router = express.Router();
const authorController=require('../controllers/authorController')
const blogController=require('../controllers/blogController')

router.post("/createBlog", blogController.createBlog)
router.post("/createAuthor", authorController.createAuthor)
//----------------------------
router.get("/getBlog", blogController.getBlogs)
router.put("/updateBlog/:blogId", blogController.updateBlog)
//--------------------------------
router.delete("/deleteByQuery", blogController.deleteByQuery)
router.delete("/deleteBlog/:blogId", blogController.deleteBlog)


module.exports = router;
