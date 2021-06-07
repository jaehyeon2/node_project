const express=require('express');
const List=require('../schemas/list');

const router=express.Router();

router.route('/')
.get(async (req, res, next)=>{
	try{
		const lists=await List.find({});
		res.json(lists);
	}catch(err){
		console.error(err);
		next(err);
	}
})
.post(async (req, res, next)=>{
	try{
		const list=await List.create({
			content:req.body.content,
			date:req.body.date,
			done:req.body.done,
		});
		console.log(list);
		res.status(201).json(list);
	}catch(err){
		console.error(err);
		next(err);
	}
});
router.route('/:id')
.patch(async (req, res, next)=>{
	try{
		const result=await List.update({
			_id:req.params.id,
		},{
			content:req.body.list,
		});
		res.json(result);
	}catch(err){
		console.error(err);
		next(err);
	}
})
.delete(async (req, res, next)=>{
	try{
		const result=await List.remove({_id:req.params.id});
		res.json(result);
	}catch(err){
		console.error(err);
		next(err);
	}
});

module.exports=router;