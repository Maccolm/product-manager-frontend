class BaseApiManager {
	constructor(routeBase = '') {
	  this.routeBase = routeBase
	}
	async getList(params) {
	  let route = this.routeBase
	  if (params) {
		 const querySearch = Object.keys(params)
			.map((key) => `${key}=${params[key]}`)
			.join('&')
		 route = `${route}?${querySearch}`
	  }
	  return RequestManager.fetchData(route)
	}
 
	async getListWithQuery(querySearch) {
	  let route = this.routeBase
	  if (querySearch) {
		 route = `${route}?${querySearch}`
	  }
	  return RequestManager.fetchData(route)
	}
 
	async getById(id) {
	  return RequestManager.fetchData(`${this.routeBase}/${id}`)
	}
 
	async getBasedOnQueryId() {
	  const id = RequestManager.getQueryParam('id')
	  if (id) return this.getById(id)
	  else return {}
	}
 
	async add(data) {
	  return RequestManager.postRequest(`${this.routeBase}/register/`, data)
	}
 
	async update(id, data) {
	  return RequestManager.postRequest(`${this.routeBase}/register/${id}`, data)
	}
 
	async register(data, dataObj) {
	  if (dataObj?._id) return this.update(dataObj?._id, data)
	  else return this.add(data)
	}
 
	async delete(id) {
	  return RequestManager.deleteRequest(this.routeBase, id)
	}
 
	showErrors(errors, errorsContainerSelector = '#errors') {
	  RequestManager.showErrors(errors, errorsContainerSelector)
	}
 }