const menuItems = [
	{ href: "index.html", text: "Main", meta: { requireAuth: false } },
	{
		href: "products/list.html",
		text: "Products",
		meta: { requireAuth: false },
	},
	{
		href: "users/list.html",
		text: "Users",
		id: "users-link",
		meta: { requireAuth: true },
	},
	{
		href: "auth/login.html",
		text: "Login",
		id: "auth-link",
		meta: { requireAuth: false },
	},
];
