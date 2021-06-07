const sequelize=require('sequelize');
//장바구니 모델
module.exports=class Basket extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			basketproduct:{
				type:Sequelize.STRING(50),
				allowNull:false,
			},
			ordercount:{
				type:Sequelize.INTEGER,
				allowNull:false,
			}
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:'Basket',
			tableName:'baskets',
			charset:'utf8mb4',
			collate:'utf8mb4_general_ci',
		})
	}
	static associate(db){
		db.Basket.belongsTo(db.User);
		db.Basket.belongsToMany(db.Product, {through:"ProductBasket"});
	}
}