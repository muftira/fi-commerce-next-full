import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/toggle-dark-mode';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Home from '@/components/sidebar/home';
import ListProducts from '@/components/sidebar/list-product';
import AddProduct from '@/components/sidebar/add-product';
import Orders from '@/components/sidebar/orders';

export default function Page() {
  const activeComponent = useSelector((state: RootState) => state.sidebar.activeComponent);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="text-[#171717] dark:text-[#ededed]">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='flex items-center mr-6 gap-2'>
            <p>Mode :</p>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeComponent === 'home' && <Home />}
          {activeComponent === 'listproducts' && <ListProducts />}
          {activeComponent === 'addproduct' && <AddProduct />}
          {activeComponent === 'orders' && <Orders />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
