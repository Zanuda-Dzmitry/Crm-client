let serverDataGet = []

export async function serverAddClient(clientObj) {
	const copyArr = [...serverDataGet]
	const newItem = makeClientFromData(clientObj)
	if (newItem) {
		return newItem
	} else {
		clientObj.id = Date.now().toString()
		clientObj.createdAt = clientObj.updatedAt = new Date().toISOString()
		copyArr.push(clientObj)
		localStorageList(copyArr, 'clients')
		return clientObj
	}
}

export async function serverGetClient() {
	let localValue = localStorage.getItem('clients')
	if (localValue !== null && localValue !== '')
		serverDataGet = JSON.parse(localValue)
	return serverDataGet
}

function localStorageList(arr, myKey) {
	localStorage.setItem(myKey, JSON.stringify(arr))
}

export async function serverPatchClient(id, clientObj) {
	for (let i = 0; i < serverDataGet.length; i++) {
		if (serverDataGet[i].id == id)
			serverDataGet.splice(i, 1, {
				id: serverDataGet[i].id,
				name: clientObj.name,
				surname: clientObj.surname,
				lastName: clientObj.lastName,
				createdAt: serverDataGet[i].createdAt,
				updatedAt: new Date().toISOString(),
				contacts: clientObj.contacts,
			})
	}

	localStorageList(serverDataGet, 'clients')
}

export async function serverDeleteClient(id) {
	for (let i = 0; i < serverDataGet.length; i++) {
		if (serverDataGet[i].id == id) serverDataGet.splice(i, 1)
	}

	localStorageList(serverDataGet, 'clients')
}

function makeClientFromData(data) {
	const errors = []
	console.log(errors)
	function asString(v) {
		return (v && String(v).trim()) || ''
	}

	// составляем объект, где есть только необходимые поля
	const client = {
		name: asString(data.name),
		surname: asString(data.surname),
		lastName: asString(data.lastName),
		contacts: Array.isArray(data.contacts)
			? data.contacts.map(contact => ({
					type: asString(contact.type),
					value: asString(contact.value),
			  }))
			: [],
	}

	// проверяем, все ли данные корректные и заполняем объект ошибок, которые нужно отдать клиенту
	if (!client.name) errors.push({ field: 'name', message: 'Не указано имя' })
	if (!client.surname)
		errors.push({ field: 'surname', message: 'Не указана фамилия' })
	if (client.contacts.some(contact => !contact.type || !contact.value))
		errors.push({
			field: 'contacts',
			message: 'Не все добавленные контакты полностью заполнены',
		})

	// если есть ошибки, то бросаем объект ошибки с их списком и 422 статусом
	if (errors.length) return errors
}
