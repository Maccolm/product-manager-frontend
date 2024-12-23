class CartApiManagerClass extends BaseApiManager {
	async addToCart(productId) {
		
	  return RequestManager.postRequest(this.routeBase, { productId })
	}
	async updateProductsAmount(productId, amount) {
	  return RequestManager.putRequest(this.routeBase, {
		 productId,
		 amount,
	  })
	}
 }
 
 const CartApiManager = new CartApiManagerClass(`/cart`)