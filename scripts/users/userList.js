const API_BASE = RequestManager.apiBase
const userTableBody = document.getElementById('userTableBody')
const actionsHeader = document.getElementById('actionsHeader')
const addUserDiv = document.getElementById('addUserDiv')

// Simulate user authentication status
const isUserLoggedIn = () => !!localStorage.getItem('jwt_token')

// Fetch and render users
async function loadUsers(filters = {}) {
  try {
    userTableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    const queryParams = new URLSearchParams(filters).toString();
    const data = await RequestManager.fetchData(`/users/?${queryParams}`)
	 const isAdmin = data.userr ? await ensureAdmin(data.userr.role) : false

    if (data.users && data.users.length === 0) {
      userTableBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>'
      return
    } else if (data.users) {
		 userTableBody.innerHTML = '';
		 data.users.forEach(user => {
			const row = document.createElement('tr');
			row.innerHTML = `
			  <td>${user.username}</td>
			  <td>${user.type?.title || 'Unknown'}</td>
			  <td>${user.email}</td>
			  ${isUserLoggedIn() && isAdmin ? `
				 <td>
					<a class="product__btn" href="./formUser.html?id=${user._id}">Edit</a>
					<button class="product__btn" onclick="deleteUser('${user._id}')">Delete</button>
				 </td>
			  ` : ''}
			`;
			userTableBody.append(row);
		 })
	
		 if (isUserLoggedIn() && isAdmin) {
			actionsHeader.style.display = 'table-cell';
			addUserDiv.style.display = 'block';
		 } else {
			actionsHeader.style.display = 'none';
			addUserDiv.style.display = 'none';
		 }
	 }
	 if(data.result === 'Access Denied') {
		 userTableBody.innerHTML = `<tr><td colspan="4">${data.result}.</td></tr>`
	 }
		
  } catch (error) {
    console.error('Error loading users:', error);
    userTableBody.innerHTML = `<tr><td colspan="4">${error}.</td></tr>`
  }
}

// Delete user
async function deleteUser(userId) {
  try {
	const response = await RequestManager.deleteRequest(`${RequestManager.apiBase}/users`, userId)
	console.log(response)
	
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

// Filter form handler
document.getElementById('filterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData.entries());
  loadUsers(filters);
});

// Clear filters handler
document.getElementById('clearFilters').addEventListener('click', () => {
  loadUsers();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});
