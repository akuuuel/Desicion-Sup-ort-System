"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kriteria, Alternatif, Penilaian, MatriksAHP } from "@/types";
import { calculateAHP } from "@/lib/ahp";
import { calculateSAW } from "@/lib/saw";
import { Button } from "@/components/ui/button";
import { FileDown, Trophy, Medal, RefreshCw, Info, BarChart2, CheckCircle2, AlertCircle, Calculator, LayoutDashboard, Zap, Sparkles, TrendingUp, ListOrdered, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getKriteria } from "@/app/actions/kriteria";
import { getAlternatif } from "@/app/actions/alternatif";
import { getPenilaian } from "@/app/actions/penilaian";
import { getMatriksAHP } from "@/app/actions/ahp";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RankingPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [penilaian, setPenilaian] = useState<Penilaian[]>([]);
  const [matriksAHP, setMatriksAHP] = useState<MatriksAHP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [kData, aData, pData, mData] = await Promise.all([
        getKriteria(), getAlternatif(), getPenilaian(), getMatriksAHP()
      ]);
      setKriteria(kData); setAlternatif(aData); setPenilaian(pData); setMatriksAHP(mData);
    } catch (error) {
       console.error(error);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const results = useMemo(() => {
    if (kriteria.length < 2 || alternatif.length === 0 || matriksAHP.length === 0) return null;
    const ahp = calculateAHP(kriteria, matriksAHP);
    if (!ahp) return null;
    const saw = calculateSAW(kriteria, alternatif, penilaian, ahp.priorityVector);
    if (!saw) return null;
    return { ahp, saw, ranking: saw.ranking };
  }, [kriteria, alternatif, penilaian, matriksAHP]);

  const handleExportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Rank', 'Nama', 'Skor']],
      body: results.ranking.map(i => [i.rank, i.nama, (i.skor * 100).toFixed(2)]),
    });
    doc.save('ranking.pdf');
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse">Menghitung keputusan...</div>;
  if (!results || results.ranking.length === 0) return <div className="p-20 text-center opacity-50 font-bold uppercase tracking-widest italic py-40 border-2 border-dashed rounded-3xl mx-6">Data tidak lengkap untuk perhitungan. <br/> <span className="text-[10px] font-medium opacity-50 mt-2 block italic">Pastikan Anda sudah mengisi Kriteria, Matriks AHP, Alternatif, dan Penilaian.</span></div>;

  const { ranking, saw } = results;
  const winners = ranking.filter(r => r.rank === 1);
  const bestCandidate = winners[0] || null;

  if (!bestCandidate) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. TOP NAVIGATION & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-muted p-1 h-12">
            <TabsTrigger value="overview" className="px-12 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-primary">
              <LayoutDashboard className="size-4" /> Hasil Utama
            </TabsTrigger>
            <TabsTrigger value="calculation" className="px-12 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-primary">
              <Calculator className="size-4" /> Detail Perhitungan
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-3 h-12">
          <Button variant="ghost" onClick={fetchData}><RefreshCw className="mr-2 size-4" /> Update</Button>
          <Button size="lg" onClick={handleExportPDF} className="rounded-xl shadow-glow font-bold"><FileDown className="mr-2 size-4" /> Export Report</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        {/* OVERVIEW CONTENT */}
        <TabsContent value="overview" className="space-y-12 animate-in fade-in duration-500">
           
           {/* REKOMENDASI TERBAIK BANNER */}
           <Card className="bg-primary text-primary-foreground border-none shadow-glow-primary overflow-hidden relative p-10 md:p-14 rounded-3xl">
              <Trophy className="absolute -right-6 -bottom-6 size-64 opacity-10" />
              <div className="relative z-10 space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="size-4" /> Rekomendasi Paling Optimal
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight italic">
                    {winners.map(w => w.nama).join(" & ")}
                 </h2>
                 <div className="flex items-end gap-10">
                    <div>
                       <div className="text-6xl md:text-8xl font-black font-mono">{(bestCandidate.skor * 100).toFixed(2)}</div>
                       <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Skor Konsistensi Akhir</div>
                    </div>
                    <div className="hidden lg:block max-w-md pb-3">
                       <p className="text-lg font-medium opacity-80 border-l-4 border-white/30 pl-4">
                          "Instansi ini memiliki keselarasan terbaik terhadap prioritas kriteria yang sudah Anda tentukan, terutama pada aspek <strong>{bestCandidate.insights?.strongest_kriteria}</strong>."
                       </p>
                    </div>
                 </div>
              </div>
           </Card>

           {/* DAFTAR RANKING LENGKAP TABLE */}
           <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                 <ListOrdered className="size-6 text-primary" /> Papan Peringkat
              </h3>
              <Card className="border shadow-premium overflow-hidden rounded-3xl">
                 <Table>
                    <TableHeader className="bg-muted/50">
                       <TableRow className="h-14 font-black">
                          <TableHead className="w-24 text-center text-[10px] uppercase">Rank</TableHead>
                          <TableHead className="text-[10px] uppercase pl-8">Instansi</TableHead>
                          <TableHead className="text-center text-[10px] uppercase">Skor Final</TableHead>
                          <TableHead className="text-right pr-12 text-[10px] uppercase">Status</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {ranking.map((res) => (
                          <TableRow key={res.alternatif_id} className={cn("h-16 transition-all", res.rank === 1 ? "bg-primary/5" : "hover:bg-muted/30")}>
                             <TableCell className="text-center font-black">
                                <span className={cn("size-10 inline-flex items-center justify-center rounded-xl text-sm shadow-sm", res.rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                   {res.rank}
                                </span>
                             </TableCell>
                             <TableCell className="font-bold text-lg pl-8">{res.nama}</TableCell>
                             <TableCell className="text-center font-mono font-black text-primary">{(res.skor * 100).toFixed(4)}</TableCell>
                             <TableCell className="text-right pr-12">
                                {res.rank === 1 ? <CheckCircle2 className="size-6 text-emerald-500 inline" /> : <Info className="size-5 text-muted-foreground opacity-20 inline" />}
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </Card>
           </div>

           {/* DETAIL ANALISIS (LARGE CARDS) */}
           <div className="space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                 <BarChart2 className="size-6 text-primary" /> Analisis Mendalam Per Alternatif
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {ranking.map((item) => (
                    <Card key={item.alternatif_id} className="relative bg-muted/20 border-none shadow-none rounded-[2rem] overflow-hidden flex flex-col group p-8">
                       {/* Rank Badge in the Corner */}
                       <div className="absolute top-6 right-6 size-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-lg shadow-glow">
                          #{item.rank}
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-1 pr-16">
                             <div className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Peringkat Terverifikasi</div>
                             <h4 className="text-2xl font-black tracking-tighter uppercase truncate">{item.nama}</h4>
                          </div>

                          <div className="flex items-center gap-10">
                             <div>
                                <div className="text-4xl font-black font-mono text-primary">{(item.skor * 100).toFixed(2)}</div>
                                <div className="text-[9px] font-bold uppercase opacity-40">Skor Akhir</div>
                             </div>
                             {item.rank > 1 && (
                                <div className="border-l pl-4 border-white/20">
                                   <div className="text-xs font-bold text-muted-foreground italic">Gap: -{(item.insights?.gap_to_top || 0).toFixed(4)}</div>
                                   <div className="text-[8px] font-black uppercase opacity-20">Selisih Poin</div>
                                </div>
                             )}
                          </div>

                          {/* Breakdown Chart */}
                          <div className="space-y-4 pt-2">
                             <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Zap className="size-3" /> Distribusi Skor Kriteria
                             </div>
                             <div className="space-y-3">
                                {item.insights?.scores.slice(0, 4).map((s, idx) => (
                                   <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                         <span className="truncate max-w-[180px]">{s.kriteria}</span>
                                         <span className="font-mono text-primary/70">{(s.score * 100).toFixed(1)}%</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden border border-white/50">
                                         <div 
                                           className="h-full bg-primary transition-all duration-1000" 
                                           style={{ width: `${(s.score / Math.max(...item.insights!.scores.map(x => x.score))) * 100}%` }} 
                                         />
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Strengths & Weaknesses */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                <div className="text-[8px] font-black uppercase text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="size-3" /> Rekomendasi</div>
                                <p className="text-xs font-bold text-foreground leading-tight">{item.insights?.strongest_kriteria}</p>
                             </div>
                             <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-1">
                                <div className="text-[8px] font-black uppercase text-orange-600 flex items-center gap-1.5"><AlertCircle className="size-3" /> Peningkatan</div>
                                <p className="text-xs font-bold text-foreground leading-tight">{item.insights?.weakest_kriteria}</p>
                             </div>
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>
           </div>
        </TabsContent>

        {/* CALCULATION CONTENT */}
        <TabsContent value="calculation" className="space-y-12 animate-in fade-in duration-500">
           {[
             { title: "Matriks Penilaian", data: saw.matrix, sub: "Data asli input penilaian" },
             { title: "Matriks Normalisasi", data: saw.normalizedMatrix, sub: "Penyamaan skala 0-1" },
             { title: "Matriks Terbobot", data: saw.weightedMatrix, sub: "Hasil Akumulasi Nilai x Bobot AHP" }
           ].map((step, idx) => (
             <Card key={idx} className="border shadow-none overflow-hidden rounded-3xl">
                <CardHeader className="bg-muted/50 border-b p-6">
                   <CardTitle className="text-lg font-black uppercase tracking-widest">{idx + 1}. {step.title}</CardTitle>
                   <CardDescription className="text-sm">{step.sub}</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto p-4">
                   <Table>
                      <TableHeader className="bg-white/5 h-12">
                        <TableRow className="border-none">
                          <TableHead className="w-64 font-bold text-[10px] pl-4 border-r">Alternatif</TableHead>
                          {kriteria.map(k => <TableHead key={k.id} className="text-center font-bold text-[10px] uppercase">{k.nama}</TableHead>)}
                          <TableHead className="text-center font-black text-[10px] uppercase border-l bg-primary/5 text-primary">TOTAL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alternatif.map((alt, i) => {
                          const rowTotal = step.data[i].reduce((acc: number, curr: number) => acc + curr, 0);
                          return (
                            <TableRow key={alt.id} className="h-12 hover:bg-muted/50">
                              <TableCell className="font-bold pl-4 border-r bg-muted/10 text-sm">{alt.nama}</TableCell>
                              {kriteria.map((k, j) => (
                                <TableCell key={k.id} className="text-center font-mono text-sm">
                                  {idx === 0 ? step.data[i][j] : step.data[i][j].toFixed(4)}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-mono font-black border-l bg-primary/5 text-primary">
                                {idx === 0 ? rowTotal.toFixed(0) : rowTotal.toFixed(4)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                   </Table>
                </div>
             </Card>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
