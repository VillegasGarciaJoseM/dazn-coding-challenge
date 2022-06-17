var Datastore = require('nedb');
var db = new Datastore('./db/userDB.db');



var crudOperations = module.exports;

crudOperations.save = (user) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.insert(user, (err, newDoc) => {
            if (err) {
                //TODO: log an error
                reject({ success: false, err: err });
            }
            resolve({ success: true, user: newDoc })
        })
    })
}

//TODO: Test!
crudOperations.update = (user) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.update({ userId: user.userId }, user, {}, (err, numReplaced) => {
            if (err) {
                //TODO: log an error
                reject({ success: false, err: err });
            }
            if (numReplaced > 1) {
                resolve({ success: false, errorMessage: "More than one User has been updated" })
            }
            resolve({ success: true });
        })
    })
}

crudOperations.findById = (id) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.findOne({ userId: id }, (err, doc) => {
            if (err) {
                reject({ success: false, err: err })
            }
            if (!doc) {
                reject({ success: false });
            }
            resolve({ success: true, user: doc });
        })
    })
}

crudOperations.addDeviceToUser = (user, device) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.update({ userId: user.userId }, { $addToSet: { devices: device } }, (err, numReplaced) => {
            if (err) {
                // TODO: log err
                console.log(err);
                reject({ success: false, err: err });
            }
            if (numReplaced > 1) {
                reject({ success: false, err: "More than one User has been updated" })
            }

            resolve({ success: true, message: `Device added to user ${user.userId}` });
        })
    })
}

crudOperations.deleteDeviceFromUser = (user, device) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.update({ userId: user.userId }, { $pull: { devices: device } }, {}, (err, numReplaced) => {
            if (err) {
                //TODO: log an error
                console.log(err)
                reject({ success: false, message: err })
            }
            if (numReplaced > 1) {
                resolve({ success: false, message: "More than one Device has been deleted" })
            }

            resolve({ success: true, message: "Device removed successfully"})
        })
    })
}

crudOperations.changePlayability = (user, device, activate) => {
    db.loadDatabase();

    return new Promise((resolve, reject) => {
        db.update({ userId: user.userId }, { $pull: { devices: device } }, {}, (err, numReplaced) => {
            if(err){
                reject({success: false, message: err})
                console.log(err);
            }
            device.playable = activate
            db.update({ userId: user.userId }, { $addToSet: { devices: device} }, {}, (err, numReplaced) => {
                if (err) {
                    //TODO: log an error
                    reject({ success: false, message: err })
                }
                if (numReplaced > 1) {
                    reject({ success: false, message: "More than one register has been deleted" })
                }
                resolve({ success: true, message: "Device changed successfully" })
            })
        });
    })
}
