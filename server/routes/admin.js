const express = require('express');
const router = express.Router();
const session = require('express-session');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/user');
const vehicle = require('../models/vehicle')
const phone = require('../models/phones')
const lesson = require('../models/lessons')
const computer = require('../models/computers');
const user = require('../models/user');
const { render } = require('ejs');
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
    return res.render('admin/login');
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
/*
Logout
*/
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/');
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
      if(user.password != password) {
        res.redirect('/loginfailed');
      }
      else if(user.username == 'admin'){
        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        req.session.userName = user.username;
        res.redirect('/admindashboard');
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
router.get('/loginfailed', async (req, res) => {
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
router.get('/registerfailed', async (req, res) => {
  try {
    const locals = {
      title: 'Register Failed',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    res.render('admin/registerfailed', {
      locals,
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

    try {
      const user = await User.create({ 
        username: req.body.username, 
        email: req.body.email,
        password: req.body.password,
        favorite: [] });
      res.redirect("/loginsuccess");
    } 
    catch (error) {
      console.log(error)
      res.redirect("/registerfailed");
    }

  } catch (error) {
    console.log(error);
  }
});


/**
 * GET /
 * Dashboard
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
      username: req.session.userName
    }
		const phonesData = await phone.find({ user: req.session.userName });
    const vehiclesData = await vehicle.find({ user: req.session.userName });
		const lessonsData = await lesson.find({ user: req.session.userName });
		const computersData = await computer.find({ user: req.session.userName });
		const data = phonesData.concat(vehiclesData, lessonsData, computersData);    
    if(req.session.userName == 'admin'){
      res.render('admin/admindashboard', {
        locals,
        data,
        layout: adminLayout
      });
    }
    else{
      res.render('admin/dashboard', {
        locals,
        data,
        layout: adminLayout
      });
    }
    

  } catch (error) {
    console.log(error);
  }

});

router.get('/admindashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Admin Dashboard',
      username: req.session.userName
    }
		const phonesData = await phone.find();
    const vehiclesData = await vehicle.find();
		const lessonsData = await lesson.find();
		const computersData = await computer.find();
		const data = phonesData.concat(vehiclesData, lessonsData, computersData);
    const users = await User.find();

    res.render('admin/admindashboard', {
      locals,
      data,
      users,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});
router.delete('/delete-user/:id',authMiddleware ,async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    const usernamefield = user.username;
    await vehicle.deleteMany({ user: usernamefield });
    await phone.deleteMany({ user: usernamefield });
    await lesson.deleteMany({ user: usernamefield });
    await computer.deleteMany({ user: usernamefield });
    await User.deleteOne( { username: usernamefield } );
    res.redirect('/admindashboard/manageusers');
  } catch (error) {
    console.log(error);
  }
});

router.get('/admindashboard/manageusers', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Admin Dashboard',
      username: req.session.userName
    }
    const users = await User.find();

    res.render('admin/manageusers', {
      locals,
      users,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});
router.get('/admindashboard/manageposts', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Admin Dashboard',
      username: req.session.userName
    }
		const phonesData = await phone.find();
    const vehiclesData = await vehicle.find();
		const lessonsData = await lesson.find();
		const computersData = await computer.find();
		const data = phonesData.concat(vehiclesData, lessonsData, computersData);

    res.render('admin/manageposts', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});


router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Settings',
      username: req.session.userName
    } 
    console.log(req.session.userName)
    const data = await User.findOne({ username: req.session.userName });
    if (!data) {
      // Handle the case where no user is found
      console.log('No user found with that username');
    } else {
      // Use the found user data
      console.log(data);
    }
    res.render('admin/settings', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

router.put('/settings/:id', authMiddleware, async (req, res) => {
  try {
    await user.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }
    });
    req.session.userName = req.body.username
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    res.redirect('/updatefailed')
  }

});


router.get('/updatefailed',authMiddleware ,async (req, res) => {
  try {
    const locals = {
      title: 'Account Update Failed',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    res.render('admin/updatefailed', {
      locals,
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
router.delete('/delete-vehicleinfo/:id', async (req, res) => {

  try {
    await vehicle.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});

router.delete('/delete-phoneinfo/:id', authMiddleware, async (req, res) => {

  try {
    await phone.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});
router.delete('/delete-computerinfo/:id', authMiddleware, async (req, res) => {

  try {
    await computer.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});
router.delete('/delete-lessoninfo/:id', authMiddleware, async (req, res) => {

  try {
    await lesson.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});

//edit post
router.get('/edit-vehicleinfo/:id', authMiddleware, async (req, res) => {
  try {
    const data = await vehicle.findOne({_id: req.params.id});
    res.render('admin/edit-vehicle' ,{
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }

});

router.put('/edit-vehicleinfo/:id', authMiddleware, async (req, res) => {
  try {
    await vehicle.findByIdAndUpdate(req.params.id, {
      active: true,
      user: req.session.userName,
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
      battery_capacity: req.body.battery_capacity,
      range: req.body.range,
      bed_capacity:req.body.bedCapacity,
      water_tank: req.body.watertank,
      drive_type: req.body.drive_type,
      payload_capacity: req.body.payloadCapacity,
    });
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});

router.get('/edit-phoneinfo/:id', authMiddleware, async (req, res) => {
  try {
    const data = await phone.findOne({_id: req.params.id});
    res.render('admin/edit-vehicle' ,{
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }

});

router.put('/edit-phoneinfo/:id', authMiddleware, async (req, res) => {
  try {
    await phone.findByIdAndUpdate(req.params.id, {
      active: true,
        title: req.body.title,
        product: "phoneinfo",
        user: req.session.userName,
        model: req.body.model,
        battery: req.body.battery,
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
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});

router.get('/edit-computerinfo/:id', authMiddleware, async (req, res) => {
  try {
    const data = await computer.findOne({_id: req.params.id});
    res.render('admin/edit-computer' ,{
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }

});
router.put('/edit-computerinfo/:id', authMiddleware, async (req, res) => {
  try {
    await computer.findByIdAndUpdate(req.params.id, {
      active: true,
        title: req.body.title,
        model: req.body.model,
        user: req.session.userName,
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
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});

router.get('/edit-lessoninfo/:id', authMiddleware, async (req, res) => {
  try {
    const data = await lesson.findOne({_id: req.params.id});
    res.render('admin/edit-lesson' ,{
      data,
      layout: adminLayout
    })
  } catch (error) {
    console.log(error);
  }

});
router.put('/edit-lessoninfo/:id', authMiddleware, async (req, res) => {
  try {
    await lesson.findByIdAndUpdate(req.params.id, {
      active: true,
        title: req.body.title,
        tutor: req.body.tutor,
        type: req.body.lesson,
        user: req.session.userName,
        product: "lessoninfo",
        location: req.body.location,
        duration: req.body.duration,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,

    });
    const page = '/dashboard';
    res.redirect(page)
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
        active: true,
        user: req.session.userName,
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
        battery_capacity: req.body.battery_capacity,
        range: req.body.range,
        bed_capacity:req.body.bedCapacity,
        water_tank: req.body.watertank,
        drive_type: req.body.drive_type,
        payload_capacity: req.body.payloadCapacity,
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
        active: true,
        title: req.body.title,
        product: "phoneinfo",
        user: req.session.userName,
        model: req.body.model,
        battery: req.body.battery,
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
        active: true,
        title: req.body.title,
        model: req.body.model,
        user: req.session.userName,
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
        active: true,
        title: req.body.title,
        tutor: req.body.tutor,
        type: req.body.lesson,
        user: req.session.userName,
        product: "lessoninfo",
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


//activate
router.put('/activate-lessoninfo/:id', authMiddleware, async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await lesson.findById({_id: slug});
    if(data.active){
      await lesson.findByIdAndUpdate(req.params.id, {
        $set: {
          active: false
        }
      });
    }
    else{
      await lesson.findByIdAndUpdate(req.params.id, {
        $set: {
          active: true
        }
      });
    }
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});
router.put('/activate-computerinfo/:id', authMiddleware, async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await computer.findById({_id: slug});
    if(data.active){
      await computer.findByIdAndUpdate(req.params.id, {
        $set: {
          active: false
        }
      });
    }
    else{
      await computer.findByIdAndUpdate(req.params.id, {
        $set: {
          active: true
        }
      });
    }
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});
router.put('/activate-phoneinfo/:id', authMiddleware, async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await phone.findById({_id: slug});
    if(data.active){
      await phone.findByIdAndUpdate(req.params.id, {
        $set: {
          active: false
        }
      });
    }
    else{
      await phone.findByIdAndUpdate(req.params.id, {
        $set: {
          active: true
        }
      });
    }
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});
router.put('/activate-vehicleinfo/:id', authMiddleware, async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await vehicle.findById({_id: slug});
    if(data.active){
      await vehicle.findByIdAndUpdate(req.params.id, {
        $set: {
          active: false
        }
      });
    }
    else{
      await vehicle.findByIdAndUpdate(req.params.id, {
        $set: {
          active: true
        }
      });
    }
    const page = '/dashboard';
    res.redirect(page)
  } catch (error) {
    console.log(error);
  }

});


//favorites
router.put('/favorite/:id', authMiddleware, async (req, res) => {
  try {
    let slug = req.params.id;
    const user = await User.findOne({username: req.session.userName});
    const data = await vehicle.findById({_id: slug});
       if(!user){
          return res.redirect('/login')
       }
      else if (!user.favorite.includes(slug)) {
        user.favorite.push(slug);
        await user.save();
    } else {
        user.favorite.pull(slug);
        await user.save();
        
    }

    const page = '/favorites';
    res.redirect(page)
  } catch (error) {
    console.log(error)
    res.redirect('/login');
  }
});

router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Favorites',
      description: ''
    }
    const user = await User.findOne({username: req.session.userName});
		const phonesData = await phone.find({active: {$ne: false}});
		const vehiclesData = await vehicle.find({active: {$ne: false}});
		const lessonsData = await lesson.find({active: {$ne: false}});
		const computersData = await computer.find({active: {$ne: false}});
		const data = phonesData.concat(vehiclesData, lessonsData, computersData);
    const combinedData = data.filter(object => user.favorite.includes(object.id));
    res.render('admin/favorites', {
      locals,
      combinedData,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});


module.exports = router;