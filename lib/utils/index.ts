import { ToastOptions, ToastPromiseParams, toast } from 'react-toastify';
import { Runner } from '@/lib/interfaces';
import { PossibleIcons } from 'heroicons-lookup';

export interface NavItem {
  name: string;
  href: string;
  icon: PossibleIcons;
}

// Used in pages/runner/index.tsx, pages/runner/charts.tsx, pages/assistant/index.tsx, pages/assistant/create-runner.tsx 
export const runnerNavItems: NavItem[] = [
  { name: 'Startseite', href: '/runner', icon: 'HomeIcon' },
  {
    name: 'Ranking',
    href: '/ranking',
    icon: 'TrendingUpIcon',
  },
  {
    name: 'Statistik',
    href: '/runner/charts',
    icon: 'ChartBarIcon',
  },
];
export const assistantNavItems: NavItem[] = [
  {
    name: 'Runde zählen',
    href: '/assistant',
    icon: 'HomeIcon',
  },
  {
    name: 'Ranking',
    href: '/ranking',
    icon: 'TrendingUpIcon',
  },
  {
    name: 'Läufer hinzufügen',
    href: '/assistant/create-runner',
    icon: 'UserAddIcon',
  },
];

// Used in components/LoginOptions.tsx, pages/assistant/create-runner.tsx, pages/assistant/index.tsx
export function themedPromiseToast(
  promise: Promise<any> | (() => Promise<any>),
  { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
  options?: ToastOptions<{}> | undefined
) {
  return toast.promise(
    promise,
    {
      pending,
      success,
      error,
    },
    {
      ...options,
      theme:
        document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    }
  );
}

// Used in components/LoginOptions.tsx
export function themedErrorToast(
  message: string,
  options?: ToastOptions<{}> | undefined
) {
  return toast.error(message, {
    ...options,
    theme:
      document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  });
}

// Used in pages/ranking.tsx
export function filterRunner(
  runner: Runner,
  {
    filterType,
    filterName,
    filterClasses,
    filterHouse,
  }: {
    filterType?: string;
    filterName?: string;
    filterClasses?: string;
    filterHouse?: string;
  }
) {
  if (filterType) {
    if (filterType === 'student' && runner.type !== 'student') {
      return false;
    }
    if (filterType === 'staff' && runner.type !== 'staff') {
      return false;
    }
    if (
      filterType === 'other' &&
      (runner.type === 'student' || runner.type === 'staff')
    ) {
      return false;
    }
  }

  if (filterClasses || filterHouse) {
    if (runner.type === 'student') {
      if (filterClasses && runner.class !== filterClasses) {
        return false;
      }
      if (filterHouse && runner.house !== filterHouse) {
        return false;
      }
    } else {
      return false || (filterHouse == 'Extern (Kollegium)' && !filterClasses);
    }
  }

  return !filterName || runner.name?.includes(filterName);
}