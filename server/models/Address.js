import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
         ref:"user"
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    }, city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipcode: {
        type: Number,
        required: true,
    },
    county: {
        type: String,
        required: true,
    }, phone: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }

})

const Address = mongoose.models.address || mongoose.model('address', addressSchema);

export default Address;