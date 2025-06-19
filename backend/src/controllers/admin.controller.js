import User from "../models/user.model.js"

export const getAllUsers = async (req ,res) =>{
    try {
        const users = await User.find({role:{$ne:'admin '}}).select("-password -__v");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
};

export const getAllAdmins = async (req ,res) =>{
    try {
        const admins = await User.find({role:'admin'}).select("-password -__v");
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

export const deleteUser = async (req ,res) =>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        res.status(200).json({success:true, message:"User deleted successfully"});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
    //todo: Soft delete instead of hard delete
    //1. Confirmation prompt in frontend
    //2. Delete multiple users at once
};

export const addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};