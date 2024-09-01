# activity-graph

A low level and stylable Web Component to display an activity graph.

## Demos

[Demo page](https://hsablonniere.github.io/activity-graph/).

## Screenshots

### GitHub

Here's an example of my 2023 GitHub contribution graph.

![An activity graph representing a year with weeks as columns. Some days are colored with different tones for indicating contribution intensity. It's the same theme as the one on GitHub.](./screenshots/github-demo-screenshot.png)

### Serializd

Here's an example of my 2024 Serializd stats graph.

![[An activity graph representing a year with weeks as columns. Some days are colored with different tones for indicating how many TV show episodes were watched. It's the same theme as the one on Serializd.]](./screenshots/serializd-demo-screenshot.png)

### Monkeytype

Here's an example of my 2024 Monkeytype stats graph.

![[An activity graph representing a year with weeks as columns. Some days are colored with different tones for indicating how many tests were done. It's the same theme as the one on Monkeytype.]](./screenshots/monkeytype-demo-screenshot.png)

### Letterboxd

Here's an example of what could be my 2023 Letterboxd stats graph, if they had such a graph.

![[An activity graph representing a year with weeks as columns. Some days are colored with different tones for indicating how many movies were watched. It's following the general look and feel of Letterboxd.]](./screenshots/letterboxd-demo-screenshot.png)

## How to install?

### Via npm

This component is published on [npm](https://www.npmjs.com/package/@hsablonniere/activity-graph).
You can "npm install" it in your project with this command:

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
    <td><code>string</code> with <code>YYYY-MM-DD</code> format
    <td>A year ago
  <tr>
    <td colspan="4">First date of the graph
  <tr>
    <td><code>end-date</code>
    <td><code>endDate</code>
    <td><code>string</code> with <code>YYYY-MM-DD</code> format
    <td>Today
  <tr>
    <td colspan="4">Last date of the graph
  <tr>
    <td><code>data</code>
    <td><code>data</code>
    <td><code>ActivityGraphData</code>
    <td><code>null</code>
  <tr>
    <td colspan="4">Data object, see <em>Data</em> section below
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
    <td colspan="4">Number representing the first day of the week, from <code>0</code>0 (sunday) to <code>6</code> (saturday)
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
    <td colspan="4">When to start/end month headers:
      <ul>
        <li><code>'early'</code>: month headers start on week with first day of month and end on last full week
        <li><code>'middle'</code>: month headers start on week with first day of month and and end on week with last day of month (month headers will overlap), it's the best choice when <code>--activity-graph-month-gap</code> is used
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

The data can be set as a JavaScript object on the `data` property, or as JSON on the `data` attribute. It must respect the following type definition:

```ts
// Keys must be YYYY-MM-DD date strings
type ActivityGraphData = Record<string, ActivityGraphDataEntry>;

interface ActivityGraphDataEntry {
  // Used for the day "cell" inner text
  text?: string;
  // Used for the day "cell" `title` attribute, for tooltips and accessibility
  title?: string;
  // Used for the day "cell" `part` attribute, as in CSS shadow part for styling purposes
  parts?: Array<string>;
}
```

Here's an example:

```js
myActivityGraph.data = {
  '2024-04-01': {
    title: '2 contributions',
    parts: ['level-1'],
  },
  '2024-04-04': {
    title: '27 contributions',
    parts: ['level-4'],
  },
};
```

### Styling

By default, the component does not have any styles.
You'll have to rely on the different CSS parts and custom properties to create a theme.

> [!NOTE]
>
> - You can rely on the fact that the element has a `display: grid` and use properties like `gap` directly on it.
> - You can have a look at the demos and their respective themes to get some ideas on how to style the component.

#### CSS parts

| Part                   | Description                          |
| ---------------------- | ------------------------------------ |
| `weekday-header`       | Target any weekday header            |
| `weekday-header--even` | Target even numbered weekday headers |
| `weekday-header--odd`  | Target odd numbered weekday headers  |
| `month-header`         | Target any month header              |
| `day`                  | Target any day "cell"                |

> [!TIP]
>
> If you want to use a CSS shadow part, you'll need the `::part()` pseudo element like this:
>
> ```css
> activity-graph::part(month-header) {
>   text-align: center;
> }
> ```

#### Custom properties

| Property                          | Description                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| `var(--activity-graph-month-gap)` | Spacing between months, can be any CSS unit, `0` by default |

## Why this project?

I really like this way of visualizing a whole year of data at once.
Watching such graphs on [GitHub](https://github.com/), [Serializd](https://www.serializd.com/) or [Monkeytype](https://monkeytype.com/), I grew a need to have a similar dataviz for other services where I track and log stuffs like [Letterboxd](https://letterboxd.com/) or [fitbit](https://fitbit.com).
I wondered how easy it would be to create my own component and that's how I went down this rabbit whole.

In the end, I restarted from scratch 3 times to try different ideas to handle the dates and the CSS grid.
It wasn't a simple problem to tackle but I had lots of fun working on this.

### Design decisions

I started the project as a vanilla Web Component, without any dependency.
I guess I was wondering how small the final bundle would be, I achied something close to `1.6kb` (minified and compressed).
My code was not that easy to read and I had no support for properties, just attributes.
A few commits later, I quickly realized I was recreating a very dumb, verbose and unefficient version of [lit](https://lit.dev).
That's when I decided to add lit as the only dependency.
In the end, the component code + lit is `6.4kb` (minified and compressed).

I wanted something based on CSS grids without any styles by default so that anyone could reuse it and apply their own theme.
At first, you could specify some style properties on the data object but I replaced it with CSS shadow parts to maximize styling in the CSS.

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
