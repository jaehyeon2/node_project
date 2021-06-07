const Sequelize=require('sequelize');

module.exports=class Post extends Sequelize.Model {
	static init(sequelize){
		return super.init({
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			title:{
				type:Sequelize.STRING(40),
				allowNull:false,
				unique:true,
			},
			owner:{
				type:Sequelize.STRING(40),
				allowNull:false,
			},
			content:{
				type:Sequelize.STRING(500),
				allowNull:false,
			},
			time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
			views:{
				type:Sequelize.INTEGER.UNSIGNED,
				allowNull:true,
				defaultValue: 0,
			},
		},{
			sequelize,
			timestamps:true,
			paranoid:true,
			modelName:'Post',
			tableName:'posts',
			charset:'utf8',
			collate:'utf8_general_ci',
		});
	}
	
	static associate(db){
		db.Post.belongsTo(db.User);
	}
};