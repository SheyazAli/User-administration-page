 const userSchema = require('../model/userModel')
 const bcrypt = require('bcrypt')
 const saltround = 10;
 const session = require("express-session");


 const registerUser = async (req,res) =>{
try {
    const {username,email,password} = req.body
    const user = await userSchema.findOne({email,username})
    if (user) return res.render('user/register',{msg:'User already exists'})
        const hashedpassword = await bcrypt.hash(password, saltround)
    const newUser = new userSchema({
        username,
        email,
        password:hashedpassword
        
    })
await newUser.save()
res.render('user/login',{msg:'User created sucessfully'})

} catch (error) {
    res.render('user/register',{msg:'Something went wrong'})

}

 }

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userSchema.findOne({ username });

    if (!user) {
      return res.render("user/login", { msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("user/login", { msg: "Incorrect password" });
    }

    // ✅ Store user info in session
    req.session.user = { id: user._id, username: user.username };

    // ✅ Redirect to home
    res.redirect("/user/home");
  } catch (error) {
    console.log(error);
    res.render("user/login", { msg: "Something went wrong in login" });
  }
};



const loadRegister = (req,res) =>{
    res.render('user/register')
}


 const loadLogin = (req,res) =>{
    res.render('user/login')
}


const loadHome = (req,res)=>{
    res.render("user/userHome")
}

const logout = (req,res) =>{
    req.session.user = null
    res.render('user/login')
}

 module.exports = {registerUser,loadRegister,loadLogin,login,loadHome,logout}