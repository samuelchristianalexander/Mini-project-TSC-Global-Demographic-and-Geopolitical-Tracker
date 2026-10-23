export function isNotEmpty(value) {
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
}

export function isAngkaValid(value) {
  const angka = Number(value);
  if (Number.isNaN(angka)) return false;
  if (!Number.isFinite(angka)) return false;
  if (angka < 0) return false;
  return true;
}

export function isTahunValid(value) {
  const tahun = Number(value);
  if (Number.isNaN(tahun)) return false;
  if (tahun < 1 || tahun > new Date().getFullYear()) return false;
  return true;
}

export function validasiPersentase(list) {
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    total += list[i].persentase;
  }
  return total === 100;
}

export function isPilihanMenuValid(value, min, max) {
  const angka = Number(value);
  if (Number.isNaN(angka)) return false;
  if (angka < min || angka > max) return false;
  return true;
}

export function isIdValid(value) {
  return isNotEmpty(value);
}