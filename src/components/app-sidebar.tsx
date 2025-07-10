import { useState, useEffect } from 'react';
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  ListOrdered,
  Package,
  House,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserLogin } from '@/types';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<UserLogin | null>(null);
  const data = {
    user: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.profilePicture.url || '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Home',
        url: 'home',
        icon: House,
        isActive: true,
        items: [
          // {
          //   title: "History",
          //   url: "#",
          // },
          // {
          //   title: "Starred",
          //   url: "#",
          // },
          // {
          //   title: "Settings",
          //   url: "#",
          // },
        ],
      },
      {
        title: 'Products',
        url: 'listproducts',
        icon: Package,
        items: [
          {
            title: 'List Products',
            url: 'listproducts',
          },
          {
            title: 'Add Product',
            url: 'addproduct',
          },
        ],
      },
      {
        title: 'Orders',
        url: 'orders',
        icon: ListOrdered,
        items: [
          // {
          //   title: "Introduction",
          //   url: "#",
          // },
          // {
          //   title: "Get Started",
          //   url: "#",
          // },
          // {
          //   title: "Tutorials",
          //   url: "#",
          // },
          // {
          //   title: "Changelog",
          //   url: "#",
          // },
        ],
      },
    ],
  };

  const User = () => {
    const data = JSON.parse(localStorage.getItem('fiCommerce') || '{}');
    if (data) {
      setUser(data);
    }
  };
  useEffect(() => {
    User();
  }, []);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
