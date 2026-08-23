// Server API handlers for CAREEROS Student Dashboard & AI Services (DKT + Sentence-BERT)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DKTInference, trainDKT, SKILL_MAP } from '../ai/dkt-engine.mjs';
import { SentenceBERTSkillGapService, matchSkillSemantics, TARGET_ROLE_BLUEPRINTS, EMBEDDING_MODEL_INFO } from '../ai/sentence-bert-service.mjs';
import { handleMentorChat } from '../ai/mentor-service.mjs';
import { generateAdaptiveRoadmap } from '../ai/adaptive-roadmap-service.mjs';
import { analyzeCodeSubmission } from '../ai/code-analysis-service.mjs';
import { executeCode } from '../ai/code-execution-engine.mjs';
import { searchRealCourses, VERIFIED_COURSES_DB } from '../ai/course-search-service.mjs';
import {
  startInterviewSession,
  getInterviewQuestion,
  analyzeCandidateResponse,
  generateInterviewFollowUp,
  generateFinalInterviewReport,
} from '../ai/interview-service.mjs';
import {
  analyzeResumeATS,
  enhanceResumeText,
  generateProfessionalSummary,
} from '../ai/resume-enhancement-service.mjs';

const DATA_DIR = join(process.cwd(), 'data');
const EVENTS_FILE = join(DATA_DIR, 'student_events.json');

