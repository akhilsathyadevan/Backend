const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@akhilprojectfiles.wnbnw.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
const schema=mongoose.Schema;
const signupSchema= new schema({
    username: String,
    email:String,
    password:String,
    phone:String

});
var Signupdata=mongoose.model('signupdata',signupSchema);
module.exports=Signupdata;