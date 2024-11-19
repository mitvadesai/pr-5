const express = require('express');

const port = 8000;

const app = express();

const db = require('./config/db')

const user = require('./models/UserModel');

const multer = require('multer');

const path = require('path');

app.set ('view engine' , 'ejs');

app.use(express.urlencoded())

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/uploads",express.static(path.join(__dirname,"uploads")))

const st = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
        const uniq = Math.floor(Math.random() * 100000);
        cb(null,${file.fieldname}-${uniq})
    }
})

const fileUpload = multer({storage:st}).single("image");

app.get('/' , (req,res) =>{
    user.find({})
    .then((data) =>{
         return res.render('view',{record : data})
    }).catch((err) =>{
        console.log(err);
        return false;
    })
})


app.get('/add' , (req,res) =>{
    return res.render ('add');
})

const UserModel = require('./models/UserModel');
const User = require('./models/UserModel');

app.post('/addrecord' , fileUpload, (req,res) =>{

    const {title,description,price} = req.body;

    UserModel.create({
       title:title,
       description:description,
       price:price,
        image:req.file.path,
    }).then((data,err) =>{
        if(err){
            console.log(err);
            return false;
        }
        console.log("recod add succesfully");
        return res.redirect('/')
        
    })
})

app.get('/delete' , (req,res) =>{
    let id = req.query.deleteid;

    user.findByIdAndDelete(id)
    .then((data) => {
        console.log("user delete succesfully");
        return res.redirect('/')
    }).catch((err) =>{
        console.log(err);
        return false;
    })
});

app.get('/edit' , (req,res) =>{
    let id = req.query.editid;

    user.findById(id)
    .then((single) =>{
        return res.render('edit' ,{movie : single})
    }).catch((err) =>{
        console.log(err);
        return false;
    })
});

app.post('/updatetRecord', fileUpload, (req, res) => {
    const { editid, title, description, price } = req.body;

    // Prepare the update data
    const updateData = {
        title: title,
        description: description,
        price: price,
    };

    // Check if a new file was uploaded
    if (req.file) {
        updateData.image = req.file.path; // Use the new image path
    }

    // Update the record in the database
    UserModel.findByIdAndUpdate(editid, updateData, { new: true })
        .then((data) => {
            console.log("Record updated successfully");
            return res.redirect('/'); // Redirect to the main page or wherever appropriate
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send("Error updating record");
        });
});

app.listen(port , (err) =>{
    if(err){
        console.log(err);
        return false;
    }
    console.log(server is run on :- ${port});
})