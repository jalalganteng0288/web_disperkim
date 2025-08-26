// =================================================================
// AUTH (Authentication) Module
// Menangani login, logout, dan manajemen sesi pengguna.
// =================================================================
import { api } from './api.js';

export function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = event.target.email.value;
            const password = event.target.password.value;
            const loginButton = document.getElementById('loginButton');

            // Tampilkan loading
            loginButton.textContent = 'Memproses...';
            loginButton.disabled = true;

            try {
                // Panggil fungsi login dari api.js
                const user = await api.login(email, password);

                // Jika berhasil, simpan data user ke sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify(user));

                // Arahkan ke halaman utama aplikasi
                window.location.href = 'index.html';

            } catch (error) {
                // Jika gagal, tampilkan pesan error
                alert(error);
                loginButton.textContent = 'Masuk';
                loginButton.disabled = false;
            }
        });
    }
}

export function checkSession() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        // Jika tidak ada data user, tendang kembali ke halaman login
        alert('Anda harus login untuk mengakses halaman ini.');
        window.location.href = 'login.html';
        return false;
    }
    return true; // Sesi valid
}

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

export function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Hapus data user dari session
        sessionStorage.removeItem('currentUser');
        // Arahkan kembali ke halaman login
        window.location.href = 'login.html';
    }
}