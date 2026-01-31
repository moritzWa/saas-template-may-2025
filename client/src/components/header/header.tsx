'use client';
import { useState, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export function Header({ className, ...props }: ComponentProps<'header'>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white',
        'flex items-center justify-between',
        'px-4 tablet:px-12',
        'h-[90px]',
        className
      )}
      {...props}
    >
      <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="font-bold text-xl">PROJECT_NAME</span>
      </Link>

      {/* Mobile menu button */}
      <button className="tablet:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Desktop nav */}
      <nav className="hidden tablet:flex items-center gap-6">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </Link>
        <Link href="/login">
          <Button>Get Started</Button>
        </Link>
      </nav>

      {/* Mobile nav overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[90px] z-50 tablet:hidden">
          <div className="absolute inset-0 bg-black/25" onClick={() => setIsOpen(false)} />
          <nav className="relative bg-white p-6 flex flex-col gap-4">
            <Link
              href="/blog"
              className="text-foreground hover:text-muted-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-muted-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
