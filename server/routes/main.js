const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle')
const phone = require('../models/phones')
const computer = require('../models/computers')
const lesson = require('../models/lessons')



//Home Route
router.get('/', async (req,res) => {
	const locals = {
		title: "CENGden",
		description: "An online marketplace application"
	};
	try{
		const phonesData = await phone.find();
		const vehiclesData = await vehicle.find();
		const lessonsData = await lesson.find();
		const computersData = await computer.find();
		const combinedData = phonesData.concat(vehiclesData, lessonsData, computersData);
		res.render('index', {locals, combinedData});
	}catch(err){
		console.log(err);
	}
});


router.get('/vehicles', async (req,res) => {
	const locals = {
		title: "Vehicles",
		description: "An online marketplace application"
	};
	try{
		const data = await vehicle.find();
		res.render('vehicles/vehicles', {locals, data});
	}catch(err){
		console.log(err);
	}
});

router.get('/computers', async (req,res) => {
	const locals = {
		title: "Computers",
		description: "An online marketplace application"
	};
	try{
		const data = await computer.find();
		res.render('computers/computers', {locals, data});
	}catch(err){
		console.log(err);
	}
});

router.get('/phones', async (req,res) => {
	const locals = {
		title: "Phones",
		description: "An online marketplace application"
	};
	try{
		const data = await phone.find();
		res.render('phones/phones', {locals, data});
	}catch(err){
		console.log(err);
	}
});

router.get('/lessons', async (req,res) => {
	const locals = {
		title: "Private Lessons",
		description: "An online marketplace application"
	};
	try{
		const data = await lesson.find();
		res.render('lessons/lessons', {locals, data});
	}catch(err){
		console.log(err);
	}
});

router.post('/vehicleinfo/:id', async (req, res) => {
	try {
        const vehicleId = req.params.id;
        const { isFavorite } = req.body; // Expecting a boolean value
        const updatedVehicle = await vehicle.findByIdAndUpdate(vehicleId, { $set: { favorite: isFavorite } }, { new: true });

        res.json({ status: 'success', message: 'Favorite status updated', data: updatedVehicle });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to update favorite status' });
    }
});
//route for vehicleinfo
router.get('/vehicleinfo/:id', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let slug = req.params.id;
		const data = await vehicle.findById({_id: slug});
		const fav = data.favorite ? "Like" : "Liked"
		res.render('vehicles/vehicleinfo', {locals, data, fav});
	}catch(err){
		console.log(err);
	}
});


//route for phoneinfo
router.get('/phoneinfo/:id', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let slug = req.params.id;
		const data = await phone.findById({_id: slug});
		res.render('phones/phoneinfo', {locals, data});
	}catch(err){
		console.log(err);
	}
});

//route for computerinfo
router.get('/computerinfo/:id', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let slug = req.params.id;
		const data = await computer.findById({_id: slug});
		res.render('computers/computerinfo', {locals, data});
	}catch(err){
		console.log(err);
	}
});

//route for lessoninfo
router.get('/lessoninfo/:id', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let slug = req.params.id;
		const data = await lesson.findById({_id: slug});
		res.render('lessons/lessoninfo', {locals, data});
	}catch(err){
		console.log(err);
	}
});

//search/filter
router.post('/search', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let searchTerm = req.body.searchTerm;
		const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"");

		const vehicledata = await vehicle.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		const phonedata = await phone.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		const lessondata = await lesson.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		const data = await computer.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		const combinedData = data.concat(vehicledata, lessondata, phonedata);
		res.render("search",{
			combinedData,
			locals
		});
	}catch(err){
		console.log(err);
	}
});
router.get('/about', (req,res) => {
	res.render('about');
});
module.exports = router;