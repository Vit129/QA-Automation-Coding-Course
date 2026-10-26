# Application Security & Cyber Defense Track

Interactive, in-browser cybersecurity and application security course designed for **Developers and QA Engineers transitioning into Security / AppSec**. It builds deep conceptual understanding and defensive code patterns that **support preparation for industry certification exams**:
- **CompTIA Security+ (SY0-701) & ISC2 SSCP / CC:** Directly reinforces core theoretical domains (CIA Triad, Zero Trust, STRIDE, CVSS v3.1, PKI/TLS, Cryptography, SIEM, Incident Response NIST SP 800-61).
- **eLearnSecurity Junior Penetration Tester (eJPT) & PortSwigger BSCP:** Strengthens understanding of web vulnerability mechanics and code-level remediation (OWASP Top 10, IDOR, SQLi, RCE, Path Traversal, SSRF, XSS, JWT, WAF). *Note: While this course masters code-level root causes and mitigations, candidates should combine it with dedicated target-range labs (e.g., Hack The Box, PortSwigger Web Security Academy) for hands-on network/browser proxy exploitation.*

---

## Curriculum Overview (9 Modules, 42 Interactive Lessons)

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

### Module 6: Governance, Risk & Compliance (Security+ Domain 5 ~20%)
27. **`risk_ale_quantitative`** — Quantitative risk analysis: SLE = AV × EF, ALE = SLE × ARO, and cost-benefit Risk Treatment (Mitigate / Transfer / Avoid / Accept).
28. **`bia_rto_rpo_dr`** — Business Continuity & Disaster Recovery: RTO/RPO from a BIA, Hot/Warm/Cold site selection, backup strategy (3-2-1).
29. **`data_classification_compliance`** — Data classification, data roles (Owner/Controller/Processor/Custodian), and mapping fields to PDPA/GDPR, PCI DSS, HIPAA.

### Module 7: Network Security & Identity (Security+ Domain 3/4, eJPT Recon)
30. **`firewall_acl_rules`** — Firewall ACL engine: first-match rule ordering, CIDR matching, and Implicit Deny; IDS vs IPS, NGFW, segmentation.
31. **`secure_protocols_ports`** — Secure protocols & ports: replacing Telnet/FTP/HTTP/LDAP with SSH/SFTP/HTTPS/LDAPS, and the port numbers exams test.
32. **`mfa_factors_validation`** — Authentication factors (know/have/are/somewhere), real vs fake MFA, and phishing-resistant FIDO2/smart card.
33. **`rbac_abac_sod`** — Access Control Models: combining RBAC + ABAC with Separation of Duties on a real approval workflow.
34. **`oauth_oidc_callback`** — OAuth 2.0 / OIDC callback validation: `state`, exact `redirect_uri`, `nonce`, `aud` to stop Login CSRF, open redirect, and token confusion.
35. **`nmap_recon_enumeration`** — Reconnaissance & Enumeration (eJPT): parse Nmap grepable output, build an attack surface, and the authorized-only pentest methodology.

### Module 8: Threats & Log Investigation (Security+ Domain 2/4, CySA+ / SOC)
36. **`malware_classification`** — Threat landscape: classify malware by behavior (ransomware, worm, trojan, rootkit, logic bomb, cryptojacking) and threat actors / vectors / IoCs.
37. **`email_auth_spoofing_defense`** — Email authentication defense: SPF / DKIM / DMARC scoring and lookalike-domain (Levenshtein) detection in a Secure Email Gateway.
38. **`log_bruteforce_detection`** — Log investigation: detect brute-force / password spraying from auth logs with a 60-second sliding window and critical-vs-warning severity.
39. **`log_injection_siem_parse`** — Log correlation: stitch WAF + Auth + DB events into an attack timeline and map to the Cyber Kill Chain / MITRE ATT&CK.

### Module 9: AI-Assisted Security (AI for SecOps + Securing AI)
40. **`ai_triage_alert_enrichment`** — AI-assisted alert triage with a deterministic governance layer and human-in-the-loop for irreversible actions.
41. **`ai_prompt_injection_defense`** — Securing AI (OWASP LLM Top 10): defend against prompt injection when feeding attacker-controlled logs/data into an LLM.
42. **`ai_detection_rule_validation`** — Detection-as-Code: validate AI-generated detection rules (bad regex, catch-all, false negatives/positives) before deploying to production.

---

## Technical Architecture & Testing
- Pure client-side JavaScript execution with no external backend server.
- All 42 lessons have strict self-test invariants in `tests/selftest.mjs`:
  - `lesson.validate(lesson.solution)` MUST pass without error.
  - `lesson.validate(lesson.template)` MUST throw an error.
