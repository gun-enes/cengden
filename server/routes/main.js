const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle')
const phone = require('../models/phones')
const computer = require('../models/computers')
const lesson = require('../models/lessons')



//Home Route
router.get('', async (req,res) => {
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
/*
function insertVehicle(){
	vehicle.insertMany([
		{
			title: "Simoştan bir öpücüğe bir araba",
			type: "Hatchback",
			brand: "Mitsubishi",
			model: "SpaceStar"
		},
		{
			title: "Enesten araba",
			type: "SUV",
			brand: "Nissan",
			model: "Qashqai"
		}
	])
}
insertVehicle();*/


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
//route for vehicleinfo
router.get('/vehicleinfo/:id', async (req,res) => {
	try{
		const locals = {
			title: "CENGden",
			description: "An online marketplace application"
		};
		let slug = req.params.id;
		const data = await vehicle.findById({_id: slug});
		res.render('vehicles/vehicleinfo', {locals, data});
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
		res.render('phoneinfo', {locals, data});
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
		res.render('computerinfo', {locals, data});
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
		res.render('lessoninfo', {locals, data});
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

		const data = await vehicle.find({
			$or: [
				{title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
				{type: {$regex: new RegExp(searchNoSpecialChars, 'i')}}
			]
		})
		res.render("search",{
			data,
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