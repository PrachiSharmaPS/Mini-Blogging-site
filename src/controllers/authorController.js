const authorModel = require('../models/authorModel')

let regex=new RegExp('[a-z0-9]+@[a-z]mail.com');
//---------------------------------Create Author-----------------------------------
const createAuthor= async function (req, res) {
    try{
    let author = req.body
    let{title,fname,lname,email,password}=author
    if(!title){return res.status(400).send({status:false,msg :"title is needed"})}
    if(!fname){return res.status(400).send({status:false,msg :" first name is needed"})}
    if(!lname){return res.status(400).send({status:false,msg :"last name is needed"})}
    if(!email){return res.status(400).send({status:false,msg :"email is needed"})}
    if(!password){return res.status(400).send({status:false,msg :"passward is needed"})}
    
  let verifyEmail= regex.test(email)
    if(!verifyEmail){ return res.status(400).send({status:false,msg :"invalid email"})}

   let authorCreated = await authorModel.create(author)
    return res.status(201).send({status:true,data: authorCreated})
    }
    catch(err) {
        console.log("this is error:",err.message)
       return res.status(500).send({status:false,msg:err})
    }
}
//-----------------------------Create login----------------------------------------
const createLogin= async function(req,res){
    try{
    const email = req.body.email
    const password = req.body.password

    if(!email || !password){
        return res.status(400).send({status:false,msg:"email/password is required"})
    }
    const user = await authorModel.findOne({email:email,password:password})
    if(!user){
        return res.status(404).send({status:false,msg:"email or password not found"})
    }

    const token = jwt.sign(
        {
            userId:user._id.toString()  
        },
        "Blog@Project-One"
    )
    return res.status(202).send({status:true,token:token})
    }
    catch(err) {
        console.log("this is error:",err.message)
       return res.status(500).send({status:false,msg:err})
    }
 }

module.exports.createAuthor=createAuthor
module.exports.createLogin=createLogin
