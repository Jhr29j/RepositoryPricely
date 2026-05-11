// Verificar autenticación al cargar
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (token && user) {
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userName) userName.textContent = `Hola, ${user.nombre}`;
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Cerrar sesión
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/index.html';
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupLogout();
});