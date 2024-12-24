class ListDataManager {
	static createTableHeader(fields, createLinkFunction, deleteFunction) {
	  const thead = document.createElement('thead')
	  const headerRow = document.createElement('tr')
 
	  for (let key in fields) {
		 const th = document.createElement('th')
		 if (typeof fields[key] === 'object') th.textContent = fields[key].title
		 else th.textContent = fields[key]
		 headerRow.append(th)
	  }
 
	  if (createLinkFunction) {
		 const editTh = document.createElement('th')
		 editTh.textContent = 'Edit'
		 headerRow.append(editTh)
	  }
	  if (deleteFunction) {
		 const deleteTh = document.createElement('th')
		 deleteTh.textContent = 'Delete'
		 headerRow.append(deleteTh)
	  }
	  thead.append(headerRow)
	  return thead
	}
 
	static createTableRow(item, fields, createLinkFunction, deleteFunction) {
	  const row = document.createElement('tr')
 
	  for (let key in fields) {
		 const td = document.createElement('td')
		 if (key === 'img' || key === 'image') {
			const link = document.createElement('a')
			link.href = fields[key].linkGetter(item)
			const img = document.createElement('img')
			img.src = fields[key].contentGetter(item)
			img.alt = fields[key]
			img.style.width = '100px' // Задайте бажану ширину зображення
			link.append(img)
			td.append(link)
		 } else if (typeof fields[key] === 'object' && fields[key].type === 'a') {
			td.innerHTML = `<a href = "${fields[key].linkGetter(item)}">${fields[
			  key
			].contentGetter(item)}</a>`
		 } else if (
			typeof fields[key] === 'object' &&
			fields[key].type === 'button'
		 ) {
			const btn = document.createElement('button')
			btn.onclick = fields[key].onClick.bind(null, item)
			btn.innerText = fields[key].contentGetter(item)
			btn.className = 'product__btn'
			if (fields[key].isDisabled?.(item)) {
			  btn.setAttribute('disabled', true)
			}
			td.append(btn)
		 } else if (typeof fields[key] === 'object') {
			//повертаємо сторінку з продуктами по постачальнику
			const link = document.createElement('a')
			link.href = `../products/list.html?provider=${item.details.provider._id}`
			link.textContent = ListDataManager.capitalizeFirstLetter(item.details.provider.title)
			td.append(link)
		} else {
			td.textContent = item[key]
		 }
		 row.append(td)
	  }
 
	  if (createLinkFunction) {
		 const editTd = document.createElement('td')
		 const editLink = document.createElement('a')
		 editLink.href = createLinkFunction(item._id)
		 editLink.textContent = 'Edit'
		 editTd.append(editLink)
		 row.append(editTd)
	  }
	  if (deleteFunction) {
		 const deleteTd = document.createElement('td')
		 const deleteButton = document.createElement('button')
		 deleteButton.textContent = 'Delete'
		 deleteButton.className = 'product__btn'
		 deleteButton.onclick = () => deleteFunction(item.details._id)
		 deleteTd.append(deleteButton)
		 row.append(deleteTd)
	  }
	  return row
	}
	static capitalizeFirstLetter(string) {
		if(!string) return ''
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
	static createTableFromList(data, fields, createLinkFunction, deleteFunction) {
	  // Створення таблиці
	  const table = document.createElement('table')
	  table.className = 'cart-table'
 
	  // Створення заголовку таблиці
	  const thead = this.createTableHeader(
		 fields,
		 createLinkFunction,
		 deleteFunction
	  )
	  table.append(thead)
 
	  // Створення тіла таблиці
	  const tbody = document.createElement('tbody')
 
	  data.forEach((item) => {
		 const row = this.createTableRow(
			item,
			fields,
			createLinkFunction,
			deleteFunction
		 )
		 tbody.append(row)
	  })
 
	  table.append(tbody)
 
	  // Виведення таблиці на сторінку
	  return table
	}
 }