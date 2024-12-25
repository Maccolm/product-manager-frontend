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
		 const data = await RequestManager.fetchData(`/products/${productId}`)
		 
		 if(!data) {
			productDetailsContainer.innerHTML = "<p>No product data found.</p>";
			return
		 }
		 
		 const isAdmin = data.isAdmin || false
		 //перевірка на expired token
		 if (typeof isAdmin === "string") {
			 if (confirm(isAdmin)) {
				 window.location.href = "../../auth/login.html"
				 localStorage.removeItem("jwt_token")
			 } else {
				 localStorage.removeItem("jwt_token")
			 }
		 }
		 // Рендеринг деталей продукту
		 renderProductDetails(data, isAdmin)
	  } catch (error) {
		 console.error("Error loading product details:", error);
		 productDetailsContainer.innerHTML = "<p>Error loading product details.</p>";
	  }
	}
 
	// Рендеринг продукту
	function renderProductDetails(data, isAdmin) {
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
			${isLoggedIn() && isAdmin? `
			  <div class="product__actions actions">
				 <a href="product-form.html?id=${product._id}" class="product__btn">Edit</a>
				 <button onclick="deleteProduct('${product._id}')" class="product__btn">Delete</button>
			  </div>
			` : ""}
			<button id='buy-btn' onclick="addProductToCart('${product._id}')" class="product__btn cart">Add To Cart</button>
			<a href="../cart/cart.html" class="product__btn cart">Cart</a>
		 </div>
	  `;
	}
 
	// Перевірка автентифікації
	function isLoggedIn() {
	  return !!localStorage.getItem("jwt_token");
	}
	// add Product to Card
	window.addProductToCart = async function (productId) {
		console.log('productId', productId);
		
		const buyBtn = document.getElementById('buy-btn')
		buyBtn.disabled = true
		try {
			const response = await CartApiManager.addToCart(productId)
			console.log(response)
			if (response) {
				buyBtn.disabled = false
				return alert('Product added to cart')
			}
		} catch (error) {
			console.log('Error to add product', error);
			alert('Product was not added to cart')
			buyBtn.disabled = false
		}
	}
 
		// Видалення продукту
		window.deleteProduct = async function (productId) {
			if(confirm('Are you sure you want to delete product?')){
				try {
					const response = await RequestManager.deleteRequest(`${API_BASE}/products/`, productId)
					if(response.success){ 
						setTimeout(() => {
							window.location.href='./list.html' // Оновлення списку продуктів
						},100)
					}
				} catch (error) {
					console.error("Error deleting product:", error)
				}
			}
		}
 
	// Завантаження деталей продукту при завантаженні сторінки
	loadProductDetails()
 });
 