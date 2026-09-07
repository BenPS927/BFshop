# Chart and Analysis Architecture Notes

## Purpose

These notes record the planned direction for extending BFshop's Results Contract and chart architecture. They describe future work rather than the current completed implementation.

## Core flow

The common flow should remain:

```text
User selections
    ↓
Analysis Request
    ↓
Analysis Machine
    ↓
Results Contract
    ↓
Shared chart component
    ↓
Visible chart
```

The Analysis Machine calculates the requested information. The Results Contract carries it in a predictable shape. The frontend chart component decides how it is presented.

## Main metrics

The first primary metrics are:

- Revenue
- Orders
- Items sold

Each metric can produce an overall value and a time series grouped by day, week or month.

## Derivations

Derivations are calculated from basic metrics or underlying records, but architecturally they travel through the same pipeline as metrics.

Examples include:

- Average order value: revenue divided by orders
- Average items per order: items sold divided by orders
- Revenue per customer
- New customers
- Returning customers

For each requested interval, the Analysis Machine runs the derivation against that interval's records and places the result into the time series. The overall result must be calculated from the complete requested range rather than by incorrectly adding or averaging the interval results.

## Breakdowns

A filter restricts the records included in a result. A breakdown divides the remaining records into labelled groups.

For example:

```text
Metric: revenue
Period: August
Interval: week
Breakdown: gender
```

The Analysis Machine would produce one weekly revenue series for each gender. The same approach can later support location, age range, product, category, and new versus returning customers.

## Comparisons

Comparisons also produce labelled groups of time-series data.

For example, comparing August with July creates:

- An August revenue series
- A July revenue series

Breakdowns and comparisons differ in how their groups are selected:

- A breakdown varies a property such as gender while normally sharing a date range.
- A comparison varies a period while normally sharing the metric and filters.

After the groups have been created, both can use the same Results Contract series shape and the same chart-rendering architecture.

The real dates should remain attached to every value. The frontend can decide whether a comparison is displayed using actual dates or aligned positions such as Day 1, Day 2, or Week 1.

## Results Contract direction

The Results Contract should eventually support one or more labelled series while retaining the meaning of each period.

Conceptually:

```ts
type ChartSeries = {
  id: string;
  label: string;
  periods: MetricPeriod[];
};

type MetricPeriod = {
  startDate: string;
  endDate: string;
  value: number;
};
```

A standard metric may return one series. A breakdown or comparison may return several. The chart does not need to know which analytical operation created them.

## One shared chart component

BFshop should use one generic metric-chart component rather than one chart file per metric.

The shared component should receive:

- The metric identity
- The overall result
- One or more labelled time series
- The interval
- Presentation settings
- The current light or dark theme

Metric-specific presentation can be supplied through configuration:

```text
Revenue    → currency format → Revenue (AUD)
Orders     → integer format  → Orders
Items sold → integer format  → Items sold
```

The shared component can render a single line, multiple lines, grouped bars or stacked bars from the same labelled-series structure. Calculation remains a backend responsibility; axes, labels, formatting and chart style remain frontend responsibilities.

## Statistical overlays

Common statistical summaries do not always need separate charts. They can be optional overlays on the primary chart.

Examples include:

- Overall mean: horizontal reference line
- Overall median: horizontal reference line
- Moving average: changing line across the chart
- Expected range: reference band

Internal measures such as standard deviation and z-score may be more useful to the later investigative system than to the merchant. They can help detect unusual activity, after which the merchant receives a plain-language finding and supporting evidence.

An unusual value is a candidate anomaly, not automatically a meaningful pattern. Repetition, persistence and supporting relationships must be investigated.

## Primary charts interface

The initial Primary Charts page should offer three standard charts:

- Revenue over time
- Orders over time
- Items sold over time

Each chart can eventually provide controls for:

- Calendar date range
- Day, week or month interval
- Filters such as gender, age and location
- A breakdown dimension
- A comparison period
- Statistical overlays
- Appropriate chart style

Changing a control changes the Analysis Request and reruns the same pipeline. It should not require a new chart component.

## Saved views

Any useful view should be saveable to Primary Charts. A saved view should primarily store:

```text
Human-readable name
+ Analysis Request
+ Presentation settings
```

Opening the saved view reruns its request using current data. A result snapshot would only be required when an immutable historical report is needed.

## Investigative system

The later investigative system can use the same analysis and chart machinery to:

1. Detect unusual movement.
2. Generate filtered, broken-down or comparative requests.
3. Investigate which groups contributed to the movement.
4. Check whether it has happened before.
5. Rank potentially useful findings.
6. Present the merchant with plain-language conclusions and supporting charts.

The merchant can then save an automatically suggested view to Primary Charts. This creates two routes to the same chart system:

```text
Manual exploration → configured chart → saved view

Automated investigation → suggested chart → saved view
```

## Data-source direction

For now, interactive chart requests can use the Analysis Machine and raw order data so that filters behave consistently.

The Metric History Database remains useful as compact historical memory for baselines, anomaly detection and AI context. It does not contain the customer or product detail required to apply filters such as gender, age or location after the snapshot has been created.

The frontend chart component should never need to know whether its result ultimately came from raw data, metric history or both.

## Main architectural conclusion

Most ordinary BFshop analytics can be represented as one or more labelled values over time:

```text
Select records
→ create groups
→ calculate a metric or derivation for each interval
→ return labelled series
→ render through the shared chart component
```

The primary architectural distinction is therefore the shape of the returned information, not whether the user requested a metric, derivation, breakdown or comparison.
