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

Pir2Pir is the finding step. It does not review anything, does not grade anything, and has no opinion
about the work.

It also carries the school's announcements, for a smaller reason: those are posted in the school's
chat, which is a busy place, and a notice about an exam sign-up is easy to lose between conversations.
Reading them beside your reviews means one fewer place to check.

## The two ways to reach somebody

**Find anyone who can help.** You pick a project you have finished or are waiting to have reviewed,
and the service looks for peers who could review it. It asks a few at a time rather than everybody at
once, and stops the moment one of them says yes. Nobody is named to anybody until that happens.

The strongest match is **reciprocal** — two people each waiting for a review of the same project.
They unblock each other, so when both are searching at the same moment they are simply put together
without either being asked.

**Ask one particular person.** If you already know who you want, you send them a request with a short
message saying why. They accept or decline. A chat exists only if they accept.

If that person is not registered, you can send them one short introduction by school email or on the
school's chat — your message, your name, and what this is. They can refuse further contact in one
click. One introduction per person per sender per month, three from everybody: this is a way to reach
somebody once, not a way to campaign at them.

Either way it ends in the same thing: a conversation between two people, in the app.

## What it deliberately does not do

This is the part worth being precise about, because it is unusual and it is a choice.

**There is no directory and no search for people.** You cannot browse members, and there is no
autocomplete. To ask somebody directly you need their exact school login.

**It never hands out anyone's contact details.** It does not show one member another member's
Telegram, email, or anything else. If two people want to continue somewhere else, they say so to each
other in the chat — the platform is not the one that disclosed it.

This holds for the introductions above too, which is the part worth saying out loud: the sender never
sees the address their message went to. They see a masked hint. The service does the delivering
precisely so that nobody has to be given anybody's address.

**Identities are disclosed only at the moment of a match.** While a search is running, a candidate is
told the project and the campus, not who is asking. The decision to help is made on the work.

**Conversations are temporary.** A chat lasts as long as it is being used, then expires and its
messages are deleted. Two people have one conversation, not a pile of them — talking again revives
the one you had rather than starting another.

**Joining is opt-in.** Nobody is enrolled by being a student. There is no crawl of the school's user
base; you are here because you signed in.

**Somebody who has not joined can be introduced once, and can stop it forever.** That is the single
exception to "we only message people who signed up", it is capped, every message says who is asking
and why it arrived, and one refusal is permanent and covers every channel.

## School news

Announcements from the school appear in the app, in tabs by channel, with the emoji and posters they
were written with. Read-only — replying belongs in the room the notice was posted in, and this is a
noticeboard rather than a second place to have the conversation.

Two things about it are worth stating plainly, because both are choices.

**Only announcements, never conversation.** A staff notice addressed to everyone is mirrored. The
replies underneath it are not — those are students asking about their own circumstances, and they are
not news. Nothing anybody writes in a thread is copied here.

**A campus channel would reach that campus only.** The service can carry a city's own room and show
it to peers of that city and nobody else. **None is running yet** — today there is one school-wide
channel and that is all, so copy should not promise campus news.

Where a notice answers an earlier one, both are shown together.

## How somebody uses it

1. Sign in with a 21School login. A one-time code is sent to the school address, or to the school's
   chat if that is picked instead; there is no password.
2. Projects are synced from 21School, so the service knows what can be reviewed.
3. Search for a reviewer, or ask a specific peer.
4. Get told when something happens, on whichever channels have been switched on.
5. Talk, arrange the review, do it on the school's platform.
6. Read the school's announcements in the same place, rather than hunting for them in chat.

## Where it works

**Running today:** the web app and a Telegram bot. Both are the same account and the same
conversations.

**Being built:** a MAX bot. The service can already sign somebody in from MAX and notify them there,
and the bot itself is not finished — so copy should not offer it yet.

**Not built:** a phone app. The web app works on a phone; that is all. Sign-in for one is ready on
the service's side, which is not the same as an app existing.

Notifications reach whichever channels a person has switched on, and blocking or removing one does
not affect the rest.

### The school's own chat

No conversation ever happens there on this service's behalf, and it is not a place the service runs.
It is read, to copy announcements across. It is written to in three cases, and it is worth being
exact about them because it is somebody else's system:

- **A sign-in code**, when the member chose that instead of email.
- **Notifications**, only if the member switched that channel on. It is off for everything by
  default — the service can reach any member there without being linked to, which is precisely why
  being able to is not treated as permission to.
