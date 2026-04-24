# Security Policy

## Supported versions

The latest `main` and the most recent tagged release receive security fixes. Older releases are on a best-effort basis.

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Email **security@dishine.it** with:

- A clear description of the issue.
- Reproduction steps or a minimal proof of concept.
- Impact assessment (what an attacker could do).
- Your contact info for follow-up.

You'll get an acknowledgment within 72 hours. We'll coordinate disclosure and credit you in the release notes unless you prefer to stay anonymous.

## Scope

In scope:

- `build-standalone.js`, `build-md.js`, `lint-docs.js` — script injection or unsafe file operations.
- `src/lib/toolkit-core.js` — logic bugs that could corrupt export outputs or misclassify tools.
- `standalone.html` — XSS or injection vulnerabilities in the generated single-file build.

Out of scope:

- Issues in Astro itself — report to the Astro team.
- Issues in third-party npm packages — report upstream.
- UI cosmetic bugs or data inaccuracies (use a regular issue instead).

---

*Built and maintained by [diShine Digital Agency](https://dishine.it)*
