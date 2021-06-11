exports.isLoggedIn=(req, res, next)=>{
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/?loginError=로그인이 필요합니다.');
	}
};

exports.isNotLoggedIn=(req, res, next)=>{
	if(!req.isAuthenticated()){
		next();
	}else{
		res.redirect('/');
	}
};

/*exports.isAdmin=(req, res, next)=>{
	if(req.user.auth==="admin"){
		next()
	}else{
		res.redirect('/?authError=권한이 없습니다!');
	}
};*/

 
exports.isAdmin = (req, res, next)=>{
    if (!req.isAuthenticated()){
        res.redirect('/accounts/login');
    }else{
        if(req.user.username!=='admin'){
            res.redirect('/?authError=권한이 없습니다.');
        }else{
            return next();
        }
    }
};