class HeaderManager {
	constructor(currentPath, menuItems) {
	  this.currentPath = currentPath;
	  this.menuItems = menuItems;
	  this.init();
	}
 
	// Метод для створення кнопок залежно від стану автентифікації
	createMenu() {
	  const content = document.getElementById("mainMenu");
 
	  const user = RequestManager.isAuthenticated(); // Отримуємо користувача з localStorage або API
	  const buttons = [
		 { text: "About us", href: "about.html" },
		 { text: "Products", href: "pages/products/list.html" },
		 ...(user ? [{ text: "Add product", href: "/products/create" }] : []),
		 { text: "Users", href: "/users" },
		 user
			? { text: `Logout (${user.username})`, href: "/auth/logout" }
			: { text: "Login", href: "/auth/login" },
	  ];
 
	  buttons.forEach(({ text, href }) => {
		 const btn = document.createElement("a");
		 btn.textContent = text;
		 btn.href = href;
		 btn.className = "product__btn";
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
 