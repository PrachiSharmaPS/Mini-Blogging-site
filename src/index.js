const express=require('express');
const bodyParser=require('body-parser');
const { default: mongoose }=require('mongoose');
const route=require('./routes/route.js');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb+srv://userProject1:WlhZV1CHyTcTiSlZ@blog.osplkog.mongodb.net/project1", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/',route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


