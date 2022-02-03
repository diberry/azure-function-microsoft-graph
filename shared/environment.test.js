const helper = require('./environment');

describe('Helper tests', () =>{
    test('Load env vars from local.settings.json', async() => {

        await helper.localSettingsToEnvironment();
        expect(process.env.FUNCTIONS_WORKER_RUNTIME).toBe("node");
    });
});
