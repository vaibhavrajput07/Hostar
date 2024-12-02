
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const MovieSchema=new Schema({
    type:{
      type:String,
      required:true,
    },
    title:{
        type:String,
        required:true,
        maxlength: 30,
    },
    description:{
        type:String,
        required:true,
        maxlength: 200,
    },
    poster:{
      url:{
        type:String,
        required:true,
      },
      filename:{
        type:String,
      } 
    },
    video:{
        url:{
          type:String,
          required:true,
        },
        filename: String,
      },
});

const Listing=mongoose.model("Listing",MovieSchema);

module.exports=Listing;