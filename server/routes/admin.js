const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/user');
const vehicle = require('../models/vehicle')
const phone = require('../models/phones')
const lesson = require('../models/lessons')
const computer = require('../models/computers')
/*
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => User.findOne( { username } ),
  id => users.find(user => user.id === id)
)
*/
/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try { 
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}


/**
 * GET /
 * Admin - Login Page
*/
router.get('/login', async (req, res) => {
  try {
    const locals = {
      title: "Login Page",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/login', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Register Page
*/
router.get('/register', async (req, res) => {
  try {
    const locals = {
      title: "Login Page",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    res.render('admin/register', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
*/
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      res.redirect('/loginfailed');
    }
    else{
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if(!isPasswordValid) {
        res.redirect('/loginfailed');
      }
      else{
        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        req.session.userName = user.username;
        res.redirect('/dashboard');
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//login failed route
router.get('/loginfailed', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'loginfailed',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await vehicle.find();
    res.render('admin/loginfailed', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});
//register failed route
router.get('/registerfailed', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Register Failed',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await vehicle.find();
    res.render('admin/registerfailed', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});
//Register Successful route
router.get('/loginsuccess', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Successful Registration',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await vehicle.find();
    res.render('admin/loginsuccess', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});
/**
 * POST /
 * Admin - Register
*/
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
      res.redirect("/loginsuccess");
    } 
    catch (error) {
      res.redirect("/registerfailed");
    }

  } catch (error) {
    console.log(error);
  }
});


/**
 * GET /
 * Admin Dashboard
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
      username: req.session.userName
    }
    const username = req.session.userName
    console.log(username)
		const phonesData = await phone.find();
    const vehiclesData = await vehicle.find({ user: req.session.userName });
		const lessonsData = await lesson.find();
		const computersData = await computer.find();
		const data = phonesData.concat(vehiclesData, lessonsData, computersData);    

    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});









/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-vehicle/:id', authMiddleware, async (req, res) => {

  try {
    await vehicle.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/');
});


// Admin - Create New Post
//add-post ekranına gider
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await vehicle.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//vehicle eklemeye gider
router.get('/add-vehicle', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Vehicle',
      description: ''
    }

    const data = await vehicle.find();
    res.render('admin/add-vehicle', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//phone eklemeye gider
router.get('/add-phone', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Phone',
      description: ''
    }

    const data = await vehicle.find();
    res.render('admin/add-phone', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//computer eklemeye gider
router.get('/add-computer', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Computer',
      description: ''
    }

    const data = await vehicle.find();
    res.render('admin/add-computer', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//lesson eklemeye gider
router.get('/add-lesson', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Lesson',
      description: ''
    }

    const data = await vehicle.find();
    res.render('admin/add-lesson', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});


 // Admin - Create New Post
// vehicle ekler
router.post('/add-vehicle', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new vehicle({
        user: req.session.userName,
        favorite: false,
        product: "vehicleinfo",
        title: req.body.title,
        model: req.body.model,
        type: req.body.type,
        brand: req.body.brand,
        image: req.body.image,
        year: req.body.year,
        color: req.body.color,
        engine_displacement: req.body.engine_displacement,
        fuel_type: req.body.fuel_type,
        transmission_type: req.body.transmission_type,
        mileage: req.body.mileage,
        price: req.body.price,
        description: req.body.description,
      });

      await vehicle.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});
// phone ekler
router.post('/add-phone', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new phone({
        title: req.body.title,
        product: "phoneinfo",
        user: req.session.userName,
        favorite: false,
        model: req.body.model,
        type: req.body.type,
        brand: req.body.brand,
        image: req.body.image,
        year: req.body.year,
        cpu: req.body.cpu,
        ram: req.body.ram,
        storage: req.body.storage,
        camera: req.body.camera,
        os: req.body.os,
        price: req.body.price,
        description: req.body.description,
      });

      await phone.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});
// computer ekler
router.post('/add-computer', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new computer({
        title: req.body.title,
        model: req.body.model,
        user: req.session.userName,
        favorite: false,
        type: req.body.type,
        product: "computerinfo",
        brand: req.body.brand,
        image: req.body.image,
        year: req.body.year,
        cpu: req.body.cpu,
        ram: req.body.ram,
        storage: req.body.storage,
        gpu: req.body.gpu,
        os: req.body.os,
        price: req.body.price,
        description: req.body.description,
      });

      await computer.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});
// lesson ekler
router.post('/add-lesson', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new lesson({
        title: req.body.title,
        tutor: req.body.tutor,
        lesson: req.body.lesson,
        user: req.session.userName,
        product: "lessoninfo",
        favorite: false,
        location: req.body.location,
        duration: req.body.duration,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
      });

      await lesson.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});
module.exports = router;