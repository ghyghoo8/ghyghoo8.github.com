---
name: write-system-architecture-essay-blog
description: Turn a real software project, architecture evolution, or version series into one canonical, sanitized Chinese technical blog written in the style of a 软考系统架构设计师论文答案. Use when the user asks to summarize project architecture for review or public sharing, extract a blog from R/V iterations, prepare an exam-ready architecture case, redact company or internal project details, or add a final memorization summary and exam expansion guide to a Markdown/Hexo post.
---

# Write System Architecture Essay Blog

## Goal

Produce one canonical Chinese Markdown article that serves two purposes:

1. explain a real project's architecture clearly enough for review and sharing;
2. provide a reusable case that the user can expand into a 软考系统架构设计师 essay.

Write from the business scenario outward. Treat implementation details as supporting evidence, not as the article's organizing structure.

## Workflow

### 1. Establish the evidence boundary

- Read the authoritative project specifications, status documents, architecture notes, and only the code needed to resolve discrepancies.
- Resolve conflicts using this default authority order: current release index and accepted manifest, current runtime code and tests, maintained status documentation, then implementation plans. Treat an unverified plan as planned rather than implemented.
- Separate planned design, implemented capability, formal acceptance, and business/research effectiveness.
- Follow the user's requested narrative scope. Omit transient debugging and checkpoint details unless they are the subject of the article.
- Never invent exact performance figures, hashes, receipts, production outcomes, or business value.
- If final acceptance evidence is unavailable, describe stable architectural delivery without fabricating verification details.

### 2. Protect confidential project information

Treat company repositories and internal project materials as non-public by default. Local access does not imply permission to publish.

Before drafting, identify:

- company, customer, product, project, tenant, site, and employee names;
- internal domains, IP addresses, hostnames, service names, API routes, database or table names, repository paths, and deployment topology;
- business IDs, asset IDs, hashes, tickets, screenshots, logs, incidents, credentials, tokens, and configuration values;
- exact capacity, performance, cost, revenue, failure, customer, and operational metrics that have not been approved for disclosure.

For public sharing:

- replace internal names with role-based terms such as “上游监控数据服务”“场景版本表”“资产索引”;
- remove exact routes, paths, identifiers, hashes, and infrastructure details when they do not carry architectural meaning;
- round or generalize metrics unless exact values are both necessary and approved;
- preserve the problem, decision, mechanism, trade-off, and effect while removing identifying details;
- redact uncertain information instead of assuming it is public;
- do not send company code, documents, logs, or screenshots to web search, image generation, plugins, or other external services without explicit authorization.

Run both a pattern scan and a semantic review. Pattern scans catch paths, URLs, IPs, keys, and long identifiers; semantic review catches customer context, business secrets, incidents, topology, and seemingly harmless combinations that reveal identity. Report what was generalized and what still requires owner approval.

### 3. Extract the business story

Summarize the source material into five questions:

1. What business system was being built?
2. What concrete problems did the previous architecture create?
3. Which quality attributes mattered most?
4. Which architectural decisions addressed those attributes?
5. What measurable or observable improvements resulted?

Prefer problems such as duplicated logic, process coupling, inconsistent data access, weak recovery, permission leakage, poor traceability, or high extension cost. Do not start with class names or file lists.

### 4. Choose the essay thesis

Select one primary thesis and keep the remaining concerns as supporting evidence:

- layered architecture;
- componentization and reuse;
- maintainability;
- reliability and recovery;
- data architecture;
- Agent architecture;
- architecture evolution.

State why the selected style fits the current project scale. Explicitly reject unnecessary complexity such as premature microservices, dynamic DSLs, or distributed scheduling when the evidence does not justify them.

### 5. Design the article around responsibilities

Use five to seven responsibility layers when the project supports them. A typical business system can use:

```text
presentation and interaction
  → application orchestration
  → domain contracts and rules
  → integration adapters
  → persistence, evidence, or asset production
```

Use domain-specific variants only when supported by the project. For example, an Agent platform may add decision control and typed workflow orchestration, while a digital-twin platform may add a dedicated 3D asset-production layer.

For each layer, explain:

```text
problem → solution → mechanism → effect
```

Describe interfaces, dependency direction, authority boundaries, failure behavior, and quality-attribute tactics. Avoid turning the section into a module encyclopedia.

### 6. Present evolution as staged delivery

Map project iterations into three to five architectural stages. Do not force universal stage names onto the project. A reusable pattern is:

