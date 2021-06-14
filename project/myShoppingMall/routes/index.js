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

router.get('/basket', isLoggedIn, async(req, res, next)=>{
	try{
		const products=await Basket.findAll({}, {where:{Userid:req.user.id}});
		res.render('basket', {title:`${req.user.nick} - myShoppingmall`, products});
	}
	catch(error){
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

router.get('/hashtag', async(req, res, next)=>{
	const query=req.query.hashtag;
	if(!query){
		return res.redirect('/');
	}
	try{
		const hashtag=await Hashtag.findOne({where:{title:query}});
		let products=[];
		if(hashtag){
			products=await hashtag.getProducts({});
			console.log('products', products);
		}
		if(!products){
			console.log('nothing');
			const message='검색 결과가 없습니다.'
			res.render('nothing', message);
		}
		return res.render('main',{
			title:`${query}-myShoppingmall`,
			products:products,
		});
	} catch (error){
		console.error(error);
		next(error);
	}
});

/*router.post('/buy', isLoggedIn, async(req, res, next)=>{
	
});*/


module.exports = router;