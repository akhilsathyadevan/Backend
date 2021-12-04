const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@akhilprojectfiles.wnbnw.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
const schema=mongoose.Schema;
const authSchema= new schema({
    name: String,
    writings:String,
    image:String

});
var Authdata=mongoose.model('authdata',authSchema);
module.exports=Authdata; 
    
    
    
    