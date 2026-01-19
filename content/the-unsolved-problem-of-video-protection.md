+++
title = "The Unsolved Problem Of Video Protection (For Developers)"
date = 2026-01-18
[taxonomies]
tags = ["video", "drm", "security", "streaming", "web-development"]
[extra]
lang = "en"
+++

# The Unsolved Problem Of Video Protection

If someone can watch your video, they can steal your video.

Mux says it bluntly, and they’re right. From a developer’s point of view, “video security” is not about creating an unstealable asset. It’s about controlling _who_ gets to watch, _how_ they access it, and _how much work_ it takes to copy or redistribute.

This post is a practical map for engineers:

- what attackers actually do,
- what each protection mechanism really buys you,
- where AES-128 “encryption” stops,
- and when you truly need full DRM.

---

## Threat Model: How People Actually Steal Video

Before picking tools, you need a threat model. The Mux article lays out the main vectors well:

1. **Hotlinking / re-embedding**

   - Flow:
     - User logs in legitimately, opens page with video.
     - Opens devtools, finds the HLS/DASH/MP4 URL.
     - Embeds that URL in another site or app.
   - Impact:
     - You pay egress; they get traffic and ad revenue.
     - Bypasses your auth stack entirely once URL is known.

2. **Direct downloads**

   - MP4:
     - Single HTTP GET -> file saved -> done.
   - HLS/DASH:
     - Parse the manifest (`.m3u8`/`.mpd`).
     - Download all segments, remux to MP4 using `ffmpeg`, `yt-dlp`, browser extensions, etc.

3. **Software screen recording**

   - Built-in or third-party recorders capture composited frames.
   - On a non-DRM setup, they see what the user sees.

4. **Physical re-recording**
   - External camera pointed at a display.
   - Zero software hooks. No OS, no browser, no player in the loop.

The last one is the key reason this problem is fundamentally unsolved: there is no API to prevent "person with camera in a room."

Everything you implement is about raising the bar to the point where only that last, painful option remains.

---

## Cost Model: What Security Really Costs You

From the Mux perspective, the “cost of security” has four dimensions you, as a dev, will feel:

- **Development:** integrating tokens, DRM, restrictions, license servers.
- **Maintenance:** adapting to SDK/OS/browser/API changes.
- **Playback errors:** more moving parts -> more reasons for legitimate viewers to hit errors.
- **Dollars:** DRM vendors, watermarking, higher-touch hosting, support.

On top of that, as Screencasting.com emphasizes when talking “cheap video hosting”: you still need to keep basic hosting costs and complexity under control. No one wants a “secure” system that collapses under normal traffic, or a bandwidth bill that dwarfs your product revenue.

So instead of asking “How do we lock this down completely?”, a better developer question is:

> Given our content and audience, what’s the lowest-complexity stack that makes casual abuse annoying and serious piracy costly?

Let’s walk the stack from “cheap and cheerful” to “serious DRM.”

---

## Tier 0: Just Host It (And Don’t Be Dumb)

For many dev teams, especially early-stage products, the biggest practical risk isn’t piracy—it’s:

- serving video from a single VPS or S3 bucket with no CDN,
- no rate limiting,
- and getting crushed on performance or egress costs.

At this stage:

- Prefer a video platform or CDN that:
  - Handles encoding/transcoding (multiple resolutions, HLS/DASH).
  - Manages global delivery.
  - Gives you basic access controls you can grow into (tokens, domain restrictions, etc.).
- Avoid DIY streaming from your app servers.

Security posture here is minimal, but not zero: you get obscurity and throttling “for free” from mature providers. That’s enough for public marketing videos, free educational content, or anything where piracy isn’t a business threat.

---

## Tier 1: Auth + Signed URLs (The Sensible Default)

The first serious layer every developer should consider is tokenized access, as outlined in Mux’s “time-based signed URLs.”

### What it is

- On your backend:
  - Authenticate and authorize the user.
  - Generate a playback URL with:
    - An expiry time (`exp`),
    - Possibly a `user_id` / `session_id`,
    - Optional constraints (IP, referrer, etc.),
    - A cryptographic signature (HMAC or similar).
- On the client:
  - Use that URL as the `src` for your player.

### What it stops

- Blind guessing or scraping of static URLs.
- Permanent working links that circulate forever.
- Some link-sharing: once expired, that exact URL is dead.

