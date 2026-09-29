---
name: apply
description: >-
  Tailors a product-design resume and cover letter for a job posting, exports
  the PDFs into the company folder, writes Job.md, and submits the application
  after explicit approval. Use when the user shares a job posting URL, asks to
  apply for a job, or says Apply.
---

# Apply

Prepare a tailored application, stop for review, then submit only after the user approves that pack. Read [sources.md](sources.md) and `General Application Info/reference.md` before writing or submitting.

Use a saved answer only when the question clearly matches it. If you are not confident, ask and wait. Do not guess.

Do not submit, email a recruiter, or save an application draft in the same turn as the review.

## Checklist

```
- [ ] Read the posting, sources.md, and General Application Info/reference.md
- [ ] Tailor resume and cover letter in applications.ts
- [ ] Export both PDFs into the company folder
- [ ] Write Job.md and update INDEX.md
- [ ] Scout required form fields without submitting
- [ ] Stop and show the pack
- [ ] After approval, submit and record the confirmation
```

## 1. Read the posting

Open the URL. If the fetch is blocked, use the browser. Record the title, company, team, location, work model, base salary range, years of experience, and the apply link. Quote the posting for requirements. Do not invent a salary, a team name, or a years figure.

Check `INDEX.md` and `companies/`. Reuse an existing company folder. Do not create a second folder for the same company.

## 2. Tailor the resume and cover letter

Edit `src/data/applications.ts` in the portfolio repo. Add one `Application` whose `id` is a kebab-case company slug and whose `label` is the company folder name.

Read `general` and the two existing applications closest to this job. Match their voice. Reorder and rewrite so the closest true work leads. Do not add employers, titles, dates, tools, or numbers that are not already in `applications.ts` or the portfolio cases.

Cover letter: four or five short paragraphs. Open with the role and the human situation in the product. Use one or two true stories. If the domain is new, say so and name the analogous work. Close with Pleasant Grove and an invitation to walk through the work. Date it today. Recipient is the named hiring manager, or "{Company} hiring team".

Experience is FamilySearch 2017–2019 and Entrata July 2019–2026. Do not write "10+ years" on the resume. If the posting asks for more than that, flag it in the review.

## 3. Export the PDFs

From the portfolio repo, start the dev server if it is not already running:

```
astro dev --background
```

Use `astro dev status` for the local origin. Download with curl:

- `{origin}/CodyBDukePortfolio/documents/cody-duke-{id}-resume.pdf`
- `{origin}/CodyBDukePortfolio/documents/cody-duke-{id}-letter.pdf`

Save them in `Job Applications/companies/{Company}/` as:

- `Cody Duke Product Design Resume.pdf`
- `Cody Duke Product Design Cover Letter.pdf`

Confirm each file starts with `%PDF` and is larger than a few kilobytes. The resume must be one page. If it spills, cut a bullet and export again. Do not run a full site build for one application.

Company folder root: `/Users/codyduke/Documents/Cursor/cody-duke-portfolio/Job Applications/companies/`.

## 4. Write Job.md

Copy `_template/Job.md`. Fill the tracking table and the summary. Use the same summary labels, in the same order, every time.

Do not rewrite the case study, the questions, or the company summary so this application looks different from the last one. If the same case is the best fit, use it again. If a question is the right question, ask it again.

- **Case study to focus on:** the public portfolio case that best matches the job. Include the work URL from sources.md. If a resume-only story is the better interview story, name it and still name which public case to open.
- **Questions to ask:** the standing questions in sources.md, plus a posting-specific question only when the posting leaves a real gap.
- **Recently noteworthy:** one sourced fact from a web search. If nothing recent checks out, write "Nothing recent I could verify."
- **Base salary range:** the posting's range. Say whether it is base, OTE, or total. If absent, "Not listed."

Set Status to `Materials ready`. Add an `INDEX.md` row if the company is new.

## 5. Scout the form

Open the apply flow far enough to list required fields. Do not create an account, fill the form, or save a draft. If a login wall appears, stop and include that in the review.

## 6. Stop for review

Show the pack and wait:

- Company folder path
- The Job.md summary bullets
- What leads on the resume, compared with the general resume
- The cover letter, full text
- Required form fields, including any that need an answer you do not have
- Mismatches: years, location, sponsorship, salary ask. For salary, state the number the rule produces: 150,000, or the posted minimum when that minimum is above 150,000. For a Utah office, say whether it is within about an hour of Pleasant Grove.

Ask them to approve, edit, or hold. Edits get another review. Do not treat silence as approval.

## 7. Submit after approval

Submit only after the user approves the current pack in this conversation ("approved", "apply", "submit", "looks good", "send it"). An approval that includes a small edit: make the edit, re-export if the PDF changed, then submit.

Use the browser. Fill from the approved pack, [sources.md](sources.md), and `General Application Info/reference.md`. Upload the company-folder PDFs. Paste the cover letter when the form has a text field.

Answer voluntary self-identification from the reference when the form asks. Stop again, without submitting, when a question does not clearly match a saved answer. Ask, then wait.

Do not bypass a captcha or invent a password. If the session is already signed in, use it. If not, hand the login back to the user.

Before the submit control, restate company, role, and the two filenames. Then submit. Save the confirmation text. Set Job.md Status to `Applied`, set Applied to that day, add a timeline line, and update `INDEX.md`.
