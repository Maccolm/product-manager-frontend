
document.addEventListener("DOMContentLoaded", () => {
	const API_BASE = RequestManager.apiBase 
	const productList = document.getElementById("productList")
	const providerSelect = document.getElementById("provider")
	const filterForm = document.getElementById("filterForm")
	const clearFilter = document.getElementById("clearFilter")
 
	// Завантажити дистриб'юторів
	async function loadProviders() {
	  try {
		 const response = await fetch(`${API_BASE}/providers`);
		 const providers = await response.json();
		 providers.forEach((provider) => {
			const option = document.createElement("option");
			option.value = provider._id;
			option.textContent = provider.title;
			providerSelect.appendChild(option);
		 });
	  } catch (error) {
		 console.error("Error loading providers:", error);
	  }
	}
 
	// Завантажити продукти
	async function loadProducts(filters = {}) {
	  try {
		 const query = new URLSearchParams(filters).toString();
		 const response = await fetch(`${API_BASE}/products?${query}`);
		 const products = await response.json();
 
		 // Очищення попередніх продуктів
		 productList.innerHTML = "";
 
		 if (products.length === 0) {
			productList.innerHTML = "<p>No products found</p>";
			return;
		 }
 
		 products.forEach((product) => {
			const productContainer = document.createElement("div");
			productContainer.className = "product__container";
 
			const distributor = product.provider?.title || "Unknown";
 
			productContainer.innerHTML = `
			  <div class="product__info">
				 <a class="product__link" href="/products/${product.id}">
					<img src="/uploads/${product.imgSrc}" alt="Flowers Img">
				 </a>
				 <p class="product__price">${product.price} $</p>
				 <a class="product__link" href="/products/${product.id}">${product.title}</a>
				 <p class="product__text"><span>Distributor:</span> ${distributor}</p>
			  </div>
			  ${
				 isLoggedIn()
					? `<div class="product__actions actions">
						 <a href="/products/edit/${product.id}" class="product__btn">Edit</a>
						 <button onclick="deleteProduct('${product.id}')" class="product__btn">Delete</button>
					  </div>`
					: ""
			  }
			`;
			productList.append(productContainer);
		 });
	  } catch (error) {
		 console.error("Error loading products:", error);
	  }
	}
 
	// Перевірка автентифікації
	function isLoggedIn() {
	  return !!localStorage.getItem("jwt_token");
	}
 
	// Видалення продукту
	async function deleteProduct(productId) {
	  try {
		 const token = localStorage.getItem("jwt_token");
		 await fetch(`${API_BASE}/products/${productId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		 });
		 loadProducts(); // Оновлення списку продуктів
	  } catch (error) {
		 console.error("Error deleting product:", error)
	  }
	}
 
	// Фільтрація продуктів
	filterForm.addEventListener("submit", (e) => {
	  e.preventDefault()
	  const filters = Object.fromEntries(new FormData(filterForm));
	  loadProducts(filters)
	});
 
	// Очищення фільтрів
	clearFilter.addEventListener("click", () => {
	  filterForm.reset()
	  loadProducts()
	});
 
	// Початкове завантаження
	loadProviders()
	loadProducts()
 });
 