import PropTypes from 'prop-types';
import "../styles/NavItem.css"

function NavItem({ href, children }: NavItemProps) {
  return (
    <li className="nav-item-custom">
      <a href={href} className="">
        {children}
      </a>
    </li>
  );
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

export default NavItem;