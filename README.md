# Haunted Catwalk Academy

A private, bite-sized learning game for a rising Alabama third grader. The first prototype blends second-grade review with third-grade previews through an original Halloween fashion adventure.

## Run locally

```bash
npm install
npm run dev
```

## Prototype principles

- Sessions end after three small challenges (about eight minutes).
- No timers, streak penalties, advertising, chat, accounts, or public competition.
- Immediate, specific feedback and optional hints.
- Every completed challenge offers three fashion rewards to choose from.
- Each cat blinks, breathes, reacts, swishes its tail, and models the selected outfit.
- Learners name and customize a new cat before each adventure.
- The creator includes six fur colors, six eye colors, seven markings, and five distinct ear shapes.
- Cats also support six secondary marking colors, five tail types, four eye shapes, four moods, four movement styles, and five portrait backgrounds.
- Coat markings adapt their contrast to remain visible on light and dark fur.
- Costumes use layered tailoring details and independently animated fabric, charms, bows, and footwear.
- Completed cats permanently enroll in a growing haunted academy collection.
- Enrolled cats can receive a makeover at any time.
- A top-down academy map offers mixed, math, reading, and language classrooms.
- Lesson questions are shuffled while avoiding the immediately previous set.
- Each subject has 15 questions, preventing repeats for five full subject-room lessons.

## Publish for browser-only use

For the complete private-repository setup, daughter-PC instructions, privacy limitations, and troubleshooting, see [GITHUB_PRIVATE_REPO_DEPLOYMENT.md](GITHUB_PRIVATE_REPO_DEPLOYMENT.md).

The repository includes a GitHub Pages workflow. After pushing to `main`:

1. Open the repository on GitHub.
2. Select **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Let the `Deploy Haunted Catwalk Academy` workflow finish.
5. Bookmark `https://reb-eng.github.io/3rd-grade-head-start/` on the learner's computer.

The published site is publicly reachable, but cat names, outfits, and learning progress remain in that browser's local storage and are not uploaded.
- Progress remains in the browser's local storage.
- Calm mode reduces decorative stimulation.

## Current learning content

- Addition across a ten
- Reading comprehension using text evidence
- Antonyms and vocabulary

The current build is deliberately small so the core loop can be tested with the learner before expanding the curriculum.
