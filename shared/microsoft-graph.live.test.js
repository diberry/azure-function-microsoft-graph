const { getUserFromGraph } = require('./microsoft-graph');
const { localSettingsToEnvironment } = require('./environment');

describe('Helper tests', () =>{
    beforeAll(async () => {
        await localSettingsToEnvironment();
      });
    test('Get user from Graph - live', async() => {

        const user = await getUserFromGraph(process.env.TEST_USER_1);
        console.log(user);
        expect(user).not.toBe(undefined);
        expect(user.email).toBe(process.env.TEST_USER_1);
    });
});