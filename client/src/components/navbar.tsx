import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

function getIsAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

function NavLinks({ pathname }: { pathname: string }) {
  const isAuthenticated = getIsAuthenticated();

  return (
    <>
      <Link
        href="/blog"
        className={`hover:text-primary transition-colors ${
          pathname === '/blog' || pathname.startsWith('/blog/')
            ? 'text-primary font-medium'
            : ''
        }`}
      >
        Blog
      </Link>

      {isAuthenticated ? (
        <Link
          href="/"
          className={`hover:text-primary transition-colors ${
            pathname === '/' ? 'text-primary font-medium' : ''
          }`}
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className={`hover:text-primary transition-colors ${
            pathname === '/login' ? 'text-primary font-medium' : ''
          }`}
        >
          Login
        </Link>
      )}
    </>
  );
}

export function Navbar() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-xl font-bold mr-8">
            PROJECT_NAME
          </Link>

          <nav className="hidden md:flex space-x-6">
            <NavLinks pathname={router.pathname} />
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks pathname={router.pathname} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
