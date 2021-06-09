const Sequelize=require('sequelize');
//구매 목록
module.exports=class Buy extends Sequelize.Model{
	static init(sequelize){
		return super.init({
			buyproduct:{
				type:Sequelize.STRING(50),
				allowNull:false,
			},
			buycount:{
				type:Sequelize.INTEGER,
				allowNull:false,
			}
		},{
			sequelize,
			timestamps:true,
			underscored:false,
			modelName:'Buy',
			tableName:'buys',
			charset:'utf8mb4',
			collate:'utf8mb4_general_ci',
		})
	}
	static associate(db){
		db.Buy.belongsTo(db.User);
		db.Buy.belongsToMany(db.Product, {through:"BuyProduct"});
	}
}