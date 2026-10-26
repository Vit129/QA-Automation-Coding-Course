// Pure logic for the multiple-choice (MCQ) exam mode: no DOM, no storage, no clock.
// exam-engine.js (UI) calls these; tests/test-mcq-exam.mjs loads this file in a bare vm.
//
// A bank question looks like:
//   { id, domain: 1..5, objective: '1.2', type: 'single'|'multi',
//     stem, choices: [string, ...], answer: [index, ...], explanation }
// `answer` always lists the correct choice indices (one for 'single', 2+ for 'multi').

(function (root) {
  // CompTIA Security+ SY0-701 exam weighting per domain (percent of scored questions).
  const DOMAIN_WEIGHTS = { 1: 12, 2: 22, 3: 18, 4: 28, 5: 20 };

  const DOMAIN_NAMES = {
    1: 'General Security Concepts',
    2: 'Threats, Vulnerabilities & Mitigations',
    3: 'Security Architecture',
    4: 'Security Operations',
    5: 'Security Program Management & Oversight',
  };

  function shuffle(arr, rand) {
    const r = rand || Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // How many questions to draw from each domain for an exam of `count` questions:
  // proportional to DOMAIN_WEIGHTS (largest-remainder rounding), capped by what the bank
  // actually has per domain; any shortfall is refilled from domains that still have spare.
  function allocateByDomain(count, availableByDomain) {
    const domains = Object.keys(DOMAIN_WEIGHTS).map(Number);
    const totalAvailable = domains.reduce((s, d) => s + (availableByDomain[d] || 0), 0);
    const target = Math.min(count, totalAvailable);
    const totalWeight = domains.reduce((s, d) => s + DOMAIN_WEIGHTS[d], 0);

    const alloc = {};
    const fractions = [];
    let assigned = 0;
    for (const d of domains) {
      const exact = (target * DOMAIN_WEIGHTS[d]) / totalWeight;
      const base = Math.min(Math.floor(exact), availableByDomain[d] || 0);
      alloc[d] = base;
      assigned += base;
      fractions.push({ d, frac: exact - Math.floor(exact) });
    }
    fractions.sort((a, b) => b.frac - a.frac || a.d - b.d);

    let left = target - assigned;
    // First pass hands the remainder to the largest fractions; later passes mop up whatever a
    // capped domain could not take, so the total always reaches `target`.
    while (left > 0) {
      let progressed = false;
      for (const { d } of fractions) {
        if (left === 0) break;
        if (alloc[d] < (availableByDomain[d] || 0)) {
          alloc[d] += 1;
          left -= 1;
          progressed = true;
        }
      }
      if (!progressed) break;
    }
    return alloc;
  }

  // Draw an exam: domain-weighted sample, then shuffle the question order. Each drawn
  // question gets a fresh `order` (a permutation of choice indices) so options appear in a
  // different position every attempt; grading still works on the original indices.
  function buildMcqExam(bank, count, rand) {
    const byDomain = {};
    for (const q of bank) (byDomain[q.domain] = byDomain[q.domain] || []).push(q);
    const available = {};
    for (const d of Object.keys(DOMAIN_WEIGHTS)) available[d] = (byDomain[d] || []).length;

    const alloc = allocateByDomain(count, available);
    const picked = [];
    for (const d of Object.keys(alloc)) {
      picked.push(...shuffle(byDomain[d] || [], rand).slice(0, alloc[d]));
    }
    return shuffle(picked, rand).map((q) => ({
      question: q,
      order: shuffle(q.choices.map((_, i) => i), rand),
    }));
  }

  // Exact-set match: a 'multi' question is wrong unless the selection equals the key
  // (no partial credit, same as a real "Choose TWO" item).
  function gradeMcq(question, selected) {
    const sel = Array.from(new Set(selected || [])).sort((a, b) => a - b);
    const key = question.answer.slice().sort((a, b) => a - b);
    return sel.length === key.length && sel.every((v, i) => v === key[i]);
  }

  // Structural problems in a bank; an empty array means the bank is well-formed.
  function validateBank(bank) {
    const problems = [];
    const seen = new Set();
    for (const q of bank) {
      const tag = q && q.id ? q.id : '(no id)';
      if (!q || !q.id) problems.push(`${tag}: missing id`);
      else if (seen.has(q.id)) problems.push(`${tag}: duplicate id`);
      else seen.add(q.id);
      if (!DOMAIN_WEIGHTS[q.domain]) problems.push(`${tag}: domain must be 1-5`);
      if (!/^[1-5]\.\d+$/.test(q.objective || '')) problems.push(`${tag}: objective must look like "2.4"`);
      else if (Number(q.objective.split('.')[0]) !== q.domain) problems.push(`${tag}: objective ${q.objective} does not belong to domain ${q.domain}`);
      if (q.type !== 'single' && q.type !== 'multi') problems.push(`${tag}: type must be single or multi`);
      if (!q.stem || !q.stem.trim()) problems.push(`${tag}: empty stem`);
      if (!Array.isArray(q.choices) || q.choices.length < 4) problems.push(`${tag}: needs at least 4 choices`);
      else {
        if (new Set(q.choices).size !== q.choices.length) problems.push(`${tag}: duplicate choice text`);
        if (!Array.isArray(q.answer) || q.answer.length === 0) problems.push(`${tag}: empty answer`);
        else {
          if (q.answer.some((i) => !Number.isInteger(i) || i < 0 || i >= q.choices.length)) problems.push(`${tag}: answer index out of range`);
          if (new Set(q.answer).size !== q.answer.length) problems.push(`${tag}: duplicate answer index`);
          if (q.type === 'single' && q.answer.length !== 1) problems.push(`${tag}: single needs exactly 1 answer`);
          if (q.type === 'multi' && q.answer.length < 2) problems.push(`${tag}: multi needs at least 2 answers`);
          if (q.type === 'multi' && q.answer.length >= q.choices.length) problems.push(`${tag}: multi cannot key every choice`);
        }
      }
      if (!q.explanation || !q.explanation.trim()) problems.push(`${tag}: empty explanation`);
      if (q.type === 'multi' && !/(เลือก|Choose|choose)\s*(2|3|สอง|สาม|TWO|THREE|two|three)/.test(q.stem || '')) {
        problems.push(`${tag}: multi stem must say how many to choose (e.g. "เลือก 2 ข้อ")`);
      }
    }
    for (const d of Object.keys(DOMAIN_WEIGHTS)) {
      if (!bank.some((q) => q.domain === Number(d))) problems.push(`domain ${d} has no questions`);
    }
    return problems;
  }

  const api = { DOMAIN_WEIGHTS, DOMAIN_NAMES, shuffle, allocateByDomain, buildMcqExam, gradeMcq, validateBank };
  root.McqLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
