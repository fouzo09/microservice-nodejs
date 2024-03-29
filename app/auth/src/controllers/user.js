const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SALT = 10;

const Register = async(req, res)=>{
    
    try {
        const password = await bcrypt.hash(req.body.password, SALT);
        const user = await User.create({...req.body, password: password});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(401).json(error);
    }
}

const Login = async(req, res)=>{

    try{
        const {email, password} = req.body;        
        const user = await User.findOne({email: email});
        
        if(user && (await bcrypt.compare(password, user.password))){
            
            const token = jwt.sign({user_id: user._id, email}, process.env.JWT_SECRET, {});
            const authenticatedUser = {firstName: user.firstName, lastName: user.lastName, email: user.email, id: user.id};
            return res.status(200).json({user: authenticatedUser, token: token});
        }

        return res.status(400).json('Utilisateur non trouvé');
    }catch(error){
        return res.status(401).json(error);
    }
}


module.exports = { Register, Login };