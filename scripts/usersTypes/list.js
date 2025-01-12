window.onload = async function () {
	async function loadUsersWithRoles() {
		const tableContainer = document.getElementById("table-container");
		const loadingSpinner = document.getElementById("loading-spinner");
		const errorMessage = document.getElementById("error-message");
		
		try {
			loadingSpinner.style.display = "block";
			errorMessage.style.display = "none";

			// Отримати список типів
			if (!RequestManager.isAuthenticated() && !UsersTypesApiManager.permissions?.read) {
				tableContainer.innerHTML = "<p>Access Denied.</p>"
				return
			}
			const data = await UsersTypesApiManager.getList();
			console.log("data", data)

			const types = data?.data || [];

			if (!types.length) {
				tableContainer.innerHTML = "<p>No types Found.</p>"
				return;
			}

			tableContainer.innerHTML = "";

			const table = document.createElement("table");
			table.style.marginBottom = '20px'
			table.innerHTML = `
		 <thead>
			<tr>
			  <th>Role</th>
			  <th>Actions</th>
			</tr>
		 </thead>
		 <tbody></tbody>
	  `;

			const tbody = table.querySelector("tbody");

			types.forEach((type) => {
				const row = document.createElement("tr");
				row.innerHTML = `
			<td>${type.title}</td>
			
			<td>
			${
				RequestManager.isAuthenticated() && UsersTypesApiManager.permissions?.update ?
				`<button class="product__btn" onclick="editUser('${type._id}')">Edit</button>`
				: ''
			}
			${
				RequestManager.isAuthenticated() && UsersTypesApiManager.permissions?.delete ?
				`<button class="product__btn" onclick="deleteFunction('${type._id}')">Delete</button>`
				: ''
			}
			</td>
		 `
				tbody.append(row);
			})

			tableContainer.append(table)
		} catch (error) {
			errorMessage.style.display = "block";
			console.error("Error to load users", error)
		} finally {
			loadingSpinner.style.display = "none"
		}
	}
	loadUsersWithRoles()
}
//функція видалення типу користувача
async function deleteFunction(id) {
	try{
		const deletedType = await UsersTypesApiManager.delete(id)		
		if(deletedType?.success) {
			alert('User type deleted successful!')
		} else {
			alert('Failed to delete user type!')
		}
		window.location.reload()
	} catch (error) {
		alert('Error to delete user type:', error)
		console.log(error)
	}
}
function editUser(id) {
	window.location.href = `./register.html?id=${id}`
}
