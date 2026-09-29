import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildHeatmap } from '../src/features/news/calendar.ts';

test('compact daily view retains leap days, leading offset and available dates', () => {
  const map = buildHeatmap(
    '2024-02-29',
    ['2024-02-01', '2024-02-29'],
    'daily',
    'zh',
    '2024-02-29',
  );
  assert.equal(map.cells.length, 40);
  assert.equal(map.cells[3].date, '2024-02-01');
  assert.equal(map.cells[31].date, '2024-02-29');
  assert.equal(map.cells[31].selected, true);
  assert.equal(map.cells.filter((cell) => cell.date).length, 2);
  assert.equal(map.cells[4].level, 0);
});

test('ISO weekly view includes week 53 and its cross-year dates', () => {
  const map = buildHeatmap(
    '2026-12-31',
    ['2026-12-31', '2027-01-01'],
    'weekly',
    'en',
    '2026-12-31',
  );
  assert.equal(map.rows, 4);
  const weeks = map.cells.filter((cell) => !cell.key.startsWith('blank'));
  assert.equal(weeks.length, 53);
  assert.equal(weeks[52].count, 2);
  assert.equal(weeks[52].date, '2027-01-01');
  assert.equal(weeks[52].selected, true);
});

test('monthly density uses unique archive dates and cannot invent activity', () => {
  const map = buildHeatmap(
    '2026-09-29',
    ['2026-08-01', '2026-08-01', '2026-09-01', '2026-09-29'],
    'monthly',
    'en',
    '2026-09-29',
  );
  assert.equal(map.cells.length, 12);
  assert.equal(map.cells[7].count, 1);
  assert.equal(map.cells[7].level, 2);
  assert.equal(map.cells[8].count, 2);
  assert.equal(map.cells[8].level, 4);
  assert.equal(map.cells[9].date, null);
  assert.equal(map.cells[9].level, 0);
  assert.equal(map.cells.filter((cell) => cell.selected).length, 1);
});

test('daily colors distinguish known activity from edition availability without fabricated counts', () => {
  const map = buildHeatmap(
    '2026-09-29',
    ['2026-09-01', '2026-09-02', '2026-09-03'],
    'daily',
    'zh',
    '2026-09-03',
    { '2026-09-02': 1, '2026-09-03': 12 },
  );
  const days = map.cells.filter((cell) => cell.date);
  assert.deepEqual(
    days.map((cell) => cell.level),
    [1, 2, 4],
  );
  assert.equal(days[0].label.includes('条已载入资讯'), false);
  assert.equal(days[1].label.includes('1 条已载入资讯'), true);
});
