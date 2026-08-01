# Programming-Paradigms Track — Design

Same pragmatic (non-DDD) approach as OOP-Fundamentals — static content track, not a
service/domain architecture.

## Scope (confirmed with user)

- New track `Programming-Paradigms`, same file shape as other 14 tracks (index.html +
  course.js + style.css, shared/engine.js contract).
- Depth: Functional Programming (6 lessons) + Concurrency/Multithreading (6 lessons) = 12
  lessons. User explicitly ruled out Networking/OS/Compiler/System Design as too deep for
  this course's QA-automation focus, and confirmed Concurrency is a genuine gap (not covered
  by Performance-Testing which is load-testing, not covered by DSA which is
  algorithms/data-structures, not execution models).
- Position: homepage nav between OOP-Fundamentals and Data-Structures-Algorithms.
- Included in shared/selftest.mjs's TRACKS array and exam/index.html's mixed exam pool.
- New accent color: `--accent-fuchsia: #d946ef` (all 13 other accent slots taken).

## Validate() strategy

Same regex-vs-real-execution decision rule as OOP-Fundamentals: regex for structural
concepts, real execution where the lesson's point is runtime behavior — which for both FP
(pure functions, composition, currying) and Concurrency (race conditions, Promise.all
parallelism, event-loop ordering) is almost every lesson, since these paradigms ARE about
runtime behavior far more than OOP's structural pillars were.

| # | id | Lesson | validate() |
|---|----|--------|-----------|
| 1 | `pp_pure_function` | Pure Functions | real execution — same input twice must give same output, and must not mutate the input |
| 2 | `pp_immutable_update` | Immutable Update Patterns | real execution — original array/object passed in must be unchanged after the call |
| 3 | `pp_higher_order_functions` | Higher-Order Functions | real execution — returned function must actually close over the right value |
| 4 | `pp_map_filter_reduce` | map/filter/reduce over imperative loops | real execution + regex (no manual `for`/`while` loop allowed) |
| 5 | `pp_function_composition` | Function Composition | real execution — composed function must apply both steps in the right order |
| 6 | `pp_currying` | Currying | real execution — partial application must actually work (`add(1)(2)` style) |
| 7 | `pp_async_await` | async/await Basics | real execution against a mock delayed Promise |
| 8 | `pp_promise_all_parallel` | Promise.all Parallelism | real execution — proves concurrent execution via a shared "concurrent-call" counter (peak > 1), same access-counting-style proof DSA uses for Big-O |
| 9 | `pp_race_condition_fix` | Race Conditions & Async-Safe State | real execution — a promise-chain mutex pattern; fires N concurrent increments, asserts the final count is exactly N (a naive unsafe counter would lose updates under simulated interleaving) |
| 10 | `pp_event_loop_ordering` | Event Loop: Microtask vs Macrotask | real execution — captures actual callback order, compares to the canonical microtask-before-macrotask order |
| 11 | `pp_worker_thread_concept` | Worker Threads (concept) | regex-only — `new Worker(...)`/`postMessage` isn't runnable inside this course's `new Function()` sandbox (no real thread/worker environment), same reasoning as the OOP-Fundamentals TypeScript lesson |
| 12 | `pp_parallel_test_capstone` | Mini Capstone: Run N Tests in Parallel | real execution — combines Promise.all (concurrency) + map/reduce (FP) to run mock test cases concurrently and aggregate pass/fail counts |

## File changes

Same as OOP-Fundamentals: new `Programming-Paradigms/{index.html,course.js,style.css}` (copy
OOP-Fundamentals's structure), homepage `index.html` (new accent var, new `.btn-pp` rule, new
card + nav link), `shared/sync-engine.sh` TRACKS array, `shared/selftest.mjs` TRACKS array,
`exam/index.html` script tag, `DESIGN.md` accent palette note (already generic, no edit
needed — confirmed pattern from OOP-Fundamentals).

## Build order

Same as OOP-Fundamentals: create dir + sync shared files, write course.js (12 lessons),
wire homepage/selftest/exam/sync-engine.sh, `node shared/selftest.mjs` must show 0 failures
across all 14 tracks, manually verify at least 2 tricky real-execution lessons (Promise.all
parallelism proof, race-condition-safe counter) reject plausible-but-wrong solutions.
