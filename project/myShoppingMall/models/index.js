const Sequelize=require('sequelize');
const User=require('./user');
const Product=require('./product');
const Comment=require('./comment');
const Basket=require('./basket');
const Hashtag=require('./hashtag');
const Buy=require('./buy');


const env=process.env.NODE_ENV||"development";
const config=require('../config/config')[env];

const db={};
const sequelize=new Sequelize(
	config.database, config.username, config.password, config,
);

db.sequelize=sequelize;
db.User=User;
db.Product=Product;
db.Comment=Comment;
db.Basket=Basket;
db.Hashtag=Hashtag;
db.Buy=Buy;

User.init(sequelize);
Product.init(sequelize);
Comment.init(sequelize);
Basket.init(sequelize);
Hashtag.init(sequelize);
Buy.init(sequelize);

User.associate(db);
Product.associate(db);
Comment.associate(db);
Basket.associate(db);
Hashtag.associate(db);
Buy.associate(db);

module.exports=db;