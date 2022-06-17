var userDB = require("./userDB.js");
var entitlementsAPI = require("../externalAPI/entitlementsAPI.js")
var reportAPI = require("../externalAPI/reportAPI.js")
var userService = module.exports;

userService.findAllDevicesFromUser = (userId) => {
    return userDB.findById(userId)
        .then(({ success, user }) => {
            if (!success) {
                return { code: 404, message: "User not found" }
            }
            return { code: 200, devices: user.devices, message: "User found" }
        })
        .catch((err) => { return { code: 500, message: "Error retreiving the information about the user" } });
}

userService.addDevice = async (user, newDevice) => {
    if (!user || !newDevice) {
        return { code: 400, message: "Bad request. User or device not present" }
    }
    if (!newDevice.deviceId) {
        return { code: 400, message: "Bad request. Device id not present" }
    }
    if (!user.userId) {
        return { code: 400, message: "Bad request. User id not present" }
    }

    // TODO: check if user exists in database

    // If a user has no more playable devices left, then the new device is set to non playable.
    newDevice.playable = await checkLimitPlayableDevicesReached(user) ? false : true;

    var res = await userDB.addDeviceToUser(user, newDevice)
        .then((message) => { return { code: 200, message: message } })
        .catch((err) => { return { code: 500, message: err } })
    return res
}

// Retrieve how many maximum playable devices can a user have
var getMaxPlayableDevicesByUser = (user) => {
    return entitlementsAPI.allEntitlements()
        .then(entitlements => {
            return entitlements.find(element => element.userId === user.userId).entitlements.devices.max_devices
        })
        .catch(err => {
            console.log(err)
        })

}
// Retieve how many playable devices has a user
var getPlayableDevicesByUser = (user) => {
    return userDB.findById(user.userId)
        .then((userRetrieved) => {
            return userRetrieved.user.devices.filter(device => device.playable == true).length
        })
        .catch(err => console.log(err))
}

var checkLimitPlayableDevicesReached = async (user) => {
    var maxPlayableDevice = await getMaxPlayableDevicesByUser(user)
    //TODO Why 0?
    var activatedDevices = await getPlayableDevicesByUser(user)

    // In the case a user has more playable devices than the max, we should disable every user's device and send a report 
    // to a specific API for reports.   
    if (maxPlayableDevice < activatedDevices) {
        reportAPI.reportExcessPayableDevicesCase(user)
    }
    return maxPlayableDevice <= activatedDevices
}

userService.updateDevice = async (user, device, activate) => {
    //assert not null (user, device)
    if (!user || !device || activate === undefined) {
        return { code: 400, message: "Bad request. Params missing" }
    }
    if (!device.deviceId) {
        return { code: 400, message: "Bad request. Device id not present" }
    }
    if (!user.userId) {
        return { code: 400, message: "Bad request. User id not present" }
    }
    if (device.playable === activate) {
        return { code: 200, message: "The device is already abled/disabled" }
    }
    if (activate) {
        // If a user has no more playable devices left.
        if (await checkLimitPlayableDevicesReached(user)) {
            return { code: 403, message: "Limit available devices has been reached." }
        }
    }

    // 
    return userDB.changePlayability(user, device, activate)
        .then((success) => {
            return { code: 200, message: `Device ${device.deviceId} succesfully updated` }
        })
        .catch(({ success, message }) => {
            // TODO: Log error
            return { code: 500, message: message }
        })
}

userService.deleteDevice = (user, device) => {
    if (!user || !device) {
        return { code: 400, message: "Bad request. Params missing" }
    }
    if (!device.deviceId) {
        return { code: 400, message: "Bad request. Device id not present" }
    }
    if (!user.userId) {
        return { code: 400, message: "Bad request. User id not present" }
    }

    return userDB.deleteDeviceFromUser(user, device)
        .then(({success, message}) => {
            return {code: 200, message: message}
        })
        .catch(err=>{
            return {code: 500, message: `Error removing the device (${device.deviceId}) from the user (${user.userId})`}
        })
}