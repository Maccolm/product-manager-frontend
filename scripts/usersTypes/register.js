window.onload = async function () {
	const categories = ['users', 'products', 'usersTypes']
	const permissions = ['read', 'create', 'update', 'delete']

	const typeObj =
	  (await UsersTypesApiManager.getBasedOnQueryId())?.data ?? {}
	const flatTypeObj = ObjectUtils.formNestedToFlatObject(typeObj)
	const redirectUrl = './list.html'

	const submitCallback = async (data) => {
		const roleNameInput = document.getElementById('roleName')
		const roleName = roleNameInput.value.trim()

		if(!roleName){
			alert('Add role Name')
			return
		}
		data.title = roleName

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
		alert('Type Created Successfully')
		setTimeout(() => {
			window.location.href = redirectUrl
		},100)
	  }
	}

	// Create a table
	function buildTable(containerId) {
		const container = document.getElementById(containerId)
		const table = document.createElement('table')
		table.style.marginBottom = '20px'
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
			).join('')}
			`
			tbody.append(row)
		})
		table.append(tbody)
		container.innerHTML = ''
		container.append(table)
	}
	function addRoleNameInput(containerId) {
		const container = document.getElementById(containerId)
		const div = document.createElement('div')
		div.className='form__section'
		div.style.maxWidth = '300px'
		div.innerHTML = `<input type="text" id="roleName" name="roleName" placeholder="Name Of Role" />`
		container.prepend(div)
	 }
	 function addSaveButton(containerId, submitCallback) {
		const container = document.getElementById(containerId)
		const button = document.createElement('button')
		button.textContent = 'Save'
		button.className = 'product__btn'
		button.addEventListener('click', async () => {
			const formData = {}
			container.querySelectorAll('input[type="checkbox"]').forEach((input) => {
				formData[input.name] = input.checked
			})
			await submitCallback(formData)
		})
		container.append(button)
	 }
	 buildTable('container')
	 addRoleNameInput('container')
	addSaveButton('container', submitCallback )
 }