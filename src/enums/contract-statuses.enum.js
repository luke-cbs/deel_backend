// Question: was not sure but felt like we should have had a contract status to change when all jobs were done?
//           this was not in the brief but was something I felt was maybe needed?
const ContractStatuses = Object.freeze({
	New: 'new',
	InProgress: 'in_progress',
	Terminated: 'terminated'
});

module.exports = ContractStatuses;
