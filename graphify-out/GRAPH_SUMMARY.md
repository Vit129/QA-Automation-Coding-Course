# Graph Summary — delivery-workflow-completion
_Auto-generated from GRAPH_REPORT.md · do not edit manually_
_Regen: `graphify update .`_

## Summary
- 4742 nodes · 5726 edges · 271 communities (239 shown, 32 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 204 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output


## Graph Freshness
- Built from commit: `82cee9c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).


## God Nodes (most connected - your core abstractions)
1. `LESSONS` - 67 edges
2. `LESSONS` - 43 edges
3. `LESSONS` - 39 edges
4. `LESSONS` - 34 edges
5. `LESSONS` - 29 edges
6. `Changelog` - 28 edges
7. `LESSONS` - 23 edges
8. `LESSONS` - 19 edges
9. `LESSONS` - 19 edges
10. `LESSONS` - 19 edges


## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `Changelog` - bridges 21 areas (28 edges)
2. `LESSONS` - bridges 1 areas (67 edges)
3. `LESSONS` - bridges 1 areas (43 edges)
4. `LESSONS` - bridges 1 areas (39 edges)
5. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
6. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
7. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
8. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
9. `@media (max-width: 480px)` - bridges 1 areas (17 edges)

## Surprising Connections (you probably didn't know these)
- `initExamPage()` --indirect_call--> `handleTextareaKeydown()`  [INFERRED]
  shared/exam-engine.js → shared/engine.js


_Full map → GRAPH_REPORT.md · query: `graphify query "..."`_
