/**
 * Caliber nav icons from the official SVG exports (public/caliber/).
 * Paths are inlined so they can inherit currentColor for hover / current page.
 * Search, bell and Admin are still stand-ins — those files were not in the drop.
 */
import type { SVGProps } from 'react';
import { withBase } from '../../lib/paths';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Official 24×24 nav icons use a 2px stroke. */
function NavSvg({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: P) => (
  <NavSvg {...p}>
    <path d="M12.9823 2.76403C12.631 2.49078 12.4553 2.35415 12.2613 2.30163C12.0902 2.25529 11.9098 2.25529 11.7387 2.30163C11.5447 2.35415 11.369 2.49078 11.0177 2.76403L4.23539 8.03916C3.78202 8.39178 3.55534 8.56809 3.39203 8.78889C3.24737 8.98447 3.1396 9.20481 3.07403 9.43908C3 9.70355 3 9.99073 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H8.2C8.48003 21 8.62004 21 8.727 20.9455C8.82108 20.8976 8.89757 20.8211 8.9455 20.727C9 20.6201 9 20.48 9 20.2V13.6C9 13.04 9 12.7599 9.10899 12.546C9.20487 12.3579 9.35785 12.2049 9.54601 12.109C9.75992 12 10.0399 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3579 14.891 12.546C15 12.7599 15 13.04 15 13.6V20.2C15 20.48 15 20.6201 15.0545 20.727C15.1024 20.8211 15.1789 20.8976 15.273 20.9455C15.38 21 15.52 21 15.8 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99073 21 9.70355 20.926 9.43908C20.8604 9.20481 20.7526 8.98447 20.608 8.78889C20.4447 8.56809 20.218 8.39178 19.7646 8.03916L12.9823 2.76403Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </NavSvg>
);

export const IconCourses = (p: P) => (
  <NavSvg {...p}>
    <path d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 15C6.65685 15 8 13.6569 8 12C8 10.3431 6.65685 9 5 9C3.34315 9 2 10.3431 2 12C2 13.6569 3.34315 15 5 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 15C20.6569 15 22 13.6569 22 12C22 10.3431 20.6569 9 19 9C17.3431 9 16 10.3431 16 12C16 13.6569 17.3431 15 19 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 7L7 10" stroke="currentColor" strokeWidth="2" />
    <path d="M17 14L14 17" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" />
  </NavSvg>
);

export const IconRolePlays = (p: P) => (
  <NavSvg {...p}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 8.96533C9.5 8.48805 9.5 8.24941 9.59974 8.11618C9.68666 8.00007 9.81971 7.92744 9.96438 7.9171C10.1304 7.90525 10.3311 8.03429 10.7326 8.29239L15.4532 11.3271C15.8016 11.551 15.9758 11.663 16.0359 11.8054C16.0885 11.9298 16.0885 12.0702 16.0359 12.1946C15.9758 12.337 15.8016 12.449 15.4532 12.6729L10.7326 15.7076C10.3311 15.9657 10.1304 16.0948 9.96438 16.0829C9.81971 16.0726 9.68666 15.9999 9.59974 15.8838C9.5 15.7506 9.5 15.512 9.5 15.0347V8.96533Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </NavSvg>
);

export const IconPaths = (p: P) => (
  <NavSvg {...p}>
    <path d="M11.5 5H11.9344C14.9816 5 16.5053 5 17.0836 5.54729C17.5836 6.02037 17.8051 6.71728 17.6702 7.39221C17.514 8.17302 16.2701 9.05285 13.7823 10.8125L9.71772 13.6875C7.2299 15.4471 5.98599 16.327 5.82984 17.1078C5.69486 17.7827 5.91642 18.4796 6.41636 18.9527C6.99474 19.5 8.51836 19.5 11.5656 19.5H12.5M8 5C8 6.65685 6.65685 8 5 8C3.34315 8 2 6.65685 2 5C2 3.34315 3.34315 2 5 2C6.65685 2 8 3.34315 8 5ZM22 19C22 20.6569 20.6569 22 19 22C17.3431 22 16 20.6569 16 19C16 17.3431 17.3431 16 19 16C20.6569 16 22 17.3431 22 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </NavSvg>
);

export const IconAnalytics = (p: P) => (
  <NavSvg {...p}>
    <path d="M9 7H4.6C4.03995 7 3.75992 7 3.54601 7.10899C3.35785 7.20487 3.20487 7.35785 3.10899 7.54601C3 7.75992 3 8.03995 3 8.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H9M9 21H15M9 21L9 4.6C9 4.03995 9 3.75992 9.10899 3.54601C9.20487 3.35785 9.35785 3.20487 9.54601 3.10899C9.75992 3 10.0399 3 10.6 3L13.4 3C13.9601 3 14.2401 3 14.454 3.10899C14.6422 3.20487 14.7951 3.35785 14.891 3.54601C15 3.75992 15 4.03995 15 4.6V21M15 11H19.4C19.9601 11 20.2401 11 20.454 11.109C20.6422 11.2049 20.7951 11.3578 20.891 11.546C21 11.7599 21 12.0399 21 12.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </NavSvg>
);

export const IconSkills = (p: P) => (
  <NavSvg {...p}>
    <path d="M9.40255 4.76408C9.77953 3.74531 11.2205 3.74531 11.5974 4.76408L13.4738 9.83484C13.5923 10.1551 13.8449 10.4077 14.1652 10.5262L19.2359 12.4026C20.2547 12.7795 20.2547 14.2205 19.2359 14.5974L14.1652 16.4738C13.8449 16.5923 13.5923 16.8449 13.4738 17.1652L11.5975 22.2359C11.2205 23.2547 9.77953 23.2547 9.40255 22.2359L7.5262 17.1652C7.40768 16.8449 7.15514 16.5923 6.83484 16.4738L1.76408 14.5975C0.745307 14.2205 0.745306 12.7795 1.76408 12.4026L6.83484 10.5262C7.15514 10.4077 7.40768 10.1551 7.5262 9.83484L9.40255 4.76408Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M19.0957 1.2815C19.2346 0.906166 19.7654 0.906165 19.9043 1.2815L20.5956 3.14968C20.6393 3.26768 20.7323 3.36072 20.8503 3.40439L22.7185 4.09568C23.0938 4.23456 23.0938 4.76544 22.7185 4.90432L20.8503 5.59561C20.7323 5.63928 20.6393 5.73232 20.5956 5.85032L19.9043 7.7185C19.7654 8.09383 19.2346 8.09383 19.0957 7.7185L18.4044 5.85032C18.3607 5.73232 18.2677 5.63928 18.1497 5.59561L16.2815 4.90432C15.9062 4.76544 15.9062 4.23456 16.2815 4.09568L18.1497 3.40439C18.2677 3.36072 18.3607 3.26768 18.4044 3.14968L19.0957 1.2815Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </NavSvg>
);

export const IconAdmin = (p: P) => (
  <Svg {...p}><path d="M12 3.5 4.5 6.5v5c0 4.4 3.1 7.9 7.5 9 4.4-1.1 7.5-4.6 7.5-9v-5z" /></Svg>
);

export const IconSearch = (p: P) => (
  <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></Svg>
);

export const IconBell = (p: P) => (
  <Svg {...p}><path d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15z" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></Svg>
);

export const IconX = (p: P) => (
  <Svg {...p}><path d="M6 6 18 18M18 6 6 18" /></Svg>
);

export const IconChevronDown = (p: P) => (
  <Svg {...p}><path d="m6 9.5 6 6 6-6" /></Svg>
);

export const IconChevronRight = (p: P) => (
  <Svg {...p}><path d="m9.5 6 6 6-6 6" /></Svg>
);

export const IconChevronUp = (p: P) => (
  <Svg {...p}><path d="m6 14.5 6-6 6 6" /></Svg>
);

export const IconArrowUp = (p: P) => (
  <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>
);

export const IconArrowDown = (p: P) => (
  <Svg {...p}><path d="M12 5v14M18 13l-6 6-6-6" /></Svg>
);

export const IconArrowLeft = (p: P) => (
  <Svg {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Svg>
);

export const IconCheckCircle = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="m8.4 12.2 2.4 2.4 4.8-4.9" /></Svg>
);

export const IconTarget = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.4" /></Svg>
);

