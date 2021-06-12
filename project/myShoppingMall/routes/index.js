const express=require('express');
const Sequelize=require('sequelize');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const {Basket, Buy, Comment, Hashtag, Product, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async (req, res, next)=>{
	try{
		const products=await Product.findAll({});
		res.render('main', {title:'MyShoppingMall', products});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/join', isNotLoggedIn, (req, res)=>{
	res.render('join', {title:'회원가입 - myShoppingMall'});
});

router.get('/product/:id', isLoggedIn, async(req, res, next)=>{
	try{
		const product=await Product.findOne({where:{id:req.params.id}});
		res.render('product', {title:`${product.name} - myShoppingMall`, product});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/basket', isLoggedIn, async(req, res, next)=>{
	try{
		await Basket.create({
			basketproduct:req.body.name,
			ordercount:req.body.count,
			UserId:req.user.id,
		});
		const nowcount=await Product.findOne({
			attributes:['remaincount'],
		},{
			where:{id:req.params.id},
		});
		await Product.update({
			remaincount:nowcount,
		},{
			where:{id:req.params.id},
		});
		res.render('basket', {title:`${user.nick} - myShoppingmall`});
	}catch(error){
		console.error(error);
		next(error);
	}
});

/*router.post('/buy', isLoggedIn, async(req, res, next)=>{
	
});*/


module.exports = router;