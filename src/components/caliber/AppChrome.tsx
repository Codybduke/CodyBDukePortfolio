/**
 * App chrome from the component library's Menus page (17:2), relabelled to the
 * Skill Intelligence nav in the packet screenshots.
 */
import {
  CaliberLogo,
  IconAdmin,
  IconAnalytics,
  IconBell,
  IconCourses,
  IconHome,
  IconPaths,
  IconRolePlays,
  IconSearch,
  IconSkills,
} from './icons';

const NAV = [
  { label: 'Home', Icon: IconHome },
  { label: 'Courses', Icon: IconCourses },
  { label: 'Role Plays', Icon: IconRolePlays },
  { label: 'Paths', Icon: IconPaths },
  { label: 'Analytics', Icon: IconAnalytics },
  { label: 'Skills', Icon: IconSkills, current: true, isNew: true },
  { label: 'Admin', Icon: IconAdmin },
];

export function AppChrome({ initials = 'EN' }: { initials?: string }) {
  return (
    <header className="cal-nav">
      <div className="cal-nav__inner">
        <span className="cal-brand">
          <CaliberLogo height={28} />
        </span>

        <nav className="cal-nav__items" aria-label="Main">
          {NAV.map(({ label, Icon, current, isNew }) => (
            <a
              key={label}
              href="#"
              className="cal-nav__item"
              aria-current={current ? 'page' : undefined}
              onClick={(e) => e.preventDefault()}
            >
              <Icon size={20} />
              {label}
              {isNew ? <span className="cal-nav__new">NEW</span> : null}
            </a>
          ))}
        </nav>

        <div className="cal-nav__right">
          <div className="cal-nav__search"><IconSearch size={15} /> Search…</div>
          <span className="cal-nav__icon-btn"><IconBell size={17} /></span>
          <span className="cal-nav__avatar">{initials}</span>
        </div>
      </div>
    </header>
  );
}
