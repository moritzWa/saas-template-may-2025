import { FileText, Home, Moon, MoreVertical, PanelLeft, Plus, Settings, Sun, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { trpc } from '@/utils/trpc';
import { Button } from './ui/button';

type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
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
  useSidebar,
} from './ui/sidebar';

export function AppSidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';

  const { data: documents } = trpc.documents.list.useQuery(
    { token, limit: 10 },
    { enabled: !!token }
  );

  const utils = trpc.useUtils();

  const createDocument = trpc.documents.create.useMutation({
    onSuccess: (doc) => {
      utils.documents.list.invalidate();
      router.push(`/documents/${doc.id}`);
    },
  });

  const deleteDocument = trpc.documents.delete.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate();
    },
  });

  const handleCreateNew = () => {
    createDocument.mutate({ token });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this document?')) {
      deleteDocument.mutate({ token, id });
      if (router.asPath === `/documents/${id}`) {
        router.push('/');
      }
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="PROJECT_NAME"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">PROJECT_NAME</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleCreateNew}
              tooltip="New Document"
              disabled={createDocument.isLoading}
            >
              <Plus className="size-4" />
              <span>New</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documents?.map((doc: Document) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={router.asPath === `/documents/${doc.id}`}
                    tooltip={doc.title}
                    className="relative group/item cursor-pointer"
                  >
                    <Link href={`/documents/${doc.id}`}>
                      <FileText className="size-4" />
                      <span className="truncate">{doc.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover/item:opacity-100 absolute right-1 top-1 group-data-[collapsible=icon]:hidden"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleDelete(doc.id, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              {documents?.length === 0 && (
                <div className="px-2 py-4 text-sm text-muted-foreground">No documents yet</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push('/settings')}
              isActive={router.pathname === '/settings'}
              tooltip="Settings"
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Theme">
                  {theme === 'light' && <Sun className="size-4" />}
                  {theme === 'dark' && <Moon className="size-4" />}
                  {theme === 'system' && <Sun className="size-4" />}
                  <span>Theme</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end">
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
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={state === 'expanded' ? 'Collapse' : 'Expand'}
            >
              <PanelLeft className="size-4" />
              <span>{state === 'expanded' ? 'Collapse' : 'Expand'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
