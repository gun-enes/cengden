const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle')
const phone = require('../models/phones')
const computer = require('../models/computers')
const lesson = require('../models/lessons')
const User = require('../models/user');



//Home Route
router.get('/', async (req,res) => {
	const locals = {
		title: "CENGden",
		description: "An online marketplace application"
	};
	try{
		const phonesData = await phone.find({active: {$ne: false}});
		const vehiclesData = await vehicle.find({active: {$ne: false}});
		const lessonsData = await lesson.find({active: {$ne: false}});
		const computersData = await computer.find({active: {$ne: false}});
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
		const data = await vehicle.find({active: {$ne: false}});
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
		const data = await computer.find({active: {$ne: false}});
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
		const data = await phone.find({active: {$ne: false}});
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
		const data = await lesson.find({active: {$ne: false}});
		res.render('lessons/lessons', {locals, data});
	}catch(err){
		console.log(err);
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
		const user = await User.findOne({username: req.session.userName});
		if (user && user.favorite.includes(slug)) {
			const fav = "Liked"
			res.render('vehicles/vehicleinfo', {locals, data, fav});
		} else {
			const fav = "Not in favorite list"
			res.render('vehicles/vehicleinfo', {locals, data, fav});
		}
		

		
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
		const user = await User.findOne({username: req.session.userName});
		if (user && user.favorite.includes(slug)) {
			const fav = "Liked"
			res.render('phones/phoneinfo', {locals, data, fav});
		} else {
			const fav = "Not in favorite list"
			res.render('phones/phoneinfo', {locals, data, fav});
		}
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
		const user = await User.findOne({username: req.session.userName});
		if (user && user.favorite.includes(slug)) {
			const fav = "Liked"
			res.render('computers/computerinfo', {locals, data, fav});
		} else {
			const fav = "Not in favorite list"
			res.render('computers/computerinfo', {locals, data, fav});
		}
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
		const user = await User.findOne({username: req.session.userName});
		if (user && user.favorite.includes(slug)) {
			const fav = "Liked"
			res.render('lessons/lessoninfo', {locals, data, fav});
		} else {
			const fav = "Not in favorite list"
			res.render('lessons/lessoninfo', {locals, data, fav});
		}
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
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{brand: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{model: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{color: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{year: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{fuel_type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{transmission_type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{description: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
			]
		})
		const phonedata = await phone.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{brand: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{model: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{cpu: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{ram: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{os: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{camera: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{description: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
			]
		})
		const lessondata = await lesson.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{tutor: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{location: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{description: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		const data = await computer.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{brand: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{model: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{cpu: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{ram: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{os: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{description: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
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