document.addEventListener("DOMContentLoaded", async () => {
	const API_BASE = RequestManager.apiBase;
	const productList = document.getElementById("productList");
	let pageData = {
		currentPage: 0,
	}
	let priceOrderSelector, filtersManager
	let loading = false
	 //функція застосування фільтрів
	 function getFiltersQueryString() {
		const queryOptions = [
		  `page=${pageData.currentPage ?? 0}`,
		  `perPage=${pageData.perPage ?? 4}`,
		]
		const filtersQueryString = filtersManager.getQueryString()
		if (filtersQueryString) queryOptions.push(filtersQueryString)

		queryOptions.push(`sort=price:${priceOrderSelector.currentOrder}`)
		return queryOptions.join('&')
	 }

	// Завантажити продукти
	async function loadProducts() {
		if(loading) return
		loading = true
		try {
			console.log('current page====>', pageData.currentPage)
			
			const resData = await ProductsApiManager.getListWithQuery(getFiltersQueryString())
			let products = resData.data?.documents
			console.log('resData====>', resData)
			

			const isAdmin = resData.isAdmin || false
			//перевірка на expired token
			if (typeof isAdmin === "string") {
				if (confirm(isAdmin)) {
					window.location.href = "../../auth/login.html"
					localStorage.removeItem("jwt_token")
				} else {
					localStorage.removeItem("jwt_token")
				}
			}

			if (products === 0) {
				productList.innerHTML = "<p>No products found</p>";
				return;
			}

			//{products, providers}
			products.forEach((product) => {
				const productContainer = document.createElement("div");
				productContainer.className = "product__container";

				const distributor = product.provider?.title || "Unknown";
				productContainer.innerHTML = `
			  <div class="product__info">
				 <a class="product__link" href="./product-details.html?id=${product._id}">
					<img src="${RequestManager.apiUrl}/uploads/${product.imgSrc}" alt="Flowers Img">
				 </a>
				 <p class="product__price">${product.price} $</p>
				 <a class="product__link" href="./product-details.html?id=${product._id}">${
					product.title
				}</a>
				 <p class="product__text"><span>Distributor:</span> ${distributor}</p>
			  </div>
			  ${
					isLoggedIn() && ProductsApiManager.permissions?.update
						? `<div class="product__actions actions">
								<a href="product-form.html?id=${product._id}" class="product__btn">Edit</a>
								${RequestManager.isAuthenticated() && ProductsApiManager.permissions?.delete ?
									`<button onclick="deleteProduct('${product._id}')" class="product__btn">Delete</button>`
								: ''
								}
							</div>`
						: ""
				}
				${
					isLoggedIn() ? `<button id='buy-btn' onclick="addProductToCart('${product._id}')" class="product__btn cart">Add To Cart</button>` : ''
				}
			`;
				productList.append(productContainer)
				//increase number of the page for the next loading
			})
			if(products.length !== 0) {
				pageData.currentPage++
			}
		} catch (error) {
			console.error("Error loading products:", error)
		} finally {
			loading = false
		}
	}
	// add Product to Card
	window.addProductToCart = async function (productId) {
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
	// Перевірка автентифікації
	function isLoggedIn() {
		return !!localStorage.getItem("jwt_token");
	}

	// Видалення продукту
	window.deleteProduct = async function (productId) {
		if(confirm('Are you sure you want to delete product?')){
			try {
				RequestManager.deleteRequest(`${API_BASE}/products/`, productId)
				loadProducts() // Оновлення списку продуктів
			} catch (error) {
				console.error("Error deleting product:", error)
			}
		}
	}



	 // Додавання селектора сортування
	 priceOrderSelector = new PriceOrderSelector(
		'.price-order-container',
		async () => {
			productList.innerHTML = ""
			pageData.currentPage = 0
	 		await loadProducts()
		})

	 //----------------------
	 // Отримання даних продуктів з сервера
	 const resFiltersData = await ProductsApiManager.getFiltersData()
	 console.log('resFiltersData ====>',resFiltersData)
	 
	 if (resFiltersData?.data) {
		const filtersConfig = [
		  {
			 name: 'title',
			 title: 'Name',
			 type: 'search',
		  },
		  {
			 name: 'price',
			 title: 'Price',
			 type: 'range',
			 options: { min: 0, max: 1000 },
		  },
		  {
			 title: 'Distributor',
			 name: 'provider',
			 type: 'selectMany',
			 options: resFiltersData.data.providers.map((item) => ({
				title: item.title,
				value: item._id,
			 })),
		  },
		]

		filtersManager = new FiltersManager(
			filtersConfig,
			'.filters-container',
			async () => {
				productList.innerHTML = ""
				pageData.currentPage = 0
			  await loadProducts()
			}
		 )
	 }

	// Початкове завантаження
	loadProducts()

	window.addEventListener('scroll', () => {
		if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
			loadProducts()
		}
	})
})

    /*
Цей вираз використовується для визначення, чи користувач прокрутив сторінку до кінця або майже до кінця. Ось пояснення кожного значення:

- window.innerHeight: Висота видимої області вікна браузера (висота вікна перегляду).
- window.scrollY: Відстань, на яку сторінка була прокручена вертикально від верхньої частини.
- document.body.offsetHeight: Повна висота документа, включаючи видиму частину та ту, що знаходиться за межами видимої області (висота всього контенту на сторінці).
- 100: Відступ у 100 пікселів від нижньої частини документа. Це робиться для того, щоб завантаження нових даних починалося трохи раніше, ніж користувач досягне самого кінця сторінки.
 */