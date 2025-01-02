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

app.post("/hostar/listing/add",upload.fields([{ name: 'poster' }, { name: 'video' }]),async(req,res)=>{
  try {
    // Ensure files are uploaded
    if (!req.files || (!req.files['poster'] && !req.files['video'])) {
        return res.status(400).send({ error: 'No poster or video uploaded!' });
    }

    // Destructure the data from the request
    const { body: data } = req;
    let poster = null;
    let video = null;

    // Handle poster file if uploaded
    if (req.files['poster']) {
      const { path: posterUrl, filename: posterFilename, mimetype } = req.files['poster'][0];
      if (!mimetype.startsWith('image/')) {
        return res.status(400).send({ error: 'Please Enter valid format of Image' });
      }
      poster = { url: posterUrl, filename: posterFilename };
      
    }

    // Handle video file if uploaded
    if (req.files['video']) {
      const { path: videoUrl, filename: videoFilename, mimetype } = req.files['video'][0];
      if (!mimetype.startsWith('video/')) {
        return res.status(400).send({ error: 'Please Enter valid format of Video' });
      }
      video = { url: videoUrl, filename: videoFilename };
    }

    // Create a new listing and save to the database
    const newListing = new Listing({
      ...data,
      poster,
      video
    });

    await newListing.save();
    res.redirect("/hostar/home");
    
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).send({ error: 'Error occurred while saving the listing.' });
  }
})

//route for update
app.get("/hostar/listing/:id/update",async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id);
  let OriginalImageUrl=data.poster.url;
  OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("form/updatedata.ejs",{data,id,OriginalImageUrl});
});

app.put("/hostar/listing/:id/update", upload.fields([{ name: 'poster' }, { name: 'video' }]), async (req, res) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send({ error: 'Listing not found' });
    }

    // Update basic listing data (text fields)
    listing = Object.assign(listing, req.body);

    // Handle poster file if uploaded
    if (req.files && req.files['poster']) {
      const { path: posterUrl, filename: posterFilename,mimetype } = req.files['poster'][0];
      if (!mimetype.startsWith('image/')) {
        return res.status(400).send({ error: 'Please Enter valid format of Image' });
      }
      listing.poster = { url: posterUrl, filename: posterFilename };
    }

    // Handle video file if uploaded
    if (req.files && req.files['video']) {
      const { path: videoUrl, filename: videoFilename,mimetype } = req.files['video'][0];
      if (!mimetype.startsWith('video/')) {
        return res.status(400).send({ error: 'Please Enter valid format of Video' });
      }
      listing.video = { url: videoUrl, filename: videoFilename };
    }

    // Save the updated listing to the database
    await listing.save();
    res.redirect("/hostar/home");

  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).send({ error: 'Error occurred while updating the listing.' });
  }
});

app.listen("8080",()=>{
    console.log("listen");
});
