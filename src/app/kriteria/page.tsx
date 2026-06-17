"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, RefreshCw, BookOpen, AlertTriangle } from "lucide-react";
import { Kriteria } from "@/types";
import { cn } from "@/lib/utils";
import { getKriteria, addKriteria, updateKriteria, deleteKriteria } from "@/app/actions/kriteria";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";

type FormData = { kode: string; nama: string; tipe: "benefit" | "cost" };
const EMPTY_FORM: FormData = { kode: "", nama: "", tipe: "benefit" };

export default function KriteriaPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Kriteria | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getKriteria();
      setKriteria(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
    setDialogOpen(true);
  };

  const openEdit = (item: Kriteria) => {
    setEditTarget(item);
    setForm({ kode: item.kode, nama: item.nama, tipe: item.tipe as "benefit" | "cost" });
    setError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode || !form.nama) { setError("Kode dan Nama tidak boleh kosong!"); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      if (editTarget) {
        await updateKriteria(editTarget.id, form);
      } else {
        await addKriteria(form);
      }
      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteKriteria(id);
      setDeleteConfirm(null);
      fetchData();
    } catch {
      setError("Gagal menghapus kriteria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading tracking-tighter text-foreground uppercase">
            Kriteria <span className="text-primary italic">Penilaian</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Tentukan parameter utama untuk mendukung keputusan Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" onClick={fetchData} disabled={isLoading}
            className="rounded-xl glass shadow-sm hover:rotate-180 duration-500">
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          </Button>
          <Button className="gap-2 rounded-xl shadow-glow font-bold px-6" onClick={openAdd}>
            <Plus className="size-4" /> Tambah Baru
          </Button>
        </div>
      </header>

      {/* Table */}
      <Card className="border-none shadow-premium glass overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold font-heading">Daftar Parameter</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
                {kriteria.length} Kriteria Aktif
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest pl-6">Kode</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Nama Kriteria</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Tipe</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5 animate-pulse">
                    <TableCell colSpan={4} className="py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></TableCell>
                  </TableRow>
                ))
              ) : kriteria.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <BookOpen className="size-12" />
                      <p className="font-black uppercase tracking-widest text-xs">Belum ada data kriteria</p>
                      <p className="text-[10px]">Klik tombol "Tambah Baru" untuk memulai</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                kriteria.map((item) => (
                  <TableRow key={item.id} className="group border-white/5 hover:bg-white/5 transition-colors h-16">
                    <TableCell className="pl-6">
                      <span className="font-mono font-black text-primary bg-primary/10 px-2 py-1 rounded text-sm">
                        {item.kode}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-base tracking-tight">{item.nama}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                        item.tipe === 'benefit'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      )}>
                        {item.tipe}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary"
                          onClick={() => openEdit(item)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => setDeleteConfirm(item.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Kriteria" : "Tambah Kriteria Baru"}</DialogTitle>
            <DialogDescription>{editTarget ? "Perbarui data kriteria yang ada." : "Masukkan data kriteria penilaian baru."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Kode Kriteria</label>
              <Input
                placeholder="cth: C1, C2, C3..."
                value={form.kode}
                onChange={e => setForm(p => ({ ...p, kode: e.target.value.toUpperCase() }))}
                className="rounded-xl bg-white/5 border-white/10 focus:ring-primary/40 font-mono font-bold"
                disabled={!!editTarget}
              />
              {editTarget && <p className="text-[10px] text-muted-foreground opacity-50">Kode tidak dapat diubah setelah dibuat.</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nama Kriteria</label>
              <Input
                placeholder="cth: Jarak, Gaji, Reputasi..."
                value={form.nama}
                onChange={e => setForm(p => ({ ...p, nama: e.target.value }))}
                className="rounded-xl bg-white/5 border-white/10 focus:ring-primary/40 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tipe Kriteria</label>
              <div className="grid grid-cols-2 gap-3">
                {(["benefit", "cost"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, tipe: t }))}
                    className={cn(
                      "rounded-xl border py-4 text-xs font-black uppercase tracking-widest transition-all",
                      form.tipe === t
                        ? t === "benefit"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : "bg-orange-500/20 border-orange-500/50 text-orange-400"
                        : "border-white/10 hover:bg-white/5 text-muted-foreground"
                    )}>
                    {t === "benefit" ? "✓ Benefit" : "↓ Cost"}
                    <p className="text-[9px] font-medium mt-1 opacity-70 capitalize">
                      {t === "benefit" ? "Nilai lebih tinggi = lebih baik" : "Nilai lebih rendah = lebih baik"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-xl">
                <AlertTriangle className="size-4 shrink-0" /> {error}
              </div>
            )}
            <DialogFooter className="gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="secondary" type="button" className="rounded-xl">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl shadow-glow font-bold px-8">
                {isSubmitting ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Tambah Kriteria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Konfirmasi Hapus</DialogTitle>
            <DialogDescription>Tindakan ini tidak dapat dibatalkan. Data kriteria terkait akan ikut terhapus.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="secondary" className="rounded-xl">Batal</Button>
            </DialogClose>
            <Button variant="destructive" className="rounded-xl font-bold" disabled={isSubmitting}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
