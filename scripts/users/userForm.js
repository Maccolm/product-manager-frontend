document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("register-form");
	const errorContainer = document.getElementById("error-container");
	const typeSelect = document.getElementById("type");
	const API_BASE = RequestManager.apiBase
	const inputs = document.querySelectorAll('input')
	console.log(inputs);
	

	window.onload = async function validateUser() {
		if(!RequestManager.isAuthenticated()) {
			window.location.href = './list.html'
		}
	}
	async function loadTypes() {
		try {
			const response = await RequestManager.fetchData(`/users/types`);
			const types = response.types
			
			types.forEach((type) => {
				const option = document.createElement("option");
				option.value = type._id;
				option.textContent = type.title;
				typeSelect.append(option);
			});
		} catch (err) {
			console.log(err);
		}
	}
	async function initForm() {
		try{
			const params = new URLSearchParams(window.location.search)
			const userId = params.get("id")
			if(userId) {
				const response = await RequestManager.fetchData(`/users/register/${userId}`)
				
				if(!response) {
					throw new Error("Failed to fetch user details")
				} else if (response.error) {
					closeAccess(response.error)
				}
					const data = response.data
					// Populate the form with the existing data
				if (data) {
					document.querySelector(".title-user").textContent = 'Edit User'
					document.getElementById("submitUserBtn").textContent = 'Edit'
					document.getElementById("username").value = data.username || ""
					document.getElementById("email").value = data.email || ""
					document.getElementById("password").value = data.password || ""
				}	
			}
		}catch(err){
			console.log(err)
		}
	}

	// Handle form submission
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(form)
		const data = Object.fromEntries(formData.entries())
		const params = new URLSearchParams(window.location.search)
		const userId = params.get("id")
		try {
			const response = await RequestManager.postRequest(`${API_BASE}/users/register/${userId ? userId : ''}`, data)
			console.log(response)
			
			if (response) {
				const responseMessage = response.error ? response.error : response.message
				alert(responseMessage)
				window.location.href = "./list.html"; // redirect on success
			}
		} catch (error) {
			console.error("Error during form submission", error);
			displayErrors([{ msg: "An error occurred. Please try again later." }]);
		}
	});
	function closeAccess(message) {
		inputs.forEach(input => {
			input.disabled = true
		})
		typeSelect.disabled = true
		errorContainer.innerHTML = message

	}
	// Function to display errors
	function displayErrors(errors) {
		errorContainer.innerHTML = ""
		if (errors.length > 0) {
			const ul = document.createElement("ul");
			errors.forEach((error) => {
				const li = document.createElement("li");
				li.textContent = error.msg;
				ul.appendChild(li);
			});
			errorContainer.appendChild(ul);
		}
	}
	loadTypes()
	initForm()
})
