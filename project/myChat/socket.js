const SocketIO=require('socket.io');
const axios=require('axios');
const cookieParser=require('cookie-parser');
const cookie=require('cookie-signature');

module.exports=(server, app, sessionMiddleware)=>{
	const io=SocketIO(server, {path:'/socket.io'});
	app.set('io', io);
	const room=io.of('/room');
	const chat=io.of('/chat');
	
	io.use((socket, next)=>{
		cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	
	room.on('connection', (socket)=>{
		console.log('room 네임스페이스 접속');
		socket.on('disconnect', ()=>{
			console.log('room 네임스페이스 접속 해제');
		});
	});
	
	chat.on('connection', (socket)=>{
		console.log('chat 네임스페이스 접속');
		const req=socket.request;
		const{headers:{referer}}=req;
		const roomId=referer
		.split('/')[referer.split('/').length-1]
		.replace(/\?.+/, '');
		socket.join(roomId);
		console.log('session', req.session);
		socket.to(roomId).emit('join',{
			user:'system',
			chat:'새 유저가 입장하셨습니다.',
		});
		
		socket.on('disconnect', ()=>{
			console.log('chat 네임스페이스 접속 해제');
			socket.leave(roomId);
			const currentRoom=socket.adapter.rooms[roomId];
			const userCount=currentRoom?currentRoom.length:0;
			if(userCount===0){
				const signedCookie = cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET);
				const connectSID = `${signedCookie}`;
				axios.delete(`https://node-mychat.run.goorm.io/room/${roomId}`,{
					headers:{
						Cookie:`connect.sid=s%3A${connectSID}`, //express-session middleware에 의해 쿠키가 암호화
					}
				})
				.then(()=>{
					console.log('방 제거 요청 성공');
				})
				.catch((error)=>{
					console.error(error);
				});
			}else{
				socket.to(roomId).emit('exit',{
					user:'system',
					chat:'유저님이 퇴장하셨습니다.',
				});
			}
		});
	});
};