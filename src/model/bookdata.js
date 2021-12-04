const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@akhilprojectfiles.wnbnw.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
const schema=mongoose.Schema;
const bookSchema= new schema({
    title: String,
    author:String,
    genre:String,
    image:String

});
var Bookdata=mongoose.model('bookdata',bookSchema);
module.exports=Bookdata;
