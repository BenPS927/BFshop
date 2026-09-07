# Analytics Architecture Discussion Summary

This document briefly records the chronological reasoning that led to the current planned analytics and chart architecture. It is a discussion record rather than a final specification.

1. BFshop first needed a way to calculate basic business totals and present revenue historically as charts.
2. The Analysis Machine was created to retrieve raw orders, apply filters and calculate requested metrics.
3. Revenue, orders and items sold were established as the initial main metrics.
4. A Results Contract was introduced so analysis results could have a predictable structure containing an overall total and an optional time series.
5. The Metric History Database was created to persist one snapshot of the main metrics each day.
6. The Metric History Machine was created to retrieve those historical snapshots for period-based requests.
7. A request router was added to choose between raw-data analysis and metric-history retrieval.
8. It was recognised that metric history cannot apply customer or product filters because its daily snapshots no longer contain that detail.
9. The current direction became using raw data for interactive chart queries while retaining metric history as compact historical memory for AI, baselines and anomaly detection.
10. The current chart implementation was traced from the Intelligence Interface, through the API and request router, into a machine and back through the Results Contract.
11. It was confirmed that chart drawing is a frontend responsibility while record selection, grouping and metric calculation belong behind the API.
12. The existing `RevenueCharts` component was identified as too specific because revenue, orders and items sold should use the same chart structure.
13. The intended replacement is one generic chart component supported by metric-specific presentation configuration for names, units, formatting and valid chart styles.
14. The user interface should initially offer primary charts for revenue, orders and items sold over time.
15. Each primary chart should allow a calendar date range and a daily, weekly or monthly interval to be selected.
16. Filters should modify the Analysis Request and rerun the same chart pipeline rather than require a new chart implementation.
17. Derivations such as average order value, average items per order and revenue per purchasing customer were recognised as metrics at the architectural level.
18. A derivation uses a different calculation but can return the same overall-value and time-series structure as a basic metric.
19. Mean, median, moving averages and similar statistics can often appear as optional overlays on an existing chart instead of requiring separate charts.
20. Standard deviation and z-scores may be more valuable inside the later investigative system than as merchant-facing information.
21. Breakdowns were discussed as dividing a metric into groups, such as female and male revenue series over the same period.
22. Period comparisons were discussed as producing groups such as July and August revenue series.
23. It was concluded that breakdowns and comparisons are conceptually different to the merchant but architecturally both produce labelled groups of time series.
24. Separate group-building functions will define groups by gender, location, age range or comparison period.
25. After groups have been defined, calculation, Results Contract construction and chart rendering can follow the same shared process.
26. The Results Contract therefore needs to evolve from one optional series per metric to one or more labelled chart series.
27. The existing Analysis Machine was recognised as an application-layer orchestration service rather than a genuinely intelligent analytical machine.
28. A clearer code-level name such as `executeAnalysisRequest` was proposed, while “Analysis Machine” may remain a product concept or later describe the investigative system.
29. The current raw-data repository retrieves every order, customer and order item before filtering them in memory.
30. The next performance refactor is to translate the typed Analysis Request into a deterministic Prisma `where` query.
31. The application service will call a query builder, pass its result to the repository, receive only matching records, run metric calculations and construct the Results Contract.
32. Date, gender, age and location conditions should first move into the database query while interval grouping and calculations remain in the application.
33. Database aggregation may be considered later, but it is not required for the first query-builder refactor.
34. Group execution will be added after the single-query path, shared Results Contract and generic chart component are stable.
35. Any manually configured or automatically discovered chart view should eventually be saveable to Primary Charts.
36. A saved view should primarily store its human-readable name, Analysis Request and presentation settings rather than a stale copy of calculated values.
37. The later investigative system can generate filtered and grouped requests, detect potentially interesting results, present evidence through the same chart architecture and allow the merchant to save useful views.

## Current architectural direction

```text
User controls or investigative system
                ↓
         Analysis Request
                ↓
      executeAnalysisRequest
                ↓
        Prisma query builder
                ↓
          Order repository
                ↓
Grouping and metric calculations
                ↓
         Results Contract
                ↓
   Generic frontend chart component
                ↓
     Visible or saved chart view
```

Metric history remains available as compact historical memory for background intelligence, baselines and anomaly detection. The chart component should not need to know which underlying data source produced a valid result.
