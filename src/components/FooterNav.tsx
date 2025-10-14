import { NavLink } from "react-router-dom";
import { Upload, Paintbrush, Image, MoreHorizontal } from "lucide-react";

const navItems = [
  { path: "/", label: "Upload", icon: Upload },
  { path: "/apply", label: "Apply Paint", icon: Paintbrush },
  { path: "/output", label: "Output", icon: Image },
  { path: "/more", label: "More", icon: MoreHorizontal },
];

export const FooterNav = () => {
  const activeLinkClass = "text-primary";
  const inactiveLinkClass = "text-gray-500 dark:text-gray-400";

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-background-light/80 backdrop-blur-sm dark:border-gray-700 dark:bg-background-dark/80">
      <nav className="flex justify-around px-2 pt-2 pb-4">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-1/4 ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <Icon size={24} />
            <p className="text-xs font-medium tracking-wide">{label}</p>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};
