const express= require('express');
const cors= require('cors');
const BookData=require('./src/model/bookdata');
const Authordata=require('./src/model/authordata');
const SignupData=require('./src/model/signupdata');
const bodyparser=require('body-parser');
const jwt = require('jsonwebtoken');
const path= require('path');
var app= new express();
const port=process.env.PORT || 5000;
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./dist/Library'));
    

app.use(cors());
// username='admin';
// password='1234';
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/Library/index.html'));
   });

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

app.get('/api/books',function(req,res){
    
    BookData.find()
                .then(function(books){
                    res.send(books);
                });
});
app.get('/api/book/:id',function(req,res){
    const id=req.params.id;
    BookData.findOne({'_id':id})
    .then((book)=>
    res.send(book))
})
app.get('/api/author/:id',function(req,res){
    const id=req.params.id;
    Authordata.findOne({'_id':id})
    .then((author)=>
    res.send(author))
})
app.post('/api/insertbook',verifyToken,function(req,res){
    console.log(req.body);
    var book={
        title: req.body.book.title,
        author:req.body.book.author,
        genre:req.body.book.genre,
        image:req.body.book.image
    }
    var Book=new BookData(book);
    Book.save();

});
app.get('/api/authors',function(req,res){
     Authordata.find()
            .then(function(authors){
              res.send(authors);
             });
            

});
app.post('/api/insertauthor',verifyToken,function(req,res){
    console.log(req.body);
    var author={
        name: req.body.author.name,
        writings:req.body.author.writings,
        image:req.body.author.image
    }
    var Author=new Authordata(author);
    Author.save();
})
app.put('/api/updatebook',function(req,res){
    console.log(req.body);

    id=req.body._id,
    title= req.body.title,
    author=req.body.author,
    genre=req.body.genre,
    image=req.body.image
    BookData.findByIdAndUpdate({'_id':id},
                               {$set:{'title':title,
                                      'author':author,
                                      'genre':genre,
                                      'image':image}})
    .then(function(){
        res.send();
    });                            

});
app.put('/api/updateauthor',function(req,res){
    console.log(req.body);

    id=req.body._id,
    name= req.body.name,
    writings=req.body.writings,
    image=req.body.image
    Authordata.findByIdAndUpdate({'_id':id},
                               {$set:{'name':name,
                                      'writings':writings,
                                      'image':image}})
    .then(function(){
        res.send();
    });                            

});
app.delete('/api/deletebook/:id',function(req,res){
    id=req.params.id;
    BookData.findByIdAndDelete({'_id':id})
    .then(()=>{
        console.log('success');
        res.send();
    })

})
app.delete('/api/deleteauthor/:id',function(req,res){
    id=req.params.id;
    Authordata.findByIdAndDelete({'_id':id})
    .then(()=>{
        console.log('success');
        res.send();
    })

})
app.post('/api/login', (req, res) => {
    // let userData = req.body
    console.log(req.body)
    var userdata={
        username:req.body.uname,
        password:req.body.password
    }
    
    SignupData.findOne({username:userdata.username,
                        password:userdata.password })
    .then((err,user)=>{
        const usname=userdata.username;
        const pas=userdata.password;
        if(err){
            console.log(err);
        }
        else{
            if(user!==null){
                console.log('user exist');
                let payload={ subject: usname + pas }
                let usertoken = jwt.sign(payload, 'user')
                res.status(200).send({usertoken,role:'user'})
            }
            else if(usname=='admin' && pas=='1234'){
                console.log('admin exist');
                let payload={ subject: usname + pas }
                let admintoken = jwt.sign(payload, 'admin')
                res.status(200).send({admintoken,role:'admin'})
            }
            else if(user==null){
                res.status(401).send('user not exist')
            }
            else{
                res.send('invalid username and password')
            }
        }
    } )                   
    
    
      
        // if (username !== userData.uname) {
        //   res.status(401).send('Invalid Username')
        // } else 
        // if ( password !== userData.password) {
        //   res.status(401).send('Invalid Password')
        // } else {
        //   let payload = {subject: username+password}
        //   let token = jwt.sign(payload, 'secretKey')
        //   res.status(200).send({token})
        // }
      
    })
app.post('/api/signup',(req,res)=>{
    console.log(req.body)
    var signup={
          username:req.body.username,
          email:req.body.email,
          password:req.body.password,
          phone:req.body.phone
    }
    var user=new SignupData(signup);
    user.save();

})    

app.listen(port,()=>{console.log('server at'+port)})
