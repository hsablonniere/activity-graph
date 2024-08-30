# activity-graph

WARNING: The documentation is still WIP...

A low level stylable Web Component to display an activity graph.

## How to install?

### Via npm

This component is published on [npm](https://www.npmjs.com/package/@hsablonniere/activity-graph).
You can "npm install" it in your project like this:

```bash
npm install @hsablonniere/activity-graph
```

### Via CDN

You can also directly use modern CDNs that exposes npm packages like JSDelivr:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@hsablonniere/activity-graph/+esm"></script>
```

or esm.sh:

```html
<script type="module" src="https://esm.sh/@hsablonniere/activity-graph"></script>
```

## How to use?

Use the `<activity-graph>` custom HTML tag like this:

```html
<activity-graph start-date="2024-01-01" end-date="2024-12-31"></activity-graph>
```

### Attributes / properties

<table>
  <tr>
    <th>Attribute
    <th>Property
    <th>Type
    <th>Default
  <tr>
    <td><code>start-date</code>
    <td><code>startDate</code>
    <td><code>YYYY-MM-DD</code>
    <td>A year ago
  <tr>
    <td colspan="4">Start date of the graph
  <tr>
    <td><code>end-date</code>
    <td><code>endDate</code>
    <td><code>YYYY-MM-DD</code>
    <td>Today
  <tr>
    <td colspan="4">End date of the graph
  <tr>
    <td><code>data</code>
    <td><code>data</code>
    <td><code>object</code>
    <td><code>null</code>
  <tr>
    <td colspan="4">Data object, see <code>Data</code> section below
  <tr>
    <td><code>lang</code>
    <td><code>lang</code>
    <td><code>string</code>
    <td>Document language (<code>lang</code> attribute on the <code>html</code> tag) or <code>en</code> if not specified
  <tr>
    <td colspan="4">BCP 47 language code used to translate weekday and month headers
  <tr>
    <td><code>week-start-day</code>
    <td><code>weekStartDay</code>
    <td><code>number</code>
    <td><code>0</code> (sunday)
  <tr>
    <td colspan="4">Number representing the day of the week for first row
  <tr>
    <td><code>weekday-headers</code>
    <td><code>weekdayHeaders</code>
    <td><code>'none' | 'long' | 'short' | 'narrow'</code>
    <td><code>narrow</code>
  <tr>
    <td colspan="4">Format used for weekday headers (see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#weekday">DateTimeFormat#weekday</a>) or <code>'none'</code> to hide them
  <tr>
    <td><code>month-headers</code>
    <td><code>monthHeaders</code>
    <td><code>'none' | 'long' | 'short' | 'narrow' | 'numeric' | '2-digit'</code>
    <td><code>short</code>
  <tr>
    <td colspan="4">Format used for month headers (see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#month">DateTimeFormat#month</a>) or <code>'none'</code> to hide them
  <tr>
    <td><code>month-limits</code>
    <td><code>monthLimits</code>
    <td><code>'early' | 'middle' | 'late'</code>
    <td><code>late</code>
  <tr>
    <td colspan="4">Where to start/end month headers:
      <ul>
        <li><code>'early'</code>: month headers start on week with first day of month and end on last full week
        <li><code>'middle'</code>: month headers will overlap
        <li><code>'late'</code>: month headers start on week first full week of month and end on week with last day of month
      </ul>
  <tr>
    <td><code>month-position</code>
    <td><code>monthPosition</code>
    <td><code>'top' | 'bottom'</code>
    <td><code>top</code>
  <tr>
    <td colspan="4">Where to put month headers
</table>

### Data

TODO

### CSS parts and custom properties

By default, the component does not have any styles.
You'll have to rely on the different CSS parts and custom properties to style it as you want.

TODO link to theme examples

| Part                   | Description |
| ---------------------- | ----------- |
| `weekday-header`       | TODO        |
| `weekday-header--even` | TODO        |
| `weekday-header--odd`  | TODO        |
| `month-header`         | TODO        |
| `day`                  | TODO        |

| Property                          | Description |
| --------------------------------- | ----------- |
| `var(--activity-graph-month-gap)` | TODO        |

NOTE: You can rely on the fact that the element has a `display: grid` and use properties like `gap` directly on it.

## Why this project?

I really like this way of visualizing a whole year of data at once.
Watching such graphs on [GitHub](https://github.com/), [Serializd](https://www.serializd.com/) or [Monkeytype](https://monkeytype.com/), I grew a need to have a similar dataviz for other services where I track and log stuffs like [Letterboxd](https://letterboxd.com/) or [fitbit](https://fitbit.com).
I wondered how easy it would be to create my own component and that's how I went down this rabbit whole.

In the end, I restarted from scratch 3 times to try different ideas to handle the dates and the CSS grid.
It wasn't a simple problem to tackle but I had lots of fun working on this.

### Design decisions

TODO (no lit, 1 simple CSS grid, no styles, under 1k, then lit...)

### Other similar projects

I created this project without looking at the competition but obviously many smart people tried before me.

[Mario Hamann](https://github.com/mariohamann) also made a Web Component and his approach (a11y, WASM, SSR...) is very interesting!

- GitHub project: https://github.com/mariohamann/activity-graph
- Article: https://mariohamann.com/activity-graph-component

And of course, there are plenty of framework specific components for React, Vue, Svelte:

- https://github.com/Angstboksen/date-activity-graph
- https://github.com/AyushSaini00/github-contribution-graph
- https://github.com/KaranGulve4342/react-github-contributions
- https://github.com/cairongquan/contriGraph
- https://github.com/charpeni/sync-external-contributions
- https://github.com/grubersjoe/react-activity-calendar
- https://github.com/grubersjoe/react-github-calendar
- https://github.com/marcelovicentegc/react-github-heatmap
- https://github.com/razorness/vue3-calendar-heatmap
- https://github.com/scottbedard/svelte-heatmap
- https://github.com/srivenkat13/github-calendar-component
- https://github.com/uiwjs/react-heat-map
- https://github.com/x3388638/github-calendar-graph
