# Review: check on understanding

Cody's first walkthrough of the coded prototype, 2026-09-01. Recorded as said. No design changes from this note.

## TLDR

The old Skills screen shows how good someone is at one skill. That is not enough, because two people with the same skill score can close very different numbers of deals. The Deals tab exists so a manager can see skill next to what is actually happening on live deals, and tell a weak first conversation apart from a company that was never going to close. That recap is right. The original job is a bit narrower than "how this equates to revenue": Ellis specifically cannot tell whether Tara is talking to the wrong companies or running a bad first call.

## The problem, as restated

Managers already have a skills dashboard. They can see the whole team on one skill, drill into a person, and read some AI-generated notes on what they do well and what they need.

What they cannot see is how that skill picture lines up with deals getting done, or with money coming in.

They want that because skill is not the only thing that makes a sale. They are not managing "how skilled is this person" as the end. They are managing how well the person performs, and how well the company performs. Two people can have the same skill score and make very different amounts of money or close very different numbers of deals. Something else is going on underneath. That is what the Deals tab is for.

## What the new screens do, as restated

On the team Deals tab you can see everyone at once, including a colorful bar of how each person's live deals sit against their discovery scores.

On a person (Tara):

- 8 deals: first-call score below proficient, and the deal has sat still for 21 days or more
- 2 deals: sat still, but the calls scored proficient
- 1 deal: moved recently, but the call scored below proficient
- 3 deals: proficient and moving

Once those four piles are clear, you can tell whether her leads were good.

"Fit or skill" means: was this a good-fit company, or was skill the problem.

The six-week focus is the next step after that diagnosis: pick one thing to work on, and which deals to watch.

## Where that matches the work

- The current Skills screen is kept. We did not replace it. We added a way to read skill against named live deals.
- Two people with the same score can have very different deal pictures. That is the reason the heatmap was not enough.
- The four piles on Tara's page are the actual mechanism. Once you see which pile most of the stuck deals sit in, you know whether to coach the conversation or look at the companies.
- The six-week focus is the action that follows the diagnosis, not a separate product.

## Where the recap is a little wider than the original job

The original question was not "how does skill equate to revenue." It was: Tara has lots of deals going nowhere — is she talking to the wrong companies, or can she not run a first conversation?

Revenue is in the bigger initiative. This epic answers the Tara question with the four piles. Money on the deals is extra context, not the thing the screen is trying to prove.
