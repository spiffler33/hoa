import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Today' },
  { path: '/weekly-review', label: 'Review' },
  { path: '/content', label: 'Content' },
  { path: '/playbook', label: 'Playbook' },
  { path: '/control', label: 'Control' },
  { path: '/reference', label: 'Reference' },
  { path: '/settings', label: 'Settings' },
];

export default function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-wordmark">Yes Lifers GTM</span>
      <div className="navbar-tabs">
        {tabs.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `navbar-tab${isActive ? ' navbar-tab--active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
