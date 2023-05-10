const express = require("express");
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const fs = require("fs");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var uploads = multer({
    storage: storage,
}).single('image');

//inser an user into database
router.post('/add', uploads, async (req, res) => {
    const user = {
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    };
    try {
        await User.create(user)
        req.session.message = {
            type: 'success',
            message: 'User added successfully!',
        };
        res.redirect('/admin');
    }
    catch (error) {
        res.json({ message: error.message, type: 'danger' });
    }
})

// Get all user route

router.get('/', (req, res) => {
    User.find().then((users) => {
        res.render('user', {
            title: "Home Page",
            users: users,
        })
    }).catch(err => {
        res.send({ message: err.message, type: err })
    })
    // res.render("index", {title : "Home page"})
});

router.get('/add', (req, res) => {
    res.render("add_users", { title: "Add Users" });
})

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then((user) => {
            if (user == null) {
                res.render("/admin");
            } else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: user,
                });
            }
        })
        .catch((err) => {
            res.redirect("/admin");
        })
});

router.post('/update/:id', uploads, (req, res) => {
    let id = req.params.id;
    let new_image = "";
    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    })
        .then(result => {
            req.session.message = {
                type: "Success",
                message: "User updated Successfully!",
            };
            res.redirect('/');
        }).catch(err => {
            res.json({ message: message, type: "danger" })
        })
});

router.get('/delete/:id', (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id)
        .then(result => {
            if (result.image != "") {
                try {
                    fs.unlinkSync('./uploads/' + result.image);
                } catch {
                    console.log(err);
                }
            }
            req.session.message = {
                type: 'success',
                message: "User deleted success",
            }
            res.redirect("/");

        }).catch(err => {
            res.json({ message: err.message })
        })
})

router.get('/admin', (req, res) => {
    User.find().then((users) => {
        res.render('index', {
            title: "Admin Page",
            users: users,
        })
    }).catch(err => {
        res.send({ message: err.message, type: err })
    })
})


module.exports = router;    