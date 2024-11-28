// Клас для керування запитами на аутентифікацію
class LoginApiManager {
	static async login(data, callback) {
	  return RequestManager.doPostRequest(
		 '/auth/login',
		 data,
		 '../index.html',
		 callback,
		 false
	  )
	}
	static async signup(data, callback) {
	  return RequestManager.doPostRequest(
		 '/auth/signup',
		 data,
		 '../index.html',
		 callback,
		 false
	  )
	}
 }