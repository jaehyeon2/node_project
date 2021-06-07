const express=require('express');

const {Basket, Buy, Comment, Hashtag, Product, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router((req, res, next)=>{
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
		res.render('production', {title:`${product.name} - myShoppingMall`, product});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/basket', isLoggedIn, async(req, res, next)=>{
	try{
		await Basket.create({
			name:req.body.name,
			count:req.body.count,
			UserId:req.user.id,
		});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/buy', isLoggedIn, async(req, res, next)=>{
	
});