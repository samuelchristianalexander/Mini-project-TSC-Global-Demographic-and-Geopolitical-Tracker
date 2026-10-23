export function buatPenguasa(namaRaja, gelar, tahunLahir, tahunWafat, masaBertahta, etnisAsal, agama, silsilah, biografiSingkat) {
  return {
    namaRaja: namaRaja,
    gelar: gelar,
    tahunLahir: tahunLahir,
    tahunWafat: tahunWafat,
    masaBertahta: masaBertahta,
    etnisAsal: etnisAsal,
    agama: agama,
    silsilah: silsilah,
    biografiSingkat: biografiSingkat,
  };
}

export function buatSilsilah(dinasti, ayah, ibu, pasangan, penerusTahta) {
  return {
    dinasti: dinasti,
    ayah: ayah,
    ibu: ibu,
    pasangan: pasangan,
    penerusTahta: penerusTahta,
  };
}