"use server";

import { createClient } from "@/utils/supabase/server";
import { Alternatif } from "@/types";
import { revalidatePath } from "next/cache";

export async function getAlternatif() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("alternatif")
    .select("*")
    .eq("user_id", user.id) // Filter eksplisit
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching alternatif:", error);
    return [];
  }

  return data as Alternatif[];
}

export async function addAlternatif(alternatif: Omit<Alternatif, "id" | "created_at">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("alternatif")
    .insert([{ ...alternatif, user_id: user.id }])
    .select();

  if (error) {
    console.error("Error adding alternatif:", error);
    throw new Error(error.message);
  }

  revalidatePath("/alternatif");
  revalidatePath("/ranking");
  revalidatePath("/dashboard");
  return data[0];
}

export async function updateAlternatif(id: string, alternatif: Partial<Alternatif>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alternatif")
    .update(alternatif)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating alternatif:", error);
    throw new Error(error.message);
  }

  revalidatePath("/alternatif");
  revalidatePath("/ranking");
  revalidatePath("/dashboard");
  return data[0];
}

export async function deleteAlternatif(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("alternatif")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting alternatif:", error);
    throw new Error(error.message);
  }

  revalidatePath("/alternatif");
  revalidatePath("/ranking");
  revalidatePath("/dashboard");
}
