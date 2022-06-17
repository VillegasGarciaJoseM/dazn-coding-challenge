var userService = require('./../../../src/components/devices/userService.js')
var expect = require('chai').expect
var sinon = require('sinon');
var userDB = require('../../../src/components/devices/userDB.js')
var entitlementsAPI = require('../../../src/components/externalAPI/entitlementsAPI.js')
describe('hooks', function () {
  before(() => {
    //inicializar la base de datos

  });
  after(() => {
    //vaciar la base de datos
  });
}),


  describe('Service Tests', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    });
    afterEach(() => {
      sandbox.restore();
    });

    const userIdFixture = 'c0b8584c-97e3-4561-b8fc-58797b1f4c6d';
    const stubValueUserHas2Playable =
    {
      success: true,
      user: {
        userId: 'c0b8584c-97e3-4561-b8fc-58797b1f4c6d',
        devices: [
          {
            deviceId: '435bc3-2fc4-f1f4-2b4b',
            playable: true
          },
          {
            deviceId: '749bb7-3c4c-f743-aaaa',
            playable: true
          },
          {
            deviceId: '977879-333f-f4ff-10f2',
            playable: false
          },
          {
            deviceId: '357868-c352-4523-ad34',
            playable: false
          }
        ]
      }
    }
    const stubValueUserHas3Playable =
    {
      success: true,
      user: {
        userId: 'c0b8584c-97e3-4561-b8fc-58797b1f4c6d',
        devices: [
          {
            deviceId: '435bc3-2fc4-f1f4-2b4b',
            playable: true
          },
          {
            deviceId: '749bb7-3c4c-f743-aaaa',
            playable: true
          },
          {
            deviceId: '977879-333f-f4ff-10f2',
            playable: true
          },
          {
            deviceId: 'aaaa11-2fc4-f1f4-2b4b',
            playable: false
          }
        ]
      }
    }
    const stubValueSuccessFalse =
    {
      success: false,
    }
    const stubValueSuccessTrue =
    {
      success: true
    }
    const entitlements = [
      {
        "userId": "302f063d-bc39-4b0c-9238-4ca9e060ab06",
        "entitlements": {
          "devices": {
            "access_device": "any",
            "max_devices": 2
          }
        }
      },
      {
        "userId": "b174f1b0-b0c5-4578-a982-4365a79b79ea",
        "entitlements": {
          "devices": {
            "access_device": "any",
            "max_devices": 3
          }
        }
      },
    ]
    const stubUserAndDevicePlayable =
    {
      "user": {
        "userId": "b174f1b0-b0c5-4578-a982-4365a79b79ea"
      },
      "device": {
        "deviceId": "aaaa11-2fc4-f1f4-2b4b",
        "playable": true
      }
    }
    const stubUserAndDeviceNotPlayable =
    {
      "user": {
        "userId": "b174f1b0-b0c5-4578-a982-4365a79b79ea"
      },
      "device": {
        "deviceId": "aaaa11-2fc4-f1f4-2b4b",
        "playable": false
      }
    }
    describe('FindAllDevicesFromUser', () => {
      it('Retieve every device of the user', async () => {
        var stub = sandbox.stub(userDB, "findById").resolves(stubValueUserHas2Playable);

        const res = await userService.findAllDevicesFromUser(stubValueUserHas2Playable.userId)

        expect(res.code).to.equal(200);
        expect(res.devices).to.equal(stubValueUserHas2Playable.user.devices)
      })

      it('User not found', async () => {
        const stub = sandbox.stub(userDB, "findById").resolves(stubValueSuccessFalse);

        const res = await userService.findAllDevicesFromUser(userIdFixture)

        expect(res.code).to.equal(404);
        expect(res.message).to.equal("User not found")
      })

      it('Promise error retrieving devices from a user', async () => {
        const stub = sandbox.stub(userDB, "findById").rejects(stubValueSuccessFalse);

        const res = await userService.findAllDevicesFromUser(userIdFixture)

        expect(res.code).to.equal(500);
        expect(res.message).to.equal("Error retreiving the information about the user")
      })
    });


    describe('addDevice', () => {
      it('add Device Ok', async () => {
        const stub = sandbox.stub(userDB, "findById").resolves(stubValueUserHas2Playable);
        const stub1 = sandbox.stub(entitlementsAPI, "allEntitlements").resolves(entitlements);

        const stub3 = sandbox.stub(userDB, "addDeviceToUser").resolves(stubValueSuccessTrue);

        const res = await userService.addDevice(stubUserAndDevicePlayable.user, stubUserAndDevicePlayable.device)

        expect(res.code).to.equal(200)
      })
      it('User or device missing in call', async () => {
        const res = await userService.addDevice(stubUserAndDevicePlayable.user, undefined)

        expect(res.code).to.equal(400)
      })
    });


    describe('Update device', () => {
      it('update Device Ok', async () => {
        const stub = sandbox.stub(userDB, "findById").resolves(stubValueUserHas2Playable);
        const stub1 = sandbox.stub(entitlementsAPI, "allEntitlements").resolves(entitlements);

        const stub3 = sandbox.stub(userDB, "changePlayability").resolves(stubValueUserHas2Playable);

        const res = await userService.updateDevice(stubUserAndDevicePlayable.user, stubUserAndDevicePlayable.device, true)

        expect(res.code).to.equal(200)
      })
      it('update Device. Limit of playable devices already reached', async () => {
        const stub = sandbox.stub(userDB, "findById").resolves(stubValueUserHas3Playable);
        const stub1 = sandbox.stub(entitlementsAPI, "allEntitlements").resolves(entitlements);

        const stub3 = sandbox.stub(userDB, "changePlayability").resolves();

        const res = await userService.updateDevice(stubUserAndDeviceNotPlayable.user, stubUserAndDeviceNotPlayable.device, true)
        expect(res.code).to.equal(403)
        expect(res.message).to.equal("Limit available devices has been reached.")
      })
    });
    
    describe('Delete device', () => {
      it('update Device Ok', async () => {
        const stub3 = sandbox.stub(userDB, "deleteDeviceFromUser").resolves({ success: true, message: "Device removed successfully" });
    
        const res = await userService.deleteDevice(stubUserAndDevicePlayable.user, stubUserAndDevicePlayable.device)
    
        expect(res.code).to.equal(200)
      })
    });
  });

