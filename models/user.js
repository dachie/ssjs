var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                console.log("新用户注册："+user.name);
                callback(err, user);
            });
        });
    });
};

User.prototype.update = function update(callback) {
    var user = {
        name: this.name,
        password: this.password
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name: user.name
            }, {
                $set: {
                    password: user.password
                }
            }, {
                safe: true
            }, function(err, newPassword) {
                mongodb.close();
                callback(err, newPassword);
            });
        });
    });
};


User.get = function get(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function(err, doc) {
                mongodb.close();
                if (doc) {
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err);
                }
            });
        });
    });
};

User.getAll = function get(callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.find().toArray(function(err, doc) {
                mongodb.close();
                if (doc.length) {
                    callback(err, doc);
                } else {
                    callback(err, []);
                }
            });
        });
    });
};