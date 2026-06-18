import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    items:[{
        productId:{
            // Product belongs to a separate service/database. Store only its ID.
            type:mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
        }
    }],
},{timestamps:true})


const cartModel = mongoose.model('cart',cartSchema);

export default cartModel;
