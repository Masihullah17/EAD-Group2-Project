const KEYS = {
	notifies: "notifies",
	notifiyId: "notifiyId",
};

export const getNotifiedCollection = () => [
	{ id: "1", title: "Content" },
	{ id: "2", title: "Element" },
	{ id: "3", title: "Image" },
];

export function insertEmployee(data) {
	let notifies = getAllNotifies();
	data["id"] = generateNotifiyId();
	notifies.push(data);
	localStorage.setItem(KEYS.notifies, JSON.stringify(notifies));
}

export function updateEmployee(data) {
	let notifies = getAllNotifies();
	let recordIndex = notifies.findIndex((x) => x.id === data.id);
	notifies[recordIndex] = { ...data };
	localStorage.setItem(KEYS.notifies, JSON.stringify(notifies));
}

export function deleteEmployee(data) {
	let notifies = getAllNotifies();
	let recordIndex = notifies.findIndex((x) => x.id === data.id);
	delete notifies[recordIndex];
	console.log(notifies);
	localStorage.setItem(KEYS.notifies, JSON.stringify(notifies));
}

export function generateNotifiyId() {
	if (localStorage.getItem(KEYS.notifiyId) == null)
		localStorage.setItem(KEYS.notifiyId, "0");
	var id = parseInt(localStorage.getItem(KEYS.notifiyId));
	localStorage.setItem(KEYS.notifiyId, (++id).toString());
	return id;
}

export function getAllNotifies() {
	if (localStorage.getItem(KEYS.notifies) == null)
		localStorage.setItem(KEYS.notifies, JSON.stringify([]));

	let notifies = JSON.parse(localStorage.getItem(KEYS.notifies));

	//map departmentID to department title
	let departments = getNotifiedCollection();
	return notifies.map((x) => ({
		...x,
		department: departments[parseInt(x.notifyId) - 1].title,
	}));
}
