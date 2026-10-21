# $99 Open Sign LP: short conversion page for cold Meta traffic (2026-10-21)

`copy_package` from the `direct-response-copywriter` skill, `asset_kind: landing_page`. Replaces the 17-section
sales letter on `/lp/done-for-you-99` (owner ruling 2026-10-21: a SHORT conversion page, no fluff, DR structure).
Same offer rules as before: name **Open Sign**, we make it and the owner presses post, time-saved and seen-daily
framing, no view or lead promises, placeholders visible, violet only on the hero and closing CTA, US spelling.

Sources read: `docs/lp-99-brief.md`, `docs/lp-99-copy.md` §0 (promises P1 to P5, facts), `docs/lp-99-copy-sabri.md`
(the approved long body), `docs/lp-99-short.md` (approved short titles), `docs/lp-99-names-and-time.md` (Open Sign,
effort comparisons), `docs/lp-99-ads.md` and `docs/skill-audit/ads-99.md` (ad hooks and the VoC lines they quote),
`docs/home-copy-v3.md` (house register), the live section files in `apps/website/components/lp/sections/offer_99_*.tsx`.

How to read: **[CONFIRM]** = owner decision not final. **[N] [DAY] [TIME] [DATE] [MONTH] [TRADE]** = filled by the
owner or the system. **[NAME] [ROLE]** = a real team member, never a stand-in. **[PROOF NEEDED: …]** = a claim with
no proof in the inventory; stays as written until the proof exists.

---

## 1. Diagnosis (Schwartz), stated with evidence

| Axis           | Placement                                                                                                                                                                    | Evidence                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Awareness      | **Problem-aware** (center of mass), with an unaware tail                                                                                                                     | VoC quoted in `lp-99-ads.md` / `ads-99.md`: "I'm too busy plumbing… always gonna do it tomorrow", "I always fall off after a couple of weeks", "A lot of the workload is deciding what to post, not just posting it". The unaware tail: "word of mouth is enough to keep me going". They know the page is dead; they do not know a content-only, no-access plan exists. |
| Sophistication | **4 to 5** (claim-tired)                                                                                                                                                     | Competitors run "1M views guaranteed", "+364%", fake "limited availability" (`lp-99-strategy.md` §1.3). Owners answer: "full of empty promises", "cowboys galore", "if it sounds too good to be true it probably is". $99 social offers already exist, so price is not news.                                                                                            |
| Matrix cell    | Problem-aware × Soph 4-5 → **problem lead + contrarian/honesty frame**, small checkable claim                                                                                | The claim is only what we deliver and can count (a post and a story every day, 60 pieces, on time). The contrarian frame is the honesty itself: we won't promise views, and the catch is you press post. In a Soph-5 market that honesty is the differentiator, not a disclaimer.                                                                                       |
| Lead chosen    | Pre-headline identifies the reader (too busy to post) → H1 states the checkable deliverable → sub states scope in one line → CTA with price and risk reversal in the caption | Matches the owner's framing rule (time saved + seen daily, never price as the frame) and the ad rows that land on the default hero (rows 3, 6, 8 in `ads-99.md`: camera roll, 9pm blank screen, "every day").                                                                                                                                                           |

Single avatar on this page: owner-operators of local service businesses (trades first; clinics and salons share the
page because the H1 is trade-neutral). Not a two-sided market, so one diagnosis, one track. Hero variants `closed` and
`busiest` keep their approved H1s for their ad rows; only the shared body below changes.

**Length follows the diagnosis:** $99 a month, cancel any month, is a low-consideration purchase. Problem-aware
readers need the problem named, the mechanism shown, the deliverable demonstrated and the risk removed. They do not
need 3,000 words. Measured: about 1,200 words on the page including the eight FAQ answers and the ten-line offer
stack (the long letter was about 4,500); the body above the offer is about 500 words.

## 2. Offer assessment (Hormozi value equation)

- **One sentence a stranger understands:** Answer a few questions each week and we make a post and a story for every
  day of the month, ready for you to post, for $99 a month.
- **Dream outcome:** strong (a page that looks open, busy and proud of its work, every day). **Likelihood:** the weak
  lever. No clients, no testimonials, no sample week built yet. The demonstration (sample week) and the first-month
  guarantee are what make it believable; both are [CONFIRM]/[PROOF NEEDED] today. **Time delay:** first week by day
  [N] (unknown). **Effort:** very low and honestly stated (answers over coffee, then press post).
