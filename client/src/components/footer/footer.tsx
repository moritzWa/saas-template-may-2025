import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'bg-muted text-foreground',
        'py-12 px-4 md:px-12',
        className
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="font-bold text-xl">PROJECT_NAME</span>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">
              Build your SaaS faster with a modern stack.
            </p>
          </div>

          <div className="flex gap-12 md:gap-20">
            <div className="space-y-3">
              <h5 className="font-semibold text-sm">Resources</h5>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">Company</h5>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground">
          PROJECT_NAME © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
