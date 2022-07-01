jest
	.useFakeTimers()
	.setSystemTime(new Date('2022-01-01'));
jest.mock('../../model');

const {sequelize} = require("../../model");
const {payClientAndContractor} = require('../job.service');

describe('payClientAndContractor', () => {
	let sut = null;

	beforeAll(() => {
		sut = payClientAndContractor;
	});

	it('should pay job/client/contractor and commit in a transaction', async () => {
		const expected = {
			"price": 200,
			"paid": true,
			"paymentDate": new Date('2022-01-01').toISOString(),
			"Contract": {
				"Contractor": {
					"balance": 222
				},
				"Client": {
					"balance": 151.3
				}
			}
		};

		const fakeJob = {
			"price": 200,
			"paid": null,
			"paymentDate": null,
			"Contract": {
				"Contractor": {
					"balance": 22
				},
				"Client": {
					"balance": 351.3
				}
			}
		};

		const jobUpdateSpy = jest.fn();
		const clientUpdateSpy = jest.fn();
		const contractorUpdateSpy = jest.fn();
		const commitSpy = jest.fn();
		const jobReloadSpy = jest.fn().mockImplementation(() => {
			fakeJob.paid = true;
			fakeJob.paymentDate = expected.paymentDate;
			fakeJob.Contract.Client.balance = expected.Contract.Client.balance;
			fakeJob.Contract.Contractor.balance = expected.Contract.Contractor.balance;
		});
		const fakeTransaction = {
			commit: commitSpy
		}

		fakeJob.update = jobUpdateSpy;
		fakeJob.reload = jobReloadSpy;
		fakeJob.Contract.Contractor.update = contractorUpdateSpy;
		fakeJob.Contract.Client.update = clientUpdateSpy;

		sequelize.transaction.mockImplementation(() => (Promise.resolve(fakeTransaction)));

		const result = await sut(fakeJob);

		expect(jobUpdateSpy).toHaveBeenCalledWith({
			paid: true,
			paymentDate: expected.paymentDate
		}, {transaction: fakeTransaction});

		expect(clientUpdateSpy).toHaveBeenCalledWith({
			balance: expected.Contract.Client.balance
		}, {transaction: fakeTransaction});

		expect(contractorUpdateSpy).toHaveBeenCalledWith({
			balance: expected.Contract.Contractor.balance
		}, {transaction: fakeTransaction});

		expect(commitSpy).toHaveBeenCalled();
		expect(jobReloadSpy).toHaveBeenCalled();
		expect(result.paid).toEqual(expected.paid);
		expect(result.paymentDate).toEqual(expected.paymentDate);
		expect(result.Contract.Contractor.balance).toEqual(expected.Contract.Contractor.balance);
		expect(result.Contract.Client.balance).toEqual(expected.Contract.Client.balance);
	});

	it('should rollback if there was an issue during transaction process', async () => {
		const fakeJob = {
			"price": 200,
			"paid": null,
			"paymentDate": null,
			"Contract": {
				"Contractor": {
					"balance": 22
				},
				"Client": {
					"balance": 351.3
				}
			}
		};

		const jobUpdateSpy = jest.fn();
		const clientUpdateSpy = jest.fn();
		const contractorUpdateSpy = jest.fn();
		const commitSpy = jest.fn().mockImplementation(() => (Promise.reject()));
		const jobReloadSpy = jest.fn();
		const rollbackSpy = jest.fn();

		fakeJob.update = jobUpdateSpy;
		fakeJob.reload = jobReloadSpy;
		fakeJob.Contract.Contractor.update = contractorUpdateSpy;
		fakeJob.Contract.Client.update = clientUpdateSpy;

		sequelize.transaction.mockImplementation(() => (Promise.resolve({
			commit: commitSpy,
			rollback: rollbackSpy
		})));

		try {
			await sut(fakeJob);
		} catch (e) {
			expect(rollbackSpy).toHaveBeenCalled();
		}
	});
});