- **Verdict: adequate.** Copy can carry this offer at Soph 4-5 because the scope honesty is a real differentiator
  ("nobody logs in, you press post"). It becomes strong the day the sample week and the signed guarantee exist. No
  `offer_construction` pass needed; the stack and five promises are already owner-approved.
- **True scarcity/urgency inventory:** none that is structural except the real start date ("first week by [DATE]").
  No countdowns, no spots. The close uses only the plain cost of waiting (another quiet month).

## 3. Headline battery (hero H1, every option ≤ 10 words)

| #   | Headline                                     | Family                   | Awareness fit          | Note                                                                                                                                                          |
| --- | -------------------------------------------- | ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **A Fresh Post and Story, Every Single Day** | self_interest            | problem / solution     | **PICK.** Checkable deliverable, says the desire (seen daily) without a result claim, already approved by the owner, scent-matched to ad row 8 ("every day"). |
| 2   | Look Open Every Day. You Press Post.         | self_interest + honesty  | problem                | First challenger: carries the scope in the H1, pre-empts "what's the catch".                                                                                  |
| 3   | Your Page Looks Closed. You're Not.          | warning / identification | problem (unaware tail) | Approved `closed` variant H1.                                                                                                                                 |
| 4   | Look as Busy Online as You Are               | self_interest            | problem                | Approved `busiest` variant H1.                                                                                                                                |
| 5   | Is Your Last Post From Last Spring?          | question                 | problem                | "Yes… how did you know?" test passes.                                                                                                                         |
| 6   | 30 Posts. 30 Stories. You Press Post.        | offer / news             | solution               | Numeric and checkable; good for a most-aware retarget.                                                                                                        |
| 7   | Answer Over Coffee. Get a Week of Posts.     | how_to (mechanism)       | solution               | Approved `coffee` variant H1.                                                                                                                                 |
| 8   | Show Up Every Day Without Writing a Caption  | how_to                   | problem                | "…without {hated part}" form.                                                                                                                                 |
| 9   | For Pros Who'd Rather Work Than Post         | identification           | unaware                | Soph-5 identification lead.                                                                                                                                   |
| 10  | Your Best Work, Posted Every Day             | self_interest            | problem                | Pride angle; slightly less concrete than #1.                                                                                                                  |
| 11  | The Only Catch: You Press Post.              | news / honesty           | product                | Approved retarget `catch` H1.                                                                                                                                 |
| 12  | A Post a Day. None of It Written by You.     | self_interest            | solution               | Effort angle.                                                                                                                                                 |
| 13  | Paid an Agency for Four Posts a Month?       | warning / question       | problem (burned owner) | Enemy frame; needs "no contract" [CONFIRM] on the page.                                                                                                       |
| 14  | People Look You Up Before They Call          | warning / news           | unaware                | Creates the problem; ad row 1 scent.                                                                                                                          |
| 15  | Turn On Your Open Sign                       | offer (brand)            | most aware             | Better as the deal H2 or on the button than as a cold H1.                                                                                                     |
| 16  | Try a Month. Love It or It's Free.           | offer                    | most aware             | Approved retarget default H1.                                                                                                                                 |
| 17  | Stop Meaning to Post.                        | warning                  | problem                | Short and sharp; risks reading as a scold on cold traffic.                                                                                                    |

Seven families covered (self_interest, question, how_to, warning, identification, offer, news). No pure-curiosity
headline. Pick reason: #1 is the one H1 that states the deliverable, the daily rhythm and the desire in eight words,
is already approved, and is the landing H1 for the three default-hero ad rows, so message match holds on day one.

---

## 4. The page (copy, in render order)

Page title: **A Post and a Story Every Day, Made for You | Testify**
Meta description: **30 posts and 30 stories a month, made from your real jobs, captions in your voice. You press
post. $99/month, no contract.**

Chrome: LP (wordmark only, legal-only footer). One background. Violet only on the hero button and the closing CTA.
Every CTA links to `/lp/done-for-you-99/checkout` with stored attribution. Kickers: give each section at most one
plain pre-line (no pill chips except the two hero fact chips; the owner is thinning chips site-wide).

### 4.1 Hero (`hero`)

Pre-line (plain text, not a pill): **For local pros too busy to post.**

H1: **A Fresh Post and Story, Every Single Day**

Sub (one line): **We make 30 posts and 30 stories a month from your real jobs. You press post.**

Fact chips: **60 pieces a month** · **Your part: less than one customer call a week**

