// 渲染与交互。纯逻辑都在 logic.js，这里只碰 DOM。
// 手机端（< 640px）用「按天分组」的纵向列表；桌面端用 7 列 × 5 时段网格。

import { COURSES, EXTRAS, SEMESTER } from './data.js';
import {
  coursesForWeek,
  currentWeek,
  detectConflicts,
  findSlot,
  initialWeek,
  nextCourse,
  weekdayOf,
} from './logic.js';

const DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const SLOTS = [1, 3, 5, 7, 9];
const KEY_WEEK = 'timetable.week';
const KEY_START = 'timetable.startDate';

const board = document.getElementById('board');
const list = document.getElementById('list');
const weeklabel = document.getElementById('weeklabel');
const hint = document.getElementById('hint');
const setup = document.getElementById('setup');
const startInput = document.getElementById('startdate');
const extralist = document.getElementById('extralist');

let startDate = localStorage.getItem(KEY_START) || SEMESTER.startDate;
let week = initialWeek(localStorage.getItem(KEY_WEEK), startDate, new Date(), SEMESTER.totalWeeks);

function clampWeek(value) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.round(value), 1), SEMESTER.totalWeeks);
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function slotLabel(period) {
  return `${period}-${period + 1} 节`;
}

/** 手机端：按天分组 */
function renderList(items, conflicts, today, isCurrentWeek) {
  list.replaceChildren();

  for (let day = 1; day <= 7; day++) {
    const dayItems = items.filter((c) => c.day === day).sort((a, b) => a.period[0] - b.period[0]);
    const isToday = day === today && isCurrentWeek;
    const section = make('section', `dayrow${isToday ? ' today' : ''}`);

    const head = make('h3');
    head.appendChild(make('span', '', `周${DAYS[day - 1]}`));
    if (isToday) head.appendChild(make('em', 'now', '今天'));
    section.appendChild(head);

    if (dayItems.length === 0) {
      section.appendChild(make('div', 'dempty', '无课'));
    } else {
      for (const course of dayItems) {
        const card = make('div', `dcard${course.type === 'lab' ? ' lab' : ''}`);
        card.appendChild(make('div', 'dname', course.name));
        const meta = `${slotLabel(course.period[0])} · ${course.room} · ${course.teacher}`;
        card.appendChild(make('div', 'dmeta', meta));
        if (course.type === 'lab') card.appendChild(make('div', 'tag', '实验'));
        if (conflicts.some((c) => c.day === day && c.period === course.period[0])) {
          card.classList.add('conflict');
        }
        section.appendChild(card);
      }
    }
    list.appendChild(section);
  }
}

/** 桌面端：7 列网格 */
function renderGrid(items, conflicts, today, isCurrentWeek) {
  board.replaceChildren();
  board.appendChild(make('div', 'slot', ''));

  for (let day = 1; day <= 7; day++) {
    const weekend = day >= 6 ? ' weekend' : '';
    const isToday = day === today && isCurrentWeek ? ' today' : '';
    board.appendChild(make('div', `dh${weekend}${isToday}`, DAYS[day - 1]));
  }

  for (const slot of SLOTS) {
    board.appendChild(make('div', 'slot', `${slot}-${slot + 1}`));

    for (let day = 1; day <= 7; day++) {
      const slotItems = findSlot(items, day, slot);
      const cell = make('div', 'cell');
      if (day === today && isCurrentWeek) cell.classList.add('today');
      if (conflicts.some((c) => c.day === day && c.period === slot)) cell.classList.add('conflict');

      for (const course of slotItems) {
        const card = make('div', `course${course.type === 'lab' ? ' lab' : ''}`);
        card.appendChild(make('div', 'cname', course.name));
        card.appendChild(make('div', 'croom', course.room));
        card.appendChild(make('div', 'cteacher', course.teacher));
        if (course.type === 'lab') card.appendChild(make('div', 'tag', '实验'));
        cell.appendChild(card);
      }

      if (slotItems.length === 0) cell.appendChild(make('div', 'empty-hint', '·'));
      board.appendChild(cell);
    }
  }
}

function render() {
  const now = new Date();
  const todayWeek = currentWeek(startDate, now, SEMESTER.totalWeeks);
  const today = weekdayOf(now);
  const isCurrentWeek = week === todayWeek;
  const items = coursesForWeek(COURSES, week);
  const conflicts = detectConflicts(items);

  weeklabel.textContent = `第 ${week} 周`;
  localStorage.setItem(KEY_WEEK, String(week));

  const next = nextCourse(COURSES, week, now);
  hint.textContent = next
    ? `下一节 · 周${DAYS[next.day - 1]} ${next.startTime} ${next.course.name} ${next.course.room}`
    : isCurrentWeek
      ? '本周已无课'
      : `第 ${week} 周已无课`;

  renderList(items, conflicts, today, isCurrentWeek);
  renderGrid(items, conflicts, today, isCurrentWeek);

  extralist.replaceChildren();
  const extras = EXTRAS.filter((item) => item.weeks.includes(week));
  if (extras.length === 0) {
    extralist.appendChild(make('li', 'quiet', `第 ${week} 周没有其他课程安排`));
  } else {
    for (const item of extras) {
      const li = make('li');
      li.appendChild(make('span', '', item.name));
      li.appendChild(make('span', '', item.teacher));
      extralist.appendChild(li);
    }
  }

  startInput.value = startDate || '';
}

document.getElementById('prev').addEventListener('click', () => {
  week = clampWeek(week - 1);
  render();
});

document.getElementById('next').addEventListener('click', () => {
  week = clampWeek(week + 1);
  render();
});

document.getElementById('thisweek').addEventListener('click', () => {
  if (!startDate) {
    setup.hidden = false;
    startInput.focus();
    return;
  }
  const computed = currentWeek(startDate, new Date(), SEMESTER.totalWeeks);
  if (computed === 0) {
    hint.textContent = '开学日期还没到';
    setup.hidden = false;
    return;
  }
  week = computed;
  setup.hidden = true;
  render();
});

document.getElementById('saveStart').addEventListener('click', () => {
  if (!startInput.value) return;
  startDate = startInput.value;
  localStorage.setItem(KEY_START, startDate);
  setup.hidden = true;
  week = currentWeek(startDate, new Date(), SEMESTER.totalWeeks) || 1;
  render();
});

render();

// 离线缓存（仅在 http/https 下生效，file:// 打开时跳过）
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
