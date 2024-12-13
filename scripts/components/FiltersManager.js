// Реалізація різних типів фільтрів для веб-додатків.
// Опис класів:
// - BaseFilter: Базовий клас для всіх типів фільтрів
// - RangeFilter: Фільтр для діапазону значень
// - DropdownFilter: Фільтр у вигляді випадаючого списку
// - SelectOneFilter: Фільтр для вибору одного варіанту
// - SelectManyFilter: Фільтр для вибору декількох варіантів
// - SearchFilter: Фільтр для пошуку
// - FiltersManager: Клас для управління всіма фільтрами

//----- Базовий клас -----
// Базовий клас для всіх типів фільтрів
class BaseFilter {
	constructor(filterConfig, onChange) {
	  // Конфігурація фільтра (filterConfig)
	  this.filterConfig = filterConfig
 
	  // Функція зворотного виклику, яка буде викликана при зміні фільтра (onChange)
	  this.onChange = onChange
 
	  // Поточне значення, вибране користувачем (currentValue)
	  this.currentValue = null
 
	  // Посилання на елементи HTML-вводу, що використовуються фільтром (inputs)
	  this.inputs = {}
	}
 
	// Абстрактний метод, який повинен бути реалізований підкласами для візуалізації HTML-елемента фільтра (render)
	render() {
	  throw new Error(
		 'Метод render() має бути реалізований у підкласах (The render() method must be implemented by subclasses)'
	  )
	}
 
	// Відображає елемент фільтра та додає прослухача подій для змін (renderFilterElement)
	renderFilterElement(containerSelector) {
	  // Викликає абстрактний метод render() для отримання HTML-розмітки фільтра
	  const filterElement = this.render()
 
	  // Додає клас 'filter' до елемента
	  filterElement.classList.add('filter')
 
	  // Додає прослухача подій для змін на елементі фільтра
	  filterElement.addEventListener('change', (event) => {
		 // Викликає updateFilterData() з ім'ям та значенням зміненого елемента
		 this.updateFilterData(event.target.name, event.target.value)
	  })
 
	  // Зберігає посилання на елемент фільтра
	  this.filterElement = filterElement
 
	  // Якщо надано селектор контейнера, додає елемент до цього контейнера
	  if (containerSelector) {
		 document.querySelector(containerSelector)?.append(filterElement)
	  }
 
	  // Повертає елемент фільтра
	  return filterElement
	}
 
	// Оновлює currentValue на основі зміненого значення вводу та запускає зворотній виклик onChange (updateFilterData)
	updateFilterData(name, value) {
	  // Оновлює currentValue новим значенням
	  this.currentValue = value
 
	  // Викликає зворотній виклик onChange, щоб повідомити про зміну фільтра
	  this.onChange()
	}
 
	// Очищає фільтр, скидаючи значення currentValue та елементів вводу (clear)
	clear() {
	  // Скидає значення currentValue до null
	  this.currentValue = null
 
	  // Перебирає всі елементи вводу та встановлює їх значення порожніми рядками
	  Object.values(this.inputs).forEach((input) => (input.value = ''))
	}
 
