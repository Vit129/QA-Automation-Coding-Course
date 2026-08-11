# Course Content Backlog — Future Ideas (not scheduled)

Lightweight parking lot for content ideas raised in conversation but not yet built.
Not a committed plan — pull an item into its own `agent-memory/plans/[FEATURE]/` when ready to build.

- [ ] **Docker: mocking a 3rd-party service** — CI-CD-Pipeline track, one new lesson.
  Teaches `docker-compose` spinning up a mock 3rd-party dependency (fake payment gateway /
  external API container) so tests don't hit the real thing — the "testcontainers" pattern.
  Regex-only validate() (check `docker-compose.yml`/`Dockerfile` structure) since this course's
  sandbox is browser-JS only, no real Docker runtime to execute against — same concept-only
  treatment already used for the TypeScript interface/abstract-class lesson (OOP-Fundamentals)
  and the Worker Threads lesson (Programming-Paradigms).
  Raised 2026-08-02, deferred at user's request ("ใส่ไว้ใน plan ก่อน").
