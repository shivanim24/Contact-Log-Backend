const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Shivaniisgood$girl';
var fetchuser=require('../middleware/fetchUser');

// ROUTE1 :create user using using :POST "/api/auth/createuser" .No login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be atleast 8 charcters long')
        .matches(/[A-Z]/).withMessage('Password must contain atleast one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain atleast one lowercase letter')
        .matches(/\d/).withMessage('Password must contain atleast 1 number')
        .matches(/[\W_]/).withMessage('Password must contain atleast 1 special character')
], async (req, res) => {
    //If there are errors return bad request and errors
    const errors = validationResult(req);
    let success=false; 
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "Sorry, a user with this email already exists" });
        }        
        const salt = await bcrypt.genSalt(10)

        const secPass = await bcrypt.hash(req.body.password, salt)
        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(data);
        success=true;
        res.json({ success,authtoken })
        // catch error
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Some error occurred" });
    }
    
    // check wheter the user with this email exists already


})

//ROUTE2 : authenticate a user using : POST "/api/auth/login"

router.post('/login', [
    body('email', 'Enter a vaild email').isEmail(),
    body('password', 'Password cannot be blank ').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({ success,errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({ success,error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            success=false;
            return res.status(400).json({ success,error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})


// ROUTE 3 : Get logged in user details using : POST "api/auth/getuser" . login required
router.post('/getuser',fetchuser, async (req, res) => {
try {
    userId=req.user.id;
   const user=await User.findById(userId).select("-password"); 
   res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
}
})
module.exports = router; 