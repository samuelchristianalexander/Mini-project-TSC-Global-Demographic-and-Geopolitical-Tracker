import readline from "readline";
import { loadData, saveData } from "./src/services/storageService.js";
import {
  tampilkanSemuaKerajaan,
  cariKerajaanById,
  tambahKerajaan,
  updateKerajaan,
  hapusKerajaan,
  tambahPeriode,
  filterByKontinen,
  filterByKomoditas,
  hitungPertumbuhanWilayah,
  validasiSemuaDemografi,
  tampilkanTimeline,
} from "./src/services/kingdomService.js";
import {
  isNotEmpty,
  isAngkaValid,
  isTahunValid,
  isPilihanMenuValid,
} from "./src/utils/validator.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function tanya(pertanyaan) {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban) => resolve(jawaban));
  });
}

async function tanyaValid(pertanyaan, validator, pesanError) {
  while (true) {
    const jawaban = await tanya(pertanyaan);
    if (validator(jawaban)) return jawaban.trim();
    console.log(pesanError);
  }
}

async function tanyaPilihanMenu() {
  while (true) {
    const jawaban = await tanya("Pilihan Anda [0-7]: ");
    if (!isPilihanMenuValid(jawaban, 0, 7)) {
      console.log("❌ Input tidak valid! Masukkan angka 0-7.");
      continue;
    }
    return Number(jawaban);
  }
}

async function tanyaYaTidak(pertanyaan) {
  while (true) {
    const jawaban = (await tanya(pertanyaan)).trim().toLowerCase();
    if (jawaban === "y" || jawaban === "ya") return true;
    if (jawaban === "t" || jawaban === "tidak") return false;
    console.log("❌ Masukkan 'y' atau 't'.");
  }
}

function tampilkanMenu() {
  console.log("\n============================================================");
  console.log("   HISTORICAL GEOPOLITICS, TRADE & DEMOGRAPHIC TRACKER");
  console.log("============================================================");
  console.log("[1] Kelola Data Kerajaan & Periode Era (CRUD)");
  console.log("[2] Kelola BioData Penguasa & Silsilah Dinasti");
  console.log("[3] Kelola Hubungan Diplomatik & Jalur Perdagangan");
  console.log("[4] Pencarian & Filter Lanjutan (Benua/Komoditas/Demografi)");
  console.log("[5] Analisis Perkembangan Wilayah & Validasi Demografi");
  console.log("[6] Timeline Peristiwa Sejarah Global");
  console.log("[7] Simpan / Muat Data (JSON File System)");
  console.log("[0] Keluar Aplikasi");
  console.log("============================================================");
}

