const authorModel = require('../models/authorModel')
const jwt= require("jsonwebtoken");

let regex=new RegExp('[a-zA-Z0-9]+@[a-z]mail.com');


//---------------------------------Create Author-----------------------------------
const createAuthor= async function (req, res) {
    try{
    let author = req.body
    let{title,fname,lname,email,password}=author
    if(!title){
        return res.status(400).send({status:false,msg :"Title is required"})}
    if(!fname){
        return res.status(400).send({status:false,msg :" First name is required"})}
    if(!lname){
        return res.status(400).send({status:false,msg :"Last name is required"})}
    if(!email){
        return res.status(400).send({status:false,msg :"Email is required"})}
    if(!password){ 
        return res.status(400).send({status:false,msg :"Passward is required"})}
    
  const verifyEmail= regex.test(email)
    if(!verifyEmail){ return res.status(400).send({status:false,msg :"Invalid Email"})}

    const emailid= await authorModel.findOne({email:email})
        if(emailid){ 
            return res.status(400).send({status:false, msg:"Email is already exists"})}

    const authorCreated = await authorModel.create(author)
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
        return res.status(400).send({status:false,msg:"Email/Password is required"})
    }
    const author = await authorModel.findOne({email:email,password:password})
    if(!author){
        return res.status(404).send({status:false,msg:"Email or Password not found"})
    }

    const token = jwt.sign(
        {
            userId:author._id.toString()  
        },
        "Blog@Project-One"
    )
    return res.status(200).send({status:true,token:token})
    }
    catch(err) {
        console.log("this is error:",err.message)
       return res.status(500).send({status:false,msg:err})
    }
 }

module.exports.createAuthor=createAuthor
module.exports.createLogin=createLogin
