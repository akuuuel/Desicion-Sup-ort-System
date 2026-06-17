"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { calculateAHP } from "@/lib/ahp";
import { MatriksAHP, Kriteria } from "@/types";
import { CheckCircle2, AlertCircle, Info, Save, RefreshCw } from "lucide-react";
import { getKriteria } from "@/app/actions/kriteria";
import { getMatriksAHP, upsertMatriksAHP } from "@/app/actions/ahp";

export default function AHPPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [dbValues, setDbValues] = useState<MatriksAHP[]>([]);
  const [localValues, setLocalValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [kData, mData] = await Promise.all([getKriteria(), getMatriksAHP()]);
      setKriteria(kData);
      setDbValues(mData);
      
      const valMap: Record<string, number> = {};
      mData.forEach(m => {
        valMap[`${m.kriteria_1_id}-${m.kriteria_2_id}`] = m.nilai;
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

  const matrixInput: MatriksAHP[] = useMemo(() => {
    const inputs: MatriksAHP[] = [];
    for (let i = 0; i < kriteria.length; i++) {
      for (let j = i + 1; j < kriteria.length; j++) {
        const key = `${kriteria[i].id}-${kriteria[j].id}`;
        inputs.push({
          id: key,
          kriteria_1_id: kriteria[i].id,
          kriteria_2_id: kriteria[j].id,
          nilai: localValues[key] || 1,
        });
      }
    }
    return inputs;
  }, [kriteria, localValues]);

  const results = useMemo(() => calculateAHP(kriteria, matrixInput), [kriteria, matrixInput]);

  const handleUpdateValue = (k1: string, k2: string, val: number) => {
    setLocalValues(prev => ({
      ...prev,
      [`${k1}-${k2}`]: val
    }));
  };

  const handleSave = async () => {
    if (results && !results.isConsistent) {
      const confirmSave = confirm("Matriks perbandingan tidak konsisten (CR > 0.1). Apakah Anda yakin ingin menyimpan bobot ini?");
      if (!confirmSave) return;
    }

    setIsSaving(true);
    try {
      const toUpsert = matrixInput.map(m => ({
        kriteria_1_id: m.kriteria_1_id,
        kriteria_2_id: m.kriteria_2_id,
        nilai: m.nilai
      }));
      await upsertMatriksAHP(toUpsert);
      alert("Matriks AHP berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan matriks AHP");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Memuat data...</div>;
  }

  if (kriteria.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <Info className="size-12 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">Butuh minimal 2 kriteria untuk melakukan perbandingan berpasangan.</p>
        <Link 
          href="/kriteria" 
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        >
          Kelola Kriteria
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading tracking-tighter text-foreground uppercase">
            Analisis <span className="text-primary italic">AHP</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Tentukan bobot prioritas melalui perbandingan kriteria berpasangan.
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
            {isSaving ? "Menyimpan..." : "Simpan Bobot"}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-premium glass overflow-hidden transition-premium">
          <CardHeader className="bg-white/5 border-b border-white/5">
            <CardTitle className="text-lg font-bold font-heading">Matriks Perbandingan</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-[0.15em] opacity-60">
              Skala Kepentingan 1 - 9
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest pl-6">Kriteria</TableHead>
                  {kriteria.map(k => (
                    <TableHead key={k.id} className="text-center font-black text-[10px] uppercase tracking-widest">{k.nama}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {kriteria.map((kRow, i) => (
                  <TableRow key={kRow.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-bold text-sm bg-white/5 pl-6 border-r border-white/5">{kRow.nama}</TableCell>
                    {kriteria.map((kCol, j) => {
                      if (i === j) return (
                        <TableCell key={kCol.id} className="text-center bg-primary/10 font-black text-primary text-sm">
                          1
                        </TableCell>
                      );
                      if (i > j) {
                        const key = `${kCol.id}-${kRow.id}`;
                        const val = localValues[key] || 1;
                        return (
                          <TableCell key={kCol.id} className="text-center text-muted-foreground font-mono text-[10px] opacity-40">
                            {(1/val).toFixed(2)}
                          </TableCell>
                        );
                      }
                      const key = `${kRow.id}-${kCol.id}`;
                      return (
                        <TableCell key={kCol.id} className="p-2 border-white/5">
                          <div className="flex items-center justify-center">
                            <select 
                              className="w-full max-w-[80px] bg-card/50 border border-white/10 rounded-lg text-center text-xs font-bold py-1.5 focus:ring-2 ring-primary/50 transition-all cursor-pointer hover:border-primary/50 appearance-none"
                              value={localValues[key] || 1}
                              onChange={(e) => handleUpdateValue(kRow.id, kCol.id, parseFloat(e.target.value))}
                            >
                              <optgroup label="Penting (1-9)">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => <option key={num} value={num}>{num}</option>)}
                              </optgroup>
                              <optgroup label="Kurang Penting (1/n)">
                                {[2, 3, 4, 5, 6, 7, 8, 9].map(num => <option key={`inv-${num}`} value={1/num}>1/{num}</option>)}
                              </optgroup>
                            </select>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-premium glass border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Analisis Hasil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Consistency Ratio</span>
                  <span className="text-3xl font-black font-mono tracking-tighter">
                    {results?.CR.toFixed(4)}
                  </span>
                </div>
                
                {results?.isConsistent ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="size-4" /> 
                    STATUS: KONSISTEN
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl">
                    <AlertCircle className="size-4" /> 
                    STATUS: TIDAK KONSISTEN
                  </div>
                )}
              </div>

              {/* Dynamic Analysis Text */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Info className="size-3" /> Interpretasi Strategis
                </h4>
                <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
                  {results && (() => {
                    const sortedWeights = [...results.priorityVector]
                      .map((w, i) => ({ nama: kriteria[i].nama, val: w }))
                      .sort((a, b) => b.val - a.val);
                    
                    const topCrit = sortedWeights[0];
                    const bottomCrit = sortedWeights[sortedWeights.length - 1];
                    const ratio = topCrit.val / (bottomCrit.val || 1);

                    return (
                      <>
                        <p>
                          Berdasarkan pembobotan Anda, kriteria <span className="text-foreground font-bold italic">{topCrit.nama}</span> menjadi prioritas utama dengan pengaruh sebesar <span className="text-primary font-black">{(topCrit.val * 100).toFixed(1)}%</span> terhadap keputusan akhir.
                        </p>
                        <p>
                          Kepentingan kriteria ini sekitar <span className="font-bold text-foreground">{ratio.toFixed(1)}x lipat</span> lebih besar dibandingkan <span className="italic">{bottomCrit.nama}</span>.
                        </p>
                        {!results.isConsistent && (
                          <p className="text-orange-400 font-medium">
                            ⚠️ Perhatian: Logika perbandingan Anda masih memiliki inkonsistensi yang tinggi. Disarankan untuk meninjau kembali matriks di samping agar hasil ranking lebih reliabel.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest">Bobot Kriteria</h4>
                  <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter">
                    Priority Vector
                  </div>
                </div>
                <div className="space-y-4">
                  {kriteria.map((k, i) => (
                    <div key={k.id} className="group space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold tracking-tight">{k.nama}</span>
                        <span className="text-xs font-black font-mono text-primary">
                          {results ? (results.priorityVector[i] * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="relative w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                         <div 
                           className="bg-primary h-full transition-all duration-1000 ease-out shadow-glow" 
                           style={{ width: `${results ? (results.priorityVector[i] * 100) : 0}%` }}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm glass border-l-4 border-l-muted opacity-60">
            <CardContent className="p-4 flex gap-3 text-xs font-medium leading-relaxed">
              <Info className="size-4 shrink-0 text-primary" />
              <p>Perubahan pada matriks di samping akan dihitung secara otomatis secara realtime.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
