const express=require("express");
const app=express();
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const Listing = require("./model/hostarSchema");

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
    let idData=await Listing.findOne({type:"sport"});  //default video play on screen
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
app.post("/hostar/listing/add",async(req,res)=>{
  let data=req.body;
  try{
    let newListing=new Listing(data);
    await newListing.save();
    res.send("Listing Created");
  }
  catch(err){
      console.log("Error occured");
      console.log(err);
      res.statusCode(500).send("Error in listing");
  }
});

//route for update
app.get("/hostar/listing/update",(req,res)=>{
  res.render("form/updatedata.ejs");
});

app.put("/hostar/listing/update",async(req,res)=>{

  let data=req.body;
  let updatedData = { ...data };
  let condition=data.condition.toString();

  try{
    const result= await Listing.updateOne({title:condition},{ $set: updatedData });
    if (result.modifiedCount > 0) {
      res.send("Listing successfully updated");
    } else if (result.matchedCount > 0) {
      res.send("Listing found, but no changes were made");
    } else {
      res.send("No matching listing found");
    }
  }
  catch(err){
      console.log("Error occured");
      console.log(err);
      res.status(500).send("Error updating the listing");
  }
});

app.listen("8080",()=>{
    console.log("listen");
});