document.addEventListener("DOMContentLoaded", () => {
	const productForm = document.getElementById("product-form");
	const providerSelect = document.getElementById("provider");
	const errorsContainer = document.getElementById("errors-container");
	const formTitle = document.getElementById("form-title");
	const imgPreview = document.getElementById("imgPreview");
	const submitBtn = document.getElementById("submit-btn");
	const API_BASE = RequestManager.apiBase;

	// Динамічні дані (можна замінити на дані, отримані через API)
	const errors = [];

	// Ініціалізація форми
	async function initForm() {
		try {
			const params = new URLSearchParams(window.location.search)
			const productId = params.get("id")

			if (productId) {
				const response = await fetch(`${API_BASE}/products/${productId}`);
				if (!response.ok) throw new Error("Failed to fetch product details")
				const data = await response.json();
				const product = data.product
				// Заповнення полів, якщо це редагування
				if (product) {
					formTitle.textContent = "Edit Product";
					submitBtn.textContent = "Edit";
					productForm.elements.title.value = product.title || "";
					productForm.elements.amount.value = product.amount || "";
					productForm.elements.price.value = product.price || "";
					productForm.elements.info.value = product.info || "";
					productForm.elements.including.value = product.including || "";
					productForm.elements.numStems.value = product.numStems || "";
				}
			}

			// Відображення попередніх помилок
			displayErrors(errors);
		} catch (err) {
			console.log(err);
		}
	}
	async function loadProviders() {
		try {
			const response = await fetch(`${API_BASE}/products`);
			const collection = await response.json()
			collection.providers.forEach((provider) => {
				const option = document.createElement("option");
				option.value = provider._id;
				option.textContent = provider.title;
				providerSelect.append(option);
			});
		} catch (error) {
			console.error("Error loading products:", error);
		}
	}

	// Відображення помилок
	const displayErrors = (errors) => {
		errorsContainer.innerHTML = "";
		if (errors.length > 0) {
			const ul = document.createElement("ul");
			errors.forEach((error) => {
				const li = document.createElement("li");
				li.className = "error__msg";
				li.textContent = error.msg;
				ul.appendChild(li);
			});
			errorsContainer.appendChild(ul);
		}
	};

	// Прев'ю завантаженого зображення
	window.previewImage = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imgPreview.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};
	async function editForm(formData, productId) {
		console.log("edit======>", formData);
		try {
			const response = await fetch(`${API_BASE}/products/edit/${productId}`, {
				method: "POST",
				body: formData,
			})
			const responseData = await response.json()
			if (response.ok) {
				console.log(responseData, 'product edited')
			} else {
				console.error("Failed to edit product:", response.statusText)
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Обробка форми
	productForm.addEventListener("submit", async (e) => {
		e.preventDefault()

		// Отримання даних форми
		const formData = new FormData(productForm);
		const formObject = Object.fromEntries(formData.entries());
		const file = formData.get('imgSrc')
		if (file && file.size === 0) {
			console.error("File is empty, skipping submission.")
			alert("Please provide a valid image file.")
			return;
	  }

		console.log("Form Submitted:", formObject);
		const params = new URLSearchParams(window.location.search);
		const productId = params.get("id");
		if (productId) {
			try {
				const response = await fetch(`${API_BASE}/products/edit/${productId}`, {
					method: "POST",
					body: formData,
				})
				const responseData = await response.json()
				if (response.ok) {
					window.location.href = "./list.html"
					console.log(responseData, 'product edited')
				} else {
					console.error("Failed to edit product:", response.statusText)
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			// Валідація або відправка на сервер
			// Наприклад, відправка через fetch:
			try {
				const response = await fetch(`${API_BASE}/products/create`, {
					method: "POST",
					body: formData,
				})
				if (response.ok) {
					window.location.href = "./list.html"
				} else {
					console.error("Failed to edit product:", response.statusText)
				}
			} catch (error) {
				console.log(error);
			}
		}
	})

	initForm();
	loadProviders();
});
