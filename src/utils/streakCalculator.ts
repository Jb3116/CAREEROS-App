/**
 * CAREEROS - Real Streak & Activity Engine
 * Calibrates day-by-day learning activity strictly based on timestamped event ledgers.
 * Supports Week View (M-S) and Navigable Month Calendar View with Timezone Integrity.
 */

export interface StudentEvent {
  student_id?: string;
  activity?: string;
  timestamp: string;
  skill?: string;
  correct?: boolean;
}

export interface DayActivityState {
  dayInitial: string;
  dayName: string;
  dateStr: string;
  formattedDate: string;
  isToday: boolean;
  isCompleted: boolean;
  activityCount: number;
  isFuture: boolean;
}

export interface MonthDayActivityState {
  dayNum: number;
  dateStr: string;
  isToday: boolean;
  isCompleted: boolean;
  activityCount: number;
  isCurrentMonth: boolean;
  isFuture: boolean;
}

export interface MonthStreakReport {
  monthName: string;
  year: number;
  monthIndex: number;
  monthDays: MonthDayActivityState[];
  monthActiveDaysCount: number;
  monthTotalDays: number;
  monthConsistencyPercent: number;
}

export interface StreakReport {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  weekDays: DayActivityState[];
  isActiveToday: boolean;
  monthReport: MonthStreakReport;
}

/**
 * Format date to YYYY-MM-DD in local time
 */
export function formatLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculate Real Streak metrics from timestamped events
 * Supports referenceDate and monthOffset (-1, 0, +1...) for month navigation
 */
export function calculateRealStreak(
  events: StudentEvent[] = [],
  referenceDate: Date = new Date(),
  monthOffset: number = 0
): StreakReport {
  const todayStr = formatLocalDateStr(referenceDate);

  // Group events by local date string
  const dateCounts: Record<string, number> = {};
  for (const ev of events) {
    if (!ev.timestamp) continue;
    try {
      const d = new Date(ev.timestamp);
      if (isNaN(d.getTime())) continue;
      const dateKey = formatLocalDateStr(d);
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    } catch {}
  }

  const uniqueDates = Object.keys(dateCounts).sort();
  const dateSet = new Set(uniqueDates);
  const isActiveToday = dateSet.has(todayStr);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  const checkDate = new Date(referenceDate);

  if (isActiveToday) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if yesterday had activity (streak still active, waiting for today)
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = formatLocalDateStr(yesterday);
    if (dateSet.has(yestStr)) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 2);
    }
  }

  // Trace back consecutive previous days
  if (currentStreak > 0) {
    while (true) {
      const dStr = formatLocalDateStr(checkDate);
      if (dateSet.has(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // 2. Calculate Longest Streak
  let longestStreak = 0;
  if (uniqueDates.length > 0) {
    let tempStreak = 1;
    longestStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffMs = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
  }

  // 3. Build Current Week View (M T W T F S S)
  const currentDayOfWeek = referenceDate.getDay(); // 0 = Sun, 1 = Mon ...
  const distFromMon = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const monday = new Date(referenceDate);
  monday.setDate(monday.getDate() - distFromMon);
  monday.setHours(0, 0, 0, 0);

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const weekDays: DayActivityState[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = formatLocalDateStr(d);
    const count = dateCounts[dStr] || 0;
    const isToday = dStr === todayStr;

    const refDayStart = new Date(referenceDate);
    refDayStart.setHours(0, 0, 0, 0);
    const isFuture = d.getTime() > refDayStart.getTime();

    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();

    weekDays.push({
      dayInitial: dayInitials[i],
      dayName: dayNames[i],
      dateStr: dStr,
      formattedDate: `${monthName} ${dayNum}`,
      isToday,
      isCompleted: count > 0,
      activityCount: count,
      isFuture,
    });
  }

  // 4. Build Navigable Month View Calendar
  const targetMonthDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + monthOffset, 1);
  const targetYear = targetMonthDate.getFullYear();
  const targetMonth = targetMonthDate.getMonth();
  const targetMonthName = targetMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // First day of month and total days in month
  const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
  const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  // Day of week of first day (0=Sun, 1=Mon... convert to Monday=0)
  const firstDayWeekday = firstDayOfMonth.getDay();
  const startPaddingDays = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const monthDays: MonthDayActivityState[] = [];
  let monthActiveDaysCount = 0;

  // Previous month padding days
  const prevMonthLastDay = new Date(targetYear, targetMonth, 0).getDate();
  for (let i = startPaddingDays - 1; i >= 0; i--) {
    const pDate = new Date(targetYear, targetMonth - 1, prevMonthLastDay - i);
    const pStr = formatLocalDateStr(pDate);
    const count = dateCounts[pStr] || 0;
    monthDays.push({
      dayNum: prevMonthLastDay - i,
      dateStr: pStr,
      isToday: pStr === todayStr,
      isCompleted: count > 0,
      activityCount: count,
      isCurrentMonth: false,
      isFuture: pDate.getTime() > referenceDate.getTime(),
    });
  }

  // Current month days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const mDate = new Date(targetYear, targetMonth, day);
    const mStr = formatLocalDateStr(mDate);
    const count = dateCounts[mStr] || 0;
    const isCompleted = count > 0;
    if (isCompleted) monthActiveDaysCount++;

    const refDayStart = new Date(referenceDate);
    refDayStart.setHours(0, 0, 0, 0);
    const isFuture = mDate.getTime() > refDayStart.getTime();

    monthDays.push({
      dayNum: day,
      dateStr: mStr,
      isToday: mStr === todayStr,
      isCompleted,
      activityCount: count,
      isCurrentMonth: true,
      isFuture,
    });
  }

  // Next month padding days to complete 35 or 42 grid slots
  const remainingSlots = (7 - (monthDays.length % 7)) % 7;
  for (let i = 1; i <= remainingSlots; i++) {
    const nDate = new Date(targetYear, targetMonth + 1, i);
    const nStr = formatLocalDateStr(nDate);
    const count = dateCounts[nStr] || 0;
    monthDays.push({
      dayNum: i,
      dateStr: nStr,
      isToday: nStr === todayStr,
      isCompleted: count > 0,
      activityCount: count,
      isCurrentMonth: false,
      isFuture: true,
    });
  }

  const monthConsistencyPercent = Math.round((monthActiveDaysCount / totalDaysInMonth) * 100);

  const monthReport: MonthStreakReport = {
    monthName: targetMonthName,
    year: targetYear,
    monthIndex: targetMonth,
    monthDays,
    monthActiveDaysCount,
    monthTotalDays: totalDaysInMonth,
    monthConsistencyPercent,
  };

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays: uniqueDates.length,
    weekDays,
    isActiveToday,
    monthReport,
  };
}

/**
 * Get time-based greeting for the student
 */
export function getTimeBasedGreeting(
  userName?: string,
  referenceDate: Date = new Date()
): { greeting: string; period: 'morning' | 'afternoon' | 'evening' | 'night' } {
  const hour = referenceDate.getHours();
  let timeGreeting = 'Good Morning';
  let period: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';

  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good Morning';
    period = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
    period = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeGreeting = 'Good Evening';
    period = 'evening';
  } else {
    timeGreeting = 'Good Night';
    period = 'night';
  }

  const name = userName ? userName.trim().split(' ')[0] : 'Champ';
  return {
    greeting: `${timeGreeting}, ${name} 👋`,
    period,
  };
}