async function menuCRUD(daftar) {
  console.log("\n--- KELOLA KERAJAAN ---");
  console.log("[1] Lihat semua kerajaan");
  console.log("[2] Tambah kerajaan");
  console.log("[3] Cari kerajaan by ID");
  console.log("[4] Update kerajaan");
  console.log("[5] Hapus kerajaan");
  console.log("[6] Tambah periode ke kerajaan");
  console.log("[0] Kembali");

  const pilihan = await tanyaValid("Pilih [0-6]: ", (v) => isPilihanMenuValid(v, 0, 6), "❌ Masukkan angka 0-6.");

  switch (pilihan) {
    case "1": tampilkanSemuaKerajaan(daftar); break;
    case "2": {
      const nama = await tanyaValid("Nama kerajaan: ", isNotEmpty, "❌ Nama tidak boleh kosong.");
      const kontinenInput = await tanyaValid("Kontinen (pisah koma, ex: Eropa,Asia): ", isNotEmpty, "❌ Kontinen tidak boleh kosong.");
      const kontinen = kontinenInput.split(",").map((k) => k.trim()).filter((k) => k !== "");
      if (kontinen.length === 0) { console.log("❌ Minimal 1 kontinen."); break; }
      const kawasan = await tanyaValid("Kawasan: ", isNotEmpty, "❌ Kawasan tidak boleh kosong.");
      tambahKerajaan(daftar, nama, kontinen, kawasan);
      break;
    }
    case "3": {
      const id = await tanyaValid("Masukkan ID kerajaan: ", isNotEmpty, "❌ ID kosong.");
      const hasil = cariKerajaanById(daftar, id);
      if (hasil) { console.log("\n📋 Detail Kerajaan:"); console.log(JSON.stringify(hasil, null, 2)); }
      break;
    }
    case "4": {
      const id = await tanyaValid("ID kerajaan yang diupdate: ", isNotEmpty, "❌ ID kosong.");
      const namaBaru = await tanya("Nama baru (kosongkan jika tidak diubah): ");
      const kawasanBaru = await tanya("Kawasan baru (kosongkan jika tidak diubah): ");
      updateKerajaan(daftar, id, namaBaru, kawasanBaru);
      break;
    }
    case "5": {
      const id = await tanyaValid("ID kerajaan yang dihapus: ", isNotEmpty, "❌ ID kosong.");
      const yakin = await tanyaYaTidak(`Yakin hapus ${id}? (y/t): `);
      if (yakin) hapusKerajaan(daftar, id);
      else console.log("Dibatalkan.");
      break;
    }
    case "6": {
      const idKerajaan = await tanyaValid("ID kerajaan: ", isNotEmpty, "❌ ID kosong.");
      const kerajaan = cariKerajaanById(daftar, idKerajaan);
      if (!kerajaan) break;

      const idPeriode = "PER" + String(kerajaan.periode.length + 1).padStart(3, "0");
      const era = await tanyaValid("Nama era: ", isNotEmpty, "❌ Era kosong.");
      const tahunAwal = await tanyaValid("Tahun awal (angka): ", isTahunValid, "❌ Tahun tidak valid.");
      const tahunAkhir = await tanyaValid("Tahun akhir (angka): ", isTahunValid, "❌ Tahun tidak valid.");
      const luas = await tanyaValid("Luas wilayah (km2, angka): ", isAngkaValid, "❌ Luas harus angka >= 0.");
      const status = await tanyaValid("Status geopolitik: ", isNotEmpty, "❌ Status kosong.");

      console.log("\n--- Input Etnis (total harus 100%) ---");
      const etnis = [];
      let totalEtnis = 0;
      while (totalEtnis < 100) {
        const namaEtnis = await tanyaValid(`Nama etnis ke-${etnis.length + 1}: `, isNotEmpty, "❌ Nama etnis kosong.");
        const sisa = 100 - totalEtnis;
        const persen = await tanyaValid(`Persentase (sisa ${sisa}%): `, (v) => isAngkaValid(v) && Number(v) <= sisa && Number(v) > 0, `❌ Harus angka > 0 dan <= ${sisa}.`);
        etnis.push({ nama: namaEtnis, persentase: Number(persen) });
        totalEtnis += Number(persen);
        if (totalEtnis < 100) console.log(`ℹ️  Total sementara: ${totalEtnis}%`);
      }

      console.log("\n--- Input Agama (total harus 100%) ---");
      const agama = [];
      let totalAgama = 0;
      while (totalAgama < 100) {
        const namaAgama = await tanyaValid(`Nama agama ke-${agama.length + 1}: `, isNotEmpty, "❌ Nama agama kosong.");
        const sisa = 100 - totalAgama;
        const persen = await tanyaValid(`Persentase (sisa ${sisa}%): `, (v) => isAngkaValid(v) && Number(v) <= sisa && Number(v) > 0, `❌ Harus angka > 0 dan <= ${sisa}.`);
        agama.push({ nama: namaAgama, persentase: Number(persen) });
        totalAgama += Number(persen);
        if (totalAgama < 100) console.log(`ℹ️  Total sementara: ${totalAgama}%`);
      }

      const periodeBaru = {
        idPeriode, era,
        tahunAwal: Number(tahunAwal),
        tahunAkhir: Number(tahunAkhir),
        luasWilayahKm2: Number(luas),
        statusGeopolitik: status,
        etnis, agama,
        penguasa: null,
        peristiwaSejarah: [],
      };
      tambahPeriode(daftar, idKerajaan, periodeBaru);
      break;
    }
    case "0": return;
  }
}

