import { useCallback, useEffect, useId, useState } from 'react';

import { atsResumeIsTailored, getAtsResume } from '../../data/ats-resume';
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
import { withBase } from '../../lib/paths';
import { resumePdfDownloadName, resumePdfPath } from '../../lib/resumePdf';

const companiesInMenu = [...applications].sort((a, b) =>
  a.label.localeCompare(b.label, 'en', { numeric: true, sensitivity: 'base' }),
);

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
  if (doc === 'ats') return 'Cody Duke, ATS Resume';
  if (doc === 'letter') return `Cody Duke, ${application.label} Cover Letter`;
  if (doc === 'single') {
    if (application.id === 'general') return 'Cody Duke, Single Column Resume';
    return `Cody Duke, ${application.label} Single Column Resume`;
  }
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
  const [titled, setTitled] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'preparing' | 'error'>('idle');

  const application = getApplication(companyId);
  const view: DocKind = doc === 'letter' && !application.coverLetter ? 'resume' : doc;

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
    setTitled(true);
  }, [hydrated, companyId, view, application, initialCompanyId, initialDoc]);

  async function downloadFile() {
    setPdfStatus('preparing');
    try {
      if (view === 'ats') {
        const { downloadAtsResume } = await import('../../lib/ats-docx');
        await downloadAtsResume(getAtsResume(application.id));
      } else {
        const response = await fetch(withBase(resumePdfPath(application.id, view)), {
          cache: import.meta.env.DEV ? 'no-store' : 'default',
        });
        if (!response.ok) throw new Error(`PDF request failed (${response.status})`);
        const blob = await response.blob();
        if (!blob.size) throw new Error('Empty PDF');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = resumePdfDownloadName(application, view);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      }
      setPdfStatus('idle');
    } catch {
      setPdfStatus('error');
    }
  }

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
      <p className="doc-chrome" data-ready={titled ? 'true' : 'false'}>
        <a href={portfolioHref}>← Portfolio</a>
        <button
          type="button"
          onClick={downloadFile}
          disabled={pdfStatus === 'preparing'}
          aria-busy={pdfStatus === 'preparing'}
        >
          {pdfStatus === 'preparing'
            ? view === 'ats'
              ? 'Preparing Word…'
              : 'Preparing PDF…'
            : view === 'ats'
              ? 'Download Word'
              : 'Download PDF'}
        </button>
      </p>
      {pdfStatus === 'error' ? (
        <p className="doc-chrome__status" role="alert">
          The file didn't download. Try again.
        </p>
      ) : null}

      {view === 'ats' ? (
        application.id === 'general' ? (
          <AtsSingleColumnView resume={getAtsResume(application.id)} />
        ) : (
          <AtsResumeView resume={getAtsResume(application.id)} />
        )
      ) : view === 'letter' && application.coverLetter ? (
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
          layout={view === 'single' ? 'single' : 'columns'}
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
                aria-pressed={view === 'single'}
                onClick={() => setDoc('single')}
              >
                Single column
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
              <button
                type="button"
                aria-pressed={view === 'ats'}
                onClick={() => setDoc('ats')}
              >
                ATS Resume
              </button>
            </div>
          </fieldset>

          <fieldset className="kit-menu__group">
            <legend>Company</legend>
            {view === 'ats' ? (
              <p className="kit-menu__note">
                {atsResumeIsTailored(application.id)
                  ? 'Tailored for this company.'
                  : 'Uses the shared ATS resume.'}
              </p>
            ) : null}
            <div className="kit-menu__list">
              {companiesInMenu.map((item) => (
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

/** PDF print resolves relative links against localhost. Contact links need the public site. */
function publishedPortfolioHref(href: string) {
  if (/^https?:\/\//i.test(href)) return href;
  return new URL(href, 'https://codybduke.com/').href;
}

function ContactBlock({
  email,
  linkedin,
  portfolioHref,
  role,
  tenure,
  location,
}: {
  email: string;
  linkedin: string;
  portfolioHref: string;
  role: string;
  tenure?: string;
  location: string;
}) {
  const tenureMark = tenure?.match(/^([•·])\s*([\s\S]*)$/);
  const tenureLabel = tenureMark ? tenureMark[2] : tenure;

  return (
    <header className="doc-header">
      <div className="doc-header__identity">
        <div className="doc-header__name">
          <img
            className="doc-header__mark"
            src={withBase('/brand/stone-logo.svg')}
            alt=""
          />
          <h1>{contact.name}</h1>
        </div>
        <p className="doc-header__role">
          <span className="doc-header__role-name">{role}</span>
          {tenureMark ? (
            <span className="doc-header__dot" aria-hidden="true">
              {tenureMark[1]}
            </span>
          ) : null}
          {tenureLabel ? <span className="doc-header__tenure">{tenureLabel}</span> : null}
        </p>
        <p className="doc-header__location">{location}</p>
      </div>
      <address>
        <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
        <a href={`mailto:${email}`}>{email}</a>
        <a href={publishedPortfolioHref(portfolioHref)}>Portfolio</a>
        <a href={linkedin}>LinkedIn</a>
      </address>
    </header>
  );
}

function ProfileSection({ resume }: { resume: ResumeContent }) {
  const heading = resume.profileHeading === '' ? null : (resume.profileHeading ?? 'Profile');

  return (
    <section className={heading ? 'resume__profile' : 'resume__profile resume__profile--plain'}>
      {heading ? (
        <h2 className={resume.profileHeading ? 'resume__profile-heading' : undefined}>{heading}</h2>
      ) : null}
      {resume.profileTitle ? <p className="resume__profile-title">{resume.profileTitle}</p> : null}
      {resume.profileLede ? (
        <p className="resume__lede">
          <em>{resume.profileLede}</em>
        </p>
      ) : null}
      <p>{resume.profile}</p>
    </section>
  );
}

function SkillsSection({ resume }: { resume: ResumeContent }) {
  return (
    <section>
      <h2>Skills</h2>
      <ul className="resume__skills">
        {resume.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

function EducationSection({
  resume,
  inline = false,
}: {
  resume: ResumeContent;
  inline?: boolean;
}) {
  return (
    <section>
      <h2>Education</h2>
      {inline ? (
        <p className="resume__school resume__school--line">
          <strong>{resume.education.degree}</strong>
          <span>{resume.education.school}</span>
          <span className="resume__school-date">{resume.education.year}</span>
        </p>
      ) : (
        <p className="resume__school">
          <strong>{resume.education.degree}</strong>
          <br />
          {resume.education.school}
          <br />
          <span className="resume__school-date">{resume.education.year}</span>
        </p>
      )}
    </section>
  );
}

function ExperienceSection({ resume }: { resume: ResumeContent }) {
  return (
    <section className="resume__experience">
      <h2>Work Experience</h2>
      {resume.jobs.map((job) => (
        <article
          className={
            job.progression === 'rank' ? 'job job--progression job--continued' : job.progression ? 'job job--progression' : 'job'
          }
          key={`${job.company}-${job.title}-${job.dates}`}
        >
          {job.progression ? (
            <>
              {job.progression === 'lead' ? <p className="job__employer">{job.company}</p> : null}
              <header className="job__head">
                <h3>{job.title}</h3>
                <p className="job__dates">{job.dates}</p>
              </header>
            </>
          ) : (
            <>
              <header className="job__head">
                <h3>{job.company}</h3>
                <p className="job__dates">{job.dates}</p>
              </header>
              <p className="job__title">{job.title}</p>
            </>
          )}
          {job.summary ? <p>{job.summary}</p> : null}
          <ul>
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function ResumeView({
  email,
  linkedin,
  portfolioHref,
  resume,
  layout = 'columns',
}: {
  email: string;
  linkedin: string;
  portfolioHref: string;
  resume: ResumeContent;
  layout?: 'columns' | 'single';
}) {
  const contact = (
    <ContactBlock
      email={email}
      linkedin={linkedin}
      portfolioHref={portfolioHref}
      role={resume.role}
      tenure={resume.tenure}
      location={resume.location}
    />
  );

  const ranked = resume.jobs.some((job) => job.progression);

  if (layout === 'single') {
    return (
      <article className={ranked ? 'resume resume--single resume--ranked' : 'resume resume--single'}>
        {contact}
        <div className="resume__flow">
          <ProfileSection resume={resume} />
          <SkillsSection resume={resume} />
          <EducationSection resume={resume} inline />
          <ExperienceSection resume={resume} />
        </div>
      </article>
    );
  }

  return (
    <article className="resume">
      {contact}

      <div className="resume__body">
        <aside className="resume__rail">
          <ProfileSection resume={resume} />
          <SkillsSection resume={resume} />
          <EducationSection resume={resume} />
        </aside>

        <div className="resume__main">
          <ExperienceSection resume={resume} />
        </div>
      </div>
    </article>
  );
}

function AtsSingleColumnView({ resume }: { resume: ReturnType<typeof getAtsResume> }) {
  const skills = resume.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <article className="resume resume--single">
      <ContactBlock
        email={resume.email}
        linkedin={resume.linkedin}
        portfolioHref={resume.portfolio}
        role={resume.headline}
        location={resume.city}
      />

      <div className="resume__flow">
        <section className="resume__profile">
          <h2>Profile</h2>
          {resume.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section>
          <h2>Work Experience</h2>
          {resume.roles.map((role) => (
            <article className="job" key={`${role.company}-${role.title}-${role.dates}`}>
              <header className="job__head">
                <h3>{role.company}</h3>
                <p className="job__dates">{role.dates}</p>
              </header>
              <p className="job__title">
                {role.title}
                <span className="job__place">{role.location}</span>
              </p>
              <p>{role.overview}</p>
              <ul>
                {role.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <ul className="resume__skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <p className="resume__systems">
            <span>Systems</span>
            {resume.systems}
          </p>
        </section>

        <section>
          <h2>Education</h2>
          <p className="resume__school resume__school--line">
            <strong>
              {resume.education.degree}, {resume.education.field}
            </strong>
            <span>{resume.education.school}</span>
            <span className="resume__school-date">{resume.education.year}</span>
          </p>
        </section>
      </div>
    </article>
  );
}

function AtsResumeView({ resume }: { resume: ReturnType<typeof getAtsResume> }) {
  return (
    <article className="ats">
      <h1>{resume.name}</h1>
      <p className="ats__headline">{resume.headline}</p>
      <p className="ats__contact">
        <a href={`mailto:${resume.email}`}>{resume.email}</a>
      </p>
      <p className="ats__contact">{resume.phoneDisplay}</p>
      <p className="ats__contact">{resume.city}</p>
      <p className="ats__contact">
        <a href={resume.portfolio}>{resume.portfolioLabel}</a>
      </p>
      <p className="ats__contact">
        <a href={resume.linkedin}>{resume.linkedinLabel}</a>
      </p>

      <h2>Summary</h2>
      {resume.summary.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>Work Experience</h2>
      {resume.roles.map((role) => (
        <section className="ats__role" key={`${role.company}-${role.title}`}>
          <p className="ats__row">
            <span className="ats__title">{role.title}</span>
            <span>{role.dates}</span>
          </p>
          <p className="ats__org">
            <span className="ats__company">{role.company}</span>
            {` | ${role.location}`}
          </p>
          <p>{role.overview}</p>
          <ul>
            {role.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>Education</h2>
      <p className="ats__row">
        <span>{resume.education.school}</span>
        <span>{resume.education.year}</span>
      </p>
      <p>
        {resume.education.degree} {resume.education.field}
      </p>

      <h2>Skills</h2>
      <p>{resume.skills}</p>
      <p className="ats__systems">Systems</p>
      <p>{resume.systems}</p>
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
      {letter.position ? <p className="letter__meta">{letter.position}</p> : null}

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
