document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("register-form");
	const errorContainer = document.getElementById("error-container");
	const typeSelect = document.getElementById("type");
	const API_BASE = RequestManager.apiBase;

	// Fake data for demonstration purposes (replace with real data in production)

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

	// // Populate the form with the existing data
	// document.getElementById("username").value = data.username || "";
	// document.getElementById("email").value = data.email || "";
	// document.getElementById("password").value = data.password || "";

	// Handle form submission
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(form);

		try {
			const response = await fetch("/users/register", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				displayErrors(errorData.errors);
			} else {
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
	loadTypes();
});
