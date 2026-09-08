import { useCallback, useEffect, useId, useState } from 'react';

import {
  applications,
  contact,
  getApplication,
  isDocKind,
  type Application,
  type CoverLetterContent,
  type DocKind,
  type ResumeContent,
} from '../../data/applications';

type Props = {
  email: string;
  linkedin: string;
  portfolioHref: string;
  initialCompanyId?: string;
  initialDoc?: DocKind;
};

const MM_WINDOW_MS = 450;

function readUrl(): { companyId?: string; doc?: DocKind } {
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get('c') ?? undefined;
  const doc = params.get('d');
  return {
    companyId,
    doc: isDocKind(doc) ? doc : undefined,
  };
}

function writeUrl(
  companyId: string,
  doc: DocKind,
  defaults: { companyId: string; doc: DocKind },
) {
  const url = new URL(window.location.href);
  if (companyId === defaults.companyId && doc === defaults.doc) {
    url.searchParams.delete('c');
    url.searchParams.delete('d');
  } else {
    url.searchParams.set('c', companyId);
    url.searchParams.set('d', doc);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) history.replaceState(null, '', next);
}

function pageTitle(application: Application, doc: DocKind) {
  if (doc === 'letter') return `Cody Duke, ${application.label} Cover Letter`;
  if (application.id === 'general') return 'Cody Duke, Product Designer Resume';
  return `Cody Duke, ${application.label} Resume`;
}

export default function ResumeKit({
  email,
  linkedin,
  portfolioHref,
  initialCompanyId = 'general',
  initialDoc = 'resume',
}: Props) {
  const menuTitleId = useId();
  const [companyId, setCompanyId] = useState(initialCompanyId);
  const [doc, setDoc] = useState<DocKind>(initialDoc);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const application = getApplication(companyId);
  const view: DocKind = doc === 'letter' && application.coverLetter ? 'letter' : 'resume';

  useEffect(() => {
    const parsed = readUrl();
    if (parsed.companyId && applications.some((item) => item.id === parsed.companyId)) {
      setCompanyId(parsed.companyId);
    }
    if (parsed.doc) setDoc(parsed.doc);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeUrl(companyId, view, { companyId: initialCompanyId, doc: initialDoc });
    document.title = pageTitle(application, view);
  }, [hydrated, companyId, view, application, initialCompanyId, initialDoc]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  useEffect(() => {
    let lastM = 0;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.repeat) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      if (event.key === 'Escape' && menuOpen) {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== 'm' && event.key !== 'M') {
        lastM = 0;
        return;
      }

      const now = Date.now();
      if (now - lastM < MM_WINDOW_MS) {
        event.preventDefault();
        lastM = 0;
        toggleMenu();
      } else {
        lastM = now;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, toggleMenu]);

  const selectCompany = (id: string) => {
    const next = getApplication(id);
    setCompanyId(next.id);
    if (doc === 'letter' && !next.coverLetter) setDoc('resume');
  };

  return (
    <>
      <p className="doc-chrome">
        <a href={portfolioHref}>← Portfolio</a>
        <button type="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </p>

      {view === 'letter' && application.coverLetter ? (
        <CoverLetterView
          email={email}
          linkedin={linkedin}
          portfolioHref={portfolioHref}
          letter={application.coverLetter}
        />
      ) : (
        <ResumeView
          email={email}
          linkedin={linkedin}
          portfolioHref={portfolioHref}
          resume={application.resume}
        />
      )}

      {menuOpen && (
        <div
          className="kit-menu"
          role="dialog"
          aria-labelledby={menuTitleId}
          aria-modal="false"
        >
          <div className="kit-menu__head">
            <p className="kit-menu__title" id={menuTitleId}>
              Versions
            </p>
            <button
              type="button"
              className="kit-menu__close"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </button>
          </div>

          <fieldset className="kit-menu__group">
            <legend>Document</legend>
            <div className="kit-menu__segment">
              <button
                type="button"
                aria-pressed={view === 'resume'}
                onClick={() => setDoc('resume')}
              >
                Resume
              </button>
              <button
                type="button"
                aria-pressed={view === 'letter'}
                disabled={!application.coverLetter}
                title={
                  application.coverLetter
                    ? undefined
                    : `No cover letter for ${application.label}`
                }
                onClick={() => setDoc('letter')}
              >
                Cover letter
              </button>
            </div>
          </fieldset>

          <fieldset className="kit-menu__group">
            <legend>Company</legend>
            <div className="kit-menu__list">
              {applications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === application.id}
                  onClick={() => selectCompany(item.id)}
                >
                  <span>{item.label}</span>
                  {!item.coverLetter && (
                    <span className="kit-menu__hint">Resume only</span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="kit-menu__foot">Double-tap M to hide</p>
        </div>
      )}
    </>
  );
}

function ContactBlock({
  email,
  linkedin,
  portfolioHref,
  role,
  location,
}: {
  email: string;
  linkedin: string;
  portfolioHref: string;
  role: string;
  location: string;
}) {
  return (
    <header className="doc-header">
      <div>
        <h1>{contact.name}</h1>
        <p className="doc-header__role">{role}</p>
        <p className="doc-header__location">{location}</p>
      </div>
      <address>
        <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
        <a href={`mailto:${email}`}>{email}</a>
        <a href={portfolioHref}>Portfolio</a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </address>
    </header>
  );
}

function ResumeView({
  email,
  linkedin,
  portfolioHref,
  resume,
}: {
  email: string;
  linkedin: string;
  portfolioHref: string;
  resume: ResumeContent;
}) {
  return (
    <article className="resume">
      <ContactBlock
        email={email}
        linkedin={linkedin}
        portfolioHref={portfolioHref}
        role={resume.role}
        location={resume.location}
      />

      <div className="resume__body">
        <aside className="resume__rail">
          <section>
            <h2>Profile</h2>
            <p className="resume__lede">
              <em>{resume.profileLede}</em>
            </p>
            <p>{resume.profile}</p>
          </section>

          <section>
            <h2>Skills</h2>
            <ul className="resume__skills">
              {resume.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Education</h2>
            <p className="resume__school">
              <strong>{resume.education.degree}</strong>
              <br />
              {resume.education.school}
              <br />
              <span className="resume__school-date">{resume.education.year}</span>
            </p>
          </section>
        </aside>

        <div className="resume__main">
          <section>
            <h2>Work Experience</h2>
            {resume.jobs.map((job) => (
              <article className="job" key={job.company}>
                <header className="job__head">
                  <h3>{job.company}</h3>
                  <p className="job__dates">{job.dates}</p>
                </header>
                <p className="job__title">{job.title}</p>
                {job.summary ? <p>{job.summary}</p> : null}
                <ul>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </div>
      </div>
    </article>
  );
}

function CoverLetterView({
  email,
  linkedin,
  portfolioHref,
  letter,
}: {
  email: string;
  linkedin: string;
  portfolioHref: string;
  letter: CoverLetterContent;
}) {
  return (
    <article className="letter">
      <ContactBlock
        email={email}
        linkedin={linkedin}
        portfolioHref={portfolioHref}
        role={letter.role}
        location={letter.location}
      />

      <p className="letter__meta">{letter.date}</p>
      <p className="letter__meta">{letter.recipient}</p>
      <p className="letter__meta">{letter.position}</p>

      <div className="letter__body">
        {letter.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="letter__signoff">
          {letter.signoff}
          <br />
          {contact.name}
        </p>
      </div>
    </article>
  );
}
