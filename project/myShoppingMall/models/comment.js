const sequelzie=require('sequelize');
//댓글 모델
module.extends=class buy extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			rating:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},
			content:{
				type:Sequelize.STRING(500),
				allowNull:false,
			}
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:'Comment',
			tableName:'comments',
			charset:'utf8',
			collate:'utf8_general_ci',
		})
	}
	static associate(db){
		db.Comment.belongsTo(db.User);
		db.Comment.belongsTo(db.Product);
	}
}