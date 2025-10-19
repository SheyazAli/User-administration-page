const adminModel = require('../model/adminModel');
const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');


const loadLogin = async (req, res) => {
    try {
        // If already logged in, redirect to dashboard
        if (req.session && req.session.admin) {
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/login', { msg: '' });
    } catch (error) {
        console.error('Load Login Error:', error);
        res.render('admin/login', { msg: 'Error loading login page' });
    }
};


const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        // Check for admin by username or email
        const admin = await adminModel.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!admin) {
            console.log('Admin not found');
            return res.render('admin/login', { msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Password incorrect');
            return res.render('admin/login', { msg: 'Incorrect password' });
        }

        // ✅ Store session
        req.session.admin = { id: admin._id, username: admin.username };


        // ✅ Redirect to dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', { msg: 'Something went wrong. Please try again.' });
    }
};

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) {
            return res.redirect('/admin/login');
        }

        // ✅ Fetch users from DB
        const users = await userModel.find({});

        res.render('admin/dashboard', {
            admin,
            users,
            msg: ''
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin/login', { msg: 'Unable to load dashboard.' });
    }
};

const editUser = async (req,res) =>{
    try {
       const {id,email,username,password} = req.body 
       const hashedPassword = await bcrypt.hash(password,10)
       const user = await userModel.findOneAndUpdate({_id:id},{$set:{email,username,password:hashedPassword}})
        const allUsers = await userModel.find({})
         // Fetch updated users
    const users = await userModel.find({});

    // Render dashboard with success message for SweetAlert
    res.render('admin/dashboard', {
      admin: req.session.admin,
      users,
      success: 'user_updated'
    });
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async (req,res)=>{
    try {
        const {id} = req.params
        const user = await userModel.findOneAndDelete({_id:id})
        res.redirect('/admin/dashboard')
    } catch (error) {
        
    }
}

const addUser = async (req,res)=>{
    try {
        const {email,username,password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new userModel({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save()
        const users = await userModel.find({});
        res.render('admin/dashboard', {
  admin: req.session.admin,
  users,
  success: 'user_added'
});
    } catch (error) {
        console.log(error)
    }
}

const searchUser = async (req,res)=>{
    try {
        const searchQuery = req.query.search?.trim(); // e.g., ?search=john

        let users;
        if (searchQuery) {
            // case-insensitive partial match on username or email
            users = await userModel.find({
                $or: [
                    { username: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } }
                ]
            });

            if (users.length === 0) {
                return res.render('admin/dashboard', {
                    admin,
                    users: [],
                    success: '',
                    error: 'No users found matching your search.',
                    msg: ''
                });
            }

            // show results with a success message
            return res.render('admin/dashboard', {
                admin,
                users,
                success: 'Search completed successfully!',
                error: '',
                msg: ''
            });
        } else {
            // if no search query, show all users
            users = await userModel.find({});
            res.render('admin/dashboard', {
                admin,
                users,
                success: '',
                error: '',
                msg: ''
            });
        }
    } catch (error) {
        
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) console.log('Session destroy error:', err);
            res.redirect('/admin/login');
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/admin/login');
    }
};

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    searchUser,
    logout
};
