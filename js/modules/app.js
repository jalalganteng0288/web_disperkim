// =================================================================
// APP Main Controller
// Otak dari aplikasi yang menghubungkan semua modul.
// =================================================================

const app = {
    state: {
        currentPage: 'dashboard',
        users: [],
        complaints: [],
    },

    init: async () => {
        // Jika tidak di halaman login, jalankan aplikasi utama
        if (!document.getElementById('loginForm')) {
            // Cek apakah user sudah login, jika tidak, akan diarahkan ke login.html
            if (!checkSession()) return;
            
            document.getElementById('appContainer').style.display = 'flex';
            
            await app.loadStaticComponents();
            app.populateUserInfo();
            app.setupEventListeners();
            await app.navigateToPage('dashboard');
        }
    },

    loadStaticComponents: async () => {
        const [sidebarHTML, headerHTML, modalsHTML] = await Promise.all([
            fetch('components/sidebar.html').then(res => res.text()),
            fetch('components/header.html').then(res => res.text()),
            fetch('components/modals.html').then(res => res.text()),
        ]);
        document.getElementById('sidebar').innerHTML = sidebarHTML;
        document.getElementById('header').innerHTML = headerHTML;
        document.getElementById('modalsContainer').innerHTML = modalsHTML;
    },
    
    populateUserInfo: () => {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('userName').textContent = user.nama;
            document.getElementById('userRole').textContent = user.role;
            document.getElementById('dropdownUserName').textContent = user.nama;
            document.getElementById('dropdownUserEmail').textContent = user.email;
        }
    },

    setupEventListeners: () => {
        document.getElementById('sidebar').addEventListener('click', e => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                app.navigateToPage(navLink.dataset.page);
            }
        });

        document.getElementById('header').addEventListener('click', e => {
            if (e.target.closest('#sidebarToggle')) document.getElementById('sidebar').classList.toggle('collapsed');
            if (e.target.closest('#userMenu')) document.getElementById('userDropdown').classList.toggle('show');
            if (e.target.closest('#logoutButton')) logout();
            if (e.target.closest('#helpButton')) ui.showModal('helpModal');
        });
        
        document.addEventListener('click', e => {
            if (!e.target.closest('#userMenu')) {
                document.getElementById('userDropdown')?.classList.remove('show');
            }
        });
    },

    navigateToPage: async (page) => {
        if (!page) return;
        app.state.currentPage = page;
        const contentEl = document.getElementById('content');
        
        contentEl.innerHTML = '<p>Loading...</p>';

        try {
            const response = await fetch(`components/pages/${page}.html`);
            if (!response.ok) throw new Error('Halaman tidak ditemukan');
            contentEl.innerHTML = await response.text();

            const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
            document.getElementById('pageTitle').textContent = navLink.textContent.trim();
            
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
            
            app.loadPageSpecificScript(page);
        } catch (error) {
            contentEl.innerHTML = `<p>Error: Halaman ${page} tidak dapat dimuat.</p>`;
        }
    },

    loadPageSpecificScript: async (page) => {
        switch (page) {
            case 'dashboard':
                const [users, complaints] = await Promise.all([api.getUsers(), api.getComplaints()]);
                app.state.users = users;
                app.state.complaints = complaints;
                document.getElementById('totalUsers').textContent = users.length;
                document.getElementById('totalComplaints').textContent = complaints.length;
                // Logika lain untuk dashboard...
                break;
            case 'users':
                app.state.users = await api.getUsers();
                ui.renderUsersTable(app.state.users);
                break;
            case 'complaints':
                app.state.complaints = await api.getComplaints();
                ui.renderComplaintsTable(app.state.complaints);
                break;
        }
    },
};

// Jalankan aplikasi
app.init();