# Pir2Pir — what it is

Short context for anyone writing about the product: landing copy, a README, an explanation to the
school. Kept in step with what the system actually does, so anything here is safe to say out loud.

If a claim is not in this file, check before publishing it. The numbers in particular have been wrong
before — see [Numbers you can quote](#numbers-you-can-quote).

## In a sentence

Pir2Pir finds a 21School student someone to do a peer review with, and gives the two of them a place
to arrange it.

## The problem

21School work is reviewed by other students. Finding one is the part the school does not help with:
you finish a project, and then you are on your own to find somebody who has done it, is willing, and
is free. In practice that means asking in chats, hoping, and waiting — and a project sits finished
but unreviewed while you do.

Pir2Pir is the finding step, and nothing else. It does not review anything, does not grade anything,
and has no opinion about the work.

## The two ways to reach somebody

**Find anyone who can help.** You pick a project you have finished or are waiting to have reviewed,
and the service looks for peers who could review it. It asks a few at a time rather than everybody at
once, and stops the moment one of them says yes. Nobody is named to anybody until that happens.

The strongest match is **reciprocal** — two people each waiting for a review of the same project.
They unblock each other, so when both are searching at the same moment they are simply put together
without either being asked.

**Ask one particular person.** If you already know who you want, you send them a request with a short
message saying why. They accept or decline. A chat exists only if they accept.

Either way it ends in the same thing: a conversation between two people, in the app.

## What it deliberately does not do

This is the part worth being precise about, because it is unusual and it is a choice.

**There is no directory and no search for people.** You cannot browse members, and there is no
autocomplete. To ask somebody directly you need their exact school login.

**It never hands out anyone's contact details.** It does not show one member another member's
Telegram, email, or anything else. If two people want to continue somewhere else, they say so to each
other in the chat — the platform is not the one that disclosed it.

**Identities are disclosed only at the moment of a match.** While a search is running, a candidate is
told the project and the campus, not who is asking. The decision to help is made on the work.

**Conversations are temporary.** A chat lasts as long as it is being used, then expires and its
messages are deleted. Two people have one conversation, not a pile of them — talking again revives
the one you had rather than starting another.

**Joining is opt-in.** Nobody is enrolled by being a student. There is no crawl of the school's user
base; you are here because you signed in.

## How somebody uses it

1. Sign in with a 21School login. A code is emailed to the school address; there is no password.
2. Projects are synced from 21School, so the service knows what can be reviewed.
3. Search for a reviewer, or ask a specific peer.
4. Get told when something happens — in the app, or in Telegram if the bot is linked.
5. Talk, arrange the review, do it on the school's platform.

## Where it works

The web app, and a Telegram bot. Both are the same account and the same conversations. MAX and a
phone app are possible later without changing how any of the above works.

Notifications reach whichever of those a person has connected. Blocking one does not affect the
others.

## Numbers you can quote

Live figures come from `GET /api/metrics/public` — use it rather than writing a number into copy.

| Field | What it honestly means |
| --- | --- |
| `totals.peers` | People registered |
| `totals.reviews` | Conversations ever opened |
| `totals.messages` | Messages ever sent |
| `totals.campuses` | **Campuses at least one registered peer belongs to** — not campuses that exist |
| `change` | How much of each arrived in the last 7 days, for a "+N" beside the figure |
| `live` | Chats and searches happening now. **Null below a floor of 5**, deliberately |

Two traps, both of which have already produced a false claim on a page:

- **`live` is null when the numbers are small.** That is not an error and it does not mean zero — it
  means an exact count would start to identify who those people are. Say nothing rather than "a few".
- **`totals.campuses` once counted campuses the service knew about**, which read 44 while ten users
  sat in four. It now counts campuses with peers. Do not reintroduce the larger number.

The service is new and small. Copy that implies a crowd will be untrue for a while, and untrue copy
is worse than modest copy.

## What is not built yet

Worth knowing so nothing here gets promised early.

- **No outcome measure.** Nothing asks whether a review actually helped, so the service can say
  conversations happened, not that they were worth having.
- **No notification preferences** beyond a single on/off. Somebody cannot ask for Telegram but not
  email.
- **No native mobile app.** The web app works on a phone; that is all.

## Legal

Terms, privacy policy and consent live in [pir2pir-docs](../../pir2pir-docs), in Russian, English and
Uzbek. Operates under 152-ФЗ and the school's own rules on personal data.

Pending corrections to those documents are tracked in [legal-follow-ups.md](legal-follow-ups.md) —
check it before quoting the policy, since an entry there means the published text does not match the
system yet.

## For engineers

- [api.md](api.md) — every endpoint, with the reasoning
- [notifications-kafka.md](notifications-kafka.md) — how a decision becomes a message
- [matching-architecture.md](matching-architecture.md) — the original design, and where it diverged
