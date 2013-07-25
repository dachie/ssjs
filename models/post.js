var mongodb = require('./db');

function Post (username, post, time,state) {
    this.user = username;
    this.post = post;

    if (time) {
        this.time = time;
    } else{
        this.time = new Date();
    }

    this.state=state;
}

module.exports = Post;

Post.prototype.save = function save(callback) {
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
        state:this.state
    };
    mongodb.open(function (err, db) {

        if(err){
            return callback(err);
        }
        db.collection('posts', function (err, collection) {

            if (err){
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            collection.insert(post, {safe: true}, function (err, post) {
                post = post[0];
                mongodb.close();
                console.log(post.user+"发布了一条新记事："+post.post+"，于"+post.time);
                callback(err, post);
            });
        });
    });
};

Post.get = function get (query, callback) {
    mongodb.open(function (err, db) {
                        
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {

            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                var posts = [];
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.post, doc.time,doc.state);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};