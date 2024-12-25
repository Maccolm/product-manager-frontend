document.addEventListener("DOMContentLoaded", () => {
	const productForm = document.getElementById("product-form");
	const providerSelect = document.getElementById("provider");
	const errorsContainer = document.getElementById("errors-container");
	const formTitle = document.getElementById("form-title");
	const imgPreview = document.getElementById("imgPreview");
	const submitBtn = document.getElementById("submit-btn");
	const API_BASE = RequestManager.apiBase;

	// Ініціалізація форми
	async function initForm() {
		try {
			const params = new URLSearchParams(window.location.search)
			const productId = params.get("id")
console.log('run init Form');

			if (productId) {
				const data = await RequestManager.fetchData(`/products/${productId}`)
			
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

		} catch (err) {
			console.log(err)
			displayErrors([{ msg: `An error occurred. Please try again later. ${err}` }])
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
		errorsContainer.innerHTML = ""
		if (errors.length > 0) {
			const ul = document.createElement("ul")
			errors.forEach((error) => {
				const li = document.createElement("li")
				li.className = "error__msg"
				li.textContent = error.msg
				ul.appendChild(li)
			})
			errorsContainer.appendChild(ul)
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
	// Обробка форми
	productForm.addEventListener("submit", async (e) => {
		e.preventDefault()

		// Отримання даних форми
		const formData = new FormData(productForm);
		const formObject = Object.fromEntries(formData.entries());
		// const file = formData.get('imgSrc')

		console.log("Form Submitted:", formObject);
		const params = new URLSearchParams(window.location.search);
		const productId = params.get("id");

			// Валідація або відправка на сервер
			// Наприклад, відправка через fetch:
			try {
				const response = await RequestManager.postFormRequest(`${API_BASE}/products/${productId ? `edit/${productId}` : 'create'}`, productForm)
				if (!response.errors && !response.error) {
					alert(response.message)
					//wait after finished alert and after redirect
					setTimeout(() => {
						window.location.href = "./list.html"
					},0)
				} else {
					if(response.error){
						alert(response.error)
						window.location.href = "../../index.html"
						localStorage.removeItem('jwt_token')
					}
					console.error("Failed to edit product:", response.errors)
					displayErrors(response.errors)
				}
			} catch (error) {
				console.log(error)
				displayErrors([{ msg: `An error occurred. Please try again later. ${error}` }])
				
			}
		})

	initForm()
	loadProviders()
});
