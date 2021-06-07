const Sequelize=require('sequelize');
const env=process.env.NODE||"development";
const config=require('../config/config')[env];
const User=require('./user');
const Product=require('./product');
const Comment=require('./comment');
const Basket=require('./basket');

const db={};
const sequelize=new Sequelize(
	config.database, config.username, config.password, config,
);

db.sequelize=sequelize;
db.User=User;
db.Product=Product;
db.Comment=Comment;
db.Basket=Basket;

User.init(sequelize);
Product.init(sequelize);
Comment.init(sequelize);
Basket.init(sequelize);

User.associate(db);
Product.associate(db);
Comment.associate(db);
Basket.associate(db);

module.exports=db;