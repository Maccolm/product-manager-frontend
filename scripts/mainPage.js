class HeaderManager {
	constructor(currentPath, menuItems) {
	  this.currentPath = currentPath;
	  this.menuItems = menuItems;
	  this.init();
	}
	// Метод для декодування даних з токена
	decodeToken(token) {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
		)
		return JSON.parse(jsonPayload)
	}
	// Метод для створення кнопок залежно від стану автентифікації
	createMenu() {
		const permissions = localStorage.getItem('permissions')		
		const userPermissions = permissions ? JSON.parse(permissions) : ''
	  const content = document.getElementById("mainMenu");
		let user
	  const token = RequestManager.isAuthenticated() // Отримуємо користувача з localStorage або API
	  if (token) {
		 user = this.decodeToken(token)
		 console.log(user);
	  }
	  const buttons = [
		 { text: "About us", href: "about.html" },
		 { text: "Products", href: "pages/products/list.html" },
		 { text: "Products scroll page", href: "pages/products/scroll-list.html" },
		 ...(RequestManager.isAuthenticated() && userPermissions.products?.create ? [{ text: "Add product", href: "pages/products/product-form.html" }] : []),
		 ...(RequestManager.isAuthenticated() && userPermissions.users?.read ? [{ text: "Users", href: "pages/users/list.html" }] : []),
		 ...(RequestManager.isAuthenticated() && userPermissions.usersTypes?.read ? [{ text: "Users Types", href: "pages/users_types/list.html" }] : []),
		 { text: "Cart", href: "pages/cart/cart.html", classNameCart: 'cart'},
		 user
			? { text: `Logout (${user.username})`, href: "/auth/logout" }
			: { text: "Login", href: "auth/login.html" },
	  ];
 
	  buttons.forEach(({ text, href, classNameCart }) => {
		 const btn = document.createElement("a");
		 btn.textContent = text
		 btn.href = href
		 btn.className = "product__btn"
		 if(classNameCart) btn.classList.add(classNameCart)
		 btn.addEventListener("click", (e) => this.handleNavigation(e, href));
		 content.appendChild(btn);
	  });
	}
 
	// Логіка для переходу між сторінками
	handleNavigation(e, href) {
	  if (href === "/auth/logout") {
		 e.preventDefault();
		 RequestManager.onLogout(); // Виклик API для виходу
		 location.reload();
	  }
	}
 
	// Ініціалізація компонента
	init() {
	  this.createMenu();
	}
 }
 