const express=require('express');

const {Post, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async(req, res, next)=>{
	try{
		const posts=await Post.findAll({order:[['id', 'DESC']]});
		res.render('main',{
			title:'NodeBoard',
			posts,
		});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/join', isNotLoggedIn, (req, res)=>{
	res.render('join',{
		title:'회원가입-NodeBoard',
	});
});

router.get('/write_post', isLoggedIn, (req, res)=>{
	res.render('write_post',{
		title:'글쓰기-NodeBoard',
	});
});

router.post('/post', isLoggedIn, async(req, res, next)=>{
	const today = new Date();   
	const time=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
	try{
		const {title, content}=req.body;
		console.log('title', title);
		console.log('content', content);
		const post=await Post.create({
			owner:req.user.nick,
			title,
			content,
			time:time,
			view:0,
		});
		res.redirect('/');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/post/:id', isLoggedIn, async (req, res, next)=>{
	try{
		const post_tmp=await Post.findOne({
			where:{id:req.params.id},
		});
		
		const views=await Post.findOne({
			attributes:['views'],
			where:{id:req.params.id},
		})
		await Post.update({
			views:post_tmp.views+1,
		},{
			where:{id:req.params.id},
		});
		
		const post=await Post.findOne({
			where:{id:req.params.id},
		});
		
		res.render('post', {
			title:`${post.title}-NodeBoard`,
			post,
		});
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports = router;