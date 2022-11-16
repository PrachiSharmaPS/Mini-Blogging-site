const express = require('express');
const router = express.Router();

const authorController=require('../controllers/authorController')
const blogController=require('../controllers/blogController')
const middleware=require('../middleware/mymiddleware')



router.post("/blogs", blogController.createBlog)
router.post("/authors", authorController.createAuthor)

router.post("/login",authorController.createLogin)
router.get("/blogs",middleware.authentication, blogController.getBlogs)
router.put("/blogs/:blogId",middleware.authentication,middleware.authorization, blogController.updateBlog)


router.delete("/blogs/:blogId",middleware.authentication,middleware.authorization, blogController.deleteBlog)
router.delete("/blogs",middleware.authentication,middleware.authorization, blogController.deleteByQuery)


module.exports = router;
