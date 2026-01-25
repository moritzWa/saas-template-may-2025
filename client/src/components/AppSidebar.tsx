import { Moon, MoreVertical, Plus, Settings, Share, Sun, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/theme-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from './ui/sidebar';

// Example items to demonstrate sidebar functionality
const sidebarExampleItems = [
  { id: '1', name: 'Example Item 1' },
  { id: '2', name: 'Example Item 2' },
  { id: '3', name: 'Example Item 3' },
];

export function AppSidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleCreateNew = () => {
    router.push('/new');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center p-[0.12rem] justify-between">
          <h2 className="text-lg ml-2 font-semibold">
            <Link href="/home">PROJECT_NAME</Link>
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleCreateNew} className="h-6 w-6">
              <Plus />
            </Button>
            {router.pathname !== '/home' && <SidebarTrigger className="h-6 w-6" />}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Example Items</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarExampleItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => router.push(`/items/${item.id}`)}
                    isActive={router.pathname === `/items/${item.id}`}
                    className="relative group/item cursor-pointer flex w-full items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-background absolute right-1"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => alert('Share functionality not implemented in template')}
                          >
                            <Share className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              alert('Delete functionality not implemented in template')
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <div className="flex items-center justify-between px-2 py-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/settings')}
                isActive={router.pathname === '/settings'}
              >
                <Settings className="mr-2" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'system' && <Sun className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
