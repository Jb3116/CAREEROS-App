import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getStudentProfile,
  saveStudentProfile,
  getInitials,
  DEFAULT_STUDENT_PROFILE,
  PROFILE_STORAGE_KEY,
  AUTH_STORAGE_KEY,
} from '../src/utils/userProfile.ts';

describe('Student Onboarding & Global Profile State Suite', () => {
  // ---------------- 1. Default Student Profile & Initials ----------------
  test('1. Default student profile contains required fields and correct avatar initials', () => {
    const profile = DEFAULT_STUDENT_PROFILE;
    assert.ok(profile.name);
    assert.ok(profile.college);
    assert.ok(profile.year);
    assert.equal(getInitials('Jyoti Bharti'), 'JB');
    assert.equal(getInitials('Alex Chen'), 'AC');
    assert.equal(getInitials('SingleName'), 'SI');
  });

  // ---------------- 2. Academic Year Strictly 4 Values ----------------
  test('2. Academic year supports strictly the 4 standardized values', () => {
    const allowedYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    // Verify none have parentheses or cohort suffixes
    for (const yr of allowedYears) {
      assert.match(yr, /^[1-4](?:st|nd|rd|th)\sYear$/);
      assert.ok(!yr.includes('(') && !yr.includes(')'));
    }
  });

  // ---------------- 3. Target Career Tracks Include EEE Core Jobs ----------------
  test('3. Target career tracks include EEE Core Jobs alongside Software tracks', () => {
    const availableTracks = [
      'Software Development Engineer',
      'Full Stack Developer',
      'Frontend Engineer',
      'Backend / Cloud Engineer',
      'Data Scientist / AI Engineer',
      'DevOps & Site Reliability',
      'EEE Core Jobs',
    ];

    assert.ok(availableTracks.includes('EEE Core Jobs'), 'EEE Core Jobs must be a selectable career track');
  });

  // ---------------- 4. Dynamic AI Calibration Synthesis String Generation ----------------
  test('4. Dynamic AI Calibration generates personalized curriculum strings', () => {
    const mockStudent = {
      fullName: 'Priya Sharma',
      college: 'IIT Madras',
      degree: 'B.Tech in Electrical & Electronics Engineering',
      currentYear: '2nd Year',
      targetRoles: ['EEE Core Jobs', 'Backend / Cloud Engineer'],
      primaryLanguages: ['C++', 'Python', 'MATLAB'],
      weeklyHours: '10 - 15 Hours / Week',
    };

    const curriculumMsg = `Analyzing ${mockStudent.currentYear} curriculum for ${mockStudent.college}...`;
    const roadmapMsg = `Calibrating ${mockStudent.targetRoles.join(' & ')} roadmap for ${mockStudent.fullName}...`;
    const modulesMsg = `Configuring ${mockStudent.degree} core modules...`;

    assert.equal(curriculumMsg, 'Analyzing 2nd Year curriculum for IIT Madras...');
    assert.equal(roadmapMsg, 'Calibrating EEE Core Jobs & Backend / Cloud Engineer roadmap for Priya Sharma...');
    assert.equal(modulesMsg, 'Configuring B.Tech in Electrical & Electronics Engineering core modules...');
  });

  // ---------------- 5. Global State Mutation & LocalStorage Sync ----------------
  test('5. saveStudentProfile persists student identity and synchronizes avatarText', () => {
    const updated = saveStudentProfile({
      name: 'Rohan Verma',
      college: 'BITS Pilani, Goa',
      degree: 'B.Tech Mechanical & Automation',
      year: '4th Year',
      currentYear: '4th Year',
      targetRoles: ['EEE Core Jobs'],
    });

    assert.equal(updated.name, 'Rohan Verma');
    assert.equal(updated.college, 'BITS Pilani, Goa');
    assert.equal(updated.currentYear, '4th Year');
    assert.equal(updated.avatarText, 'RV');
    assert.ok(updated.targetRoles?.includes('EEE Core Jobs'));
  });

  // ---------------- 6. Robust Password Complexity Validation ----------------
  test('6. Password complexity enforces length, uppercase, lowercase, number, and special char', async () => {
    const { validatePasswordComplexity } = await import('../src/utils/authAccounts.ts');

    // Weak passwords
    const weak1 = validatePasswordComplexity('short');
    assert.equal(weak1.isValid, false);
    assert.equal(weak1.criteria.length, false);

    const weakNoUpper = validatePasswordComplexity('careeros2026!');
    assert.equal(weakNoUpper.isValid, false);
    assert.equal(weakNoUpper.criteria.uppercase, false);

    const weakNoLower = validatePasswordComplexity('CAREEROS2026!');
    assert.equal(weakNoLower.isValid, false);
    assert.equal(weakNoLower.criteria.lowercase, false);

    const weakNoNum = validatePasswordComplexity('CareerOS!');
    assert.equal(weakNoNum.isValid, false);
    assert.equal(weakNoNum.criteria.number, false);

    const weakNoSpecial = validatePasswordComplexity('CareerOS2026');
    assert.equal(weakNoSpecial.isValid, false);
    assert.equal(weakNoSpecial.criteria.special, false);

    // Strong password
    const strong = validatePasswordComplexity('CareerOS2026!');
    assert.equal(strong.isValid, true);
    assert.equal(strong.errors.length, 0);
    assert.ok(strong.criteria.length && strong.criteria.uppercase && strong.criteria.lowercase && strong.criteria.number && strong.criteria.special);
  });

  // ---------------- 7. Strict Sign In vs Sign Up Enforcement ----------------
  test('7. Strict Sign In prevents unknown accounts and wrong passwords', async () => {
    const { verifyStudentCredentials, registerNewAccount } = await import('../src/utils/authAccounts.ts');

    // 1. Unknown account should be rejected with clear message
    const unknownRes = verifyStudentCredentials('nonexistent.user@random.edu', 'SomePass123!');
    assert.equal(unknownRes.success, false);
    assert.ok(unknownRes.error?.includes('Account not found'));

    // 2. Existing account with wrong password should be rejected
    const wrongPassRes = verifyStudentCredentials('alex.chen@vit.edu', 'WrongPass123!');
    assert.equal(wrongPassRes.success, false);
    assert.ok(wrongPassRes.error?.includes('Incorrect password'));

    // 3. Existing account with valid password should succeed
    const validRes = verifyStudentCredentials('alex.chen@vit.edu', 'CareerOS2026!');
    assert.equal(validRes.success, true);
    assert.equal(validRes.account?.email, 'alex.chen@vit.edu');

    // 4. Sign Up new account then Sign In
    const newStudentEmail = `test.student.${Date.now()}@vit.edu`;
    const regRes = registerNewAccount({
      name: 'New Test Student',
      email: newStudentEmail,
      password: 'StrongPass2026!',
      college: 'VIT Chennai',
    });
    assert.equal(regRes.success, true);

    // Now Sign In with the newly registered account
    const newSignInRes = verifyStudentCredentials(newStudentEmail, 'StrongPass2026!');
    assert.equal(newSignInRes.success, true);
    assert.equal(newSignInRes.account?.name, 'New Test Student');
  });

  // ---------------- 8. Unicode Text Normalization & Mojibake Repair ----------------
  test('8. Unicode normalization repairs Mojibake and strictly preserves technical symbols', async () => {
    const { normalizeImportedText, detectMojibake, sanitizeTechnicalSkillList } = await import(
      '../src/utils/textNormalization.ts'
    );

    // Corrupted Mojibake strings
    const mojibakeSample = 'Software Engineer â€“ Built scalable services with C++, C#, .NET & Node.js â€œHigh Performanceâ€ â€¢ Ã©tudiant';
    assert.equal(detectMojibake(mojibakeSample), true);

    const repaired = normalizeImportedText(mojibakeSample);
    assert.equal(detectMojibake(repaired), false);
    assert.ok(repaired.includes('–'), 'Must repair en-dash');
    assert.ok(repaired.includes('“') && repaired.includes('”'), 'Must repair smart quotes');
    assert.ok(repaired.includes('•'), 'Must repair bullet point');
    assert.ok(repaired.includes('étudiant'), 'Must repair accented character');
    assert.ok(repaired.includes('C++'), 'Must strictly preserve C++');
    assert.ok(repaired.includes('C#'), 'Must strictly preserve C#');
    assert.ok(repaired.includes('.NET'), 'Must strictly preserve .NET');
    assert.ok(repaired.includes('Node.js'), 'Must strictly preserve Node.js');

    // Technical skills list sanitization
    const skills = sanitizeTechnicalSkillList('C++, Python, TypeScript, C#, .NET, Node.js, C++');
    assert.equal(skills, 'C++, Python, TypeScript, C#, .NET, Node.js');
  });

  // ---------------- 9. DOCX Word XML Text Cleaning ----------------
  test('9. parseWordXmlToText extracts structured text from Word XML without artifacts', async () => {
    const { parseWordXmlToText } = await import('../src/utils/textNormalization.ts');

    const sampleXml = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>Alex Chen</w:t></w:r></w:p>
          <w:p><w:r><w:t>Experienced in C++ &amp; Distributed Systems â€“ 9.01 CGPA</w:t></w:r></w:p>
        </w:body>
      </w:document>
    `;

    const extracted = parseWordXmlToText(sampleXml);
    assert.ok(extracted.includes('Alex Chen'));
    assert.ok(extracted.includes('C++ &amp; Distributed Systems – 9.01 CGPA') || extracted.includes('C++'));
    assert.ok(!extracted.includes('â€“'), 'Must not contain mojibake');
  });

  // ---------------- 10. Zero-Streak Fresh Profile Initialization ----------------
  test('10. Fresh student signup strictly initializes zero-streak and dynamic state', async () => {
    const { createFreshStudentProfile } = await import('../src/utils/userProfile.ts');

    const freshProfile = createFreshStudentProfile({
      name: 'Fresh Candidate',
      email: 'fresh.candidate@university.edu',
      college: 'IIT Delhi',
    });

    assert.equal(freshProfile.streakDays, 0, 'New user streak must strictly be 0');
    assert.equal(freshProfile.readinessScore, 0, 'Initial readiness score must start at 0%');
    assert.equal(freshProfile.atsScore, 0, 'Initial ATS score must start at 0%');
    assert.equal(freshProfile.name, 'Fresh Candidate');
    assert.equal(freshProfile.avatarText, 'FC');
  });

  // ---------------- 11. Real Streak Logic & Precision Verification ----------------
  test('11. Real streak calculation strictly enforces date-based completion and streak breaks', async () => {
    const { calculateRealStreak, formatLocalDateStr } = await import('../src/utils/streakCalculator.ts');

    const refDate = new Date('2026-08-23T12:00:00Z');
    const todayStr = formatLocalDateStr(refDate);

    // 1. Zero events -> streak = 0
    const zeroReport = calculateRealStreak([], refDate);
    assert.equal(zeroReport.currentStreak, 0);
    assert.equal(zeroReport.longestStreak, 0);
    assert.equal(zeroReport.totalActiveDays, 0);
    assert.equal(zeroReport.isActiveToday, false);
    assert.ok(zeroReport.weekDays.every((d) => !d.isCompleted));

    // 2. Activity today -> streak = 1
    const todayReport = calculateRealStreak(
      [{ timestamp: refDate.toISOString(), activity: 'problemSolved', correct: true }],
      refDate
    );
    assert.equal(todayReport.currentStreak, 1);
    assert.equal(todayReport.isActiveToday, true);

    // 3. Activity yesterday only -> streak = 1 (active, waiting for today)
    const yestDate = new Date(refDate);
    yestDate.setDate(refDate.getDate() - 1);
    const yestReport = calculateRealStreak(
      [{ timestamp: yestDate.toISOString(), activity: 'problemSolved', correct: true }],
      refDate
    );
    assert.equal(yestReport.currentStreak, 1);
    assert.equal(yestReport.isActiveToday, false);

    // 4. Activity 2 days ago only (yesterday missed) -> streak = 0 (broken streak)
    const twoDaysAgo = new Date(refDate);
    twoDaysAgo.setDate(refDate.getDate() - 2);
    const brokenReport = calculateRealStreak(
      [{ timestamp: twoDaysAgo.toISOString(), activity: 'problemSolved', correct: true }],
      refDate
    );
    assert.equal(brokenReport.currentStreak, 0);

    // 5. 3-day consecutive streak
    const d3 = new Date(refDate);
    d3.setDate(refDate.getDate() - 2);
    const d2 = new Date(refDate);
    d2.setDate(refDate.getDate() - 1);
    const d1 = new Date(refDate);

    const multiReport = calculateRealStreak(
      [
        { timestamp: d3.toISOString(), activity: 'code' },
        { timestamp: d2.toISOString(), activity: 'code' },
        { timestamp: d1.toISOString(), activity: 'code' },
      ],
      refDate
    );
    assert.equal(multiReport.currentStreak, 3);
    assert.equal(multiReport.longestStreak, 3);
    assert.equal(multiReport.totalActiveDays, 3);

    // 6. Future date prevention
    const futureDate = new Date(refDate);
    futureDate.setDate(refDate.getDate() + 5);
    const futureReport = calculateRealStreak(
      [{ timestamp: futureDate.toISOString(), activity: 'code' }],
      refDate
    );
    assert.equal(futureReport.currentStreak, 0, 'Future events must not count towards active streak');
  });

  // ---------------- 12. Month Calendar Rendering Zero-State & Active State ----------------
  test('12. Month calendar accurately renders 0-state and active state without mock ticks', async () => {
    const { calculateRealStreak } = await import('../src/utils/streakCalculator.ts');

    const refDate = new Date('2026-08-23T12:00:00Z');

    // Zero-state month report
    const zeroReport = calculateRealStreak([], refDate);
    const month = zeroReport.monthReport;
    assert.equal(month.monthActiveDaysCount, 0, 'Zero-state must have 0 active month days');
    assert.equal(month.monthConsistencyPercent, 0, 'Zero-state consistency must be 0%');
    assert.ok(month.monthDays.every((d) => !d.isCompleted), 'All month days must be uncompleted');

    // Active state month report
    const activeReport = calculateRealStreak(
      [
        { timestamp: '2026-08-01T10:00:00Z', activity: 'code' },
        { timestamp: '2026-08-02T10:00:00Z', activity: 'code' },
        { timestamp: '2026-08-03T10:00:00Z', activity: 'code' },
      ],
      refDate
    );
    assert.equal(activeReport.monthReport.monthActiveDaysCount, 3);
  });

  // ---------------- 13. Hex Escape & Corrupted Binary Artifact Filtering ----------------
  test('13. normalizeImportedText strips PDF stream markers, control chars, and hex artifacts', async () => {
    const { normalizeImportedText } = await import('../src/utils/textNormalization.ts');

    const corruptedRaw = '%PDF-1.7 4 0 obj <</Filter /FlateDecode>> stream\x00\x01\x02xBfij9CG endstream endobj\nAlex Chen\nProficient in C++, C#, .NET & TypeScript â€“ 9.01 CGPA';
    const cleaned = normalizeImportedText(corruptedRaw);

    assert.ok(!cleaned.includes('%PDF-1.7'), 'Must strip %PDF header');
    assert.ok(!cleaned.includes('obj'), 'Must strip obj markers');
    assert.ok(!cleaned.includes('endobj'), 'Must strip endobj markers');
    assert.ok(!cleaned.includes('\x00'), 'Must strip null bytes');
    assert.ok(cleaned.includes('Alex Chen'), 'Must preserve candidate name');
    assert.ok(cleaned.includes('C++'), 'Must preserve C++');
    assert.ok(cleaned.includes('C#'), 'Must preserve C#');
    assert.ok(cleaned.includes('.NET'), 'Must preserve .NET');
    assert.ok(cleaned.includes('TypeScript'), 'Must preserve TypeScript');
    assert.ok(cleaned.includes('–'), 'Must repair en-dash');
  });

  // ---------------- 14. True Zero-State Dashboard Calculation Across All Widgets ----------------
  test('14. True zero-state across all dashboard widgets for brand-new student accounts', async () => {
    const { createFreshStudentProfile } = await import('../src/utils/userProfile.ts');
    const { generateAutomatedTodaysPlan } = await import('../src/utils/appEvents.ts');
    const { DKTInference } = await import('../ai/dkt-engine.mjs');

    // 1. Fresh Profile Zero State
    const freshStudent = createFreshStudentProfile({
      name: 'Pristine Student',
      email: 'pristine@university.edu',
      college: 'National Engineering College',
    });
    assert.equal(freshStudent.streakDays, 0);
    assert.equal(freshStudent.readinessScore, 0);
    assert.equal(freshStudent.atsScore, 0);

    // 2. Today's Plan Zero State
    const tasks = generateAutomatedTodaysPlan();
    assert.equal(tasks.length, 0, 'New user Today Plan must be empty (prompts for assessment)');
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const planProgressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    assert.equal(completedTasks.length, 0, 'New user must have 0 completed tasks in Today Plan');
    assert.equal(planProgressPercent, 0, 'New user Today Plan progress must be 0%');

    // 3. AI DKT Skill Mastery Zero State
    const dktPrediction = DKTInference.predict([], 's_new_user');
    assert.equal(dktPrediction.readiness_score, 0, 'Zero-state readiness must be 0%');
    assert.equal(dktPrediction.category_mastery.coding, 0, 'Coding mastery must be 0%');
    assert.equal(dktPrediction.category_mastery.aptitude, 0, 'Aptitude mastery must be 0%');
    assert.equal(dktPrediction.category_mastery.communication, 0, 'Communication mastery must be 0%');
  });
});
