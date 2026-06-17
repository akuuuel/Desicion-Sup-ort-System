"use server";

import { createClient } from "@/utils/supabase/server";
import { Penilaian } from "@/types";
import { revalidatePath } from "next/cache";

export async function getPenilaian() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("penilaian")
    .select("*")
    .eq("user_id", user.id); // Filter eksplisit

  if (error) {
    console.error("Error fetching penilaian:", error);
    return [];
  }

  return data as Penilaian[];
}

export async function upsertPenilaian(penilaian: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Jika input adalah array, tambahkan user_id ke setiap item
  // Jika input adalah object, bungkus jadi array dan tambahkan user_id
  const dataToUpsert = Array.isArray(penilaian) 
    ? penilaian.map(p => ({ ...p, user_id: user.id }))
    : [{ ...penilaian, user_id: user.id }];

  const { data, error } = await supabase
    .from("penilaian")
    .upsert(dataToUpsert, {
      onConflict: "alternatif_id,kriteria_id,user_id"
    })
    .select();

  if (error) {
    console.error("Error upserting penilaian:", error);
    throw new Error(error.message);
  }

  revalidatePath("/penilaian");
  revalidatePath("/ranking");
  revalidatePath("/dashboard");
  return data;
}

export async function deletePenilaianByAlternatif(alternatifId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("penilaian")
    .delete()
    .eq("alternatif_id", alternatifId);

  if (error) {
    console.error("Error deleting penilaian:", error);
    throw new Error(error.message);
  }

  revalidatePath("/penilaian");
}
