import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId :{
        type: String , 
        require : true,
        ref:"user"
    },
    items:[
        {
            product : { type : String , require : true , ref: 'product'},
            quantity : { type : String , require : true }
        }
    ],
    amount : {type : Number , require : true },
    address : { type : String , require : true  , ref:'address'},
    status:{type : String , require : true  ,default: 'Order Placed'},
    paymentType : {type : String , require : true },
    isPaid : {type : String , require : true  ,default:false},

} , {timestamps:true});

const Order = mongoose.models.order || mongoose.model('order' , orderSchema);

export default Order