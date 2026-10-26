// 纯逻辑，不碰 DOM，可单元测试。

import { PERIOD_TIMES } from './data.js';

const DAY_MS = 86400000;

/** 把 'YYYY-MM-DD' 解析成本地时区的当天 0 点 */
export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 当前教学周；未开始返回 0，超过总周数夹到 totalWeeks */
export function currentWeek(startISO, today, totalWeeks) {
  if (!startISO) return 0;
  const start = parseDate(startISO);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((t - start) / DAY_MS);
  if (diff < 0) return 0;
  return Math.min(Math.floor(diff / 7) + 1, totalWeeks);
}

/** 取某一周的课程 */
export function coursesForWeek(courses, week) {
  return courses.filter((c) => c.weeks.includes(week));
}

/** 按「星期-起始节」分组，便于渲染 */
export function groupBySlot(courses) {
  const map = new Map();
  for (const course of courses) {
    const key = `${course.day}-${course.period[0]}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(course);
  }
  return map;
}

/** 同一格出现两门及以上即为冲突 */
export function detectConflicts(courses, week) {
  const list = week === undefined ? courses : coursesForWeek(courses, week);
  const map = groupBySlot(list);
  const conflicts = [];
  for (const [key, items] of map) {
    if (items.length > 1) {
      const [day, period] = key.split('-').map(Number);
      conflicts.push({ day, period, items });
    }
  }
  return conflicts;
}

/** 星期几：周一=1 … 周日=7 */
export function weekdayOf(date) {
  return ((date.getDay() + 6) % 7) + 1;
}

/** 找下一节课：从今天的此刻往后，最多看到本周结束 */
export function nextCourse(courses, week, now) {
  const list = coursesForWeek(courses, week);
  const today = weekdayOf(now);
  const minutes = now.getHours() * 60 + now.getMinutes();

  for (let day = today; day <= 7; day++) {
    const dayCourses = list
      .filter((c) => c.day === day)
      .sort((a, b) => a.period[0] - b.period[0]);

    for (const course of dayCourses) {
      const time = PERIOD_TIMES[course.period[0]];
      if (!time) continue;
      const [h, m] = time.start.split(':').map(Number);
      if (day === today && h * 60 + m <= minutes) continue; // 已经开课的不算
      return { course, day, startTime: time.start };
    }
  }
  return null;
}

/** 某周某天某格的课程（渲染用） */
export function findSlot(courses, day, period) {
  return courses.filter((c) => c.day === day && c.period[0] === period);
}
