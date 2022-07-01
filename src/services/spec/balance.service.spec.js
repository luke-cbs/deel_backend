jest.mock('../../model');

const {sequelize} = require("../../model");
const {depositToClient} = require('../balance.service');

describe('depositToClient', () => {
	let sut = null;

	beforeAll(() => {
		sut = depositToClient;
	});

	it('should throw an error if no contracts', () => {
		const fakeProfile = {
			"balance": 1.3
		};

		expect(() => sut(fakeProfile, 51)).rejects.toThrow();
	});

	it('should throw an error if deposit greater than 25% of total jobs', () => {
		const fakeProfile = {
			"balance": 1.3,
			"Client": [
				{
					"Jobs": [
						{
							"price": 200,
						}
					]
				}
			]
		};

		expect(() => sut(fakeProfile, 51)).rejects.toThrow();
	});

	it('should create a transaction and update relevant profiles and reload to get latest', async () => {
		const expected = 51.3;
		const commitSpy = jest.fn();

		const fakeProfile = {
			"balance": 1.3,
			"Client": [
				{
					"Jobs": [
						{
							"price": 200,
						}
					]
				}
			],
		};

		const profileUpdateSpy = jest.fn();
		const profileReloadSpy = jest.fn().mockImplementation(() => {
			fakeProfile.balance = 51.3;
		});
		const fakeTransaction = {
			commit: commitSpy
		}
		fakeProfile.update = profileUpdateSpy;
		fakeProfile.reload = profileReloadSpy;


		sequelize.transaction.mockImplementation(() => (Promise.resolve(fakeTransaction)));

		const result = await sut(fakeProfile, 50);

		expect(profileUpdateSpy).toHaveBeenCalledWith({balance: 51.3}, {transaction: fakeTransaction});
		expect(commitSpy).toHaveBeenCalled();
		expect(profileReloadSpy).toHaveBeenCalled();
		expect(result.balance).toEqual(expected);
	});

	it('should rollback if there was an issue during transaction process', async () => {
		const fakeProfile = {
			"balance": 1.3,
			"Client": [
				{
					"Jobs": [
						{
							"price": 200,
						}
					]
				}
			],
		};

		const commitSpy = jest.fn().mockImplementation(() => (Promise.reject()));
		const rollbackSpy = jest.fn();
		const profileUpdateSpy = jest.fn();
		const profileReloadSpy = jest.fn();

		fakeProfile.update = profileUpdateSpy;
		fakeProfile.reload = profileReloadSpy;

		sequelize.transaction.mockImplementation(() => (Promise.resolve({
			commit: commitSpy,
			rollback: rollbackSpy
		})));

		try {
			await sut(fakeProfile, 50);
		} catch (e) {
			expect(rollbackSpy).toHaveBeenCalled();
		}
	});
});
