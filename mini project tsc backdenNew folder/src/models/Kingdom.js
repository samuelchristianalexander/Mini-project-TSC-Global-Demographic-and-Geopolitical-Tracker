export function buatKerajaan(id, nama, kontinen, kawasan) {
  return {
    id: id,
    nama: nama,
    kontinen: kontinen,
    kawasan: kawasan,
    hubunganDiplomatik: [],
    jalurPerdagangan: [],
    periode: [],
  };
}

export function buatPeriode(idPeriode, era, tahunAwal, tahunAkhir, luasWilayahKm2, statusGeopolitik) {
  return {
    idPeriode: idPeriode,
    era: era,
    tahunAwal: tahunAwal,
    tahunAkhir: tahunAkhir,
    luasWilayahKm2: luasWilayahKm2,
    statusGeopolitik: statusGeopolitik,
    etnis: [],
    agama: [],
    penguasa: null,
    peristiwaSejarah: [],
  };
}