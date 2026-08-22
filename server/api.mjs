// Server API handlers for CAREEROS Student Dashboard

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

  if (pathname === '/api/student/dashboard') {
    const data = {
      profile: {
        name: 'Alex Chen',
        college: 'Vellore Institute of Technology',
        year: 'CS @ 3rd Year',
        streakDays: 5,
        readinessScore: 78,
        atsScore: 91,
      },
      tasks: [
        { id: 't1', title: 'DSA Revision', completed: true, tag: 'Completed' },
        { id: 't2', title: 'Aptitude Practice', completed: true, tag: 'Completed' },
        { id: 't3', title: '2 Tree Problems', completed: false, tag: 'Pending' },
        { id: 't4', title: 'Interview Practice', completed: false, tag: 'Pending' },
      ],
      skills: [
        { name: 'Coding', percentage: 72, category: 'coding' },
        { name: 'Aptitude', percentage: 81, category: 'aptitude' },
        { name: 'Communication', percentage: 64, category: 'communication' },
      ],
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

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Endpoint not found' }));
}
