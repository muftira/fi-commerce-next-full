import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { setActiveComponent } from '@/store/slices/sidebarSlice';

// components
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
  const dispatch = useDispatch();
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
                {activeComponent === 'home' ? (
                  <BreadcrumbItem className="hidden md:block cursor-pointer">
                    <BreadcrumbLink onClick={() => dispatch(setActiveComponent('home'))}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : activeComponent === 'orders' ? (
                  <BreadcrumbItem className="hidden md:block cursor-pointer">
                    <BreadcrumbLink onClick={() => dispatch(setActiveComponent('orders'))}>
                      Orders
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : activeComponent === 'addproduct' || activeComponent === 'listproducts' ? (
                  <BreadcrumbItem className="hidden md:block cursor-pointer">
                    <BreadcrumbLink onClick={() => dispatch(setActiveComponent('listproducts'))}>
                      Product
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
                {activeComponent === 'addproduct' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Add Product</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                {activeComponent === 'listproducts' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>List Product</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center mr-6 gap-2">
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
