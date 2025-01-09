class ObjectUtils {
	// Метод для отримання значення властивості, якщо вона існує
	static getPropertyValueIfExists(obj, path) {
	  return path
		 .split('.')
		 .reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj)
	}
 
	// Метод для встановлення значення властивості, якщо вона існує
	static setPropertyValueIfExists(obj, path, value) {
	  const keys = path.split('.')
	  let current = obj
 
	  for (let i = 0; i < keys.length - 1; i++) {
		 if (!(keys[i] in current)) current[keys[i]] = {}
		 current = current[keys[i]]
	  }
 
	  current[keys[keys.length - 1]] = value
	}
 
	// Метод для перетворення об'єкта з вкладеними властивостями у плоский об'єкт
	static formNestedToFlatObject(obj, parentKey = '', result = {}) {
	  for (let key in obj) {
		 if (obj.hasOwnProperty(key)) {
			const fullKey = parentKey ? `${parentKey}.${key}` : key
			if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
			  this.formNestedToFlatObject(obj[key], fullKey, result)
			} else {
			  result[fullKey] = obj[key]
			}
		 }
	  }
	  return result
	}
 
	// Метод для перетворення плоского об'єкта у об'єкт з вкладеними властивостями
	static fromFlatToNestedObject(flatObj) {
	  const result = {}
	  for (let key in flatObj) {
		 if (flatObj.hasOwnProperty(key)) {
			this.setPropertyValueIfExists(result, key, flatObj[key])
		 }
	  }
	  return result
	}
 }
 
 // // Приклад використання:
 // const nestedObj = {
 //   myProperty: 'value',
 //   pagesPermissions: {
 //     products: {
 //       delete: false,
 //     },
 //   },
 // }
 
 // const flatObj = ObjectUtil.formNestedToFlatObject(nestedObj)
 // console.log(flatObj)
 // // { 'myProperty': 'value', 'pagesPermissions.products.delete': false }
 
 // const restoredObj = ObjectUtil.fromFlatToNestedObject(flatObj)
 // console.log(restoredObj)
 // // { myProperty: 'value', pagesPermissions: { products: { delete: false } } }
 