Button (violet): **Yes! Turn On My Open Sign: $99/Month**
Caption: **$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free.**

Trust row (thin, at the fold): **We never need your passwords · Nothing goes out unless you post it · Every file is
yours to keep · Secure checkout by Stripe**

Visual: the example-week mock (keep `ExampleWeek`), labeled **Example. Demo business.**

Variants: `closed` and `busiest` keep their approved pre-line and H1 (`lp-99-short.md` §1). Their subs shrink to one
line each:

- `closed` sub: **Before they call, people look you up. Give them a page that's open every day. You press post.**
- `busiest` sub: **Your days are full of good work nobody online sees. We turn it into a post and a story a day.**

### 4.2 Problem (`problem`, PAS: problem and agitation)

Pre-line: **Sound familiar?**

H2: **"I'll Post Something Tomorrow."**

Body (letter column, short paragraphs):

You pull into the driveway after a ten-hour day. You open Facebook to "quickly post something."

Five minutes later you close it. Nothing posted.

That's not laziness. The job comes first. It always will.

The hard part was never pressing post. It's deciding what to say at 9pm, then making it look right.

Meanwhile, people look you up before they call. They find a page that went quiet in [MONTH] and wonder if you're
still open.

You are. Your page just doesn't show it.

### 4.3 How it works (`mechanism`, the 3-step plan)

Pre-line: **We call it the Monday Coffee Questions.**

H2: **You Answer. We Make It. You Press Post.**

Sub: **Three steps. One of them is ours.**

| Step | Title               | Body                                                                                                                                                                                                                      | Chip                      |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1    | **You answer.**     | Every Monday we send three or four quick questions. "What job are you proudest of this week?" Reply by text or voice note. Send a couple of phone photos if you have them. No photos that week? We make graphics instead. | Less than a customer call |
| 2    | **We make it.**     | Seven posts, seven stories, every caption in your words, and the day each one goes out. It lands in your portal every [DAY] by [TIME].                                                                                    | Our job                   |
| 3    | **You press post.** | Open the portal. Copy the caption. Download the file. Post. About a minute each.                                                                                                                                          | About a minute each       |

After you sign up (small list under the steps):

- **Today:** tell us your trade and town. Two minutes.
- **Day 1 to 2:** your first questions arrive.
- **By day [N]:** your first week is in your portal.
- **Every [DAY] after:** a new week, on time.

### 4.4 See a week (`sample`, the proof band)

Pre-line: **Don't take our word for it. Look.**

H2: **See a Full Week, Ready to Post**

Sub: **An example week for a demo business. Yours is made from your jobs, your photos and your words.**

Trade tags (keep `TradeTags`), then:

