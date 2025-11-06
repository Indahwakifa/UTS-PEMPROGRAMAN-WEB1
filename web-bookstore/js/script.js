/* ============================================================
   Script Utama Toko Buku Online 📚
   Mengelola login, katalog, tracking, dan checkout
   ============================================================ */

// Pastikan data dari data.js sudah dimuat
if (typeof dataPengguna === "undefined") {
  console.error("⚠️ data.js belum terhubung!");
}

/* -------------------------------
   LOGIN PAGE (login.html)
--------------------------------*/
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const pengguna = dataPengguna.find(
    (u) => u.email === email && u.password === password
  );

  if (pengguna) {
    alert(`Login berhasil! Selamat datang, ${pengguna.nama}`);
    localStorage.setItem("penggunaAktif", JSON.stringify(pengguna));
    window.location.href = "dashboard.html";
  } else {
    alert("Email atau password yang anda masukkan salah!");
  }
}

// Modal Pop-up
function bukaModal(id) {
  document.getElementById(id).style.display = "block";
}

function tutupModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = function (event) {
  const daftarModal = document.getElementById("modal-daftar");
  const lupaModal = document.getElementById("modal-lupa");
  if (event.target === daftarModal) tutupModal("modal-daftar");
  if (event.target === lupaModal) tutupModal("modal-lupa");
};

/* -------------------------------
   DASHBOARD PAGE (dashboard.html)
--------------------------------*/
function greetingWaktu() {
  const penggunaAktif = JSON.parse(localStorage.getItem("penggunaAktif"));
  if (!penggunaAktif) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  const jam = new Date().getHours();
  let waktu = "Malam";
  if (jam < 11) waktu = "Pagi";
  else if (jam < 15) waktu = "Siang";
  else if (jam < 18) waktu = "Sore";

  const greet = document.getElementById("greeting");
  if (greet)
    greet.textContent = `Selamat ${waktu}, ${penggunaAktif.nama} 👋`;
}

function logout() {
  if (confirm("Yakin ingin logout?")) {
    localStorage.removeItem("penggunaAktif");
    window.location.href = "login.html";
  }
}

