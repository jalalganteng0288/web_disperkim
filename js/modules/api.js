// =================================================================
// API (Application Programming Interface) Module
// Bertindak sebagai backend/database palsu untuk aplikasi kita.
// =================================================================

// Data Sampel Pengguna (Users)
const sampleUsers = [
    {
        id: 1,
        nama: 'Admin User',
        email: 'admin@disperkim.garut.go.id',
        password: 'password', // Di aplikasi nyata, password harus di-hash
        nik: '1234567890123456',
        telepon: '081234567890',
        role: 'Super Admin',
        status: 'Aktif',
        created_at: '2024-01-15'
    },
    {
        id: 2,
        nama: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        nik: '1234567890123457',
        telepon: '081234567891',
        role: 'Operator',
        status: 'Aktif',
        created_at: '2024-01-16'
    },
    {
        id: 3,
        nama: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        nik: '1234567890123458',
        telepon: '081234567892',
        role: 'User',
        status: 'Tidak Aktif',
        created_at: '2024-01-17'
    }
];

// Data Sampel Pengaduan (Complaints)
const sampleComplaints = [
    {
        id: 'ADU001',
        judul: 'Jalan Berlubang di Jl. Merdeka',
        pelapor: 'Ahmad Suryadi',
        kategori: 'jalan',
        lokasi: 'Jl. Merdeka No. 123, Garut',
        status: 'baru',
        tanggal: '2024-01-20',
        deskripsi: 'Jalan berlubang besar yang membahayakan pengendara',
        telepon_pelapor: '081234567893',
        photos: ['photo1.jpg', 'photo2.jpg']
    },
    {
        id: 'ADU002',
        judul: 'Lampu Jalan Mati',
        pelapor: 'Siti Nurhaliza',
        kategori: 'lampu',
        lokasi: 'Jl. Sudirman, Garut',
        status: 'proses',
        tanggal: '2024-01-19',
        deskripsi: 'Lampu jalan sudah mati selama 3 hari',
        telepon_pelapor: '081234567894',
        photos: ['photo3.jpg']
    },
    {
        id: 'ADU003',
        judul: 'Drainase Tersumbat',
        pelapor: 'Budi Santoso',
        kategori: 'drainase',
        lokasi: 'Jl. Ahmad Yani, Garut',
        status: 'selesai',
        tanggal: '2024-01-18',
        deskripsi: 'Drainase tersumbat sampah menyebabkan banjir',
        telepon_pelapor: '081234567895',
        photos: ['photo4.jpg', 'photo5.jpg']
    }
];


// Objek API untuk diekspor
const api = {
    // Fungsi untuk mendapatkan semua pengguna
    getUsers: () => {
        // Mensimulasikan pengambilan data dari server
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(sampleUsers);
            }, 500); // delay 0.5 detik
        });
    },

    // Fungsi untuk mendapatkan semua pengaduan
    getComplaints: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(sampleComplaints);
            }, 500);
        });
    },
    
    // Fungsi untuk memverifikasi login
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = sampleUsers.find(u => u.email === email && u.password === password);
                if (user) {
                    // Jangan kirim password ke frontend
                    const { password, ...userWithoutPassword } = user;
                    resolve(userWithoutPassword);
                } else {
                    reject('Email atau password salah.');
                }
            }, 1000); // delay 1 detik untuk simulasi loading
        });
    }
};

// Jika ada file api.js lain yang ingin digabungkan, bisa dilakukan di sini.
// Namun untuk sekarang, kita hanya gunakan objek 'api' ini.