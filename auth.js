// ====================== AUTHENTICATION SYSTEM ======================
// Velocity Motors - Simple Client-side Auth (localStorage based)

const AUTH_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin",
    email: "admin@velocitymotors.pk"
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    role: "user",
    name: "Customer",
    email: "user@example.com"
  },
  {
    id: 3,
    username: "ali",
    password: "ali123",
    role: "user",
    name: "Ali Khan",
    email: "ali@example.com"
  }
];

// Get current logged-in user
function getCurrentUser() {
  const userStr = localStorage.getItem("vm_user");
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Check if current user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

// Login function
function login(username, password) {
  const user = AUTH_USERS.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (user) {
    // Don't store password
    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    };
    localStorage.setItem("vm_user", JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }
  return { success: false, message: "Invalid username or password" };
}

// Logout function
function logout() {
  localStorage.removeItem("vm_user");
  window.location.href = "login.html";
}

// Protect page - redirect if not logged in
function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.pathname);
  }
}

// Protect admin page
function requireAdmin() {
  if (!isLoggedIn()) {
    window.location.href = "login.html?redirect=admin.html";
    return;
  }
  if (!isAdmin()) {
    alert("Access Denied! Admin only.");
    window.location.href = "index.html";
  }
}

// Update navbar based on login status
function updateNavbar() {
  const user = getCurrentUser();
  const authArea = document.getElementById("auth-area");
  const mobileAuthArea = document.getElementById("mobile-auth-area");

  if (!authArea) return;

  if (user) {
    const adminLink = user.role === "admin" 
      ? `<a href="admin.html" class="text-sm font-medium hover:text-accent transition text-yellow-400">Admin Panel</a>` 
      : "";

    authArea.innerHTML = `
      <div class="flex items-center gap-4">
        ${adminLink}
        <span class="text-sm text-gray-300">
          <i class="fas fa-user-circle mr-1"></i> ${user.name}
        </span>
        <button onclick="logout()" class="text-sm border border-gray-600 px-4 py-1.5 rounded-full hover:border-accent hover:text-accent transition">
          Logout
        </button>
      </div>
    `;

    if (mobileAuthArea) {
      mobileAuthArea.innerHTML = `
        <div class="border-t border-gray-700 pt-3 mt-3">
          <p class="text-sm text-gray-400 mb-2">Logged in as <strong class="text-white">${user.name}</strong></p>
          ${user.role === "admin" ? '<a href="admin.html" class="block py-2 text-yellow-400">Admin Panel</a>' : ""}
          <button onclick="logout()" class="block w-full text-left py-2 text-red-400">Logout</button>
        </div>
      `;
    }
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="text-sm font-medium hover:text-accent transition">Login</a>
      <a href="login.html" class="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">Sign In</a>
    `;

    if (mobileAuthArea) {
      mobileAuthArea.innerHTML = `
        <a href="login.html" class="block py-2 hover:text-accent">Login / Sign In</a>
      `;
    }
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
});
