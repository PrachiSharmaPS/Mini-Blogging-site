const express = require('express');
const router = express.Router();
const authorController=require('../controllers/authorController')
const blogController=require('../controllers/blogController')

router.post("/createBlog", blogController.createBlog)
router.get("/getBlog", blogController.getBlogs)
module.exports = router;
