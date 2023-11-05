export async function serverAddClient(clientObj) {
	const response = await fetch('http://localhost:3000/api/clients', {
		method: 'POST',
		body: JSON.stringify(clientObj),
		headers: { 'Content-Type': 'application/json' },
	})

	let serverDataClient = await response.json()

	return serverDataClient
}

export async function serverGetClient() {
	const response = await fetch('http://localhost:3000/api/clients', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	let serverDataClient = await response.json()

	return serverDataClient
}

export async function serverPatchClient(id, client) {
	const response = await fetch('http://localhost:3000/api/clients/' + id, {
		method: 'PATCH',
		body: JSON.stringify(client),
		headers: { 'Content-Type': 'application/json' },
	})

	let serverDataClient = await response.json()
	console.log(serverDataClient)
	return serverDataClient
}

export async function serverDeleteClient(id) {
	const response = await fetch('http://localhost:3000/api/clients/' + id, {
		method: 'DELETE',
	})

	let serverDataClient = await response.json()

	return serverDataClient
}
