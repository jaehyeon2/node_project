const Sequelize=require('sequelize');
const env=process.env.NODE_ENV||'development';
const config=require('../config/config')[env];

const User=require('./user');
const Image=require('./image');
const Hashtag=require('./hashtag');

const db={};
const sequelize=new Sequelize(
	config.database, config.username, config.password, config,
);

db.sequelize=sequelize;
db.User=User;
db.Image=Image;
db.Hashtag=Hashtag;

User.init(sequelize);
Image.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Image.associate(db);
Hashtag.associate(db);

module.exports=db;