import { validasiPersentase, isNotEmpty } from "../utils/validator.js";

export function tambahKerajaan(daftarKerajaan, nama, kontinen, kawasan) {
  if (!isNotEmpty(nama)) {
    console.log("❌ Nama kerajaan tidak boleh kosong.");
    return null;
  }
  if (!Array.isArray(kontinen) || kontinen.length === 0) {
    console.log("❌ Kontinen minimal 1.");
    return null;
  }
  const urutan = daftarKerajaan.length + 1;
  const idBaru = "KNG" + String(urutan).padStart(3, "0");
  const kerajaanBaru = {
    id: idBaru,
    nama: nama.trim(),
    kontinen: kontinen,
    kawasan: kawasan,
    hubunganDiplomatik: [],
    jalurPerdagangan: [],
    periode: [],
  };
  daftarKerajaan.push(kerajaanBaru);
  console.log(`✅ Kerajaan "${nama}" berhasil ditambahkan (ID: ${idBaru}).`);
  return kerajaanBaru;
}

export function tampilkanSemuaKerajaan(daftarKerajaan) {
  if (daftarKerajaan.length === 0) {
    console.log("📭 Belum ada data kerajaan.");
    return;
  }
  daftarKerajaan.forEach((k, index) => {
    console.log(`${index + 1}. [${k.id}] ${k.nama}`);
    console.log(`   Kontinen : ${k.kontinen.join(", ")}`);
    console.log(`   Kawasan  : ${k.kawasan}`);
    console.log(`   Periode  : ${k.periode.length} era`);
    console.log("");
  });
}

export function cariKerajaanById(daftarKerajaan, id) {
  const hasil = daftarKerajaan.find((k) => k.id === id);
  if (!hasil) {
    console.log(`❌ Kerajaan dengan ID "${id}" tidak ditemukan.`);
    return null;
  }
  return hasil;
}

export function updateKerajaan(daftarKerajaan, id, namaBaru, kawasanBaru) {
  const kerajaan = daftarKerajaan.find((k) => k.id === id);
  if (!kerajaan) {
    console.log(`❌ Kerajaan dengan ID "${id}" tidak ditemukan.`);
    return false;
  }
  if (namaBaru && namaBaru.trim() !== "") kerajaan.nama = namaBaru.trim();
  if (kawasanBaru && kawasanBaru.trim() !== "") kerajaan.kawasan = kawasanBaru.trim();
  console.log(`✅ Data kerajaan "${id}" berhasil diupdate.`);
  return true;
}

export function hapusKerajaan(daftarKerajaan, id) {
  const index = daftarKerajaan.findIndex((k) => k.id === id);
  if (index === -1) {
    console.log(`❌ Kerajaan dengan ID "${id}" tidak ditemukan.`);
    return false;
  }
  const nama = daftarKerajaan[index].nama;
  daftarKerajaan.splice(index, 1);
  console.log(`🗑️  Kerajaan "${nama}" (${id}) berhasil dihapus.`);
  return true;
}

export function tambahPeriode(daftarKerajaan, idKerajaan, periodeBaru) {
  const kerajaan = daftarKerajaan.find((k) => k.id === idKerajaan);
  if (!kerajaan) {
    console.log(`❌ Kerajaan dengan ID "${idKerajaan}" tidak ditemukan.`);
    return false;
  }
  if (!validasiPersentase(periodeBaru.etnis)) {
    console.log("❌ Total persentase etnis harus 100%.");
    return false;
  }
  if (!validasiPersentase(periodeBaru.agama)) {
    console.log("❌ Total persentase agama harus 100%.");
    return false;
  }
  kerajaan.periode.push(periodeBaru);
  console.log(`✅ Periode "${periodeBaru.era}" berhasil ditambahkan ke ${kerajaan.nama}.`);
  return true;
}

export function filterByKontinen(daftarKerajaan, kontinen) {
  const hasil = daftarKerajaan.filter((k) =>
    k.kontinen.some((c) => c.toLowerCase() === kontinen.toLowerCase())
  );
  if (hasil.length === 0) {
    console.log(`❌ Tidak ada kerajaan di kontinen "${kontinen}".`);
    return [];
  }
  hasil.forEach((k) => console.log(`- [${k.id}] ${k.nama} (${k.kontinen.join(", ")})`));
  return hasil;
}

export function filterByKomoditas(daftarKerajaan, kataKunci) {
  const hasil = daftarKerajaan.filter((k) =>
    k.jalurPerdagangan.some(
      (j) =>
        j.komoditasEkspor.some((e) => e.toLowerCase().includes(kataKunci.toLowerCase())) ||
        j.komoditasImpor.some((i) => i.toLowerCase().includes(kataKunci.toLowerCase()))
    )
  );
  if (hasil.length === 0) {
    console.log(`❌ Tidak ada kerajaan dengan komoditas "${kataKunci}".`);
    return [];
  }
  hasil.forEach((k) => console.log(`- [${k.id}] ${k.nama}`));
  return hasil;
}

export function hitungPertumbuhanWilayah(kerajaan) {
  if (kerajaan.periode.length < 2) {
    console.log("ℹ️  Butuh minimal 2 periode untuk menghitung pertumbuhan.");
    return null;
  }
  const periodeUrut = [...kerajaan.periode].sort((a, b) => a.tahunAwal - b.tahunAwal);
  for (let i = 1; i < periodeUrut.length; i++) {
    const sebelum = periodeUrut[i - 1];
    const sesudah = periodeUrut[i];
    const selisih = sesudah.luasWilayahKm2 - sebelum.luasWilayahKm2;
    const persen = (selisih / sebelum.luasWilayahKm2) * 100;
    console.log(`📈 ${sebelum.era} -> ${sesudah.era}`);
    console.log(`   Selisih : ${selisih.toLocaleString()} km²`);
    console.log(`   Persen  : ${persen.toFixed(2)}%`);
    console.log("");
  }
  return periodeUrut;
}

export function validasiSemuaDemografi(daftarKerajaan) {
  let adaMasalah = false;
  daftarKerajaan.forEach((k) => {
    k.periode.forEach((p) => {
      const etnisValid = validasiPersentase(p.etnis);
      const agamaValid = validasiPersentase(p.agama);
      if (!etnisValid || !agamaValid) {
        adaMasalah = true;
        console.log(`⚠️  [${k.id}] ${k.nama} - ${p.era}`);
        if (!etnisValid) console.log("   ❌ Persentase etnis tidak 100%");
        if (!agamaValid) console.log("   ❌ Persentase agama tidak 100%");
      }
    });
  });
  if (!adaMasalah) console.log("✅ Semua persentase demografi valid (100%).");
  return !adaMasalah;
}

export function tampilkanTimeline(daftarKerajaan) {
  const semuaEvent = [];
  daftarKerajaan.forEach((k) => {
    k.periode.forEach((p) => {
      p.peristiwaSejarah.forEach((e) => {
        semuaEvent.push({
          tahun: e.tahun,
          nama: e.namaEvent,
          deskripsi: e.deskripsi,
          kerajaan: k.nama,
        });
      });
    });
  });
  if (semuaEvent.length === 0) {
    console.log("📭 Belum ada peristiwa sejarah.");
    return;
  }
  semuaEvent.sort((a, b) => a.tahun - b.tahun);
  semuaEvent.forEach((e) => {
    console.log(`📜 ${e.tahun} - ${e.nama}`);
    console.log(`   ${e.deskripsi}`);
    console.log(`   (${e.kerajaan})`);
    console.log("");
  });
}