import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import http from 'http';
import { html } from 'lit';
import githubContributions from '../data/github-contributions.json' with { type: 'json' };
import '../src/activity-graph.js';

http
  .createServer(async (req, res) => {
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
    });

    const result = render(html`
      <h2>2023 GitHub contributions</h2>
      <activity-graph
        class="github"
        weekday-headers="short"
        month-limits="late"
        lang="en"
        start-date="2023-01-01"
        end-date="2023-12-31"
        .data=${githubContributions}
      ></activity-graph>
    `);

    const contents = await collectResult(result);

    res.write(`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="data:image/x-icon;," />
    <title>Demo with lit SSR</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
      }
    
      activity-graph.github {
        --size: 10px;
        gap: 3px;
        border: 1px solid #d0d7de;
        border-radius: 0.375em;
        padding: 1em;
        display: inline-grid;
      }
      
      activity-graph.github::part(weekday-header),
      activity-graph.github::part(month-header) {
        font-size: 12px;
      }
      
      activity-graph.github::part(weekday-header),
      activity-graph.github::part(day) {
        height: var(--size);
        line-height: var(--size);
      }
      
      activity-graph.github::part(weekday-header) {
        padding-right: 0.25em;
      }
      
      activity-graph.github::part(weekday-header--even) {
        display: none;
      }
      
      activity-graph.github::part(month-header) {
        height: 13px;
        line-height: 13px;
      }
      
      activity-graph[month-limits='middle'].github::part(month-header) {
        text-align: center;
      }
      
      activity-graph.github::part(day) {
        border-radius: 2px;
        outline-offset: -1px;
        outline: 1px solid #1b1f230f;
        width: var(--size);
      }
      
      activity-graph.github::part(day--data-0) {
        background-color: #ebedf0;
      }
      
      activity-graph.github::part(day--data-1) {
        background-color: #9be9a8;
      }
      
      activity-graph.github::part(day--data-2) {
        background-color: #40c463;
      }
      
      activity-graph.github::part(day--data-3) {
        background-color: #30a14e;
      }
      
      activity-graph.github::part(day--data-4) {
        background-color: #216e39;
      }
    </style>
  </head>
  <body>
    <h1>Demo with lit SSR</h1>
    
    ${contents}
    
  </body>
  </html>
  `);
    res.end();
  })
  .listen(8080);
