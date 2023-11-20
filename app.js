const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const authRoutes=require('./routes/authRoutes');
const imageRoutes=require('./routes/imageRoutes');
const ejs=require('ejs');
const path=require('path');
const session=require('express-session');
const passport = require('passport');
require('./auth/auth')
const isLoggedIn=require('./middleware/isLoggedIn');

const app=express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false},
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(
        ()=>{
            console.log("Connected to db");
        }
    );

    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
      });
      


app.get('/',(req,res)=>
{
    // res.send('<a href="/auth/google">Authenticate with google</a>');
    if (req.isAuthenticated()) {
        
        console.log('Authenticated user:', req.user);
      } else {
        
        console.log('User is not authenticated');
      }
    
      // Your other route handling logic goes here
      res.render('index', { user: req.user });
    
});




app.use('/',authRoutes);
app.use('/image',imageRoutes);


app.get('/protected',isLoggedIn,(req,res)=>
{
    res.send('<a href="/auth/logout">Logout</a>');
})

app.listen(8000,()=>
{
    console.log('listening');
});