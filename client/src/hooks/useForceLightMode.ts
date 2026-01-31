import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * Forces light mode for the duration of the component's lifecycle.
 * Use this on public pages (landing, blog, about) that aren't dark mode compatible.
 */
export function useForceLightMode() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const previousTheme = theme;

    // Force light mode
    if (theme !== 'light') {
      setTheme('light');
    }

    // Restore previous theme on unmount
    return () => {
      if (previousTheme && previousTheme !== 'light') {
        setTheme(previousTheme);
      }
    };
  }, []);
}
