document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("register-form");
	const errorContainer = document.getElementById("error-container");
	const typeSelect = document.getElementById("type");
	const API_BASE = RequestManager.apiBase;

	async function loadTypes() {
		try {
			const response = await fetch(`${API_BASE}/users/types`);
			const collection = await response.json()
			const types = collection.types
			
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
			const productId = params.get("id")
			if(productId) {
				const response = await fetch(`${API_BASE}/users/register/${productId}`)
				if(!response.ok) throw new Error("Failed to fetch product details")
					const user = await response.json()
					const data = user.data
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
		const productId = params.get("id")
		try {
			const response = await fetch(`${API_BASE}/users/register/${productId ? productId : ''}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
			  },
				body: JSON.stringify(data),
			});

			const responseJSON = await response.json()
			if (!response.ok) {
				displayErrors(responseJSON)
			} else {
				alert(responseJSON.message)
				window.location.href = "./list.html"; // redirect on success
			}
		} catch (error) {
			console.error("Error during form submission", error);
			displayErrors([{ msg: "An error occurred. Please try again later." }]);
		}
	});

	// Function to display errors
	function displayErrors(errors) {
		errorContainer.innerHTML = "";
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
