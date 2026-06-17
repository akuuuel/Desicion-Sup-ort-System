"use server";

import { supabase } from "@/lib/supabase";
import { DEFAULT_KRITERIA, DEFAULT_ALTERNATIF } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function seedDatabase() {
  // 1. Seed Kriteria
  const { data: existingKriteria } = await supabase.from("kriteria").select("id");
  if (!existingKriteria || existingKriteria.length === 0) {
    const { error: kError } = await supabase
      .from("kriteria")
      .insert(DEFAULT_KRITERIA.map(k => ({ kode: k.kode, nama: k.nama, tipe: k.tipe })));
    
    if (kError) console.error("Error seeding kriteria:", kError);
  }

  // 2. Seed Alternatif
  const { data: existingAlternatif } = await supabase.from("alternatif").select("id");
  if (!existingAlternatif || existingAlternatif.length === 0) {
    const { error: aError } = await supabase
      .from("alternatif")
      .insert(DEFAULT_ALTERNATIF.map(a => ({ kode: a.kode, nama: a.nama, alamat: "Jakarta, Indonesia" })));
    
    if (aError) console.error("Error seeding alternatif:", aError);
  }

  revalidatePath("/");
  return { success: true };
}
