"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Map,
  Settings2,
  Trophy,
} from "lucide-react";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  // ... (keeping the same data structure)
  navMain: [
    {
      title: "Main Menu",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Kriteria",
          url: "/kriteria",
          icon: BookOpen,
        },
        {
          title: "Tempat Magang",
          url: "/alternatif",
          icon: Map,
        },
      ],
    },
    {
      title: "Perhitungan SPK",
      url: "#",
      items: [
        {
          title: "Matriks AHP",
          url: "/ahp",
          icon: Settings2,
        },
        {
          title: "Penilaian",
          url: "/penilaian",
          icon: ClipboardList,
        },
        {
          title: "Hasil & Ranking",
          url: "/ranking",
          icon: Trophy,
        },
      ],
    },
  ],
};

import { LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";
import { SidebarFooter } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow text-primary-foreground transform transition-transform hover:rotate-6">
            <BarChart3 className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-black text-xl tracking-tighter text-foreground">InternRank</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Premium SPK</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="py-4">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      render={<a href={item.url} />}
                      isActive={pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))}
                    >
                      <item.icon className="size-4" />
                      <span className="font-semibold">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-muted/10">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton 
               onClick={() => logout()}
               className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-10 rounded-xl"
             >
                <LogOut className="size-4" />
                <span className="font-bold uppercase text-[10px] tracking-widest">Logout Session</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