- **One introduction to somebody not registered**, capped and refusable exactly as described above.

The first two are a member asking to be written to. What a peer wrote in a chat here is never among
it: message previews are not sent to the school's chat, or to any messenger, by default or by choice.

## Choosing how you are told

Notifications are set per kind and per channel, not with one switch. Somebody can have review matches
in Telegram, keep talk requests on their phone, and have neither in the school's chat.

The channels are the web app, the messenger bots, push to a device, and the school's chat.

Three things about it are choices worth stating:

- **The list of settings comes from the service**, so a kind added in a release appears in settings
  the same day rather than becoming a message nobody can find the switch for.
- **The school's chat is off for everything** until somebody turns it on, because the service can
  reach any member there whether or not they ever linked anything.
- **What a peer wrote never leaves for a messenger.** A message preview reaches the app and a
  member's own device, and there is no setting that sends it anywhere else.

Switching everything off silences delivery, not the record: what happened is still in the app to
read. A member asked not to be interrupted, not to be kept in the dark.

## Numbers you can quote

Live figures come from `GET /api/metrics/public` — use it rather than writing a number into copy. The
landing fetches it straight from the browser; a page on a host we do not run cannot, so a figure
embedded somewhere else has to come from a server.

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

## Saying what you think of it

Any member can write one testimonial about Pir2Pir. It is not public until a moderator accepts it,
and editing an accepted one takes it back down until it is accepted again — so an approval always
belongs to the words it was given to.

Accepted ones are served anonymously for the landing page, with the author's login and first name.
That makes it the only thing here that shows what a member wrote to people who are not members, which
is why it is gated rather than instant.

## Bringing somebody in

Every member has a short code — seven characters, no glyphs that get confused when retyped — and two
links built from it: one into the web app, one into the bot. Somebody who registers holding a code is
recorded against whoever's it was, once, permanently.

A leaderboard ranks members by how many they have brought in. Anybody who would rather not appear can
turn their name off in settings: they keep their position and lose their name, because removing them
would shift everybody below and turn a privacy setting into a way to inflate other people.

Two things it deliberately does not do: a code cannot be revoked or expire, and there is no way to
invite one specific person. It is a link you share, not an invitation you issue.

## What is not built yet

Worth knowing so nothing here gets promised early.

- **No outcome measure.** Nothing asks whether a review actually helped, so the service can say
  conversations happened, not that they were worth having.
- **Nothing is earned by inviting anybody.** The leaderboard counts and ranks; it does not pay. What
  it should count — people who joined, or people who joined and then did something — is deliberately
  still open, because that choice decides whether the incentive is volume or usefulness.
- **The leaderboard is members-only**, and that is what justifies appearing on it by default. A public
  one would have to be opt-in.
- **No way to move an account to a different messenger account** in one step. It is unlink, then link
  again, which needs the old account or a web session.
- **No native mobile app.** The web app works on a phone; that is all.
- **A few kinds cannot be switched off**, on purpose, and they are the ones where silence breaks
  something rather than quietening it — an ask being withdrawn, and a mail provider waiting on a
  confirmation that has nowhere else to arrive.
- **No reply counts on announcements.** A notice does not say how much it was discussed.
- **Campus news is not running, and could only be Ufa.** One school-wide channel is mirrored today.
  The account that reads the school's chat belongs to a student in Ufa, so even when campus rooms are
  switched on, no other city's could follow without an account there.
- **Mirroring a private campus room is not cleared yet.** The school-wide channel is public and safe
  to republish; a campus room is readable only because our account is a member of it. Tracked in
  [legal-follow-ups.md](legal-follow-ups.md) — check it before writing about campus news.

## Legal

Terms, privacy policy and consent live in [pir2pir-docs](../../pir2pir-docs), in Russian, English and
Uzbek. Operates under 152-ФЗ and the school's own rules on personal data.

Pending corrections to those documents are tracked in [legal-follow-ups.md](legal-follow-ups.md) —
check it before quoting the policy, since an entry there means the published text does not match the
system yet.

## For engineers

- [api.md](api.md) — every endpoint, with the reasoning
- [economy-analysis.md](economy-analysis.md) — design for a virtual economy; nothing built yet
- [notifications-kafka.md](notifications-kafka.md) — how a decision becomes a message
- [matching-architecture.md](matching-architecture.md) — the original design, and where it diverged
