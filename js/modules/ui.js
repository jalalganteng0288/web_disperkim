// =================================================================
// UI (User Interface) Module
// Berisi semua fungsi untuk memanipulasi DOM dan tampilan.
// =================================================================

const ui = {
    // Fungsi untuk menampilkan modal
    showModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },

    // Fungsi untuk menyembunyikan modal
    hideModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    },

    // Fungsi untuk menampilkan notifikasi
    showNotification: (message, type = 'info') => {
        const notification = document.getElementById('notification');
        const content = document.getElementById('notificationContent');
        if (notification && content) {
            content.textContent = message;
            notification.className = `notification notification-${type}`;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    },
    
    // Fungsi untuk merender tabel pengguna
    renderUsersTable: (users) => {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = users.map(user => `
            <tr>
                <td><input type="checkbox" value="${user.id}"></td>
                <td>${user.nama}</td>
                <td>${user.email}</td>
                <td>${user.nik}</td>
                <td>${user.telepon}</td>
                <td><span class="badge badge-info">${user.role}</span></td>
                <td><span class="badge badge-${user.status === 'Aktif' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" title="Edit" onclick="app.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" title="Hapus" onclick="app.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" title="Reset Password" onclick="app.resetPassword(${user.id})">
                        <i class="fas fa-key"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // Fungsi untuk merender tabel pengaduan
    renderComplaintsTable: (complaints) => {
        const tableBody = document.getElementById('complaintsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = complaints.map(complaint => `
            <tr>
                <td>${complaint.id}</td>
                <td>${complaint.judul}</td>
                <td>${complaint.pelapor}</td>
                <td><span class="badge badge-info">${ui.getCategoryText(complaint.kategori)}</span></td>
                <td>${complaint.lokasi}</td>
                <td><span class="badge badge-${ui.getStatusBadgeClass(complaint.status)}">${ui.getStatusText(complaint.status)}</span></td>
                <td>${ui.formatDate(complaint.tanggal)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" title="Detail" onclick="app.viewComplaintDetail('${complaint.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-success" title="Cetak">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // --- Helper Functions ---
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    },

    getStatusText: (status) => {
        const map = { baru: 'Baru Masuk', verifikasi: 'Diverifikasi', proses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
        return map[status] || status;
    },

    getStatusBadgeClass: (status) => {
        const map = { baru: 'info', verifikasi: 'warning', proses: 'warning', selesai: 'success', ditolak: 'danger' };
        return map[status] || 'info';
    },

    getCategoryText: (category) => {
        const map = { jalan: 'Jalan Rusak', drainase: 'Drainase', lampu: 'Lampu Jalan', trotoar: 'Trotoar', lainnya: 'Lainnya' };
        return map[category] || category;
    }
};