async function menuFilter(daftar) {
  console.log("\n--- FILTER & PENCARIAN ---");
  console.log("[1] Filter by Kontinen");
  console.log("[2] Filter by Komoditas");
  console.log("[0] Kembali");
  const pilihan = await tanyaValid("Pilih [0-2]: ", (v) => isPilihanMenuValid(v, 0, 2), "❌ Masukkan angka 0-2.");
  switch (pilihan) {
    case "1": { const k = await tanyaValid("Nama kontinen: ", isNotEmpty, "❌ Kosong."); filterByKontinen(daftar, k); break; }
    case "2": { const k = await tanyaValid("Kata kunci komoditas: ", isNotEmpty, "❌ Kosong."); filterByKomoditas(daftar, k); break; }
    case "0": return;
  }
}

async function menuAnalisis(daftar) {
  console.log("\n--- ANALISIS & VALIDASI ---");
  console.log("[1] Hitung pertumbuhan wilayah");
  console.log("[2] Validasi semua persentase demografi");
  console.log("[0] Kembali");
  const pilihan = await tanyaValid("Pilih [0-2]: ", (v) => isPilihanMenuValid(v, 0, 2), "❌ Masukkan angka 0-2.");
  switch (pilihan) {
    case "1": { const id = await tanyaValid("ID kerajaan: ", isNotEmpty, "❌ Kosong."); const k = cariKerajaanById(daftar, id); if (k) hitungPertumbuhanWilayah(k); break; }
    case "2": validasiSemuaDemografi(daftar); break;
    case "0": return;
  }
}

async function menuFile(daftar) {
  console.log("\n--- FILE SYSTEM ---");
  console.log("[1] Simpan data ke JSON");
  console.log("[2] Muat ulang data dari JSON");
  console.log("[0] Kembali");
  const pilihan = await tanyaValid("Pilih [0-2]: ", (v) => isPilihanMenuValid(v, 0, 2), "❌ Masukkan angka 0-2.");
  switch (pilihan) {
    case "1": await saveData(daftar); break;
    case "2": {
      const dataBaru = await loadData();
      console.log(`✅ Data dimuat ulang (${dataBaru.length} kerajaan).`);
      daftar.length = 0;
      dataBaru.forEach((d) => daftar.push(d));
      break;
    }
    case "0": return;
  }
}

function menuPlaceholder(nama) {
  console.log(`\nℹ️  Menu "${nama}" belum diimplementasi di versi mini ini.`);
  console.log("   (Fokus mini project: CRUD utama, filter, analisis, file I/O.)");
}

async function main() {
  const daftarKerajaan = await loadData();
  console.log(`📚 Berhasil memuat ${daftarKerajaan.length} data kerajaan.`);

  let berjalan = true;
  while (berjalan) {
    tampilkanMenu();
    const pilihan = await tanyaPilihanMenu();
    switch (pilihan) {
      case 1: await menuCRUD(daftarKerajaan); break;
      case 2: menuPlaceholder("BioData Penguasa & Silsilah"); break;
      case 3: menuPlaceholder("Hubungan Diplomatik & Jalur Perdagangan"); break;
      case 4: await menuFilter(daftarKerajaan); break;
      case 5: await menuAnalisis(daftarKerajaan); break;
      case 6: tampilkanTimeline(daftarKerajaan); break;
      case 7: await menuFile(daftarKerajaan); break;
      case 0: {
        const simpan = await tanyaYaTidak("Simpan data sebelum keluar? (y/t): ");
        if (simpan) await saveData(daftarKerajaan);
        console.log("👋 Terima kasih! Aplikasi ditutup.");
        berjalan = false;
        break;
      }
    }
  }
  rl.close();
}

main();