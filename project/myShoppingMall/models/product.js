const Sequelize=require('sequelize');
//상품 모델
module.extends=class Product extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			name:{
				type:Sequelize.STRING(50),
				allowNull:false,
			},
			img:{
				type:Sequelize.STRING(300),
				allowNull:false,
			},
			content:{
				type:Sequelize.STRING(500),
				allowNull:false,
			},
			price:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},
			remaincount:{
				type:Sequelize.INTEGER,
				allowNull:false,
			},
			hashtag:{
				type:Sequelize.STRING(500),
				allowNull:true,
			}
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:'Product',
			tableName:'products',
			charset:'utf8mb4',
			collate:'utf8mb4_general_ci',
		})
	}
	static associate(db){
		db.Product.hasMany(db.Comment);
		db.Product.belongsToMany(db.Basket, {through:"ProductBasket"});
		db.Product.belongsToMany(db.Buy, {through:"BuyProduct"});
		db.Product.belongsToMany(db.Hashtag, {through:'ProductHashtag'});
	}
}