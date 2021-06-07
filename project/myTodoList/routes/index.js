const express=require('express');
const List=require('../schemas/list');

const router=express.Router();


// GET /로 접속했을 때의 라우터
router.get('/', async (req, res, next)=>{
	try{
		const lists=await List.find({});
		res.render('list', {lists});
	}catch(err){
		console.error(err);
		next(err);
	}
});

module.exports=router;