### Dev details to get right

- **Token duration:**
  - Keep it short enough to limit abuse (e.g., 1–4 hours).
  - Long enough to not annoy legitimate viewers who pause or scrub.
- **Error handling:**
  - When a token expires mid-session, your player will start failing segment loads:
    - Detect 401/403 on segments/manifest.
    - Fetch a fresh signed URL via your backend.
    - Seamlessly reload the player at the same playback position.
- **Identification:**
  - Include something like `sub` / `uid` in the token payload:
    - If a URL appears on a piracy site, decode the token and find the leaking account.

### Limitations

- Anyone with a valid URL during its lifetime can still:
  - Download segments,
  - Re-embed it,
  - Screen capture it.
- It’s a gate, not a lock.

But in terms of “bang for buck,” signed URLs are arguably the #1 measure for most internal apps, SaaS products, and paywalled content platforms.

---

## Tier 1.5: Referrer & User-Agent Filtering (Soft Filters)

Mux calls these out as supporting protections that are easy to bolt on.

### Referrer checks

On your video-hosting backend/CDN, inspect `Referer`:

- Allow if it matches your web origin(s): `https://app.example.com`.
- Optionally, allow official casting/domains (e.g. Chromecast, AirPlay hosts).
- Deny if it’s some random site: `https://pirate-portal.io`.

**Pros**

- Blocks the laziest form of hotlinking (simple `<video src="...">` embeds).
- Very low implementation effort.

**Cons**

- Easy to spoof for serious attackers.
- Breaks for:
  - Native mobile apps (no referrer),
  - Some privacy setups,
  - Cast/AirPlay/Smart TV paths unless whitelisted.

Use it as a guardrail, not a guarantee.

### User-Agent filtering

Inspect `User-Agent`:

- Allow browsers and your official apps.
- Optionally block known download tools or obviously non-human agents.

Again, all self-reported, so treat this as **filter noise, not stop attackers.**

Realistically, Tier 1 + 1.5 will block casual freeloaders and bots, and gives you basic visibility into abuse, with minimal added complexity.

---

## Tier 2: AES-128 HLS Encryption – What It Actually Does

Kinescope’s AES-128 vs DRM discussion hits an important nuance developers often miss:

> Encrypting segments with AES-128 and giving the client the key is _not_ the same as DRM.

### Standard AES-128 HLS flow

- Encode HLS segments.
- Generate an AES-128 content key.
- Encrypt each segment with that key.
- Expose a key URI in the playlist, e.g.:

  ```m3u8
  #EXT-X-KEY:METHOD=AES-128,URI="https://keys.example.com/k123.key"
  ```

- Player:
  - Fetches the key file from `keys.example.com`.
  - Decrypts segments locally, then decodes/plays.

### Security properties

- If someone only has your _storage_ (e.g., raw `.ts` or `.mp4` segments) but not the key server, they can’t decode easily.
- If you serve keys via HTTPS from a separate origin with access control, you get some “defense in depth” around misconfigurations.

But the key reality:

- The decryption key is delivered to the client in plain form at some point.
- Any attacker who can use `curl` or intercept HTTP traffic can grab it.
- Decrypted bytes exist in process memory, accessible to:
  - Screen recorders,
  - Hooking/instrumentation tools,
  - Modified players.

In an era where HTTPS is mandatory anyway, AES-128 HLS mostly protects _at rest_ and in some infra breach scenarios—not against end-user copying.

It’s worth using in some setups (especially if you’re worried about bucket exposure or need a compliance checkbox), but don’t confuse it with “solved security.”

---

## Tier 3: Real DRM (Widevine / FairPlay / PlayReady)

When the content is actually high-value—think OTT TV, movie rentals, major sports, or expensive commercial training—you eventually need proper DRM.

### Architecture

At a high level:

1. Content is encrypted with keys you manage or via a DRM service.
2. Encrypted streams are delivered to clients (HLS with FairPlay, DASH with Widevine/PlayReady, etc.).
3. Player initializes DRM:
   - Uses EME (Encrypted Media Extensions) in browsers.
   - Or native DRM APIs (Android, iOS/tvOS, smart TVs).
4. Client requests a license from your DRM license server:
   - Includes device info, content ID, maybe user entitlements.
