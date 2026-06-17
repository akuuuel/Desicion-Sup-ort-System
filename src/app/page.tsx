"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Map, Trophy, ArrowUpRight, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getKriteria } from "@/app/actions/kriteria";
import { getAlternatif } from "@/app/actions/alternatif";
import { getMatriksAHP } from "@/app/actions/ahp";
import { calculateAHP } from "@/lib/ahp";
import { calculateSAW } from "@/lib/saw";
import { getPenilaian } from "@/app/actions/penilaian";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    kriteria: 0,
    alternatif: 0,
    bestRanking: "-",
    crValue: 0,
    isConsistent: false
  });
  const [rankingData, setRankingData] = useState<{ name: string; score: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [kData, aData, mData, pData] = await Promise.all([
        getKriteria(),
        getAlternatif(),
        getMatriksAHP(),
        getPenilaian()
      ]);

      const ahp = calculateAHP(kData, mData);
      let bestRank = "-";
      let cr = 0;
      let consistent = false;
      let rankingArr: { name: string; score: number }[] = [];

      if (ahp) {
        cr = ahp.CR;
        consistent = ahp.isConsistent;
        
        if (pData.length > 0 && aData.length > 0) {
          const sawResult = calculateSAW(kData, aData, pData, ahp.priorityVector);
          if (sawResult && sawResult.ranking.length > 0) {
            bestRank = sawResult.ranking[0].nama;
            rankingArr = sawResult.ranking.slice(0, 5).map(item => ({
              name: item.nama.length > 15 ? item.nama.substring(0, 15) + "..." : item.nama,
              score: parseFloat((item.skor * 100).toFixed(2))
            }));
          }
        }
      }

      setStats({
        kriteria: kData.length,
        alternatif: aData.length,
        bestRanking: bestRank,
        crValue: cr,
        isConsistent: consistent
      });
      setRankingData(rankingArr);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-glow">
            <TrendingUp className="size-3" /> System Intelligence Live
          </div>
          <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground leading-[0.9]">
            Dashboard <span className="text-primary italic">Overview</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            Sistem Pendukung Keputusan Pemilihan Tempat Magang Terbaik dengan integrasi metode AHP & SAW.
          </p>
        </div>
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={fetchData} 
          disabled={isLoading} 
          className="rounded-2xl glass shadow-premium font-bold px-8 active:scale-95 transition-all"
        >
          <RefreshCw className={cn("size-4 mr-2", isLoading && "animate-spin")} />
          Sync Analytics
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Kriteria Penilaian", value: stats.kriteria, icon: BookOpen, color: "from-blue-500", desc: "Parameter Aktif" },
          { title: "Alternatif Magang", value: stats.alternatif, icon: Map, color: "from-indigo-500", desc: "Instansi Terdaftar" },
          { title: "Rekomendasi Utama", value: stats.bestRanking, icon: Trophy, color: "from-primary", desc: "Skor Tertinggi" },
          { 
            title: "Consistency Ratio", 
            value: stats.crValue.toFixed(4), 
            icon: TrendingUp, 
            color: stats.isConsistent ? "from-emerald-500" : "from-orange-500",
            desc: stats.isConsistent ? "Matriks Konsisten" : "Perlu Penyesuaian",
            statusColor: stats.isConsistent ? "text-emerald-500" : "text-orange-500"
          },
        ].map((item, i) => (
          <Card key={i} className="group relative overflow-hidden border-none shadow-premium glass transition-premium hover:-translate-y-1">
            <div className={cn("absolute -right-4 -top-4 size-24 bg-gradient-to-br opacity-5 blur-2xl rounded-full transition-all group-hover:scale-150", item.color)} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{item.title}</CardTitle>
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <item.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-black tracking-tighter truncate", item.statusColor)}>
                {isLoading ? <div className="h-9 w-20 bg-white/5 animate-pulse rounded-lg" /> : item.value}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-premium glass overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5">
            <div className="space-y-1">
               <CardTitle className="text-lg font-bold font-heading uppercase tracking-tighter">Sebaran <span className="text-primary italic">Skor Akhir</span></CardTitle>
               <CardDescription className="text-xs uppercase tracking-widest opacity-60">Top 5 Alternatif Terbaik</CardDescription>
            </div>
            <BarChart2 className="size-5 text-primary/40" />
          </CardHeader>
          <CardContent className="h-[400px] pt-10 pb-6">
             {isLoading ? (
               <div className="h-full flex items-center justify-center text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse italic">Processing Analytics...</div>
             ) : rankingData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={rankingData} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor' }} 
                      width={120}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(20,20,25,0.95)', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ color: '#6366f1', fontWeight: 900, fontSize: '12px' }}
                    />
                    <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={24} animationDuration={1500}>
                      {rankingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'rgba(99, 102, 241, 0.4)'} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-20 group">
                  <BarChart2 className="size-16 group-hover:scale-110 transition-transform" />
                  <p className="font-black uppercase tracking-[0.3em] text-[10px]">Data Belum Lengkap</p>
               </div>
             )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-none shadow-premium glass flex flex-col">
          <CardHeader className="bg-white/5 border-b border-white/5">
            <CardTitle className="text-lg font-bold font-heading uppercase tracking-tighter">Workflow <span className="text-primary italic">Keputusan</span></CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest opacity-60">Status Progress Proyek</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col">
            <div className="space-y-6 flex-1">
              {[
                { step: 1, title: "Kriteria Magang", desc: "Definisikan parameter", status: stats.kriteria > 0 ? "done" : "current", href: "/kriteria" },
                { step: 2, title: "Daftar Instansi", desc: "Data perusahaan magang", status: stats.alternatif > 0 ? "done" : (stats.kriteria > 0 ? "current" : "upcoming"), href: "/alternatif" },
                { step: 3, title: "Pembobotan AHP", desc: "Evaluasi prioritas", status: stats.crValue > 0 ? "done" : (stats.alternatif > 0 ? "current" : "upcoming"), href: "/ahp" },
                { step: 4, title: "Skoring Alternatif", desc: "Input nilai detail", status: rankingData.length > 0 ? "done" : (stats.crValue > 0 ? "current" : "upcoming"), href: "/penilaian" },
                { step: 5, title: "Executive Report", desc: "Hasil ranking akhir", status: rankingData.length > 0 ? "done" : "upcoming", href: "/ranking" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 group relative">
                  <div className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black transition-all shadow-sm",
                    item.status === 'done' ? 'bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30' : 
                    item.status === 'current' ? 'bg-primary text-primary-foreground shadow-glow' : 
                    'bg-white/5 text-muted-foreground/40'
                  )}>
                    {item.step}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className={cn(
                      "text-xs font-black uppercase tracking-widest leading-none",
                      item.status === 'upcoming' ? 'opacity-30' : ''
                    )}>
                      {item.title}
                    </p>
                    <p className={cn(
                      "text-[10px] text-muted-foreground font-medium truncate",
                      item.status === 'upcoming' ? 'opacity-30' : ''
                    )}>
                      {item.desc}
                    </p>
                  </div>
                  <Link 
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20 hover:text-primary",
                      item.status === 'upcoming' && "hidden"
                    )}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
               <Link 
                 href="/ranking" 
                 className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-2xl shadow-glow bg-primary font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all text-primary-foreground")}
               >
                 View Rankings
                 <ArrowUpRight className="ml-2 size-3" />
               </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
