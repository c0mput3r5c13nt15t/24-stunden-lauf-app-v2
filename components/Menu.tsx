import { PossibleIcons } from 'heroicons-lookup';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { auth } from '@/lib/firebase';

interface MenuProps {
  navItems: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: PossibleIcons;
}

export default function Menu({ navItems }: MenuProps) {
  async function logout() {
    return auth
      .signOut()
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <div className="menu w-max rounded-box menu-horizontal absolute bottom-3 left-1/2 z-40 -translate-x-1/2 bg-base-100 p-2 shadow-xl landscape:bottom-1/2 landscape:left-2 landscape:translate-x-0 landscape:translate-y-1/2 landscape:gap-2 landscape:menu-vertical">
        <ul className="flex flex-row gap-2 landscape:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="btn-ghost btn-square btn justify-center btn-sm sm:btn-md"
              aria-label={item.name}
            >
              <Icon name={item.icon} />
            </Link>
          ))}
        </ul>
        <div className="divider divider-horizontal !m-0 landscape:divider-vertical" />
        <button
          onClick={logout}
          className="btn-ghost btn-square btn text-error btn-sm sm:btn-md"
          aria-label="Logout"
        >
          <Icon name="LogoutIcon" />
        </button>
      </div>
    </>
  );
}
