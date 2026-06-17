"use server";

import { createClient } from "@/utils/supabase/server";
import { MatriksAHP } from "@/types";
import { revalidatePath } from "next/cache";

export async function getMatriksAHP() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("matriks_ahp")
    .select("*")
    .eq("user_id", user.id); // Filter eksplisit

  if (error) {
    console.error("Error fetching matriks_ahp:", error);
    return [];
  }

  return data as MatriksAHP[];
}

export async function upsertMatriksAHP(values: Omit<MatriksAHP, "id">[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const valuesWithUser = values.map(v => ({ ...v, user_id: user.id }));

  const { error } = await supabase
    .from("matriks_ahp")
    .upsert(valuesWithUser, { onConflict: "kriteria_1_id,kriteria_2_id,user_id" });

  if (error) {
    console.error("Error upserting matriks_ahp:", error);
    throw new Error(error.message);
  }

  revalidatePath("/ahp");
  revalidatePath("/dashboard");
}
