// =================================================================
// APP Main Controller (FINAL & WORKING)
// Otak dari aplikasi yang menghubungkan semua modul.
// =================================================================

// PERBAIKAN: Pastikan semua modul yang dibutuhkan sudah di-import
import { api } from './api.js';
import { ui } from './ui.js';
import { checkSession, getCurrentUser, logout } from './auth.js';

const app = {
    // Fungsi init utama, akan dijalankan oleh index.html
    init: () => {
        app.initializeApp();
    },

    // Inisialisasi aplikasi utama setelah login
    initializeApp: async () => {
        if (!checkSession()) return; // Cek sesi, jika tidak valid, akan redirect ke login

        document.getElementById('appContainer').style.display = 'flex';
        
        await app.loadStaticComponents();
        app.populateUserInfo();
        app.setupEventListeners();
        
        const initialPage = window.location.hash.substring(1) || 'dashboard';
        await app.navigateToPage(initialPage);
    },

    // Memuat komponen HTML statis (sidebar, header, modals)
    loadStaticComponents: async () => {
        try {
            const [sidebarHTML, headerHTML, modalsHTML] = await Promise.all([
                fetch('components/sidebar.html').then(res => res.text()),
                fetch('components/header.html').then(res => res.text()),
                fetch('components/modals.html').then(res => res.text()),
            ]);
            document.getElementById('sidebar').innerHTML = sidebarHTML;
            document.getElementById('header').innerHTML = headerHTML;
            document.getElementById('modalsContainer').innerHTML = modalsHTML;
        } catch (error) {
            console.error("Gagal memuat komponen statis:", error);
        }
    },
    
    // Mengisi info user di header
    populateUserInfo: () => {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('userName').textContent = user.nama;
            document.getElementById('userRole').textContent = user.role;
            document.getElementById('dropdownUserName').textContent = user.nama;
            document.getElementById('dropdownUserEmail').textContent = user.email;
        }
    },

    // Pusat Kontrol Event Listener
    setupEventListeners: () => {
        document.body.addEventListener('click', e => {
            if (e.target.closest('#sidebarToggle')) document.getElementById('sidebar').classList.toggle('collapsed');
            if (e.target.closest('#userMenu')) document.getElementById('userDropdown').classList.toggle('show');
            if (e.target.closest('#logoutButton')) logout();
            if (e.target.closest('#helpButton')) ui.showModal('helpModal');

            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const page = navLink.dataset.page;
                if (page !== (window.location.hash.substring(1))) {
                    window.location.hash = page;
                }
            }

            const dismissButton = e.target.closest('[data-dismiss="modal"]');
            if (dismissButton) {
                const modal = dismissButton.closest('.modal');
                if(modal) ui.hideModal(modal.id);
            }
        });
        
        document.addEventListener('click', e => {
            if (!e.target.closest('#userMenu')) {
                document.getElementById('userDropdown')?.classList.remove('show');
            }
        });

        window.addEventListener('hashchange', () => {
            app.navigateToPage(window.location.hash.substring(1) || 'dashboard');
        });
    },

    // Navigasi antar halaman
    navigateToPage: async (page) => {
        const contentEl = document.getElementById('content');
        contentEl.innerHTML = '<p style="text-align:center; padding: 2rem;">Loading...</p>';

        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error(`Halaman ${page}.html tidak ditemukan`);
            
            contentEl.innerHTML = await response.text();

            const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
            if(navLink) {
                document.getElementById('pageTitle').textContent = navLink.textContent.trim();
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
            
            app.loadPageSpecificScript(page);
        } catch (error) {
            console.error("Gagal navigasi:", error);
            contentEl.innerHTML = `<p style="text-align:center; padding: 2rem; color: var(--danger-color);">Error: ${error.message}.</p>`;
        }
    },

    // Memuat data spesifik untuk halaman tertentu
    loadPageSpecificScript: async (page) => {
        switch (page) {
            case 'dashboard':
                const [users, complaints] = await Promise.all([api.getUsers(), api.getComplaints()]);
                document.getElementById('totalUsers').textContent = users.length;
                document.getElementById('totalComplaints').textContent = complaints.length;
                document.getElementById('resolvedComplaints').textContent = complaints.filter(c => c.status === 'selesai').length;
                document.getElementById('pendingComplaints').textContent = complaints.filter(c => c.status === 'baru' || c.status === 'proses').length;
                
                document.getElementById('addUserBtn')?.addEventListener('click', () => ui.showModal('addUserModal'));
                document.getElementById('addComplaintBtn')?.addEventListener('click', () => ui.showModal('addComplaintModal'));
                break;
            case 'users':
                const usersData = await api.getUsers();
                ui.renderUsersTable(usersData);
                document.getElementById('addUserModalBtn')?.addEventListener('click', () => ui.showModal('addUserModal'));
                break;
            case 'complaints':
                const complaintsData = await api.getComplaints();
                ui.renderComplaintsTable(complaintsData);
                break;
        }
    },
};

// Jalankan aplikasi
app.init();