class PriceOrderSelector {
	constructor(containerSelector, onChange) {
	  this.currentOrder = 'asc' // За замовчуванням сортування за зростанням ціни
	  this.onChange = onChange // Метод, який викликається при зміні вибору
	  this.render(containerSelector)
	}
 
	render(containerSelector) {
	  // Створення контейнера для випадаючого списку
	  const container = document.createElement('div')
	  container.className = 'price-order-selector'
 
	  // Створення елемента <label> для напису
	  const label = document.createElement('label')
	  label.textContent = 'Sort method:'
	  label.className = 'price-order-label'
 
	  // Створення елемента <select>
	  const select = document.createElement('select')
	  select.name = 'priceOrder'
	  select.className = 'price-order-dropdown'
 
	  // Створення опцій для сортування
	  const optionAsc = document.createElement('option')
	  optionAsc.value = 'asc'
	  optionAsc.textContent = 'Price low'
	  optionAsc.selected = this.currentOrder === 'asc'
 
	  const optionDesc = document.createElement('option')
	  optionDesc.value = 'desc'
	  optionDesc.textContent = 'Price hight'
	  optionDesc.selected = this.currentOrder === 'desc'
 
	  // Додавання опцій до <select>
	  select.append(optionAsc)
	  select.append(optionDesc)
 
	  // Додавання обробника подій для зміни вибору
	  select.addEventListener('change', (event) => {
		 this.currentOrder = event.target.value
		 if (this.onChange) {
			this.onChange()
		 }
	  })
 
	  // Додавання <label> та <select> до контейнера
	  container.append(label)
	  container.append(select)
 
	  if (containerSelector)
		 document.querySelector(containerSelector)?.append(container)
 
	  return container
	}
 }