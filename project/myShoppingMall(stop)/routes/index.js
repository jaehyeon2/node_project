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

/*router.post('/buy', isLoggedIn, async(req, res, next)=>{
	
});*/

//admin router
router.get('/', isLoggedIn, (req, res)=>{
	res.render('/adminpage/admin', {title:'myShoppingMall-Admin'});
});

router.get('/product', isLoggedIn, (req, res)=>{
	res.render('/adminpage/admin_product', {title:'상품등록 - myShoppingMall-Admin'})
});

router.get('/control', isLoggedIn, (req, res)=>{
	res.render('/adminpage/admin_product_control', {title:'상품 관리 - myShoppingMall-Admin'});
});

router.get('/update/:id', isLoggedIn, async(req, res, next)=>{
	try{
		const product=await Product.findOne({where:{id:req.params.id}});
		res.render('/adminpage/admin_product_control', {title:`${product.name} - myShoppingMall`, product});
	}catch(error){
		console.error(error);
		next(error);
	}
});

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

router.post('/product', isLoggedIn, upload.single('img'), async(req, res, next)=>{
	try{
		await Product.create({
			name:req.body.name,
			img:req.file.filename,
			price:req.body.price,
			content:req.body.content,
			hashtag:req.body.hashtag,
		});
		const hashtags=req.body.hashtag.match(/#[^\s#]*/g);
		if(hashtags){
			const result=await Promise.all(
				hashtags.map(tag=>{
					return Hashtag.findOrCreate({
						where:{title:tag.slice(1).toLowerCase()},
					})
				}),
			);
			await image.addHashtags(result.map(r=>r[0]));
		}
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/delete/:id', isLoggedIn, async(req, res, next)=>{
	try{
		const result=await Product.destroy({where:{id:req.params.id}});
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/update/:id', isLoggedIn, async(req, res, next)=>{
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


module.exports = router;