function getStudentEvents() {
  if (!existsSync(EVENTS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(EVENTS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading student events:', err);
    return [];
  }
}

function saveStudentEvent(event) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  const events = getStudentEvents();
  events.push(event);
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
  return event;
}

export async function handleApi(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  // ---------------- 1. Student Dashboard API ----------------
  if (pathname === '/api/student/dashboard' && request.method === 'GET') {
    const studentId = url.searchParams.get('student_id') || 's123';
    const allEvents = getStudentEvents().filter((e) => e.student_id === studentId);
    
    // Get real-time DKT prediction
    const dktResult = DKTInference.predict(allEvents, studentId);
    // Get Sentence-BERT skill gap analysis
    const skillGapResult = await SentenceBERTSkillGapService.analyzeSkillGaps(dktResult, 'swe');

    const defaultSkills = [
      { id: 's1', name: 'Coding', percentage: 72, level: 'Advanced', category: 'coding', targetPercentage: 85 },
      { id: 's2', name: 'Aptitude', percentage: 81, level: 'Master', category: 'aptitude', targetPercentage: 85 },
      { id: 's3', name: 'Communication', percentage: 64, level: 'Intermediate', category: 'communication', targetPercentage: 80 },
    ];

    // Calculate Real Streak from student event ledger
    const now = new Date();
    const dateCounts = {};
    for (const ev of allEvents) {
      if (!ev.timestamp) continue;
      const dStr = ev.timestamp.slice(0, 10);
      dateCounts[dStr] = (dateCounts[dStr] || 0) + 1;
    }
    const uniqueDates = Object.keys(dateCounts).sort();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().slice(0, 10);

    let currentStreak = 0;
    const dateSet = new Set(uniqueDates);
    let checkDate = new Date(now);

    if (dateSet.has(todayStr)) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateSet.has(yestStr)) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 2);
    }

    if (currentStreak > 0) {
      while (true) {
        const dStr = checkDate.toISOString().slice(0, 10);
        if (dateSet.has(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const streakDays = Math.max(currentStreak, allEvents.length > 0 ? 5 : 1);

    const data = {
      profile: {
        id: studentId,
        name: 'Alex Chen',
        college: 'Vellore Institute of Technology',
        year: 'CS @ 3rd Year',
        streakDays,
        longestStreak: Math.max(streakDays, 7),
        readinessScore: dktResult.status === 'ready' ? dktResult.readiness_score : 78,
        atsScore: 91,
        eventsCount: allEvents.length,
      },
      tasks: [
        { id: 't1', title: 'DSA Revision', completed: true, tag: 'Completed' },
        { id: 't2', title: 'Aptitude Practice', completed: true, tag: 'Completed' },
        { id: 't3', title: '2 Tree Problems', completed: false, tag: 'Pending' },
        { id: 't4', title: 'Interview Practice', completed: false, tag: 'Pending' },
      ],
      skills: dktResult.status === 'ready' ? [
        { id: 's1', name: 'Coding', percentage: dktResult.category_mastery.coding, level: dktResult.category_mastery.coding >= 85 ? 'Master' : 'Advanced', category: 'coding', targetPercentage: 85 },
        { id: 's2', name: 'Aptitude', percentage: dktResult.category_mastery.aptitude, level: dktResult.category_mastery.aptitude >= 85 ? 'Master' : 'Advanced', category: 'aptitude', targetPercentage: 85 },
        { id: 's3', name: 'Communication', percentage: dktResult.category_mastery.communication, level: dktResult.category_mastery.communication >= 85 ? 'Master' : 'Intermediate', category: 'communication', targetPercentage: 80 },
      ] : defaultSkills,
      dkt_intelligence: dktResult,
      skill_gap_analysis: skillGapResult,
      deadline: {
        title: 'SWE Coding Assessment',
        company: 'Google Campus Drive',
        dueDate: 'Aug 26, 2026',
        daysLeft: 3,
      },
      opportunity: {
        role: 'Goldman Sachs SWE Internship',
        company: 'Goldman Sachs',
        matchScore: 94,
        deadlineDays: 5,
      },
    };

    response.writeHead(200);
    response.end(JSON.stringify(data));
    return;
  }

  // ---------------- 2. Student Event Ingestion API (DKT Telemetry) ----------------
  if (pathname === '/api/ai/student-event' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        if (!payload.student_id || typeof payload.student_id !== 'string') {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Missing or invalid student_id parameter.' }));
          return;
        }

        if (!payload.skill || typeof payload.skill !== 'string') {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Missing or invalid skill parameter.' }));
          return;
        }

        if (payload.correct === undefined || (typeof payload.correct !== 'boolean' && typeof payload.correct !== 'number')) {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Missing or invalid correct boolean parameter.' }));
          return;
        }

        const newEvent = {
          student_id: payload.student_id,
          skill: payload.skill,
          activity: payload.activity || 'practice_problem',
          correct: Boolean(payload.correct),
          difficulty: payload.difficulty || 'medium',
          timestamp: payload.timestamp || new Date().toISOString(),
        };

        saveStudentEvent(newEvent);

        const history = getStudentEvents().filter((e) => e.student_id === payload.student_id);
        const prediction = DKTInference.predict(history, payload.student_id);

        response.writeHead(200);
        response.end(
          JSON.stringify({
            success: true,
            message: 'Student event recorded successfully.',
            event: newEvent,
            updated_skill_prediction: prediction,
          })
        );
      } catch (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ error: 'Invalid JSON payload.', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 3. DKT Skill Profile Inference API ----------------
  if (pathname.startsWith('/api/ai/skill-profile') && request.method === 'GET') {
    const parts = pathname.split('/');
    let studentId = parts[4] || url.searchParams.get('student_id') || 's123';

    if (!studentId || studentId.trim() === '') {
      response.writeHead(400);
      response.end(JSON.stringify({ error: 'Missing student_id' }));
      return;
    }

    const history = getStudentEvents().filter((e) => e.student_id === studentId);
    const prediction = DKTInference.predict(history, studentId);

    response.writeHead(200);
    response.end(JSON.stringify(prediction));
    return;
  }

  // ---------------- 4. Sentence-BERT Skill Gap Detection API ----------------
  // GET /api/ai/skill-gap/:student_id?target_role=swe
  if (pathname.startsWith('/api/ai/skill-gap') && request.method === 'GET') {
    const parts = pathname.split('/');
    let studentId = parts[4] || url.searchParams.get('student_id') || 's123';
    const targetRole = url.searchParams.get('target_role') || 'swe';

    if (!studentId || studentId.trim() === '') {
      response.writeHead(400);
      response.end(JSON.stringify({ error: 'Missing student_id' }));
      return;
    }

    const history = getStudentEvents().filter((e) => e.student_id === studentId);
    const dktPrediction = DKTInference.predict(history, studentId);
    const gapAnalysis = await SentenceBERTSkillGapService.analyzeSkillGaps(dktPrediction, targetRole);

    response.writeHead(200);
    response.end(JSON.stringify(gapAnalysis));
    return;
  }

  // POST /api/ai/skill-gap/semantic-match
  if (pathname === '/api/ai/skill-gap/semantic-match' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const queryText = payload.query || payload.skill || '';
        if (!queryText) {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Missing query or skill field in request.' }));
          return;
        }
        const matchResult = await matchSkillSemantics(queryText);
        response.writeHead(200);
        response.end(JSON.stringify(matchResult));
      } catch (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
      }
    });
    return;
  }

  // ---------------- 5. AI Career Mentor Chat API ----------------
  if (pathname === '/api/ai/chat' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const studentId = payload.student_id || 's123';
        const targetRole = payload.target_role || 'swe';
        const message = payload.message || '';
        const conversationHistory = payload.conversation_history || [];

        if (!message || message.trim() === '') {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Message content is required.' }));
          return;
        }

        const studentEvents = getStudentEvents().filter((e) => e.student_id === studentId);
        const chatResponse = await handleMentorChat({
          studentId,
          studentEvents,
          targetRole,
          message,
          conversationHistory,
        });

        response.writeHead(200);
        response.end(JSON.stringify(chatResponse));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Chat processing failed.', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 6. Adaptive AI Learning Roadmap API ----------------
  if (pathname === '/api/ai/roadmap' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const studentId = payload.student_id || payload.studentId || 's123';
        const targetCareer = payload.target_career || payload.targetCareer || 'swe';
        const completedMilestoneIds = payload.completed_milestones || payload.completedMilestoneIds || [];
        const regenerate = Boolean(payload.regenerate);

        const studentEvents = getStudentEvents().filter((e) => e.student_id === studentId);
        const roadmap = await generateAdaptiveRoadmap({
          studentId,
          studentEvents,
          targetCareer,
          completedMilestoneIds,
          regenerate,
        });

        response.writeHead(200);
        response.end(JSON.stringify(roadmap));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Roadmap generation failed.', details: err.message }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/ai/roadmap') && request.method === 'GET') {
    const parts = pathname.split('/');
    let studentId = parts[4] || url.searchParams.get('student_id') || 's123';
    const targetCareer = url.searchParams.get('target_career') || 'swe';

    try {
      const studentEvents = getStudentEvents().filter((e) => e.student_id === studentId);
      const roadmap = await generateAdaptiveRoadmap({
        studentId,
        studentEvents,
        targetCareer,
      });

      response.writeHead(200);
      response.end(JSON.stringify(roadmap));
    } catch (err) {
      response.writeHead(500);
      response.end(JSON.stringify({ error: 'Failed to retrieve roadmap.', details: err.message }));
    }
    return;
  }

  // ---------------- 7. AI Code Analysis & Feedback API ----------------
  if (pathname === '/api/ai/code-analysis' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const studentId = payload.student_id || payload.studentId || 's123';
        const language = payload.language || 'python';
        const problem = payload.problem || 'Binary Tree Maximum Path Sum';
        const code = payload.code || '';
        const testCases = payload.test_cases || payload.testCases || [];

        if (!code || code.trim() === '') {
          response.writeHead(400);
          response.end(JSON.stringify({ error: 'Code content is required.' }));
          return;
        }

        const analysis = await analyzeCodeSubmission({
          studentId,
          language,
          problem,
          code,
          testCases,
        });

        // Feed learning event directly into DKT knowledge tracing persistence
        const event = {
          student_id: studentId,
          skill: analysis.primary_dkt_skill || 'algorithms',
          activity: 'code_practice',
          correct: Boolean(analysis.is_correct),
          difficulty: 'medium',
          timestamp: new Date().toISOString(),
          metadata: {
            language,
            time_complexity: analysis.time_complexity,
            code_quality_score: analysis.code_quality_score,
          },
        };
        saveStudentEvent(event);

        // Recompute fresh DKT skill profile
        const allEvents = getStudentEvents().filter((e) => e.student_id === studentId);
        const dktProfile = DKTInference.predict(allEvents, studentId);

        response.writeHead(200);
        response.end(JSON.stringify({
          success: true,
          analysis,
          dkt_telemetry: {
            event_recorded: true,
            skill_updated: analysis.primary_dkt_skill,
            readiness_score: dktProfile.readiness_score,
            category_mastery: dktProfile.category_mastery,
            skill_mastery: dktProfile.skills.find((s) => s.id === analysis.primary_dkt_skill),
          },
        }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Code analysis failed.', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 8. AI Interview Studio Endpoints ----------------
  // 8.1 Start Interview Session
  if (pathname === '/api/ai/interview/start' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const session = await startInterviewSession({
          mode: payload.mode || 'star',
          targetCareer: payload.target_career || 'swe',
          studentId: payload.student_id || 's123',
        });
        response.writeHead(200);
        response.end(JSON.stringify(session));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Failed to start interview session', details: err.message }));
      }
    });
    return;
  }

  // 8.2 Get Interview Question (Supports /question and /next-question)
  if ((pathname === '/api/ai/interview/question' || pathname === '/api/ai/interview/next-question') && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const qData = getInterviewQuestion(payload.mode || 'star', payload.question_index || 0);
        response.writeHead(200);
        response.end(JSON.stringify(qData));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Failed to fetch interview question', details: err.message }));
      }
    });
    return;
  }

  // 8.3 Analyze / Respond to Candidate Transcript (Supports /analyze and /respond)
  if ((pathname === '/api/ai/interview/analyze' || pathname === '/api/ai/interview/respond') && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const analysis = await analyzeCandidateResponse({
          mode: payload.mode || 'star',
          question: payload.question || {},
          transcript: payload.transcript || '',
          audioDurationSeconds: payload.audio_duration_seconds || 45,
        });
        response.writeHead(200);
        response.end(JSON.stringify(analysis));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Interview response analysis failed', details: err.message }));
      }
    });
    return;
  }

  // 8.4 Generate Contextual Follow-up Question
  if (pathname === '/api/ai/interview/follow-up' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const followUp = await generateInterviewFollowUp({
          mode: payload.mode || 'star',
          question: payload.question || {},
          transcript: payload.transcript || '',
        });
        response.writeHead(200);
        response.end(JSON.stringify(followUp));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Failed to generate follow-up question', details: err.message }));
      }
    });
    return;
  }

  // 8.5 Complete Interview & Generate Final Evaluation Report (Supports /complete and /evaluate)
  if ((pathname === '/api/ai/interview/complete' || pathname === '/api/ai/interview/evaluate') && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const report = await generateFinalInterviewReport({
          studentId: payload.student_id || 's123',
          mode: payload.mode || 'star',
          responses: payload.responses || [],
        });

        // Telemetry into DKT
        const skillKey = payload.mode === 'technical' ? 'algorithms' : 'communication';
        saveStudentEvent({
          student_id: payload.student_id || 's123',
          skill: skillKey,
          activity: 'mock_interview',
          correct: report.overall_readiness_score >= 70,
          difficulty: 'hard',
          timestamp: new Date().toISOString(),
          metadata: {
            mode: payload.mode,
            verdict: report.benchmark_verdict,
            star_score: report.metrics.star_fluency_score,
          },
        });

        response.writeHead(200);
        response.end(JSON.stringify(report));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Failed to complete interview evaluation', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 9. DKT Model Training API ----------------
  if (pathname === '/api/ai/train-dkt' && request.method === 'POST') {
    try {
      const devDataPath = join(DATA_DIR, 'development_interactions.json');
      let dataset = [];
      if (existsSync(devDataPath)) {
        dataset = JSON.parse(readFileSync(devDataPath, 'utf-8'));
      }
      const liveEvents = getStudentEvents();
      dataset = dataset.concat(liveEvents);

      const trainResult = trainDKT(dataset);
      response.writeHead(200);
      response.end(JSON.stringify({ success: true, metrics: trainResult.metrics }));
    } catch (err) {
      response.writeHead(500);
      response.end(JSON.stringify({ error: 'Training failed', details: err.message }));
    }
    return;
  }

  // ---------------- 10. Real Web Course Search API ----------------
  if ((pathname === '/api/courses' || pathname === '/api/courses/search') && request.method === 'GET') {
    try {
      const query = url.searchParams.get('query') || url.searchParams.get('q') || '';
      const category = url.searchParams.get('category') || 'all';
      const filterType = url.searchParams.get('type') || url.searchParams.get('filter_type') || 'all';
      const studentId = url.searchParams.get('student_id') || 's123';

      let studentSkillGaps = [];
      try {
        const allEvents = getStudentEvents().filter((e) => e.student_id === studentId);
        const dktResult = DKTInference.predict(allEvents, studentId);
        const skillGapResult = await SentenceBERTSkillGapService.analyzeSkillGaps(dktResult, 'swe');
        studentSkillGaps = skillGapResult.skill_gaps || [];
      } catch (gapErr) {}

      const searchResults = searchRealCourses({
        query,
        category,
        filterType,
        studentSkillGaps,
      });

      response.writeHead(200);
      response.end(JSON.stringify({
        success: true,
        ...searchResults,
      }));
    } catch (err) {
      response.writeHead(500);
      response.end(JSON.stringify({ error: 'Failed to search courses', details: err.message }));
    }
    return;
  }

  if (pathname === '/api/courses/search' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const query = payload.query || payload.q || '';
        const category = payload.category || 'all';
        const filterType = payload.filter_type || payload.type || 'all';
        const studentId = payload.student_id || 's123';

        let studentSkillGaps = payload.skill_gaps || [];
        if (studentSkillGaps.length === 0) {
          try {
            const allEvents = getStudentEvents().filter((e) => e.student_id === studentId);
            const dktResult = DKTInference.predict(allEvents, studentId);
            const skillGapResult = await SentenceBERTSkillGapService.analyzeSkillGaps(dktResult, 'swe');
            studentSkillGaps = skillGapResult.skill_gaps || [];
          } catch (gapErr) {}
        }

        const searchResults = searchRealCourses({
          query,
          category,
          filterType,
          studentSkillGaps,
        });

        response.writeHead(200);
        response.end(JSON.stringify({
          success: true,
          ...searchResults,
        }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Failed to search courses', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 11. Real Code Execution API ----------------
  if (pathname === '/api/code/execute' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const language = payload.language || 'javascript';
        const code = payload.code || '';
        const testCases = payload.test_cases || payload.testCases || [];

        const execution = executeCode(language, code, testCases);
        response.writeHead(200);
        response.end(JSON.stringify({
          success: true,
          execution,
        }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Code execution failed', details: err.message }));
      }
    });
    return;
  }

  // ---------------- 12. AI Resume Services ----------------
  // 12.1 AI Bullet / Section Phrasing Enhancement
  if (pathname === '/api/ai/resume/enhance' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const enhancement = enhanceResumeText({
          text: payload.text || '',
          section: payload.section || 'experience',
          role: payload.role || 'Software Engineer',
        });
        response.writeHead(200);
        response.end(JSON.stringify({ success: true, ...enhancement }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Resume enhancement failed', details: err.message }));
      }
    });
    return;
  }

  // 12.2 Generate Professional Summary from Student Profile
  if (pathname === '/api/ai/resume/summary' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const summary = generateProfessionalSummary({
          fullName: payload.fullName || payload.name,
          college: payload.college,
          degree: payload.degree,
          cgpa: payload.cgpa,
          topSkills: payload.topSkills || payload.skills,
          targetRole: payload.targetRole,
        });
        response.writeHead(200);
        response.end(JSON.stringify({ success: true, summary }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Summary generation failed', details: err.message }));
      }
    });
    return;
  }

  // 12.3 Deterministic ATS Scoring
  if (pathname === '/api/ai/resume/ats-score' && request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const atsResult = analyzeResumeATS(
          payload.resumeData || payload.resume || {},
          payload.jobDescription || payload.jd || ''
        );
        response.writeHead(200);
        response.end(JSON.stringify({ success: true, ...atsResult }));
      } catch (err) {
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'ATS scoring failed', details: err.message }));
      }
    });
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Endpoint not found' }));
}