**[SAMPLE WEEK: [TRADE], 7 posts + 7 stories, real design work]** [PROOF NEEDED: the sample week is not built; this is
the page's only demonstration, so the band stays a visible placeholder until it exists]

Line under the sample: **Seven posts. Seven stories. Every caption written. Every day planned. Four weeks of this is
your month.**

Caption: **Example. Demo business.**

### 4.5 Straight talk (`straight`, short honesty strip, ink panel)

H2: **What We Won't Promise**

Intro line: **You've heard the big promises. Here are the plain terms instead.**

| We won't                                                        | Not in this plan                |
| --------------------------------------------------------------- | ------------------------------- |
| Promise you views, followers, calls or jobs. Nobody honest can. | Posting to your accounts        |
| Lock you into a contract. [CONFIRM P4]                          | Answering comments and messages |
| Ask for your passwords.                                         | Paid ads                        |
| Use stock photos of someone else's work.                        | Photo shoots or filming days    |
| Make you dance, film yourself or chase trends.                  |                                 |
| Post anything in your name. You press post. Always.             |                                 |

Line under the right column: **Want us to post and reply for you too? That's our full service. Start here and move
up whenever you like.** [CONFIRM D8; plain text, no link]

Close line: **What we do promise: 60 finished pieces a month, made from your work, in your voice, on time.**

### 4.6 The offer (`offer-stack`)

Pre-line: **Here's everything you get.**

H2: **Introducing Open Sign**

Descriptor (directly under the H2): **A post and a story for every day of the month, made from your real work, ready
for you to post.**

**Every month**

- **30 feed posts, made from your real jobs.** The finished kitchen, the before and after, the crew, the tip only a
  pro would know.
- **30 stories, one for every day.** So your page never looks quiet, even in the week you're flat out.
- **Every caption written, in your voice.** From your own answers, so it sounds like you on a good day.
- **The posting day for every piece.** No planning. No "what should I post today?"
- **Your private portal.** Copy the caption, download the file, post. About a minute each, from your phone.

**Free with your first month** [CONFIRM each bonus]

- **Profile Tune-Up Kit.** Bio, highlight covers and a pinned post, ready to paste in.
- **Your Trade's Question List.** The [N] questions your customers ask most, each one turned into a post.
- **Ready Replies.** Written answers to "How much?", "Do you cover my area?" and "How do I book?"
- **"Post It in a Minute" Guide.** A one-minute walkthrough for Facebook and Instagram.
- **Your Seasonal Content Calendar.** Your trade's busy weeks and holidays, planned 12 months ahead.

Price line: **$99 a month. [SETUP FEE]. No contract. Cancel in 2 clicks.**

Button (ink, mid-page): **Yes! Turn On My Open Sign: $99/Month**
Caption: **$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free.**

### 4.7 Guarantee (`guarantee`, risk reversal)

Pre-line: **Burned before? We take the risk.**

H2: **Five Promises. All the Risk Is Ours.**

Sub: **Either you love having a post and a story for every day, or you get your money back and keep everything we
made.**

Canonical wording from `lp-99-copy.md` §0.2, word for word, all [CONFIRM]:

1. **Love It or It's Free.** If your first month isn't worth it to you, tell us within [7] days after it ends and we
   refund the full $99. You keep all 60 pieces.
2. **On Time, or That Week Is Free.** Your week of posts and stories is in your portal every [DAY] by [TIME]. If a
   week is late, that week is free.
3. **Unlimited Edits.** Want a change? Ask in the portal and we redo it within [N] business days. As many times as
   you like.
4. **No Contract.** Cancel in your portal in 2 clicks, any month. Everything you've received stays yours.
5. **Your Accounts Stay Yours.** We never ask for your passwords. Nothing goes out unless you post it.

Close line: **Read that again. You keep all 60 pieces, even if you ask for your money back.**

### 4.8 Questions (`objections-faq`, eight, accordion, first three open)

Pre-line: **Questions? Straight answers.**

H2: **Straight Answers, Including "What's the Catch?"**

1. **Do I still have to post it?** Yes. Each piece takes about a minute: copy the caption, download the file, post.
   Every piece tells you which day. Want us to post for you? That's our full service, not this plan.
2. **How much of my time does it really take?** About 5 minutes a week to answer our questions. Then about a minute
   to post each piece, so about 2 minutes a day if you post the day's post and story. The thinking, writing and
   designing is ours.
3. **What's the catch at $99?** You press post. We make the content; we don't run your accounts. Running accounts is
   the expensive part of any agency, and it isn't in this plan. That's why it costs $99.
4. **Do I have to be on camera?** No. No dancing, no trends, no filming days. We make posts from your job photos,
   your tools and your finished work, or graphics with no photo at all.
5. **Will it sound like me?** It's made from your answers, so it uses your words. You see everything before you post
   it. Want a change? Ask and we redo it, as many times as you like.
6. **Do you need my passwords?** No. Never. Nothing goes out unless you post it.
7. **Can I cancel?** Yes. Cancel in your portal in 2 clicks, any month. Everything you've received stays yours.
   [CONFIRM P4]
8. **Will this get me more views or jobs?** We can't promise that, and we won't. We promise you show up every day,
   with posts made from your real work, on time.

Line under the accordion: **Something else? Email [NAME]: hello@[DOMAIN]. A real person answers within [N] hours.**
[CONFIRM]

### 4.9 Close (`final-cta`, violet CTA)

Pre-line: **So here's where you're at.**

H2: **A Full Page, or Another Quiet Month?**

Sub: **One road costs you less than one appointment a month. The other costs you another quiet month.**

Line: **Sign up today and your first week is in your portal by [DATE].**

Button (violet): **Yes! Turn On My Open Sign: $99/Month**
Caption: **$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free.**

### 4.10 P.S. (`ps`, letter column, short)

To your success,
**[NAME]**, [ROLE], Testify

**P.S.** The whole thing in one breath: we make a post and a story for every day of the month from your real jobs,
captions in your voice, each one telling you which day it goes out. Your part takes less time each week than one
customer call. Then you press post. $99 a month, no contract, and your first month is love it or it's free. Even if
you ask for your money back, you keep all 60 pieces.

### 4.11 Sticky bar (unchanged)

Left: **Open Sign · 30 posts + 30 stories a month, made for you · You press post**
Button: **Yes! Turn It On for $99/Month**

### Registry changes (`apps/website/lib/landing_pages.ts`)

`done-for-you-99` sections become: `hero`, `problem`, `mechanism`, `sample`, `straight`, `offer-stack`,
`guarantee`, `objections-faq`, `final-cta`, `ps`. Dropped: `proof` (the trust row moves into the hero), `letter`,
`story`, `seen`, `time`, `team` (no real [NAME]/[ROLE] yet; the signed P.S. and the FAQ email line carry the
"real person" signal until the team exists), `next` (folded into the mechanism's after-you-sign-up list). The
retargeting LP `done-for-you-99-back` is out of scope here and keeps its sections.

---

## 5. VoC usage

- **Sources read:** the VoC lines quoted verbatim in `docs/lp-99-ads.md` and `docs/skill-audit/ads-99.md` (both cite
  `research/03-voice-of-customer.md`). **Limiter:** the original research file is not on disk anywhere under
  `vs_code/testify` or the Claude temp folders, so only the quoted lines were available, and they are forum/trade-press
  VoC, not this business's own customers. No customer quotes exist, so no testimonial block is written.
- **Verbatim or near-verbatim woven (6):** "always gonna do it tomorrow" → H2 "I'll Post Something Tomorrow"; "the
  job comes first" → problem body; "deciding what to post, not just posting it" → "The hard part was never pressing
  post. It's deciding what to say"; "see if they're even still around" → "wonder if you're still open"; "promising you
  the world" → "You've heard the big promises"; "held hostage" / "year long contract" → the no-contract and
  no-passwords promises and the honesty strip.

## 6. Proof gaps (every marker on the page)

1. `[PROOF NEEDED: sample week]` (4.4): the page's only demonstration. Build it for one demo trade before launch, or
   the proof band is a visible placeholder.
2. P1 to P5 guarantee terms, window, remedy for a late week, cancel timing (4.7, 4.5, 4.8 Q7): all [CONFIRM].
3. First-drop timing `[N]` days and `[DATE]` (4.3, 4.9), delivery `[DAY] by [TIME]` (4.3, 4.7), edit turnaround `[N]`
   business days (4.7).
4. `[SETUP FEE]` (4.6): none, or the line reads "No setup fee."
5. The five bonuses (4.6): each [CONFIRM] it exists before launch; cut any that does not.
6. `[NAME]`, `[ROLE]`, `hello@[DOMAIN]`, reply time `[N]` hours (4.8, 4.10): a real person, or the sign-off reads
   "The Testify team" and the email line drops the reply time.
7. Full-service mention (4.5): [CONFIRM D8].
8. Platforms the pieces are sized for: not stated on this page (deliberately), because it is [CONFIRM].
9. `[MONTH]` (4.2): a generic value such as "months ago" works if no system value is available.
10. No testimonials, numbers or case studies anywhere: none exist. None were invented.

## 7. Readability (measured, not estimated)

Measured with the FK script from `working-frameworks.md` §5.7 on the reader-facing copy in §4 (headings, body,
bullets, FAQ answers; placeholders and labels excluded). Target for a landing page: FK grade ≤ 6.

- Result (node port of the same formula, run 2026-10-21 on the §4 extraction):
  `words=1295 sents=202 wps=6.4 FK-grade=2.4`. Pass. The 1,295 count includes the two variant subs and the table
  labels, so the rendered default page is about 1,200 words. Fragments ("Nothing posted.", "Our job.") pull the
  grade down; measured on the problem-section paragraphs alone it still sits under grade 5, so no reduction pass
  was needed. Script: `scratchpad/fk.mjs`, extraction: `scratchpad/lp99_copy_only.txt` (session scratchpad).

## 8. Edit passes attested

1. **Cut the first fifth:** the letter opening, story, "seen" scene and evenings section are gone; the page enters at
   the H1 and the problem section opens on the driveway moment, not a salutation.
2. **Concreteness:** every claim is a count or a moment (30 posts, 30 stories, seven a week, a minute each, Monday,
   the driveway, 9pm). "Less than one customer call" replaces the bare "5 minutes" everywhere except FAQ Q2 (the
   truth anchor, owner rule).
3. **One idea per sentence:** done; the longest sentences are the canonical promise sentences, kept word for word.
4. **Read aloud:** fragments allowed ("Nothing posted." "Our job."); no stumbles found.
5. **Skim path:** pre-lines + H2s + bolds alone read: too busy to post → a fresh post and story every day → "I'll post
   tomorrow" → you answer, we make it, you press post → see a full week → what we won't promise → Open Sign, everything
   you get → five promises, all the risk is ours → the catch is you press post → a full page or another quiet month.
6. **Compliance:** no views, followers, leads, calls, jobs or income promised; no scarcity or countdowns; no
   testimonials; scope stated on every CTA surface ("you press post"); banned phrases ("we post", "we manage", "we
   reply", "hands-off", "we do the rest") absent; price plain, no anchoring, no value totals; US spelling; no emojis.
   Audience includes clinics and salons but the product is content, not treatment, so no health claims arise.
7. **Readability:** measured (§7, §9).

## 9. Package summary (JSON)

```json
{
  "skill": "direct-response-copywriter",
  "asset_kind": "landing_page",
  "diagnosis": {
    "awareness_stage": "problem",
    "sophistication_stage": 4,
    "evidence": "VoC quoted in lp-99-ads.md / ads-99.md: 'always gonna do it tomorrow', 'fall off after a couple of weeks', 'deciding what to post'; competitors run view guarantees and fake scarcity; owners answer 'empty promises', 'too good to be true'. Problem-aware center with an unaware tail; sophistication 4 to 5.",
    "lead_type_chosen": "problem lead + honesty/contrarian frame with a small checkable claim (Problem-aware x Soph 4-5 cell)"
  },
  "offer_assessment": {
    "one_sentence_offer": "Answer a few questions each week and we make a post and a story for every day of the month, ready for you to post, for $99 a month.",
    "value_equation_notes": "Dream outcome strong (page looks open every day); effort very low and honestly stated; time delay unknown ([N] days to first week); likelihood is the weak lever because there is no sample week, no clients and the guarantee is unconfirmed.",
    "verdict": "adequate"
  },
  "headline_battery": "see section 3 (17 options, 7 families, pick = #1)",
  "asset": { "format": "markdown", "content": "see section 4" },
  "voc_usage": {
    "sources_read": ["docs/lp-99-ads.md", "docs/skill-audit/ads-99.md"],
    "verbatim_woven": 6,
    "absent": false,
    "limiter_note": "Original research/03-voice-of-customer.md not found on disk; only the lines quoted in the two ad docs were available, and they are forum VoC, not this business's customers. No customer quotes exist."
  },
  "proof_gaps": "see section 6 (10 items)",
  "readability": {
    "fk_grade": 2.4,
    "words_per_sentence": 6.4,
    "target": "<= 6 (landing page, cold traffic)",
    "pass": true,
    "note": "measured via the FK script (node port, same formula) on the section-4 extraction, 1295 words / 202 sentences; not estimated"
  },
  "edit_passes_attested": [
    "first_fifth",
    "concreteness",
    "one_idea",
    "read_aloud",
    "skim_path",
    "compliance",
    "readability"
  ],
  "test_plan": [
    {
      "order": 1,
      "variable": "hero H1",
      "variants": [
        "A Fresh Post and Story, Every Single Day",
        "Look Open Every Day. You Press Post."
      ],
      "metric": "checkout_start rate per LP view",
      "minimum": "100 checkout starts per arm before judging"
    },
    {
      "order": 2,
      "variable": "hero sub (lead)",
      "variants": [
        "deliverable line (as written)",
        "problem line: 'People look you up before they call. Give them a page that's open every day.'"
      ],
      "metric": "checkout_start rate",
      "minimum": "100 checkout starts per arm"
    },
    {
      "order": 3,
      "variable": "offer presentation",
      "variants": [
        "bonuses listed",
        "bonuses collapsed to one line 'plus five first-month bonuses'"
      ],
      "metric": "purchase rate per checkout start",
      "minimum": "100 purchases per arm"
    },
    {
      "order": 4,
      "variable": "CTA label",
      "variants": ["Yes! Turn On My Open Sign: $99/Month", "Yes! Make My First Week: $99/Month"],
      "metric": "checkout_start rate",
      "minimum": "100 checkout starts per arm"
    }
  ],
  "summary": "Problem-aware, claim-tired local owners get a short page: identify, state the daily deliverable, name the 9pm problem, show the three steps, demonstrate a week, say what we won't promise, list the offer, remove the risk, answer the catch, close on the cost of waiting. The sample week is the only demonstration and is not built; the guarantees are unconfirmed. Both are the launch blockers, not the copy."
}
```
