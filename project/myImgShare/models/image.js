const Sequelize=require('sequelize');

module.exports=class Image extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			title:{
				type:Sequelize.STRING(40),
				allowNull:false,
			},
			img:{
				type:Sequelize.STRING(300),
				allowNull:false,
			},
			content:{
				type:Sequelize.STRING(500),
				allowNull:true,
			},
			owner:{
				type:Sequelize.STRING(40),
				allowNull:false,
			},
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:'Image',
			tableName:'images',
			charset:'utf8mb4',
			collate:'utf8mb4_general_ci',
		})
	}
	static associate(db){
		db.Image.belongsTo(db.User);
		db.Image.belongsToMany(db.Hashtag, {through:'ImgHashtag'});
	}
};