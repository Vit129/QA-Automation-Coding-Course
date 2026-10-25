# Application Security & Cyber Defense Track

Interactive, in-browser cybersecurity and application security course designed for **Developers and QA Engineers transitioning into Security / AppSec** and preparing for international certification exams:
- **CompTIA Security+ (SY0-701)**
- **eLearnSecurity Junior Penetration Tester (eJPT)**
- **PortSwigger Certified Web Security Practitioner (BSCP)**
- **ISC2 Systems Security Certified Practitioner (SSCP) / CC**

---

## Curriculum Overview (5 Modules, 26 Interactive Lessons)

### Module 1: Cybersecurity Fundamentals & Threat Modeling (Security+ Core)
1. **`cia_triad_zero_trust`** — CIA Triad (Confidentiality, Integrity, Availability) & Zero Trust Architecture (Verify Explicitly, Least Privilege, Assume Breach).
2. **`threat_modeling_stride`** — Threat Modeling with Microsoft STRIDE framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) and mapped security mitigations.
3. **`cvss_cve_scoring`** — Vulnerability Triage using CVSS v3.1 vector strings, calculating Base Scores, and prioritizing remote unauthenticated CVEs.

### Module 2: Cryptography & Identity Defense
4. **`crypto_hashing_salting`** — Password Hashing & Salting: why fast hashing (MD5, SHA-1, plain SHA-256) is dangerous against GPUs, and implementing slow adaptive hashing (bcrypt, Argon2id) with work factors.
5. **`crypto_symmetric_asymmetric`** — Symmetric (AES-256-GCM) vs Asymmetric Encryption (RSA, ECC), hybrid encryption, and generating/verifying Digital Signatures using Node.js `crypto`.
6. **`pki_tls_handshake`** — Public Key Infrastructure (PKI), Certificate Authorities (Root & Intermediate CA), Chain of Trust, CRL/OCSP revocation, and validating TLS certificates.
7. **`auth_bypass_prevention`** — Authentication vs Authorization: testing API route groups to ensure Auth Middleware is strictly enforced across every private endpoint without gaps.
8. **`jwt_attacks_tampering`** — JSON Web Token (JWT) security: defending against Algorithm Confusion attacks (`alg: "none"`), weak HMAC secret brute-forcing, and expiration verification.
9. **`session_management_cookies`** — Session Hijacking defense: inspecting cookie security flags (`HttpOnly` to stop XSS theft, `Secure` for HTTPS transport, `SameSite=Strict/Lax` for CSRF mitigation).

### Module 3: Deep-Dive OWASP Top 10 & Offensive AppSec
10. **`broken_access_control_idor`** — Broken Access Control (OWASP A01:2021): IDOR / BOLA, Horizontal vs Vertical Privilege Escalation, and why object IDs must always be bound to authenticated session identity.
11. **`sqli_union_blind`** — SQL Injection (In-band UNION-based, Error-based, Boolean/Time-based Blind SQLi) and total remediation using Parameterized Queries / Prepared Statements.
12. **`command_injection`** — Command Injection & Remote Code Execution (RCE): exploiting shell metacharacters (`;`, `|`, `&&`, `$()`) and secure coding via `execFile` and strict whitelisting.
13. **`path_traversal`** — Path Traversal (Directory Traversal): bypassing relative paths (`../`) and achieving safe file access through Path Canonicalization (`path.resolve`).
14. **`xss_stored_reflected_dom`** — Cross-Site Scripting (XSS): comparing Reflected, Stored, and DOM-based XSS, and building Context-Aware HTML Entity Encoders.
15. **`content_security_policy`** — Content Security Policy (CSP): defense-in-depth header configuration, disallowing `'unsafe-inline'` / `'unsafe-eval'`, and enforcing `object-src 'none'`.
16. **`csrf_token_defense`** — Cross-Site Request Forgery (CSRF): Synchronizer Token Pattern, Custom Request Headers (`X-CSRF-Token`), and Double-Submit Cookies.
17. **`ssrf_cloud_metadata`** — Server-Side Request Forgery (SSRF): blocking loopback, private RFC 1918 subnets, and Cloud Instance Metadata Service (`http://169.254.169.254`).
18. **`cors_misconfiguration`** — Cross-Origin Resource Sharing (CORS): testing for arbitrary origin reflection, wildcard handling, and credentials sharing risks.
19. **`sensitive_data_exposure`** — Information Disclosure: preventing stack trace signatures (`at ...(file:line:col)`) and database internal error messages from leaking in API responses.

### Module 4: Security Architecture & Web Defense
20. **`security_headers_hardening`** — Production Web Server Hardening: auditing `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY/SAMEORIGIN`.
21. **`rate_limiting_dos_defense`** — Application-layer DoS mitigation: Token Bucket / Sliding Window algorithms, preventing credential stuffing, and asserting HTTP 429 Too Many Requests.
22. **`waf_rule_simulation`** — Web Application Firewall (WAF) rule engines: inspecting Layer 7 payloads against OWASP Core Rule Set (CRS) signatures before reaching handlers.

### Module 5: DevSecOps, Incident Response & Operations
23. **`sast_semgrep_scanning`** — Static Application Security Testing (SAST): writing AST-level and regex pattern rules to catch dangerous sinks (`eval`, dynamic code) during CI builds.
24. **`secret_detection_git`** — Pre-commit / CI Secret Scanning: detecting private keys (`BEGIN RSA PRIVATE KEY`) and cloud provider credentials (`AKIA...`) in Git diffs before pushing.
25. **`sca_dependency_sbom`** — Software Supply Chain Security: Software Composition Analysis (SCA) via `npm audit --omit=dev --json` gates and Software Bill of Materials (SBOM / CycloneDX) awareness.
26. **`security_logging_forensics`** — Security Audit Trails & SIEM: neutralizing Log Injection (`\r\n`), formatting structured audit events, and understanding NIST SP 800-61 Incident Handling Phases (Preparation, Detection & Analysis, Containment, Eradication, Recovery, Lessons Learned).

---

## Technical Architecture & Testing
- Pure client-side JavaScript execution with no external backend server.
- All 26 lessons have strict self-test invariants in `tests/selftest.mjs`:
  - `lesson.validate(lesson.solution)` MUST pass without error.
  - `lesson.validate(lesson.template)` MUST throw an error.