5. DRM module (CDM) receives keys in a secure context:
   - Keys never appear in JS or app code.
   - Decrypts video in secure hardware/OS contexts.
6. OS/DRM stack enforces:
   - Screen recording blocked/black-screened.
   - Output restrictions enforced (HDCP, resolution caps).
   - Offline license rules (expiration, device count).

### What DRM actually buys you

- Software screen recorders see black, not frames.
- Keys are never present in application space, only in CDM/TEE.
- You can control device classes and outputs (e.g., no 4K over insecure HDMI).
- Combined with entropy/watermarking, leaks are more traceable.

### What it does _not_ solve

- Someone filming the screen with an external camera.
- Credential sharing and account reselling (that’s a business/policy issue).
- All edge-case playback failures—if anything, it introduces more.

### Developer tradeoffs

- **Complexity:**
  - Multiple DRMs with different quirks (e.g., Widevine on Chrome/Android, FairPlay on Safari/iOS, PlayReady on some TVs).
  - License servers, key provisioning, entitlement logic.
  - Testing matrix explodes (browsers x OSes x devices).
- **Maintenance:**
  - DRM vendors and platforms change behavior.
  - OS/browser releases sometimes break EME/DRM flows.
- **Error handling:**
  - More reasons for `MEDIA_ERR_DECODE`, license errors, etc.
  - You need observability and fallbacks.
- **Cost:**
  - Many DRM providers license per device/stream.

For developers, the main question is _when_ the business risk justifies this level of investment. For many SaaS or course platforms, the answer is “not yet.”

---

## Watermarking: Turning Copies Into Evidence

Forensic watermarking slots alongside DRM when you care not just about “can they copy this?” but “who leaked this copy?”

### Basic pattern

- Encode at least two variants of every segment (A/B).
- For each viewer or session, choose a unique pattern (e.g., ABBAABB…).
- Player receives a seemingly normal stream; differences are invisible.
- Later, if a pirated copy appears, analyze its pattern to recover the user/session.

Practically:

- Implementation is non-trivial:
  - Encoding pipeline complexity increases.
  - Delivery logic must assemble viewer-unique streams.
- Cost and overhead may be significant.

If you’re building Netflix-class security, this is on the table. For most developers, it’s overkill.

---

## Putting It All Together: A Developer’s Decision Tree

Here’s a pragmatic starting point when you’re choosing protection levels:

1. **What’s the content value?**

   - Public, marketing, or free community content:
     - Don’t overbuild. Host on a solid platform/CDN.
   - Paid, but not existential:
     - Courses, SaaS “premium” videos, internal trainings.
   - High-stakes commercial:
     - Licensed films, live sports, region-limited TV, regulated sectors.

2. **Who is the attacker?**

   - Casual freeloaders (people posting URLs around, running simple downloaders).
   - Motivated pirates (building mirror sites, selling access, evading detection).
   - Insider threats / storage breach (S3 buckets exposed, etc.).

3. **What are we willing to pay in dev time, ongoing ops, and support?**

From there:

- If content is low-risk:

  - Use robust hosting, maybe signed URLs for metrics/abuse control, and stop there.

- If content is paywalled but not highly sensitive:

  - Implement:
    - Auth + signed URLs (with embedded user/session IDs).
    - Basic referrer and User-Agent filtering for web.
    - Logging/alerts for abnormal token usage.
  - Optionally add AES-128 HLS if you care about storage-level leakage.

- If content is core IP or licensed and leaks would be serious:
  - Plan for:
    - Multi-DRM (Widevine/FairPlay/PlayReady) via a provider.
    - Thorough QA across devices and OS versions.
    - Strong monitoring of license/errors and a support loop.
    - Possibly watermarking if you need to trace leaks.

In all cases, remember the one immutable constraint:

> A perfect “unstealable” video pipeline is impossible. Your job is to make abuse sufficiently expensive, detectable, and rare.

---

## References

- Mux – If someone can watch it, they can steal it: securing video content on the internet: https://www.mux.com/blog/if-someone-can-watch-it-they-can-steal-it-securing-video-content-on-the-internet
- Screencasting.com – Cheap video hosting: https://screencasting.com/articles/cheap-video-hosting
- Kinescope – DRM encryption and AES-128 vs DRM protection: https://www.kinescope.com/blog/drm-encryption#aes128-protection-vs-drm-solution-protection
