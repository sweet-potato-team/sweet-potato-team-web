import { NavLink } from 'react-router-dom';

function SidebarLink({ to, iconClass, label, isCollapsed, activeColor, defaultColor }) {
  return (
    <NavLink
      className='list-group-item list-group-item-action py-3'
      to={to}
      style={({ isActive }) => ({
        backgroundColor: isActive ? activeColor : '',
        color: isActive ? '#fff' : defaultColor,
        borderColor: isActive ? activeColor : ''
      })}
    >
      <i className={`${iconClass} me-2`} />
      {!isCollapsed && label}
    </NavLink>
  );
}

export default SidebarLink;
