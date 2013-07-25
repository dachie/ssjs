var Post = require('../models/post.js');
var User = require('../models/user.js');

exports.notfound=function(req,res){
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('未登录，正在跳转至登陆页...');
    res.redirect("/login");
};

exports.index = function(req, res) {
  if (!req.session.user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('未登录，正在跳转至登陆页...');
    res.redirect("/login");
  } else {
    var query = {
      user: req.session.user.name,
      state: 1
    };
    Post.get(query, function(err, posts) {
      res.render('index', {
        title: "",
        posts: posts,
        username: req.session.user.name
      });
    });
  }
};

exports.recycle = function(req, res) {
  if (!req.session.user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('未登录，正在跳转至登陆页...');
    res.redirect("/login");
  } else {
    var query = {
      user: req.session.user.name,
      state: 0
    };
    Post.get(query, function(err, posts) {
      res.render('recycle', {
        title: "-废纸篓",
        posts: posts,
        username: req.session.user.name
      });
    });
  }
};

exports.dachie = function(req, res) {
  if (!req.session.user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('未登录，正在跳转至登陆页...');
    res.redirect("/login");
  }
  if (req.session.user.name != "dachie") {
    res.redirect("/");
  }
  User.getAll(function(err, u) {
    res.render('dachie', {
      title: "-管理后台",
      users: u,
      username: req.session.user.name,
      total: u.length
    });
  });
};

exports.user = function(req, res) {
  if (!req.session.user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('登录超时，请重新登录...');
    res.redirect("/login");
  } else {
    User.get(req.session.user.name, function(err, u) {
      res.render('user', {
        title: "-个人资料",
        user: u,
        error: req.flash("error").toString()
      });
    });
  }
};

exports.doUser = function(req, res) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    var user = new User({
      name: req.session.user.name,
      password: req.body["password"]
    });
    user.update(function(err, u) {
      if (err) {
        res.redirect("/login");
      }
      req.session.user = user;
      res.redirect("/");
    });
  }
};

exports.reg = function(req, res) {
  res.render('reg', {
    title: "-注册",
    error: req.flash("error").toString()
  });
};
exports.doReg = function(req, res) {

  var newUser = new User({
    name: req.body.name,
    password: req.body.password
  });
  User.get(newUser.name, function(err, user) {
    if (user) {
      err = '用户名已存在';
    }
    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }

    newUser.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功');
      res.redirect('/');
    });
  });
};
exports.create = function(req, res) {
  var post = new Post(req.session.user.name, req.body["post"], new Date(), 1);
  post.save(function(err, post) {
    if (err) {
      req.flash("error", err);
      res.redirect("/error");
    }
    res.redirect("/");
  });

};

exports.error = function(req, res) {
  res.render('error', {
    title: "error",
    error: req.flash("error").toString()
  });
};
exports.login = function(req, res) {
  res.render('login', {
    title: "-登录",
    error: req.flash("error").toString()
  });
};
exports.doLogin = function(req, res) {
  if (req.body.name != "" && req.body.password != "") {
    User.get(req.body.name, function(err, u) {
      if (err) {
        req.flash("error", err);
        res.redirect("/login");
      }
      if (u) {
        if (u.password != req.body.password) {
          err = "密码错误";
          req.flash("error", err);
          res.redirect("/login");
        } else {
          console.log(u.name + "于" + new Date() + "登录了系统！");
          req.session.user = u;
          res.redirect("/");
        }
      } else {
        err = "账号错误";
        req.flash("error", err);
        res.redirect("/login");
      }

    });
  } else {
    res.redirect("/login");
  }
};
exports.logout = function(req, res) {
  req.session.user && console.log(req.session.user.name + "于" + new Date() + "退出了系统！");
  req.session.user = null;
  res.redirect("/login");
};

exports.cache =function(req,res){
  res.render("cache",{
    layout:false
  });
};