	// Генерує рядок запиту для фільтра на основі поточного значення (getQueryString)
	getQueryString() {
	  // Якщо є поточне значення, формуємо рядок запиту у форматі "ім'я_фільтра=значення"
	  if (this.currentValue) {
		 return `${this.filterConfig.name}=${this.currentValue}`
	  }
 
	  // Якщо немає поточного значення, повертаємо порожній рядок
	  return ''
	}
 }
 
 //-------- Клас для фільтра діапазону: -----
 class RangeFilter extends BaseFilter {
	// Метод для візуалізації HTML-елемента фільтра діапазону (render)
	render() {
	  // Витягує властивості конфігурації фільтра (min, max, name, title)
	  const { min, max, name, title } = this.filterConfig
 
	  // Створює контейнерний елемент для фільтра
	  const container = document.createElement('div')
 
	  // Встановлює внутрішній HTML-код контейнера з мітками та полями вводу для мінімального та максимального значень
	  container.innerHTML = `
		 <label>${title ?? name}:</label>
		 <input type="number" min="${min}" max="${max}" name="${name}_min" placeholder="Від (From)">
		 <input type="number" min="${min}" max="${max}" name="${name}_max" placeholder="До (To)">
	  `
 
	  // Отримує посилання на елемент вводу для мінімального значення
	  this.inputs.min = container.querySelector(`input[name="${name}_min"]`)
 
	  // Отримує посилання на елемент вводу для максимального значення
	  this.inputs.max = container.querySelector(`input[name="${name}_max"]`)
 
	  // Повертає контейнерний елемент фільтра
	  return container
	}
 
	// Оновлює поточне значення фільтра на основі зміненого значення вводу (updateFilterData)
	updateFilterData(name, value) {
	  // Розділяє назву елемента вводу на поле (min або max) та оператор зміни значення
	  const [field, operator] = name.split('_')
 
	  // Якщо поточне значення фільтра ще не існує, ініціалізує його об'єктом з властивостями min та max (null за замовчуванням)
	  if (!this.currentValue) {
		 this.currentValue = { min: null, max: null }
	  }
 
	  // Оновлює відповідну властивість (min або max) поточного значення фільтра новим значенням
	  this.currentValue[operator] = value
 
	  // Викликає функцію зворотного виклику для повідомлення про зміну фільтра
	  this.onChange()
	}
 
	// Генерує рядок запиту для фільтра діапазону (getQueryString)
	getQueryString() {
	  // Перевіряє, чи існує поточне значення фільтра та чи хоча б одна з властивостей min або max має значення
	  if (this.currentValue && (this.currentValue.min || this.currentValue.max)) {
		 // Масив для зберігання параметрів рядка запиту
		 const queryParameters = []
 
		 // Якщо встановлено мінімальне значення, додає параметр фільтра для мінімального значення (gte - greater than or equal)
		 if (this.currentValue.min) {
			queryParameters.push(
			  `${this.filterConfig.name}=gte:${encodeURIComponent(
				 this.currentValue.min
			  )}`
			)
		 }
 
		 // Якщо встановлено максимальне значення, додає параметр фільтра для максимального значення (lte - less than or equal)
		 if (this.currentValue.max) {
			queryParameters.push(
			  `${this.filterConfig.name}=lte:${encodeURIComponent(
				 this.currentValue.max
			  )}`
			)
		 }
 
		 // Повертає рядок запиту, сформований з масиву параметрів, з'єднаних символом '&'
		 return queryParameters.join('&')
	  }
 
	  // Якщо поточне значення фільтра відсутнє або жодна з властивостей min та max не має значення, повертає порожній рядок
	  return ''
	}
 }
 
 //--------- Клас для випадаючого списку: ----------
 class DropdownFilter extends BaseFilter {
	render() {
	  const { options, name, title } = this.filterConfig
	  const container = document.createElement('div')
	  const optionsHtml = options
		 .map(
			(option) => `<option value="${option.value}">${option.title}</option>`
		 )
		 .join('')
	  container.innerHTML = `
		 <label>${title ?? name}:</label>
		 <select name="${name}_value">
			${optionsHtml}
		 </select>
	  `
	  this.inputs.select = container.querySelector(`select[name="${name}_value"]`)
	  return container
	}
 
	// updateFilterData(name, value) {
	//   this.currentValue = value
	//   this.onChange()
	// }
 
	// clear() {
	//   this.currentValue = null
	//   this.inputs.select.value = ''
	// }
 }
 
 //--------- Клас для вибору одного елемента: ----------
 class SelectOneFilter extends BaseFilter {
	render() {
	  const { options, name, title } = this.filterConfig
	  const container = document.createElement('div')
	  const optionsHtml = options
		 .map(
			(option) =>
			  `<label><input type="radio" name="${name}_value" value="${option.value}"> ${option.title}</label>`
		 )
		 .join('')
	  container.innerHTML = `
		 <label>${title ?? name}:</label>
		 ${optionsHtml}
	  `
	  this.inputs.radios = container.querySelectorAll(
		 `input[name="${name}_value"]`
	  )
	  return container
	}
 
	// updateFilterData(name, value) {
	//   this.currentValue = value
	//   this.onChange()
	// }
 
	clear() {
	  this.currentValue = null
	  this.inputs.radios.forEach((radio) => (radio.checked = false))
	}
 }
 
 //--------- Клас для вибору багатьох елементів: --------
 class SelectManyFilter extends BaseFilter {
	render() {
	  const { options, name, title } = this.filterConfig
	  const container = document.createElement('div')
	  const optionsHtml = options
		 .map(
			(option) =>
			  `<label><input type="checkbox" name="${name}_value:multiple" value="${option.value}"> ${option.title}</label>`
		 )
		 .join('')
	  container.innerHTML = `
		 <label>${title ?? name}:</label>
		 ${optionsHtml}
	  `
	  this.inputs.checkboxes = container.querySelectorAll(
		 `input[name="${name}_value:multiple"]`
	  )
	  return container
	}
 
	updateFilterData(name, value) {
	  if (!this.currentValue) {
		 this.currentValue = []
	  }
	  const index = this.currentValue.indexOf(value)
	  if (index > -1) {
		 this.currentValue.splice(index, 1)
	  } else {
		 this.currentValue.push(value)
	  }
	  this.onChange()
	}
 
	clear() {
	  this.currentValue = []
	  this.inputs.checkboxes.forEach((checkbox) => (checkbox.checked = false))
	}
 
	getQueryString() {
	  if (this.currentValue && this.currentValue.length > 0)
		 return `${this.filterConfig.name}=${this.currentValue.join(',')}`
 
	  return ''
	}
 }
 
 //------- Клас для пошукового фільтра: ----------
 class SearchFilter extends BaseFilter {
	render() {
	  const { name, title } = this.filterConfig
	  const container = document.createElement('div')
	  container.innerHTML = `
		 <label>${title ?? name}:</label>
		 <input type="text" name="${name}_value">
	  `
	  this.inputs.search = container.querySelector(`input[name="${name}_value"]`)
	  return container
	}
 
	// updateFilterData(name, value) {
	//   this.currentValue = value
	//   this.onChange()
	// }
 
	// clear() {
	//   this.currentValue = ''
	//   this.inputs.search.value = ''
	// }
 }
 
 //================== Клас для менеджера фільтрів: ================
 class FiltersManager {
	constructor(filtersConfig, containerSelector, onFilterChange) {
	  this.filtersConfig = filtersConfig
	  this.container = document.querySelector(containerSelector)
	  this.onFilterChange = onFilterChange
	  this.filters = []
 
	  this.render()
	}
 
	render() {
	  // Створюємо контейнер для фільтрів
	  const filtersContainer = document.createElement('div')
	  filtersContainer.classList.add('filters-container')
 
	  // Створюємо кнопку "Очистити"
	  const clearButton = document.createElement('button')
	  clearButton.textContent = 'Очистити'
	  clearButton.addEventListener('click', () => this.clearAllFilters())
 
	  // Додаємо фільтри до контейнера
	  this.filtersConfig.forEach((filterConfig) => {
		 let filter
		 switch (filterConfig.type) {
			case 'range':
			  filter = new RangeFilter(filterConfig, this.onFilterChange)
			  break
			case 'dropdown':
			  filter = new DropdownFilter(filterConfig, this.onFilterChange)
			  break
			case 'selectOne':
			  filter = new SelectOneFilter(filterConfig, this.onFilterChange)
			  break
			case 'selectMany':
			  filter = new SelectManyFilter(filterConfig, this.onFilterChange)
			  break
			case 'search':
			  filter = new SearchFilter(filterConfig, this.onFilterChange)
			  break
			default:
			  console.warn(`Невідомий тип фільтра: ${filterConfig.type}`)
			  return
		 }
 
		 this.container.append(filter.renderFilterElement())
		 this.filters.push(filter)
	  })
 
	  this.container.append(clearButton)
	}
 
	clearAllFilters() {
	  this.filters.forEach((filter) => filter.clear())
	  this.onFilterChange()
	}
 
	getQueryString() {
	  const queryParams = this.filters
		 .map((filter) => filter.getQueryString())
		 .filter((param) => param)
		 .join('&')
	  return queryParams
	}
 }
 //==================== ПРИКЛАД ВИКОРИСТАННЯ ===================
 // const filtersManager = new FiltersManager(
 //   [
 //     //-----------  Фільтр діапазону цін ------------
 //     { type: 'range', name: 'price', title: 'Ціна', min: 0, max: 1000 },
 //     //------------ Фільтр за категорією (випадаючий список) ------------
 //     {
 //       type: 'dropdown',
 //       name: 'category',
 //       title: 'Категорія',
 //       options: [
 //         { value: 'electronics', title: 'Електроніка' },
 //         { value: 'clothing', title: 'Одяг' },
 //         { value: 'books', title: 'Книги' },
 //       ],
 //     },
 //     //------------ Фільтр за розміром (вибір одного варіанту) ------------
 //     {
 //       type: 'selectOne',
 //       name: 'size',
 //       title: 'Розмір',
 //       options: [
 //         { value: 's', title: 'S' },
 //         { value: 'm', title: 'M' },
 //         { value: 'l', title: 'L' },
 //       ],
 //     },
 //     //------------ Фільтр за кольором (вибір декількох варіантів) ------------
 //     {
 //       type: 'selectMany',
 //       name: 'color',
 //       title: 'Колір',
 //       options: [
 //         { value: 'red', title: 'Червоний' },
 //         { value: 'blue', title: 'Синій' },
 //         { value: 'green', title: 'Зелений' },
 //       ],
 //     },
 //     //------------ Фільтр за назвою товару (пошук) ------------
 //     { type: 'search', name: 'name', title: 'Назва товару' },
 //   ],
 //   '.filters-container',
 //   (queryString) => {
 //     console.log('Новий рядок запиту:', queryString);
 //     // Тут ви можете обробити отриманий рядок запиту і виконати відповідні дії,
 //     // наприклад, відправити його на сервер для отримання відфільтрованих даних
 //   }
 // )