export const IconInfo = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.2" /><circle cx="12" cy="8.1" r=".9" fill="currentColor" stroke="none" /></Svg>
);

export const IconAlert = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.8v4.6" /><circle cx="12" cy="15.9" r=".9" fill="currentColor" stroke="none" /></Svg>
);

export const IconClock = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.4V12l3.1 1.9" /></Svg>
);

export const IconCalendar = (p: P) => (
  <Svg {...p}><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></Svg>
);

export const IconPhone = (p: P) => (
  <Svg {...p}><path d="M7.5 4.5h-2A1.5 1.5 0 0 0 4 6.2C4.4 13 11 19.6 17.8 20a1.5 1.5 0 0 0 1.7-1.5v-2a1.4 1.4 0 0 0-1.1-1.4l-2.5-.5-1.6 1.6a12 12 0 0 1-4.5-4.5L11.4 10l-.5-2.5a1.4 1.4 0 0 0-1.4-1.1z" /></Svg>
);

export const IconUsers = (p: P) => (
  <Svg {...p}><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" /><path d="M16 5.7a3.2 3.2 0 0 1 0 5.7M17.5 14.6a5.5 5.5 0 0 1 3 4.9" /></Svg>
);

export const IconBriefcase = (p: P) => (
  <Svg {...p}><rect x="3" y="7.5" width="18" height="12" rx="2.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" /></Svg>
);

export const IconFilter = (p: P) => (
  <Svg {...p}><path d="M4 6h16l-6.2 7.3V19L10.2 20v-6.7z" /></Svg>
);

export const IconReset = (p: P) => (
  <Svg {...p}><path d="M4 11a8 8 0 1 1 2.3 5.7" /><path d="M4 5.5V11h5.5" /></Svg>
);

/** Cali AI mark — the pink/purple sparkle used on generated copy. */
export const IconSparkle = ({ size = 14, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <defs>
      <linearGradient id="cal-ai-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e879c8" />
        <stop offset="100%" stopColor="#9b6ff0" />
      </linearGradient>
    </defs>
    <path d="m11 2.5 1.9 5.1 5.1 1.9-5.1 1.9L11 16.5 9.1 11.4 4 9.5l5.1-1.9z" fill="url(#cal-ai-grad)" />
    <path d="m18.2 15 .8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" fill="url(#cal-ai-grad)" />
  </svg>
);

/** The blue gem the packet uses on "Outperforming X%". */
export const IconGem = ({ size = 14, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path d="M7 3h10l4 6-9 12L3 9z" fill="#4aa8ff" />
    <path d="M7 3 3 9h18l-4-6z" fill="#7cc3ff" />
    <path d="M12 21 3 9h18z" fill="#2f8ee6" opacity=".55" />
  </svg>
);

/** Official lockup. Served as an SVG so it stays a vector in the page. */
export function CaliberLogo({ height = 28 }: { height?: number }) {
  const width = Math.round(height * (147 / 36));
  return (
    <img
      className="cal-brand__logo"
      src={withBase('/caliber/logo.svg')}
      alt="Caliber"
      width={width}
      height={height}
    />
  );
}