/* -------------------------------
   STOK PAGE (stok.html)
--------------------------------*/
function tampilkanKatalog() {
  const container = document.getElementById("katalog");
  const statusMsg = document.getElementById("status");
  if (!container) return;

  container.innerHTML = "";

  if (dataKatalogBuku.length === 0) {
    statusMsg.style.display = "block";
    return;
  } else {
    statusMsg.style.display = "none";
  }

  dataKatalogBuku.forEach((buku) => {
    const card = document.createElement("div");
    card.className = "buku-card";
    card.innerHTML = `
      <div class="card-cover">
          <img src="${buku.cover}" alt="${buku.namaBarang}">
      </div>
      <div class="card-details">
          <h4>${buku.namaBarang}</h4>
          <p><strong>Kode:</strong> ${buku.kodeBarang}</p>
          <p><strong>Jenis:</strong> ${buku.jenisBarang}</p>
          <p><strong>Edisi:</strong> ${buku.edisi}</p>
          <p class="stok-info">Stok: ${buku.stok}</p>
      </div>
      <div class="card-footer">
          <span class="harga">${buku.harga}</span>
          <button class="btn btn-primary btn-beli" onclick="alert('Anda memilih ${buku.namaBarang}')">Beli</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function tambahBuku() {
  const kode = document.getElementById("kode").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const jenis = document.getElementById("jenis").value.trim();
  const edisi = document.getElementById("edisi").value.trim();
  const stok = document.getElementById("stok").value.trim();
  const harga = document.getElementById("harga").value.trim();

  if (!kode || !nama || !jenis || !edisi || !stok || !harga) {
    alert("Semua field harus diisi!");
    return;
  }

  const bukuBaru = {
    kodeBarang: kode,
    namaBarang: nama,
    jenisBarang: jenis,
    edisi: edisi,
    stok: parseInt(stok),
    harga: harga,
    cover: "img/default_book.jpg",
  };

  dataKatalogBuku.push(bukuBaru);
  tampilkanKatalog();
  document.querySelectorAll(".filter-group input").forEach((input) => (input.value = ""));
}

/* -------------------------------
   TRACKING PAGE (tracking.html)
--------------------------------*/
function cariTracking() {
  const noDO = document.getElementById("nomorDO").value.trim();
  const hasilDiv = document.getElementById("hasilTracking");
  const infoDiv = document.getElementById("trackingInfo");
  const timelineDiv = document.getElementById("trackingTimeline");
  const errorDiv = document.getElementById("errorMessage");

  if (!noDO) {
    alert("Masukkan nomor DO terlebih dahulu!");
    return;
  }

  hasilDiv.style.display = "none";
  errorDiv.style.display = "none";

  const data = dataTracking[noDO];
  if (!data) {
    errorDiv.style.display = "block";
    return;
  }

  hasilDiv.style.display = "block";
  infoDiv.innerHTML = `
      <div class="info-item"><strong>Nama Pemesan</strong>${data.nama}</div>
      <div class="info-item"><strong>Status Pengiriman</strong>
          <span class="status-indicator ${cekStatusClass(data.status)}">${data.status}</span>
      </div>
      <div class="info-item"><strong>Ekspedisi</strong>${data.ekspedisi}</div>
      <div class="info-item"><strong>Tanggal Kirim</strong>${data.tanggalKirim}</div>
      <div class="info-item"><strong>Jenis Paket</strong>${data.paket}</div>
      <div class="info-item"><strong>Total Pembayaran</strong>${data.total}</div>
  `;

  timelineDiv.innerHTML = "";
  data.perjalanan.forEach((event) => {
    const div = document.createElement("div");
    div.className = "timeline-event";
    div.innerHTML = `<div class="event-time">${event.waktu}</div><div>${event.keterangan}</div>`;
    timelineDiv.appendChild(div);
  });
}

function cekStatusClass(status) {
  switch (status.toLowerCase()) {
    case "dalam perjalanan":
    case "dikirim":
      return "dikirim";
    case "selesai":
    case "terkirim":
      return "terkirim";
    case "gagal":
      return "gagal";
    default:
      return "";
  }
}

/* -------------------------------
   CHECKOUT PAGE (checkout.html)
--------------------------------*/
function isiDropdown() {
  const bukuSelect = document.getElementById("bukuSelect");
  if (!bukuSelect) return;

  dataKatalogBuku.forEach((buku) => {
    const opt = document.createElement("option");
    opt.value = buku.kodeBarang;
    opt.textContent = `${buku.namaBarang} (${buku.harga})`;
    opt.setAttribute("data-harga", buku.harga.replace(/[^\d]/g, ""));
    bukuSelect.appendChild(opt);
  });
}

function updateHarga() {
  const bukuSelect = document.getElementById("bukuSelect");
  const hargaSatuan = document.getElementById("hargaSatuan");
  const totalHarga = document.getElementById("totalHarga");
  const jumlah = parseInt(document.getElementById("jumlah").value) || 1;

  const selected = bukuSelect.options[bukuSelect.selectedIndex];
  if (!selected || !selected.value) {
    hargaSatuan.textContent = "Harga Satuan: -";
    totalHarga.innerHTML = "<strong>Total Harga:</strong> Rp 0";
    return;
  }

  const harga = parseInt(selected.getAttribute("data-harga")) || 0;
  const total = harga * jumlah;

  hargaSatuan.textContent = `Harga Satuan: Rp ${harga.toLocaleString("id-ID")}`;
  totalHarga.innerHTML = `<strong>Total Harga:</strong> Rp ${total.toLocaleString("id-ID")}`;
}

function buatPesanan() {
  const nama = document.getElementById("namaPemesan").value.trim();
  const email = document.getElementById("emailPemesan").value.trim();
  const alamat = document.getElementById("alamatPemesan").value.trim();
  const metode = document.getElementById("metodeBayar").value;
  const bukuDipilih = document.getElementById("bukuSelect").value;
  const jumlah = document.getElementById("jumlah").value;
  const statusPesanan = document.getElementById("statusPesanan");

  if (!nama || !email || !alamat || !metode || !bukuDipilih) {
    alert("Harap isi semua data pemesan dan pilihan buku!");
    return;
  }

  alert(`Pesanan atas nama ${nama} berhasil dibuat!\nBuku: ${bukuDipilih}\nJumlah: ${jumlah}\nMetode: ${metode}`);
  statusPesanan.style.display = "block";

  // Reset form
  document.getElementById("namaPemesan").value = "";
  document.getElementById("emailPemesan").value = "";
  document.getElementById("alamatPemesan").value = "";
  document.getElementById("metodeBayar").value = "";
  document.getElementById("bukuSelect").value = "";
  document.getElementById("jumlah").value = 1;
  updateHarga();
}

/* -------------------------------
   Fungsi Umum
--------------------------------*/
function kembaliDashboard() {
  window.location.href = "dashboard.html";
}
