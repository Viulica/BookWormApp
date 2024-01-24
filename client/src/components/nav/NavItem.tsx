import "../../styles/NavItem.css";

function NavItem({ href, children, path }: NavItemProps) {
  let isActive = false;
  let className = "";
  href === path ? (isActive = true) : isActive;
  isActive ? (className = "active") : className;

  return (
    <li className={`nav-item-custom ${className}`}>
      <a href={href} className="">
        {children}
      </a>
    </li>
  );
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  path: string;
}

export default NavItem;
