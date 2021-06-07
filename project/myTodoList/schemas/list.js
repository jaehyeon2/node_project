const mongoose=require('mongoose');

const { Schema }=mongoose;

const listSchema=new Schema({
	content:{
		type:String,
		required:true,
		unique:true,
	},
	date:{
		type:String,
		required:true,
		default:Date.now,
	},
	done:{
		type:Boolean,
		required:true,
	},
});

module.exports=mongoose.model('List', listSchema);