class ProductsApiManagerClass extends BaseApiManager {
	async getFiltersData(params) {
	  return RequestManager.fetchData(`${this.routeBase}/filters-data`)
	}
 }
 
 const ProductsApiManager = new ProductsApiManagerClass('/products', 'products')