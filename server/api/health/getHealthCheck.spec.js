const { getHealthCheck } = require('./getHealthCheck');

const req = {};
const res = {
    status: () =>({
        send: jest.fn().mockResolvedValue({ message: 'OK' }),
    })
};
describe("getHealthCheck.js", () => {
    it('should return ok', async () => {
        const resp = await getHealthCheck(req, res);
        expect(resp).toEqual({message: 'OK'});
    })
})