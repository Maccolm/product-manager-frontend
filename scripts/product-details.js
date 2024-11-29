document.addEventListener("DOMContentLoaded", () => {
	const API_BASE = RequestManager.apiBase
	const productDetailsContainer = document.getElementById("productDetails");
 
	// Завантажити деталі продукту
	async function loadProductDetails() {
	  try {
		 // Отримання ID продукту з URL
		 const params = new URLSearchParams(window.location.search);
		 const productId = params.get("id");
 
		 if (!productId) {
			productDetailsContainer.innerHTML = "<p>Product not found.</p>";
			return;
		 }
 
		 // Виклик API для отримання деталей продукту
		 const response = await fetch(`${API_BASE}/products/${productId}`);
		 if (!response.ok) throw new Error("Failed to fetch product details");
 
		 const data = await response.json()
		 if(!data) {
			productDetailsContainer.innerHTML = "<p>No product data found.</p>";
			return
		 }
		 // Рендеринг деталей продукту
		 renderProductDetails(data)
	  } catch (error) {
		 console.error("Error loading product details:", error);
		 productDetailsContainer.innerHTML = "<p>Error loading product details.</p>";
	  }
	}
 
	// Рендеринг продукту
	function renderProductDetails(data) {
		const product = data.product
	  const distributor = product.provider?.title || "Unknown";
 
	  productDetailsContainer.innerHTML = `
		 <div class="product__img">
			<img src="${RequestManager.apiUrl}/uploads/${product.imgSrc}" alt="Product Image" />
		 </div>
		 <span class="divider divider-sm"></span>
		 <div class="product__info">
			<p class="product__title">${product.title}</p>
			<p class="product__price">${product.price} $</p>
			<span class="divider"></span>
			<div class="product__desc">
			  <p class="product__text">${product.info}</p>
			  <span class="divider"></span>
			  <p class="product__text">Distributor: ${distributor}</p>
			  <span class="divider"></span>
			  <h2>What Including?</h2>
			  <p class="product__text">
				 ${product.numStems} stems including ${product.including}
			  </p>
			</div>
			<span class="divider"></span>
			${isLoggedIn() ? `
			  <div class="product__actions actions">
				 <a href="/products/edit/${product.id}" class="product__btn">Edit</a>
				 <button onclick="deleteProduct('${product.id}')" class="product__btn">Delete</button>
			  </div>
			` : ""}
		 </div>
	  `;
	}
 
	// Перевірка автентифікації
	function isLoggedIn() {
	  return !!localStorage.getItem("jwt_token");
	}
 
	// Видалення продукту
	async function deleteProduct(productId) {
	  try {
		 const token = localStorage.getItem("jwt_token");
		 const response = await fetch(`${API_BASE}/products/${productId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		 });
 
		 if (response.ok) {
			alert("Product deleted successfully!");
			window.location.href = "list.html";
		 } else {
			alert("Failed to delete product.");
		 }
	  } catch (error) {
		 console.error("Error deleting product:", error);
	  }
	}
 
	// Завантаження деталей продукту при завантаженні сторінки
	loadProductDetails()
 });
 