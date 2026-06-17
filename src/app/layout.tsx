import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InternRank - SPK Pemilihan Tempat Magang Terbaik",
  description: "Sistem Pendukung Keputusan Pemilihan Tempat Magang menggunakan metode AHP dan SAW",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  let user = null;
  
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error("Layout Auth Check Error:", error);
    // Jika error network, jangan langsung lempar ke login
  }

  // Kita buat layout tetap tampil agar tidak terjebak di halaman login saat koneksi buruk
  // Jika tidak ada user sama sekali (memang belum login), halaman anak (children) 
  // akan otomatis menampilkan form login dari file page.tsx masing-masing atau via login page.
  return (
    <html lang="id" className="content-dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Toaster position="top-center" richColors />
        <SidebarProvider>
          {user && <AppSidebar />}
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 px-6 sticky top-0 bg-transparent z-10">
              <div className="flex items-center gap-2 rounded-full bg-card/50 backdrop-blur-xl border border-white/5 pl-2 pr-4 py-1.5 shadow-sm">
                {user && <SidebarTrigger className="h-7 w-7" />}
                {user && <Separator orientation="vertical" className="h-4 bg-white/10" />}
                <h1 className="text-xs font-black font-heading uppercase tracking-[0.2em] text-muted-foreground">
                  Overview <span className="text-primary/60 mx-1">/</span> <span className="text-foreground">InternRank Platform</span>
                </h1>
              </div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-10 space-y-10">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