1. **Foundation:** establish the real data path, business boundary, and initial delivery.
2. **Contract and governance:** stabilize state, identity, persistence, concurrency, and recovery.
3. **Reuse and integration:** reuse the domain contract across real workflows and adapters.
4. **Operationalization:** add asset, quality, observability, release, or performance governance.

For an Agent platform, these may become foundation, reuse, and typed orchestration. For another domain, rename and merge them around the actual architectural risks.

For every stage answer:

- Why was this stage necessary?
- What was added or changed?
- How was it verified?
- What limitation motivated the next stage?

Do not list every minor version. Merge patches into the stage whose architectural issue they resolved.

### 7. Use evidence selectively

- Include two to five representative numbers when they demonstrate performance, memory, storage, recovery, or reuse.
- Prefer rounded, memorable metrics over long hashes and run IDs.
- Use one compact comparison table for stage evolution when helpful.
- Retain exact metrics only when external disclosure is approved; otherwise use ranges, orders of magnitude, or qualitative results.
- State explicitly that engineering acceptance is not equivalent to production effectiveness, operational efficiency, business value, strategy validity, or Alpha validity where relevant.
- Exclude local absolute paths, credentials, sensitive data, verbose artifact identities, and incidental test noise.

## Required article structure

Use this structure unless the user requests another:

```markdown
---
title: ...
date: YYYY-MM-DD
categories:
- 系统架构
tags:
- 系统架构师
- ...
---

## 摘要
## 一、项目背景
## 二、需求分析与架构目标
## 三、总体架构设计
## 四、各层关键设计
## 五、分阶段实施
## 六、项目实施效果
## 七、设计难点与解决方案
## 八、结论
## 软考备考提炼
## 备考速记摘要
### 考场展开卡片
```

Keep the abstract close to an exam abstract: project, role, problem, chosen architecture, implementation stages, and result in one compact paragraph.

Use an ASCII diagram by default for broad Markdown/Hexo compatibility. Use Mermaid only when the target repository already supports it.

Do not force the full blog into examination length. Keep the canonical article useful for review and sharing, then make the final exam sections a compact reconstruction aid:

- `软考备考提炼` maps the project to likely essay topics, the author's role, quality attributes, decisions, and evidence.
- `备考速记摘要` contains the mnemonic paragraph, expansion card, and topic-shifting guidance.

## Exam-oriented ending

Always end with both items below.

### Memorization summary

Create one short paragraph using a project-specific mnemonic such as:

```text
one core, N layers, M stages, K safeguards
```

It must summarize the business problem, architecture, implementation path, and quality gains.

### Expansion card

Provide a compact table:

| Memory point | Problem | Solution | Mechanism | Effect |
|---|---|---|---|---|

Then explain how to shift emphasis for likely essay topics, such as layered architecture, reuse, reliability, data architecture, Agent architecture, or architecture evolution.

The expansion card must help the user reconstruct the essay rather than memorize it word for word.

## Writing rules

- Write in first-person project-practice style where appropriate: “我负责……”“我采用……”.
- Lead with the business context and quality attributes.
- Explain trade-offs and rejected alternatives, not only the final design.
- Keep terminology consistent; define necessary English terms on first use.
- Prefer cohesive prose over excessive bullet lists.
- Keep implementation names only when they clarify a stable contract.
- Produce one canonical article; merge later corrections into it instead of creating “补充版” or “增强版”.
- Preserve the target repository's existing front matter, filename, category, and tag conventions.
- If the user asks to treat a completed delivery as complete, omit transient debugging history while retaining evidence honesty.

## Validation

Before handing off:

1. record the target repository's existing worktree state and preserve unrelated files;
2. confirm the front matter is valid and matches nearby posts;
3. check Markdown heading order, tables, and code fences;
4. confirm the article is business-first rather than implementation-first;
5. verify every claimed result against the evidence authority order or remove the precision;
6. run a sensitive-pattern scan and a human semantic disclosure review;
7. confirm the final memorization summary, expansion card, and topic-shifting guidance are present;
8. run `git diff --check -- <post>` for a tracked post; for a new untracked post, use `git diff --no-index --check /dev/null <post>` and treat status 1 with no diagnostic output as a clean new-file diff;
9. for Hexo, prefer the real source pipeline such as `hexo generate` or inspect the Hexo database; direct `hexo render <file>` may render front matter as body text and is not a source-pipeline validation;
10. distinguish article parsing failures from pre-existing site, theme, or layout warnings;
11. report the exact output path, disclosure status, validation performed, and whether a site build was run.

Do not publish, commit, or deploy unless the user explicitly requests it.
