const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if(err)
        console.log(err);
    else {
        // console.log("Connected successfully to DB server");
        db = client.db('test');
    }
});

module.exports= {
    insert: function (users) {
        db.collection('collection').insertMany(users, function(err, results){
            console.log(results);
        });
    }
};




