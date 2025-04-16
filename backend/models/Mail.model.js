import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
    title: {
         type:String,
    },

      message:{
        type:String,
        required:true,
      },

     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    
  }, 
  
  { timestamps: true });

export const  Mail = mongoose.model("Mail", mailSchema);

