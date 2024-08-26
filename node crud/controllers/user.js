const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'wedrfuiofdsghjklkjhmnvcxvbnmlkjytertyuiouy'

exports.createUser = async(req,res)=>{
    const data = req.body
    const {email} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }
    const user = new User(data)
    await user.save();
    res.status(201).json(user)
}

exports.getAllUser = async(req,res)=>{
    const user = await User.find();
    res.status(201).json(user)
}

exports.getSingleUser = async(req,res)=>{
    const id = req.params.id
    const user = await User.findById(id);
    if(!(user)){
        return res.status(400).json({message:"user not avaible"})
    }
    res.status(201).json(user)
}

exports.updateUser = async(req,res)=>{
    const id = req.body.id
    const data = req.body
    const user = await User.findByIdAndUpdate(id,data);    
    res.status(201).json(user)
}

exports.deleteRecord = async(req,res)=>{
    const id = req.params.id
    const user = await User.findByIdAndDelete(id);
    res.status(201).json(user)
}

exports.userSignUp = async(req,res)=>{
    const {email, password,name} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);    
    if(!(email && password && name)){
        return res.status(400).json({message:"all Feild are requird"})
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }
    const data = {email,name,password:hash}
    const user = new User(data)
    await user.save();
    res.status(201).json(user)
}


exports.userLogin = async(req,res)=>{
    const {email, password,name} = req.body  

    if(!(email && password)){
        return res.status(400).json({message:"all Feild are requird"})
    }

    const existingUser = await User.findOne({email})
    console.log(`>>>>>>>>>>>existingUser>>>>>>>>>`,existingUser);

    if(!(existingUser)){
        return res.status(400).json({message:"User not found"})
    }

    const match = await bcrypt.compare(password, existingUser.password);
    console.log(`>>>>>>>>match>>>>>>>>>>`,match);
    if(!match){
        return res.status(400).json({message:"Invalid password"})
    }
    const token = jwt.sign({id:existingUser._id}, secret
        // , { expiresIn: '1h' }
    );
    console.log(`>>>>>>token>>>>>>>>>>>`,token);
    
    res.json({token,existingUser})
}