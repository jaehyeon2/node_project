const express=require('express');
const Sequelize=require('sequelize');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const {Hashtag, Image, User}=require('../models');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async(req, res, next)=>{
	try{
		const images=await Image.findAll({});
		if(!images){
			const message='등록된 사진이 없습니다.';
			return res.render('nothing', message);
		}
		res.render('main', {
			title:'myImageShare',
			images,
		});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/join', isNotLoggedIn, (req, res)=>{
	res.render('join', {title:'회원가입-myImageShare'});
});

router.get('/image', isLoggedIn, (req, res)=>{
	res.render('image', {title:'사진 등록-myImageShare'});
});

try{
	fs.readdirSync('uploads');
}catch(error){
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}
const upload=multer({
	storage:multer.diskStorage({
		destination(req, file, cb){
			cb(null, 'uploads/');
		},
		filename(req, file, cb){
			const ext=path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext)+new Date().valueOf()+ext);
		},
	}),
	limits:{fileSize:5*1024*1024},
});
router.post('/image', isLoggedIn, upload.single('img'), async(req, res, next)=>{
	try{
		const {title, content}=req.body;
		const image=await Image.create({
			title,
			content,
			img:req.file.filename,
			UserId:req.user.id,
			owner:req.user.nick,
		});
		const hashtags=req.body.content.match(/#[^\s#]*/g);
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
	} catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/image/:id', isLoggedIn, async(req, res, next)=>{
	try{
		const image=await Image.findOne({where:{id:req.params.id}});
		res.render('imageshare', {title:`${image.title}-myImageShare`, image});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/delete/:id', isLoggedIn, async(req, res, next)=>{
	try{
		const image=await Image.findOne({where:{id:req.params.id}});
		console.log(image.owner, req.user.nick);
		if(image.owner===req.user.nick){
			const result=await Image.destroy({where:{id:req.params.id}});
			return res.redirect('/');
		}
		else{
			res.redirect('/');
		}
		
	}catch(err){
		console.error(err);
		next(err);
	}
})

router.get('/hashtag', async(req, res, next)=>{
	const query=req.query.hashtag;
	if(!query){
		return res.redirect('/');
	}
	try{
		const hashtag=await Hashtag.findOne({where:{title:query}});
		let images=[];
		if(hashtag){
			images=await hashtag.getImages({});
			console.log('images', images);
		}
		if(!images){
			console.log('nothing');
			const message='검색 결과가 없습니다.'
			res.render('nothing', message);
		}
		return res.render('main',{
			title:`${query}-myImageShare`,
			images:images,
		});
	} catch (error){
		console.error(error);
		next(error);
	}
})

module.exports=router;