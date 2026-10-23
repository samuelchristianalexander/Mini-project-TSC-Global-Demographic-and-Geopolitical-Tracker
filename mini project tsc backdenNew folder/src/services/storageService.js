import { readFile, writeFile } from "fs/promises";

const PATH = "./data/data_sejarah.json";

export async function loadData() {
  try {
    const isiFile = await readFile(PATH, "utf-8");
    const data = JSON.parse(isiFile);
    return data;
  } catch (error) {
    console.log("⚠️  Gagal membaca file, memulai dengan data kosong.");
    return [];
  }
}

export async function saveData(data) {
  try {
    const teksJson = JSON.stringify(data, null, 2);
    await writeFile(PATH, teksJson, "utf-8");
    console.log("💾 Data berhasil disimpan ke file.");
    return true;
  } catch (error) {
    console.log("❌ Gagal menyimpan data:", error.message);
    return false;
  }
}