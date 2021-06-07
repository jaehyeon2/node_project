const express=require('express');

const Room=require('../schemas/room');
const Chat=require('../schemas/chat');

const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router=express.Router();

router.use((req, res, next)=>{
	res.locals.user=req.user;
	next();
});

router.get('/', async (req, res, next)=>{
	try{
		const rooms=await Room.find({});
		res.render('main',{rooms, title:'mychat'});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/join', isNotLoggedIn, (req, res)=>{
	res.render('join',{title:'회원가입-myChat'});
});

router.get('/room', isLoggedIn, async(req, res, next)=>{
	res.render('room', {title:'채팅방 생성 - myChat'});
});

router.post('/room', isLoggedIn, async(req, res, next)=>{
	try{
		const newRoom=await Room.create({
			title:req.body.title,
			max:req.body.max,
			owner:req.user.nick,
			password:req.body.password,
		});
		const io=req.app.get('io');
		io.of('/room').emit('newRoom', newRoom);
		res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/room/:id', isLoggedIn, async(req, res, next)=>{
	try{
		console.log('user', req.user.nick);
		const room=await Room.findOne({_id:req.params.id});
		const io=req.app.get('io');
		if(!room){
			return res.redirect('/?error=존재하지 않는 채팅방입니다.');
		}
		if(room.password&&room.password!==req.query.password){
			return res.redirect('/?error=비밀번호가 틀렸습니다.');
		}
		const {rooms}=io.of('/chat').adapter;
		if(rooms&&rooms[req.params.id]&&room.max<=rooms[req.params.id].length){
			return res.redirect('/?error=허용 인원이 초과했습니다.');
		}
		const chats=await Chat.findOne({room:room._id}).sort('createdAt');
		
		return res.render('chat',{
			room,
			title:room.title,
			chats,
			user:req.user.nick,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
});

router.delete('/room/:id', async(req, res, next)=>{
	try{
		await Room.remove({_id:req.params.id});
		await Chat.remove({room:req.params.id});
		res.send('ok');
		setTimeout(()=>{
			req.app.get('io').of('/room').emit('removeRoom', req.params.id);
		}, 2000);
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/room/:id/chat', isLoggedIn, async(req, res, next)=>{
	try{
		const chat=await Chat.create({
			room:req.params.id,
			user:req.user.nick,
			chat:req.body.chat,
		});
		req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		res.send('ok');
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports=router;