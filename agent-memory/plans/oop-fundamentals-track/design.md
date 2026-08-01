# OOP-Fundamentals Track — Design

Not using dev-architect's DDD template (Strategic/Tactical/Logical Design) — this is a
static content track for a teaching site, not a service/domain architecture. No bounded
contexts, no aggregates, no API contracts to define. Plan below is pragmatic instead.

## Scope (confirmed with user)

- New track `OOP-Fundamentals`, same file shape as the other 12 tracks (index.html +
  course.js + style.css, shared/engine.js contract).
- Depth: 4 OOP pillars + design patterns for QA (Factory, Singleton, Builder). 15 lessons.
- Position: homepage nav between Framework-Design and Data-Structures-Algorithms.
- Included in shared/selftest.mjs's TRACKS array and exam/index.html's mixed exam pool.
- Colors: Data-Structures-Algorithms emerald -> new `--accent-amber: #f59e0b`;
  OOP-Fundamentals gets the freed `--accent-emerald: #10b981`.

## Validate() strategy — regex vs real execution (decision, not asked back to user)

Default to regex (matches the other 12 tracks' single-concept-lesson pattern) EXCEPT
where the lesson's entire point is a runtime behavior regex cannot meaningfully check
(identity equality, differing output per subclass, method-chaining result, counter
state). Building those as regex-only would repeat the exact flaw this session just spent
two PRs fixing in Final-Project (string-shaped code passing without doing the right
thing) — inconsistent to ship the same flaw fresh in a brand-new track. Real execution
here follows the same `new Function()` pattern already proven in Final-Project Phase 8
(synchronous, no mock/async harness needed — these are plain classes, not Playwright
code), so it's a known, tested pattern, not new engineering risk.

| # | id | Lesson | Concept | validate() |
|---|----|--------|---------|-----------|
| 1 | `oop_class_constructor` | Class & Constructor พื้นฐาน | `class TestUser { constructor(username, role) {...} }` | regex: `class TestUser`, `constructor(`, `this.username`, `this.role` |
| 2 | `oop_encapsulation_private` | Private Fields | `#balance` + `deposit(amount)` method | regex: `#balance` present, plain `this.balance` absent, `deposit(` exists |
| 3 | `oop_encapsulation_getter` | Getter | `get balance()` returns `#balance` | regex: `get balance()` |
| 4 | `oop_encapsulation_setter_validation` | Setter + validation | `set balance(value)` rejects negative | regex: `set balance(`, `throw`/`< 0` present |
| 5 | `oop_immutability` | Immutability | `Object.freeze()` on a config object | regex: `Object.freeze(` |
| 6 | `oop_inheritance_extends` | Inheritance | `class LoginPage extends BasePage` + `super(url)` | regex: `extends BasePage`, `super(` |
| 7 | `oop_method_override` | Method Overriding | subclass overrides `open()`, calls `super.open()` | regex: method exists + `super.open(` |
| 8 | `oop_polymorphism_common_interface` | Polymorphism | array of BasePage subclasses, same `.open()` call, different real output | **real execution** — regex can't tell if the override actually changes behavior |
| 9 | `oop_abstraction_template_method` | Abstraction | base `run()` throws unless overridden | **real execution** — must prove the base throws and the subclass doesn't |
| 10 | `oop_composition_over_inheritance` | Composition over inheritance | Page holds `this.logger = new Logger()` instead of extending Logger | regex: no `extends Logger`, has `new Logger()` field |
| 11 | `oop_factory_pattern` | Factory | `TestUserFactory.create(type)` returns different shapes per type | **real execution** — the whole point is differing output |
| 12 | `oop_singleton_pattern` | Singleton | `ConfigManager.getInstance()` returns the same instance every call | **real execution** — identity check, regex is meaningless here |
| 13 | `oop_builder_pattern` | Builder | `new TestDataBuilder().setName().setEmail().build()` chaining | **real execution** — verify the built object's actual fields |
| 14 | `oop_static_members` | Static members | `static totalCreated` increments per instance | **real execution** — verify the counter's actual value after N instantiations |
| 15 | `oop_capstone_mini` | Mini capstone (track-closer, not the course Final-Project) | combine Factory + Singleton + Builder into one small `TestSuiteRunner` | **real execution** |

## Scope expansion (2026-08-01, post-ship follow-up)

User asked to deepen the track to match DSA/DB depth: add all 5 SOLID principles, 4 more
patterns (Observer/Strategy/Adapter/Decorator), and a TypeScript interface/abstract-class
lesson. Track grew from 15 to 25 lessons (renumbered `บทที่ 1`-`24` + capstone). New lessons,
inserted in this order:

| # | id | Concept | validate() |
|---|----|---------|-----------|
| 10 | `oop_typescript_interface_abstract` | TS `interface` + `abstract class implements` | regex — TS isn't executable in this JS-only sandbox, same as Framework-Design's TS-flavored regex lessons |
| 12 | `oop_solid_srp` | Single Responsibility — split a validate+write class into two | regex (structural, no runtime behavior to prove) |
| 13 | `oop_solid_ocp` | Open/Closed — extend via new subclass instead of editing base | real execution (same shape as Polymorphism — must prove differing output) |
| 14 | `oop_solid_lsp` | Liskov Substitution — subclass must honor base's return-shape contract | real execution — the whole point is a runtime shape check |
| 15 | `oop_solid_isp` | Interface Segregation — split a fat interface into small ones | regex (structural) |
| 16 | `oop_solid_dip` | Dependency Inversion — constructor-inject collaborator instead of hardcoding `new` | real execution — spy-injects a fake logger, proves it's actually called |
| 20 | `oop_observer_pattern` | Observer — subscribe/notify | real execution — proves all subscribers get called |
| 21 | `oop_strategy_pattern` | Strategy — swappable algorithm via injected object | real execution — proves behavior actually changes per strategy |
| 22 | `oop_adapter_pattern` | Adapter — wrap incompatible interface | real execution — proves the call is forwarded and the result passed through |
| 23 | `oop_decorator_pattern` | Decorator — wrap a function, add behavior transparently | real execution — proves original behavior + wrapping both hold |

Also hid `Accessibility-Testing` from all learner-facing surfaces (homepage nav/card/script
tag/TRACKS array, exam pool script tag, `shared/selftest.mjs` TRACKS array) per user request —
files/course content on disk are untouched, only display + regression-test coverage removed.

Bug caught and fixed during this expansion: `getLearnerClass` re-executes the whole code
string per class name, so pulling `TestRunner`/`SmokeTestRunner` (LSP) or
`ReportFormatter`/`XmlReportFormatter` (OCP) via separate calls would give unrelated class
references — `instanceof` always false even for correct solutions. Reused the existing
`getLearnerClasses` fix (extract all related classes from one execution) already applied to
Polymorphism/Abstraction.

## File changes

1. **New**: `OOP-Fundamentals/index.html`, `course.js`, `style.css` — copy Framework-Design's
   structure, adapt track name/id prefix/color/lesson content.
2. **`index.html`** (homepage): add `--accent-amber: #f59e0b`; change `.btn-dsa` to amber;
   add new `.btn-oop` rule using emerald; insert a track card + nav link between
   Framework-Design's and Data-Structures-Algorithms' sections.
3. **`shared/sync-engine.sh`**: add `OOP-Fundamentals` to its `TRACKS` array (so
   engine.js/editor-*.js/gamification.js get copied in) — missed in the interview brief,
   caught while planning file changes; every track needs this or its sandbox won't run.
4. **`shared/selftest.mjs`**: add `'OOP-Fundamentals'` to `TRACKS` array.
5. **`exam/index.html`**: add `<script src="../OOP-Fundamentals/course.js"></script>`
   alongside the other 12 track script tags.
6. **`DESIGN.md`**: update accent palette section (amber added, emerald reassigned) per
   `rules/product-design.md`'s design-doc-sync expectation.

## Build order

1. Run `shared/sync-engine.sh` after creating the track dir (needs the dir to exist first
   to copy files into) — or create dir + copy shared files manually, then run sync once
   for consistency.
2. Write `course.js` (15 lessons) — biggest chunk of work, delegate to a subagent with this
   design doc + Framework-Design/course.js as style reference.
3. Wire homepage, selftest.mjs, exam/index.html, sync-engine.sh, DESIGN.md.
4. `node shared/selftest.mjs` must show 0 failures across all 13 tracks (was 12).
5. Manually verify at least one real-execution lesson (e.g. Singleton) rejects a
   plausible-but-wrong solution, same verification discipline used on Final-Project.
