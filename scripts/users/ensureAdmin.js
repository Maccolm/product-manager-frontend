async function ensureAdmin(typeId) {
	try {
		const response = await RequestManager.fetchData('/users/types')
		if (response) {
			const types = response.types			
			const isAdmin = types.some(type => type.id === typeId && type.title === 'admin')
			return isAdmin
		}
		return null
	} catch (error) {
		alert(`${'Couldn\'t check role of the user', error}`)
		return null
	}
}