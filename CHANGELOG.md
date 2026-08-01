# Changelog

All notable changes to QA-Automation-Coding-Course are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and QA-Automation-Coding-Course follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [0.10.0] - 2026-08-01

### Added
- Execute Phase 3/4 code for real via mock Playwright harness ([`8361356`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/8361356f4054ae7ef82220219d6ffba9eb4bc293))
- Execute Phase 5 for real, reduce Phase 8 answer-leak ([`daa749b`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/daa749b771a9144a96552fe944ae275185fee9c4))
- Sequential lesson lock + resume-to-first-incomplete on load ([`dcf0bfe`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/dcf0bfe7ffdbb2e785474a0cf115421894683cd3))
- Add OOP-Fundamentals track (14th course) ([#15](https://github.com/Vit129/QA-Automation-Coding-Course/pull/15)) ([`daba89c`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/daba89cbc592494dab404f25d88eef6c09ab7b84))

### Fixed
- Close skip-ahead gaps and shallow validation in capstone ([`256e58d`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/256e58dece12d79c46c85937b533cb09284ffc30))
- Locked lessons show the warning alert instead of doing nothing ([`49a8e50`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/49a8e50a54c05606a2075b39b809ec55bc48f06f))
- Actually propagate lock/resume feature to all 13 track engine.js copies ([`2d41df9`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/2d41df946e0d0c045b3509a1ae5a81318e67e5a1))

## [0.9.5] - 2026-07-31

### Added
- Wire same editor conveniences (highlight, autocomplete, dedent, comment-toggle) into exam page ([`476f328`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/476f3287186b3af11db329a9833664503e706a7c))

## [0.9.4] - 2026-07-31

### Added
- Add syntax highlight + dedent/comment-toggle; fix(course): remove answer-revealing hints across all tracks ([`ae6d917`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ae6d917067c764b9a4bafc65bf63d0d7e8076fcb))

## [0.9.3] - 2026-07-31

### Added
- Redesign Final Project to 8 integrated phases ([`3fdbe5e`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/3fdbe5e25709983c711c754c377f027085c68991))

## [0.9.2] - 2026-07-31

### Added
- Transform Final Project into Engineering PRD Spec & AC standard (v0.9.2) ([`1f946f8`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/1f946f80d599f6622f56198b590e37b168089132))

### Documentation
- Add capstone-and-course-refinement plan for next session continuation ([`eb3c515`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/eb3c515bf38e35264e3c3d4951b10d2ee34ba0e8))

## [0.9.1] - 2026-07-30

### Added
- Upgrade Final Project to 9-step Software & QA Lifecycle Architecture (v0.9.1) ([`41478ee`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/41478eefdfed2b7f01f6db019362657a2a02cd4a))

## [0.9.0] - 2026-07-30

### Added
- Add editor autocomplete navigation, pair deletion, case-sensitivity guard, and Final Project Capstone (v0.9.0) ([`ebcfa73`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ebcfa734976ec01030dbdd6cc43f614e87cbad46))

## [0.8.4] - 2026-07-30

### Added
- Add keyboard navigation to editor autocomplete dropdown ([`ffb1511`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ffb15114ebff2df709024f57668ab0f56e027ed9))

## [0.8.3] - 2026-07-30

### Added
- Show latest GitHub release tag in footer, fetched at runtime so it never goes stale ([`aeb418e`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/aeb418ec0f1b10d3ad095f451aed6a1a5b3cf0db))

### Fixed
- Recover API-Testing lessons 9-10 and dedupe corrupted lesson data from v0.8.1 bulk edit ([`31e0b30`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/31e0b3042c73aba582554f98f6fe33af2585376a))

## [0.8.2] - 2026-07-29

### Fixed
- Replace generic 4-block theory filler with lesson-specific Mental Model code snippets and Pitfall content across 168 lessons (12 tracks) — v0.8.1's bulk upgrade left placeholder text and, in ~15 lessons, corrupted/truncated code blocks ([`a40f908`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/a40f908c903179c89b3452f3e9653aa094a811bb))

## [0.8.0] - 2026-07-29

### Added
- Add lazygit teaching content to CLI-Essentials git track ([`44b46c3`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/44b46c3efd9d726354d24607e0fbaf70a079f3fe))
- Deepen Visual-Regression-Testing track (7 -> 12 lessons) ([`f8c2182`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/f8c2182e58e951904f9a80e253022ad8a4223f5f))
- Deepen CI-CD-Pipeline track (9 -> 13 lessons) ([`8271d4d`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/8271d4d8f61debc9eac4f6b86dce46d7fcd5775b))
- Deepen Framework-Design track (8 -> 13 lessons) ([`ad24e3c`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ad24e3c1644ef27276a8bff622a9481c811955fa))
- Deepen Accessibility-Testing track (8 -> 13 lessons) ([`84fe28e`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/84fe28e26f93d9106a4b26e9e384cf7f3219bf75))
- Deepen Security-Testing track (8 -> 13 lessons) ([`504c4d8`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/504c4d89567b2b2cfa4aa875101005e06bc10240))

### Fixed
- Enable arrow-key line editing in ship commit-message prompt ([`72938b6`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/72938b6bb4f98d7f228f5f1697c2fc0ca53851f4))
- Close coverage gaps found in Fable curriculum review ([`b3b0e5e`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/b3b0e5e52f9d7eacb6900049458cfa1b258afd19))
- Re-sync landing page lesson counts after deepening 5 tracks ([`7ac3929`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/7ac3929e784c727dab4cff9ccd80765dd2f8af81))

## [0.6.1] - 2026-07-22

### Added
- Auto-derive lesson totals from each track's course.js instead of hardcoding ([`8e464b9`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/8e464b90674b5d0fd2c04e7e680406beceaa7e46))
- Make course site responsive for mobile and tablet screens ([`8fa2ab4`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/8fa2ab441952d62d83fb91b8fef25b9b9f9ff3a9))

### Fixed
- Untrack .claude/worktrees gitlink breaking GitHub Pages build check ([`ceb36a4`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ceb36a490890f1303e633e631a2b279415652629))
- Update exam question-count max to match actual lesson pool size ([`b9249c1`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/b9249c1c792721a5a50a9e727c50d9d395654078))
- Sync homepage TRACKS lesson totals and 11-track banner to actual 12 tracks/164 lessons ([`0b75bff`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/0b75bffee8836fe3f88fa1053a7b7dac99b26620))

## [0.6.0] - 2026-07-22

### Added
- Add Normal Forms lessons to DB track and new Data Structures & Algorithms course ([`bed9a88`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/bed9a88a5b218837e7cb50895f7996027ac4b478))

## [0.5.1] - 2026-07-21

### Added
- Milestone messages + completion certificates ([`7db2050`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/7db2050c6c5f745df6d38d546464007c84168a9b))

## [0.5.0] - 2026-07-21

### Added
- Add rate-limit and flaky-test retry lessons to all 3 tracks ([`c877bca`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/c877bca4597ba821321b732c1510c6a3580f9f67))
- Add Home button and make the lesson sidebar a persistent overlay drawer ([`e25cf42`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/e25cf42901894588c3d4182ea9e15871761b0361))
- Add root-cause diagnosis lessons (not just increase timeout) to all 3 tracks ([`7a08728`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/7a08728f798d1dbb7ca4e68c4e415cba36fb3868))
- Add dialog, loading-state, and file-import lessons across all 3 tracks ([`93a1a27`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/93a1a27de4ce6d2e9bbce0ae593d1e9bf99f4573))
- Add Performance Testing (k6) as a new 4th track ([`88d5136`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/88d5136e263f6071344e5728a911160429e36273))
- Add Database Design & SQL as a new 5th track ([`c09dcee`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/c09dcee2646ba0b63f5b4376980da6fc48120508))
- Add Git, Vim & Unix Cheat Sheet as the 6th and final track ([`43a8db4`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/43a8db436f566931c6d8edabea707d1b249c4652))
- Add file type/size validation lessons (closes realism gap) ([`d211bf5`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/d211bf576dd2cf37303c28c7eb09d4b99a5d0061))
- Add course progress dashboard and completion rewards to landing page ([`ec1463a`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ec1463a6fea5b451b33334435cd122e8446e2639))
- Add XP/badge toasts and completion celebration animation ([`1a64483`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/1a644834897bbba40416494f16655f86ea2bc0d7))
- Add export/import for course progress (portable across browsers/machines) ([`ec660db`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/ec660dbec4fb4dce706fa12c882b9b59a6a6ca87))
- Deepen DB Design & Performance Testing tracks per user request ([`d8c81ff`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/d8c81ffe63a7a84f3c14ec33f7242b62a881475b))
- Add Security, Accessibility, Visual Regression, CI/CD, and Framework Design tracks ([`92cf6a0`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/92cf6a0e516dd1c574d94703964088e85f03dbd3))
- Add mixed timed mock exam, selectable by content track ([`1731cf8`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/1731cf8ddfabc1e151e5db5e486f091e9a4f7c5e))
- Dialog close button repositioned + code editor autocomplete ([`cca0de1`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/cca0de16407da6d14c57a6767abcc203be0a5837))

### Changed
- Extract shared sandbox engine, add 10 new CLI-Essentials lessons ([`2b8c030`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/2b8c030dc69fdf68caf0fd5ca32dc9e3ec874d31))
- Deepen Framework-Design's DRY exercise per user request ([`720a66e`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/720a66e46f4d851bb2fd2f347480df8949054800))

### Documentation
- Add README with track overview and run instructions ([`7279d55`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/7279d551b903febeeb0811536c90ea013da8420c))
- Clarify track titles, reorder landing page, fix lesson counts ([`311caf4`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/311caf4aab11424a88d006152914453a9ca94464))
- Update footer credit line ([`d562c31`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/d562c31daa984f5c52e0ed6412a6ea66ca522a26))
- Add MIT LICENSE ([`04759ea`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/04759eaf1a76fe4b7b3e77fa1de37831a8be3033))
- Add License section to README ([`e60c8f8`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/e60c8f8896189a5e69062e1936188270fec4846a))
- Trim Development section from README, duplicated in script comments ([`6680231`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/66802313351269eed5a3aceeb9bb295d96af97ab))
- Add PRODUCT.md and DESIGN.md ([`79ccf93`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/79ccf930260183c7096ff54358190e1cfcbda889))

### Fixed
- Rename harness-terminal branding to Kouen across RF lessons ([`5ae2523`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/5ae2523e9c7971fc76790932d4efc7aa4cb14733))
- Correct Security-Testing grounding errors found by independent Fable review, commit self-test harness ([`8962814`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/89628143d04ede69751d658d8a5a6a819f32f27f))
- Harden all 11 tracks against hint-leaked answers and gameable validate() ([`38bc980`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/38bc980be931efe907a1d187c73102ff0d11379d))
- Deploy Pages via GitHub Actions, legacy build queue stuck on stale commit ([`3a3c1fc`](https://github.com/Vit129/QA-Automation-Coding-Course/commit/3a3c1fc2c82d24e4dd97869174da8cef4efab2ef))

