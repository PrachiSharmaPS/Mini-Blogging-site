const jwt= require("jsonwebtoken");
const blogModel = require("../models/blogModel");

//-----------------Authentication-------------------------------
const authentication = function (req, res, Next) {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    console.log(token);
    let decodedToken = jwt.verify(token,"Blog@Project-One");

    if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" });
       req.decodedToken=decodedToken
        Next()
}
//-----------------Authorization-------------------------------
const authorization = async function(req,res,next){
    try{
 const blogId = req.params.blogId
 const userVerified = req.decodedToken.userId

 if(!blogId){

    if(!req.query.authorId){
        return res.status(400).send({status:false, msg:"author/blog id is required"})
    }
 }
  if(blogId){
   
    const findAuthor = await blogModel.findById(blogId).select({authorId:1,_id:0})
    const author = findAuthor.authorId.toString();

    if(userVerified != author){
        return res.status(403).send({status:false,msg:"You are not authorised "})
    }
    next()
  }
  else{
    const queryByAuthor = req.query.authorId
    if(userVerified != queryByAuthor){
        return res.status(403).send({status:true,msg:"You are not authorised"})
    }
    next();
  }
  }
  catch(err){
    return res.status(500).send({status:false,msg:err.message})
  }
}
module.exports.authorization = authorization

module.exports.authentication = authentication

