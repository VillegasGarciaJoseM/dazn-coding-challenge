const axios = require('axios')

const options = {
    hostname: "https://growth-engineering-nodejs-home-assessement-dev.s3.eu-central-1.amazonaws.com",
    path: "entitlements.json",
    mehod: "GET"
}

const entitlementAPI = module.exports;

entitlementAPI.allEntitlements = async () => {
    return await axios.get(`${options.hostname}/${options.path}`)
        .then(res => { 
            return res.data })
        .catch(error => {
            return error
        });
}