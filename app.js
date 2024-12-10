if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const express=require("express");
const app=express();
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const Listing = require("./model/hostarSchema");
const multer  = require('multer')
const {storage}=require("./cloudConfig.js");
const upload = multer({ storage });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

const dbUrl="mongodb+srv://vaibhavrajput411:qoV51LL5llHAnpjN@cluster0.klrkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
.then(()=>console.log("Database created.."))
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}

app.get("/",(req,res)=>{
    res.send("root");
});

//this is frontend APi
//home route
app.get("/hostar/:id",async(req,res)=>{

    let data=await Listing.find({});
    let idData=await Listing.findOne({type:"Sport"});  //default video play on screen
    let {id}=req.params;
    if(id.length!=24){
       id=idData._id.toString();
    }

    res.render("hostarPage/HomePage.ejs",{data,id});
});

//route for all listing (show all button)
app.get("/hostar/home/allListings",async(req,res)=>{
    let data=await Listing.find({});
    res.render("hostarPage/allListings.ejs",{data});
});

//route for search bar
app.get("/hostar/home/search",async(req,res)=>{
  let data=await Listing.find({});
    res.render("hostarPage/searchPage.ejs",{data});
});


//This is a backend Api
//for Inserting data into the hostar db

app.get("/hostar/listing/add",(req,res)=>{
  res.render("form/inserdata.ejs");
});

//route for add
app.post("/hostar/listing/add",upload.single('poster'),async(req,res)=>{
  try {
    // Ensure a file was uploaded
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded!' });
    }

    // Destructure the necessary data
    const { body: data } = req;
    const { path: url, filename } = req.file;

    // console.log(url, "...", filename);

    // Create a new listing and save to the database
    const newListing = new Listing(data);
    newListing.poster = { url, filename };
    await newListing.save();
    res.redirect("/hostar/home");
    
} catch (err) {
    // Handle errors gracefully
    // console.error("Error occurred:", err);
    return res.status(500).send({ error: 'Error occurred while saving the listing.' });
}
});

//route for update
app.get("/hostar/listing/:id/update",async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id);
  let OriginalImageUrl=data.poster.url;
  OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("form/updatedata.ejs",{data,id,OriginalImageUrl});
});

app.put("/hostar/listing/:id/update",upload.single('poster'),async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body});
    // console.log(req.file);

    if(typeof req.file!== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.poster={url,filename};
    await listing.save();
    }
    res.redirect("/hostar/home");
});

app.listen("8080",()=>{
    console.log("listen");
});
