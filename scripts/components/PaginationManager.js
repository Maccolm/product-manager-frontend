class PaginationManager {
	/**
	 * Конструктор класу PaginationManager
	 * @param {Object} options - Об'єкт з параметрами для ініціалізації
	 * @param {number} options.totalItemsNumber - Загальна кількість елементів
	 * @param {number} options.itemsPerPage - Кількість елементів на сторінці
	 * @param {number} options.currentPage - Номер поточної сторінки (починаючи з 0)
	 * @param {string} options.containerSelector - Селектор контейнера для рендерингу пагінації
	 * @param {function} options.onClick - Функція зворотного виклику, яка буде викликана при зміні сторінки
	 */
	constructor({
	  totalItemsNumber,
	  itemsPerPage,
	  currentPage,
	  containerSelector,
	  onClick,
	}) {
	  // Зберігаємо параметри
	  this.totalItemsNumber = totalItemsNumber
	  this.itemsPerPage = itemsPerPage
	  this.currentPage = currentPage
	  // Обчислюємо загальну кількість сторінок
	  this.totalPages = Math.ceil(totalItemsNumber / itemsPerPage)
	  this.containerSelector = containerSelector
	  this.onClick = onClick
	  
	  // Рендеримо пагінацію
	  this.render()
	}
 
	/**
	 * Рендерить елементи пагінації в контейнер
	 */
	render() {
	  // Отримуємо контейнер для рендерингу
	  const container = document.querySelector(this.containerSelector)
	  // Очищаємо вміст контейнера
	  container.innerHTML = ''
 
	  // Створюємо список для елементів пагінації
	  const ul = document.createElement('ul')
	  ul.classList.add('pagination')
 
	  // Додаємо кнопку "Попередня"
	  this.prevLi = document.createElement('li')
	  const prevLink = document.createElement('a')
	  prevLink.href = '#'
	  prevLink.textContent = 'Previous'
	  this.prevLi.className = this.currentPage === 0 ? 'disabled' : ''
	  this.prevLi.addEventListener('click', () => {
		 if (this.currentPage > 0) {
			this.currentPage--
			this.onClick(this.currentPage)
			this.updatePaginationStyles()
		 }
	  })
	  this.prevLi.append(prevLink)
	  ul.append(this.prevLi)
 
	  // Додаємо кнопки сторінок
	  this.pageLinks = []
	  for (let i = 1; i <= this.totalPages; i++) {
		 const li = document.createElement('li')
		 const link = document.createElement('a')
		 link.href = '#'
		 link.textContent = i
		 if (i === this.currentPage + 1) {
			li.classList.add('active')
		 }
		 li.addEventListener('click', () => {
			this.currentPage = i - 1
			this.onClick(this.currentPage)
			this.updatePaginationStyles()
		 })
		 li.append(link)
		 ul.append(li)
		 this.pageLinks.push(li)
	  }
 
	  // Додаємо кнопку "Наступна"
	  this.nextLi = document.createElement('li')
	  const nextLink = document.createElement('a')
	  nextLink.href = '#'
	  nextLink.textContent = 'Next'
	  this.nextLi.className =
		 this.currentPage === this.totalPages - 1 ? 'disabled' : ''
	  this.nextLi.addEventListener('click', () => {
		 if (this.currentPage + 1 < this.totalPages) {
			this.currentPage++
			this.onClick(this.currentPage)
			this.updatePaginationStyles()
		 }
	  })
	  this.nextLi.append(nextLink)
	  ul.append(this.nextLi)
 
	  // Додаємо список елементів пагінації до контейнера
	  container.append(ul)
	}
 
	/**
	 * Оновлює стилі елементів пагінації
	 */
	updatePaginationStyles() {
	  // Оновлюємо стиль активної кнопки сторінки
	  this.pageLinks.forEach((link, index) => {
		 if (index === this.currentPage) {
			link.classList.add('active')
		 } else {
			link.classList.remove('active')
		 }
	  })
 
	  // Оновлюємо стиль кнопок "Попередня" та "Наступна"
	  this.prevLi.className = this.currentPage === 0 ? 'disabled' : ''
	  this.nextLi.className =
		 this.currentPage === this.totalPages - 1 ? 'disabled' : ''
	}
 }