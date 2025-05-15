
// Address Controller : /api/address/add

import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const {address , userId} = req.body;
        await Address.create({...address ,  userId: userId});
        res.status(201).json({success:true, message: 'Address added successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

// Address Controller : /api/address/get
export const getAddress =async (req, res) => {
    try {
        const userId = req.userId;
        const addresses = await Address.find({userId , deleted: { $ne: true }});
        console.log(addresses , 'addresses');
        console.log(userId , 'userId');
        if (!addresses) {
            return res.status(400).json({ message: 'No addresses found' });
        }
        res.status(200).json({success:true,  addresses});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const deleteAddress = async(req , res)=>{
    try {
        const {addressId} = req.body;
        const address = await Address.findByIdAndUpdate(addressId , {deleted: true});
        if(!address){
            return res.status(400).json({ message: 'Address not found' });
        }
        console.log(address , 'address');
        res.status(200).json({success:true, addresses: [address], message: 'Address deleted successfully'});
    } catch (error) {
        
    }
}