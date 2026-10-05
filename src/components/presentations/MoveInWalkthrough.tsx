import { useEffect, useState } from 'react';

import { labSrc } from './proto-driver';

type Props = {
  protoSrc: string;
  presentHref: string;
  notes: Record<string, string>;
};

// The prototype paints its simulator gradient from these variables, set inline on <html>.
// r-1fuvl1u and r-1gx6g7k are the exported atomic classes for the phone and lab-menu shadows;
// the phone sits about 28px above the iframe's bottom edge, so its shadow has to stay inside that.
const CLEAR_BACKDROP = `html {
  --oxp-simulator-backdrop-start: transparent !important;
  --oxp-simulator-backdrop-end: transparent !important;
}
.r-1fuvl1u { box-shadow: rgba(84, 70, 44, 0.18) 0 8px 18px !important; }
.r-1gx6g7k { box-shadow: rgba(84, 70, 44, 0.1) 0 6px 14px !important; }`;

function clearBackdrop(iframe: HTMLIFrameElement) {
  const doc = iframe.contentDocument;
  if (!doc || doc.getElementById('case-walk-backdrop')) return;
  const style = doc.createElement('style');
  style.id = 'case-walk-backdrop';
  style.textContent = CLEAR_BACKDROP;
  doc.head.appendChild(style);
}

export default function MoveInWalkthrough({ protoSrc, presentHref, notes }: Props) {
  // Stays null on the server so the prototype only starts after hydration.
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    setIframeSrc(labSrc(protoSrc, 'online'));
  }, [protoSrc]);

  return (
    <figure className="case-embed case-embed--lab case-walk">
      <h2 className="case-walk__title">Feel free to try it out.</h2>
      <div className="case-embed__frame">
        {iframeSrc && (
          <iframe
            src={iframeSrc}
            title="OXP Move-In prototype"
            allow="fullscreen"
            onLoad={(event) => clearBackdrop(event.currentTarget)}
          />
        )}
      </div>
      <figcaption>
        <p>{notes.home}</p>
        <p>
          <a href={presentHref}>Open the full walkthrough</a>
          {iframeSrc && (
            <>
              {' · '}
              <a href={iframeSrc} target="_blank" rel="noopener noreferrer">
                Open in a new tab
              </a>
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
