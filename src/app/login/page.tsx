'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { KeyRound, Mail, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    const result = isLogin ? await login(formData) : await signup(formData)
    
    if (result?.error) {
      toast.error(isLogin ? 'Login Gagal' : 'Pendaftaran Gagal', {
        description: result.error,
      })
      setLoading(false)
    } else if (result?.success) {
      toast.success(isLogin ? 'Login Berhasil' : 'Pendaftaran Berhasil', {
        description: isLogin ? 'Selamat datang kembali di InternRank!' : 'Akun Anda telah berhasil dibuat.',
      })
      
      // Delay sedikit agar user bisa melihat toast sukses
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
           <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow-primary rotate-3 transform transition-transform hover:rotate-0">
              <Sparkles className="size-8 text-primary-foreground" />
           </div>
           <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter uppercase">Intern<span className="text-primary italic">Rank</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Decision Intelligence Platform</p>
           </div>
        </div>

        <Card className="border-none shadow-2xl glass overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-1 pb-6 pt-10 text-center">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              {isLogin ? 'Masuk untuk mengelola hasil ranking Anda' : 'Daftar untuk mulai menganalisis tempat magang'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest pl-1">Alamat Email</Label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                   <Input 
                     id="email" 
                     name="email" 
                     type="email" 
                     placeholder="nama@email.com" 
                     required 
                     className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest pl-1">Kata Sandi</Label>
                <div className="relative group">
                   <KeyRound className="absolute left-4 top-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                   <Input 
                     id="password" 
                     name="password" 
                     type="password" 
                     placeholder="••••••••" 
                     required 
                     className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                   />
                </div>
              </div>
              

              <Button 
                type="submit" 
                className="w-full h-12 rounded-2xl bg-primary shadow-glow font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'}
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-white/5 border-t border-white/5 p-6 flex flex-col gap-2">
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors pr-2"
             >
               {isLogin ? 'Belum punya akun? Daftar gratis' : 'Sudah punya akun? Masuk'}
             </button>
             <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
                Protected by InternRank Core Engine 2.0
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
