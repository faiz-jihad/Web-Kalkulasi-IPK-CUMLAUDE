# 🎓 Web Kalkulasi IPK & Predikat Kelulusan (CUMLAUDE)

[![GitHub license](https://img.shields.io/github/license/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE)](https://github.com/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE)](https://github.com/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE/network/members)

Aplikasi web sederhana untuk membantu mahasiswa menghitung **Indeks Prestasi Kumulatif (IPK)** mereka dan memprediksi predikat kelulusan, termasuk kriteria **Cumlaude**, **Magna Cumlaude**, dan **Summa Cumlaude**.

---

## 💡 Fitur Utama

* **Kalkulasi IPK Akurat:** Hitung IPK berdasarkan input nilai mata kuliah (huruf) dan Satuan Kredit Semester (SKS).
* **Prediksi Predikat Kelulusan:** Secara otomatis menampilkan predikat kelulusan yang berpotensi diraih (Pujian/Cumlaude, Sangat Memuaskan, Memuaskan, dsb.) sesuai IPK yang dihasilkan.
* **Antarmuka Sederhana:** Desain yang **mudah digunakan** dan **responsif** sehingga dapat diakses melalui berbagai perangkat.
* **Multi-Input:** Mendukung penambahan baris mata kuliah untuk perhitungan kumulatif.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi web dasar:

* **HTML:** Struktur dasar halaman web.
* **CSS:** Styling dan tampilan.
* **JavaScript:** Logika perhitungan IPK dan interaktivitas.

---

## 🚀 Cara Menggunakan

### 1. **Akses Langsung (Rekomendasi)**

Anda dapat mencoba aplikasi ini secara langsung melalui:

https://ipkcalculate.vercel.app/

### 2. **Instalasi Lokal**

Untuk menjalankan proyek ini di komputer lokal Anda:

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE.git](https://github.com/faiz-jihad/Web-Kalkulasi-IPK-CUMLAUDE.git)
    ```
2.  **Masuk ke Direktori Proyek:**
    ```bash
    cd Web-Kalkulasi-IPK-CUMLAUDE
    ```
3.  **Buka File `index.html`:**
    Cukup buka file `index.html` di browser web pilihan Anda.

### 3. **Input Data**

1.  Masukkan **Nama Mata Kuliah** (opsional).
2.  Pilih **Nilai Huruf** (A, B+, B, dst.).
3.  Masukkan **Jumlah SKS** mata kuliah tersebut.
4.  Klik tombol **"Tambah Mata Kuliah"** untuk menambahkan baris baru jika diperlukan.
5.  Hasil **IPK** dan **Predikat Kelulusan** akan diperbarui secara *real-time* atau setelah menekan tombol hitung (tergantung implementasi).

---

## 📖 Dasar Perhitungan Predikat

Predikat kelulusan didasarkan pada standar umum Perguruan Tinggi di Indonesia (dapat disesuaikan):

| Rentang IPK | Predikat Kelulusan |
| :---: | :--- |
| **3.51 - 4.00** | **Dengan Pujian (Cumlaude/Summa Cumlaude)** |
| **2.76 - 3.50** | Sangat Memuaskan |
| **2.00 - 2.75** | Memuaskan |
| **< 2.00** | Kurang Memuaskan |

> **Catatan:** Beberapa kampus memiliki aturan tambahan untuk Cumlaude (misalnya, masa studi tepat waktu dan tidak ada nilai C). Pastikan untuk membandingkan hasil dengan peraturan akademik kampus Anda.

---

## 🤝 Kontribusi

Kontribusi dalam bentuk *issue* atau *pull request* sangat disambut baik! Jika Anda memiliki ide untuk fitur baru atau menemukan *bug*, silakan:

1.  *Fork* repositori ini.
2.  Buat *branch* baru (`git checkout -b fitur/NamaFiturBaru`).
3.  Lakukan perubahan (`git commit -am 'Tambahkan NamaFiturBaru'`).
4.  *Push* ke *branch* (`git push origin fitur/NamaFiturBaru`).
5.  Buka *Pull Request* baru.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

## 🧑‍💻 Kontak

* **Pembuat:** Faiz Jihad
* **GitHub:** [https://github.com/faiz-jihad](https://github.com/faiz-jihad)
