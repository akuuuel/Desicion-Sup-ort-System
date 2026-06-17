"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Kriteria, Alternatif, Penilaian } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Info, ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getKriteria } from "@/app/actions/kriteria";
import { getAlternatif } from "@/app/actions/alternatif";
import { getPenilaian, upsertPenilaian } from "@/app/actions/penilaian";

export default function PenilaianPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [localValues, setLocalValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success'|'error'; msg: string } | null>(null);

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [kData, aData, pData] = await Promise.all([
        getKriteria(),
        getAlternatif(),
        getPenilaian()
      ]);
      setKriteria(kData);
      setAlternatif(aData);
      
      const valMap: Record<string, number> = {};
      pData.forEach(p => {
        valMap[`${p.alternatif_id}-${p.kriteria_id}`] = p.nilai;
      });
      setLocalValues(valMap);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (altId: string, kritId: string, val: number) => {
    setLocalValues(prev => ({
      ...prev,
      [`${altId}-${kritId}`]: val
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toUpsert: Omit<Penilaian, "id">[] = [];
      alternatif.forEach(alt => {
        kriteria.forEach(krit => {
          const key = `${alt.id}-${krit.id}`;
          if (localValues[key] !== undefined) {
            toUpsert.push({
              alternatif_id: alt.id,
              kriteria_id: krit.id,
              nilai: localValues[key]
            });
          }
        });
      });
      await upsertPenilaian(toUpsert);
      showToast('success', 'Penilaian berhasil disimpan!');
    } catch (error) {
      showToast('error', 'Gagal menyimpan penilaian.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Memuat data...</div>;
  }

  if (kriteria.length === 0 || alternatif.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <Info className="size-12 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">Harap lengkapi data kriteria dan alternatif terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-premium font-bold text-sm transition-all animate-in slide-in-from-bottom-4",
          toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-destructive text-destructive-foreground"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="size-5 shrink-0" /> : <AlertTriangle className="size-5 shrink-0" />}
          {toast.msg}
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-6xl mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading tracking-tighter text-foreground uppercase">
            Input <span className="text-primary italic">Penilaian</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Evaluasi performa alternatif pada setiap kriteria yang ditentukan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={fetchData} 
            disabled={isLoading || isSaving}
            className="rounded-xl glass shadow-sm font-bold uppercase tracking-widest text-[10px]"
          >
            <RefreshCw className={cn("size-3 mr-2", isLoading && "animate-spin")} /> Update
          </Button>
          <Button 
            className="gap-2 rounded-xl shadow-glow font-bold px-6" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            <Save className="size-4" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </header>

      <Card className="border-none shadow-premium glass overflow-hidden transition-premium">
        <CardHeader className="bg-white/5 border-b border-white/5 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold font-heading uppercase tracking-tighter">Matriks Keputusan (X)</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest opacity-60">Input Nilai Performa 0 - 100</CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black tracking-widest uppercase">
              <ClipboardList className="size-3" /> Ready to Calculate
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-widest pl-6 bg-background/80 backdrop-blur-md sticky left-0 z-20 border-r border-white/5">
                    Nama Instansi
                  </TableHead>
                  {kriteria.map(k => (
                    <TableHead key={k.id} className="text-center min-w-[120px] py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px] tracking-tighter">{k.kode}</span>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate max-w-[100px]">{k.nama}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alternatif.map((alt) => (
                  <TableRow key={alt.id} className="group border-white/5 transition-colors hover:bg-white/5 h-16">
                    <TableCell className="font-bold text-sm bg-background/80 backdrop-blur-md sticky left-0 z-20 border-r border-white/5 pl-6 group-hover:text-primary transition-colors">
                      {alt.nama}
                    </TableCell>
                    {kriteria.map((krit) => {
                      const key = `${alt.id}-${krit.id}`;
                      return (
                        <TableCell key={krit.id} className="p-0 border-r border-white/5">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="h-16 text-center font-mono font-black text-base bg-transparent border-none focus:ring-2 ring-primary/40 rounded-none w-full transition-all hover:bg-primary/5 focus:bg-primary/10"
                            placeholder="-"
                            value={localValues[key] ?? ""}
                            onChange={(e) => handleUpdate(alt.id, krit.id, parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-6xl mx-auto w-full">
        <Card className="border-none shadow-sm glass border-l-4 border-l-muted opacity-60">
          <CardContent className="p-4 flex gap-3 text-xs font-medium leading-relaxed">
            <Info className="size-4 shrink-0 text-primary" />
            <p>Gunakan tombol Tab untuk berpindah antar kolom input dengan cepat. Nilai yang Anda masukkan akan digunakan sebagai basis normalisasi SAW.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
