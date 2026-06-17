"use server";

import { createClient } from "@/utils/supabase/server";
import { Kriteria } from "@/types";
import { revalidatePath } from "next/cache";

export async function getKriteria() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from("kriteria")
    .select("*")
    .eq("user_id", user.id) // Filter eksplisit
    .order("kode", { ascending: true });

  if (error) {
    console.error("Error fetching kriteria:", error);
    return [];
  }

  return data as Kriteria[];
}

export async function addKriteria(kriteria: Omit<Kriteria, "id" | "created_at">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("kriteria")
    .insert([{ ...kriteria, user_id: user.id }])
    .select();

  if (error) {
    console.error("Error adding kriteria:", error);
    throw new Error(error.message);
  }

  revalidatePath("/kriteria");
  revalidatePath("/ahp");
  revalidatePath("/dashboard");
  return data[0];
}

export async function updateKriteria(id: string, kriteria: Partial<Kriteria>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kriteria")
    .update(kriteria)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating kriteria:", error);
    throw new Error(error.message);
  }

  revalidatePath("/kriteria");
  revalidatePath("/ahp");
  revalidatePath("/dashboard");
  return data[0];
}

export async function deleteKriteria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("kriteria")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting kriteria:", error);
    throw new Error(error.message);
  }

  revalidatePath("/kriteria");
  revalidatePath("/ahp");
  revalidatePath("/dashboard");
}
