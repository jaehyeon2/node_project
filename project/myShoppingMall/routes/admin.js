const express=require('express');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const {Basket, Buy, Comment, Hashtag, Product, User}=require('../models');
const {isLoggedIn, isNotLoggedIn, isAdmin}=require('./middlewares');

const router=express.Router();

router.get('/', isLoggedIn, isAdmin, (req, res)=>{
	res.render('admin', {title:'myShoppingMall-Admin'});
});

router.get('/product', isLoggedIn, isAdmin, (req, res)=>{
	res.render('adminproduct', {title:'상품등록 - myShoppingMall-Admin'})
})

try{
	fs.readdirSync('uploads');
}catch(error){
	console.error('uploads 폴더가 존재하지 않습니다. 폴더를 새로 생성합니다.');
	fs.mkdirSync('uploads');
}

const upload=multer({
	storage:multer.diskStorage({
		destination(req, file, cb){
			cb(null, 'uploads/');
		},
		filename(req, file, cb){
			const ext=path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext)+new Date().valueof()+ext);
		},
	}),
	limits:{fileSize:5*1024*1024},
});

router.post('/product', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		await Product.create({
			name:req.body.name,
			img:req.file.filename,
			price:req.body.price,
			content:req.body.content,
			hashtag:req.body.hashtag,
		});
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/delete/:id', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		const result=await Product.destroy({where:{id:req.params.id}});
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/update/:id', isLoggedIn, isAdmin, async(req, res, next)=>{
	try{
		const nowcount=await Product.findOne({
			attributes:['remaincount'],
		},{
			where:{id:req.params.id},
		});
		await Product.update({
			remaincount:nowcount+req.body.count,
		},{
			where:{id:req.params.id},
		});
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

