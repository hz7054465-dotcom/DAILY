import { Language } from '@/types/settings';

export const en = {
  'tab.home': 'Home',
  'tab.statistics': 'Statistics',
  'tab.settings': 'Settings',

  'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',

  'home.today': 'Today',
  'home.habitsCount': '{n} habits',
  'home.noHabitsTitle': 'No habits yet',
  'home.noHabitsSub': 'Tap + to create your first habit.',
  'home.offTitle': 'Nothing scheduled today',
  'home.offSub': 'Enjoy your day off.',

  'progress.title': "Today's progress",
  'progress.noHabits': 'No habits',
  'progress.done': '{done} of {total} done',
  'progress.none': 'Nothing scheduled today',
  'progress.start': "Let's get started",
  'progress.good': 'Good start, keep going',
  'progress.almost': 'Almost there',
  'progress.complete': 'All done. Great day!',
  'progress.streak': '{n} day streak',

  'week.title': 'This week',

  'stats.title': 'Statistics',
  'stats.emptyTitle': 'No data yet',
  'stats.emptySub': 'Create a habit and check it off to see your stats.',
  'stats.totalHabits': 'Total habits',
  'stats.checkIns': 'Check-ins',
  'stats.completionRate': 'Completion rate',
  'stats.bestStreak': 'Best streak',

  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.mode': 'Mode',
  'settings.dark': 'Dark',
  'settings.light': 'Light',
  'settings.system': 'System',
  'settings.accent': 'Accent color',
  'settings.date': 'Date',
  'settings.weekStarts': 'Week starts on',
  'settings.saved': 'Changes saved automatically.',

  'day.0': 'Sun',
  'day.1': 'Mon',
  'day.2': 'Tue',
  'day.3': 'Wed',
  'day.4': 'Thu',
  'day.5': 'Fri',
  'day.6': 'Sat',
  'dayLong.0': 'Sunday',
  'dayLong.1': 'Monday',
  'dayLong.2': 'Tuesday',
  'dayLong.3': 'Wednesday',
  'dayLong.4': 'Thursday',
  'dayLong.5': 'Friday',
  'dayLong.6': 'Saturday',
  'schedule.everyDay': 'Every day',

  'habit.new': 'New habit',
  'habit.edit': 'Edit habit',
  'habit.name': 'Name',
  'habit.namePlaceholder': 'e.g. Read 10 pages',
  'habit.icon': 'Icon',
  'habit.repeat': 'Repeat on',
  'habit.save': 'Save habit',
  'habit.saveChanges': 'Save changes',
  'habit.cancel': 'Cancel',
  'habit.errName': 'Habit name cannot be empty.',
  'habit.errDays': 'Select at least one weekday.',
  'habit.errSave': 'Could not save. Please try again.',
} as const;

export type TKey = keyof typeof en;

export const ar: Record<TKey, string> = {
  'tab.home': 'الرئيسية',
  'tab.statistics': 'الإحصائيات',
  'tab.settings': 'الإعدادات',

  'greeting.morning': 'صباح الخير',
  'greeting.afternoon': 'نهارك سعيد',
  'greeting.evening': 'مساء الخير',

  'home.today': 'اليوم',
  'home.habitsCount': '{n} عادة',
  'home.noHabitsTitle': 'لا توجد عادات بعد',
  'home.noHabitsSub': 'اضغط + لإنشاء أول عادة لك.',
  'home.offTitle': 'لا شيء مجدول اليوم',
  'home.offSub': 'استمتع بيوم راحتك.',

  'progress.title': 'تقدّم اليوم',
  'progress.noHabits': 'لا عادات',
  'progress.done': '{done} من {total} مكتملة',
  'progress.none': 'لا شيء مجدول اليوم',
  'progress.start': 'هيا نبدأ',
  'progress.good': 'بداية جيدة، واصل',
  'progress.almost': 'اقتربت من الهدف',
  'progress.complete': 'أنجزت كل شيء. يوم رائع!',
  'progress.streak': '{n} يوم متتالي',

  'week.title': 'هذا الأسبوع',

  'stats.title': 'الإحصائيات',
  'stats.emptyTitle': 'لا توجد بيانات بعد',
  'stats.emptySub': 'أنشئ عادة وعلّمها لتظهر إحصائياتك.',
  'stats.totalHabits': 'إجمالي العادات',
  'stats.checkIns': 'مرات الإنجاز',
  'stats.completionRate': 'نسبة الإنجاز',
  'stats.bestStreak': 'أفضل سلسلة',

  'settings.title': 'الإعدادات',
  'settings.appearance': 'المظهر',
  'settings.mode': 'الوضع',
  'settings.dark': 'داكن',
  'settings.light': 'فاتح',
  'settings.system': 'النظام',
  'settings.accent': 'لون التطبيق',
  'settings.date': 'التاريخ',
  'settings.weekStarts': 'بداية الأسبوع',
  'settings.saved': 'تُحفظ التغييرات تلقائياً.',

  'day.0': 'أحد',
  'day.1': 'اثنين',
  'day.2': 'ثلاثاء',
  'day.3': 'أربعاء',
  'day.4': 'خميس',
  'day.5': 'جمعة',
  'day.6': 'سبت',
  'dayLong.0': 'الأحد',
  'dayLong.1': 'الاثنين',
  'dayLong.2': 'الثلاثاء',
  'dayLong.3': 'الأربعاء',
  'dayLong.4': 'الخميس',
  'dayLong.5': 'الجمعة',
  'dayLong.6': 'السبت',
  'schedule.everyDay': 'كل يوم',

  'habit.new': 'عادة جديدة',
  'habit.edit': 'تعديل العادة',
  'habit.name': 'الاسم',
  'habit.namePlaceholder': 'مثال: اقرأ 10 صفحات',
  'habit.icon': 'الأيقونة',
  'habit.repeat': 'تكرار في',
  'habit.save': 'حفظ العادة',
  'habit.saveChanges': 'حفظ التعديلات',
  'habit.cancel': 'إلغاء',
  'habit.errName': 'اسم العادة لا يمكن أن يكون فارغاً.',
  'habit.errDays': 'اختر يوماً واحداً على الأقل.',
  'habit.errSave': 'تعذّر الحفظ. حاول مرة أخرى.',
};

export type TParams = Record<string, string | number>;

export function translate(lang: Language, key: TKey, params?: TParams): string {
  const dict: Record<TKey, string> = lang === 'ar' ? ar : en;
  let text: string = dict[key] ?? en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.split(`{${k}}`).join(String(v));
    }
  }
  return text;
}

/** Short weekday name key (0 = Sunday ... 6 = Saturday). */
export const dayKey = (d: number): TKey => `day.${d}` as TKey;
/** Long weekday name key. */
export const dayLongKey = (d: number): TKey => `dayLong.${d}` as TKey;
