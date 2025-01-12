document.addEventListener("DOMContentLoaded", async () => {
	const API_BASE = RequestManager.apiBase;
	const productList = document.getElementById("productList");
	let pageData = {}
	let priceOrderSelector, filtersManager
	 //функція застосування фільтрів
	 function getFiltersQueryString() {
		const queryOptions = [
		  `page=${pageData.currentPage ?? 0}`,
		  `perPage=${pageData.perPage ?? 4}`,
		]
		// Отримуємо параметр 'provider' з URL
		const urlParams = new URLSearchParams(window.location.search)
		const providerId = urlParams.get('provider')
		// Якщо параметр 'provider' в URL вказаний, додаємо його до запиту
		//Для випадку, коли користувач перейшов за посиланням постачальника в його корзині товарів і тоді показуємо йому всі товари цього постачальника
		if (providerId) queryOptions.push(`provider=${providerId}`)
		const filtersQueryString = filtersManager.getQueryString()
		if (filtersQueryString) queryOptions.push(filtersQueryString)

		queryOptions.push(`sort=price:${priceOrderSelector.currentOrder}`)
		return queryOptions.join('&')
	 }

	// Завантажити продукти
	async function loadProducts(page = 0) {
		console.log(ProductsApiManager.permissions);
		
		try {
			if(Number.isFinite(page)) pageData.currentPage = page
			const resData = await ProductsApiManager.getListWithQuery(getFiltersQueryString())
			let products = resData.data?.documents
			console.log('resData====>', resData)
			
			pageData = {
				...pageData,
				totalItemsNumber: resData.data?.count,
			 }

			// Очищення попередніх продуктів
			productList.innerHTML = "";

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
					RequestManager.isAuthenticated() && ProductsApiManager.permissions?.update
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
					RequestManager.isAuthenticated() ? `<button id='buy-btn' onclick="addProductToCart('${product._id}')" class="product__btn cart">Add To Cart</button>` : ''
				}
			`
				productList.append(productContainer)
				 //------------- додавання пагінації -----
				setupPagination()
			});
		} catch (error) {
			console.error("Error loading products:", error);
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

	// Видалення продукту
	window.deleteProduct = async function (productId) {
		if(confirm('Are you sure you want to delete product?')){
			try {
				await RequestManager.deleteRequest(`${API_BASE}/products/`, productId)
				loadProducts() // Оновлення списку продуктів
			} catch (error) {
				console.error("Error deleting product:", error)
			}
		}
	}
	if(document.querySelector('.price-order-container')){
		// Додавання селектора сортування
		priceOrderSelector = new PriceOrderSelector(
		  '.price-order-container',
		  () => loadProducts(0)
		)
	}

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
		  // {
		  //   title: 'Тип продавця',
		  //   name: 'type',
		  //   type: 'dropdown',
		  //   options: resFiltersData.data.types.map((item) => ({
		  //     title: item.title,
		  //     value: item._id,
		  //   })),
		  // },
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

		if(document.querySelector('.filters-container')) {
			filtersManager = new FiltersManager(
				filtersConfig,
				'.filters-container',
				async () => {
				  await loadProducts(0)
				  //------------- додавання пагінації -----
				 setupPagination()
				}
			 )
		 }
		}

	// --------add Pagination --------
	function setupPagination() {
		new PaginationManager({
			totalItemsNumber: pageData.totalItemsNumber,
			itemsPerPage: 4,
			currentPage: pageData.currentPage ?? 0,
			containerSelector: '#pagination',
			onClick: async (page) => {
			  await loadProducts(page)
			},
		 })
	}

		// Початкове завантаження
		loadProducts(0)
})

