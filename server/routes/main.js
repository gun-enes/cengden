const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle')

//Home Route
router.get('', async (req,res) => {
	const locals = {
		title: "CENGden",
		description: "An online marketplace application"
	};
	try{
		const data = await vehicle.find();
		res.render('index', {locals, data});
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
















router.get('/about', (req,res) => {
	res.render('about');
});


 
module.exports = router;