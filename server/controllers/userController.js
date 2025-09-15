import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js"

// Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Please fill all fields" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  const token = generateToken(user._id.toString());
  res.json({ success: true, token });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please fill all the fields' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(user._id.toString());

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Get User data using Token (JWT)
export const getUserData = async (req, res)=>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}