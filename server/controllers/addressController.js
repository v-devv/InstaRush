
// Address Controller : /api/address/add

import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const {address , userId} = req.body;
        await Address.create({...address ,  userID: userId});
        res.status(201).json({success:true, message: 'Address added successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

// Address Controller : /api/address/get
export const getAddress =async (req, res) => {
    try {
        const {userId} = req.userId;
        const addresses = await Address.find({userId});
        if (!addresses) {
            return res.status(201).json({ message: 'No addresses found' });
        }
        res.status(200).json({success:true,  addresses});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}