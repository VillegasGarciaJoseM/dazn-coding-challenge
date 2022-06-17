var Datastore = require('nedb');
var db = new Datastore('./src/db/userDB.db');
var populateUsers = require('./populate/populate.js')
db.loadDatabase();

db.insert(populateUsers, (err, newDoc) => {
    if (err) {
        console.log(err)
    }
})