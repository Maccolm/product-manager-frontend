document.addEventListener('DOMContentLoaded', () => {
	const productForm = document.getElementById('product-form');
	const providerSelect = document.getElementById('provider');
	const errorsContainer = document.getElementById('errors-container');
	const formTitle = document.getElementById('form-title');
	const imgPreview = document.getElementById('imgPreview');
 
	// Динамічні дані (можна замінити на дані, отримані через API)
	const product = null; // Якщо редагування, додайте об'єкт продукту
	const providers = [
	  { _id: '1', title: 'Provider 1' },
	  { _id: '2', title: 'Provider 2' },
	];
	const errors = [];
 
	// Ініціалізація форми
	const initForm = () => {
	  // Заповнення полів, якщо це редагування
	  if (product) {
		 formTitle.textContent = 'Edit Product';
		 productForm.elements.title.value = product.title || '';
		 productForm.elements.amount.value = product.amount || '';
		 productForm.elements.price.value = product.price || '';
		 productForm.elements.info.value = product.info || '';
		 productForm.elements.including.value = product.including || '';
		 productForm.elements.numStems.value = product.numStems || '';
	  }
 
	  // Динамічно заповнюємо список провайдерів
	  providers.forEach(provider => {
		 const option = document.createElement('option');
		 option.value = provider._id;
		 option.textContent = provider.title;
		 providerSelect.appendChild(option);
	  });
 
	  // Відображення попередніх помилок
	  displayErrors(errors);
	};
 
	// Відображення помилок
	const displayErrors = (errors) => {
	  errorsContainer.innerHTML = '';
	  if (errors.length > 0) {
		 const ul = document.createElement('ul');
		 errors.forEach(error => {
			const li = document.createElement('li');
			li.className = 'error__msg';
			li.textContent = error.msg;
			ul.appendChild(li);
		 });
		 errorsContainer.appendChild(ul);
	  }
	};
 
	// Прев'ю завантаженого зображення
	const previewImage = (event) => {
	  const file = event.target.files[0];
	  if (file) {
		 const reader = new FileReader();
		 reader.onload = (e) => {
			imgPreview.src = e.target.result;
		 };
		 reader.readAsDataURL(file);
	  }
	};
 
	// Обробка форми
	productForm.addEventListener('submit', (e) => {
	  e.preventDefault();
 
	  // Отримання даних форми
	  const formData = new FormData(productForm);
	  const formObject = Object.fromEntries(formData.entries());
 
	  console.log('Form Submitted:', formObject);
 
	  // Валідація або відправка на сервер
	  // Наприклад, відправка через fetch:
	  // fetch('/api/products', {
	  //   method: 'POST',
	  //   body: formData,
	  // }).then(response => console.log(response));
	});
 
	initForm();
 });
 