// 课表数据。改课表只需要改这个文件。
// day: 1=周一 … 7=周日   period: [起节, 止节]   type: lecture 讲课 / lab 实验 / practice 实践

export const SEMESTER = {
  name: '2026-2027 学年第 1 学期',
  totalWeeks: 18,
  // 第 1 周的周一。2026-08-31 起算，2026-10-26 正好是第 9 周
  startDate: '2026-08-31',
};

// 节次对应时间（用于“下一节课”提示）
export const PERIOD_TIMES = {
  1: { start: '08:00', end: '09:40' },
  3: { start: '10:00', end: '11:40' },
  5: { start: '14:00', end: '15:40' },
  7: { start: '16:00', end: '17:40' },
  9: { start: '19:00', end: '20:40' },
};

export const COURSES = [
  // 周一 3-4 节：同一门课按周换教室
  { day: 1, period: [3, 4], name: '移动通信技术', room: 'J2-103', teacher: '汪洋', type: 'lecture',
    weeks: [1, 2, 3, 5, 6] },
  { day: 1, period: [3, 4], name: '移动通信技术', room: 'J2-104', teacher: '汪洋', type: 'lecture',
    weeks: [4, 7, 9, 10, 11, 12] },

  // 周二 1-2 节
  { day: 2, period: [1, 2], name: '商业管理案例分析', room: 'J1-301', teacher: '马娟', type: 'lecture',
    weeks: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12] },

  // 周二 5-6 节：四段教室
  { day: 2, period: [5, 6], name: '光宽带接入技术', room: 'J2-109', teacher: '王威', type: 'lecture',
    weeks: [1, 2, 3, 4, 5] },
  { day: 2, period: [5, 6], name: '光宽带接入技术', room: 'J2-303', teacher: '王威', type: 'lecture',
    weeks: [6] },
  { day: 2, period: [5, 6], name: '光宽带接入技术', room: 'J2-116', teacher: '王威', type: 'lecture',
    weeks: [7] },
  { day: 2, period: [5, 6], name: '光宽带接入技术', room: 'J2-219', teacher: '王威', type: 'lecture',
    weeks: [9, 10, 11, 12] },

  // 周三 3-4 节（原移动通信技术 J2-316 已按你的选择移除，只保留概率论）
  { day: 3, period: [3, 4], name: '概率论与数理统计', room: 'J1-212', teacher: '董玉香', type: 'lecture',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },

  // 周四
  { day: 4, period: [3, 4], name: '商业管理案例分析', room: 'J3-303', teacher: '马娟', type: 'lecture',
    weeks: [1, 2, 3, 4, 5] },
  { day: 4, period: [7, 8], name: '光宽带接入技术', room: 'J2-208', teacher: '王威', type: 'lecture',
    weeks: [1, 2, 3, 4, 5] },
  { day: 4, period: [9, 10], name: '形势与政策3', room: 'J3-306', teacher: '张秋月', type: 'lecture',
    weeks: [9, 10] },

  // 周五 3-4 节：单周
  { day: 5, period: [3, 4], name: '概率论与数理统计', room: 'J1-201', teacher: '董玉香', type: 'lecture',
    weeks: [1, 3, 5, 7, 9, 11, 13, 15] },

  // 周六 9-10 节：实验课
  { day: 6, period: [9, 10], name: '光宽带接入技术', room: 'S1-212 信号与系统实验室', teacher: '王威', type: 'lab',
    weeks: [4, 5, 6, 7, 9, 10, 11, 12] },
];

// 没有固定节次的课程
export const EXTRAS = [
  { name: '毕业实习', teacher: '洪子渊 / 王威', weeks: [8, 12, 13, 14, 15, 16, 17, 18], type: 'practice' },
  { name: '形势与政策3（实践）', teacher: '张秋月', weeks: [9, 10], type: 'practice' },
];
