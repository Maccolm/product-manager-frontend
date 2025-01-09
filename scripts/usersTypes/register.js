window.onload = async function () {
	const categories = ['users', 'products', 'usersTypes']
	const permissions = ['read', 'create', 'update', 'delete']

	const typeObj =
	  (await UsersTypesApiManager.getBasedOnQueryId())?.data ?? {}
	const flatTypeObj = ObjectUtils.formNestedToFlatObject(typeObj)
	// const redirectUrl = `${headerManager.basePath}users_types/list.html`

console.log(typeObj)

	const submitCallback = async (data) => {
	  for (const key in data) {
		 if (data[key] === 'on') {
			data[key] = true
		 }
	  }
	  console.table(JSON.stringify(data))

	  let nestedData = ObjectUtils.fromFlatToNestedObject(data)

	  console.table(JSON.stringify(nestedData))

	  let res = await UsersTypesApiManager.register(nestedData, typeObj)

	  if (res.errors) {
		 UsersTypesApiManager.showErrors(res.errors)
	  } else {
		 window.location.href = redirectUrl
	  }
	}

	// Create a table
	function buildTable(containerId) {
		const container = document.getElementById(containerId)
		const table = document.createElement('table')
		table.className = 'permissions-table'

		const thead = document.createElement('thead')
		const headerRow = document.createElement('tr')
		headerRow.innerHTML= `
			<th>Category</th>
			${permissions.map((permission) => `<th>${permission.toUpperCase()}</th>`).join('')}
		`
		thead.append(headerRow)
		table.append(thead)

		//add table body
		const tbody = document.createElement('tbody')
		categories.forEach((category) => {
			const row = document.createElement('tr')
			row.innerHTML = `
			<td>${category}</td>
			${permissions.map((permission) => 
				`<td>
					<input
						type="checkbox"
						name="pagesPermissions.${category}.${permission}"
						${flatTypeObj[`pagesPermissions.${category}.${permission}`] ? 'checked' : ''}
					/>
				</td>`
			)}
			`
			tbody.append(row)
		})
		table.append(tbody)
		container.innerHTML = ''
	}
	buildTable('container')
 }