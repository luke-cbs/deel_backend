const {getTopProfession, getTopClients} = require('../admin.service');

describe('getTopProfession', () => {
	let sut = null;

	beforeAll(() => {
		sut = getTopProfession;
	});

	it('should return empty data if no jobs provided', function () {
		const expected = {
			professions: [],
			amount: 0
		};
		const result = sut([]);

		expect(result).toStrictEqual(expected);
	});

	it('should return top profession based on jobs as well as sum of total jobs for that profession', () => {
		const fakeJobs = [
			{
				"price": 2020,
				"Contract": {
					"Contractor": {
						"profession": "Programmer",
					}
				}
			},
			{
				"price": 20,
				"Contract": {
					"Contractor": {
						"profession": "Programmer",
					}
				}
			},
			{
				"price": 2300,
				"Contract": {
					"Contractor": {
						"profession": "Artist",
					}
				}
			},
		];

		const expected = {
			professions: ["Artist"],
			amount: 2300
		};
		const result = sut(fakeJobs);

		expect(result).toStrictEqual(expected);
	});

	it('should return both professions if equal', () => {
		const fakeJobs = [
			{
				"price": 2000,
				"Contract": {
					"Contractor": {
						"profession": "Programmer",
					}
				}
			},
			{
				"price": 2000,
				"Contract": {
					"Contractor": {
						"profession": "Artist",
					}
				}
			},
		];

		const expected = {
			professions: ["Programmer", "Artist"],
			amount: 2000
		};

		const result = sut(fakeJobs);

		expect(result).toStrictEqual(expected);
	});
});

describe('getTopClient', () => {
	let sut = null;

	beforeAll(() => {
		sut = getTopClients;
	});

	it('should return top clients and their job amounts', () => {
		const expected = [{
			id: 1,
			fullName: "James Brown",
			paid: 2000
		}, {
			id: 2,
			fullName: "Bobby Green",
			paid: 500
		}];

		const fakeJobs = [
			{
				"price": 2000,
				"Contract": {
					"Client": {
						"id": 1,
						"firstName": "James",
						"lastName": "Brown",
					}
				}
			},
			{
				"price": 500,
				"Contract": {
					"Client": {
						"id": 2,
						"firstName": "Bobby",
						"lastName": "Green",
					}
				}
			},
		];

		const result = sut(fakeJobs);

		expect(result).toStrictEqual(expected);
	});
});
