/**
 * CAREEROS - Authentic PDF & DOCX Resume Document Exporters
 * Exports live resume data with selected font families, templates, and bullet structures.
 */

export interface EducationItem {
  id: string;
  college: string;
  degree: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  cgpa: string;
  coursework?: string;
}

export interface ResumeExportData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: {
    id?: string;
    college: string;
    degree: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    duration: string;
    cgpa: string;
    coursework: string;
  };
  educations?: EducationItem[];
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
  };
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    location: string;
    duration: string;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    tech: string;
    link: string;
    bullets: string[];
  }>;
}

/**
 * Generate and download an authentic Microsoft Word .docx document
 */
export function exportResumeToDocx(
  resume: ResumeExportData,
  fontFamily: string = 'Inter, sans-serif'
): void {
  const sanitize = (str: string = '') =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const cleanFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Calibri';

  // Build high-fidelity HTML-based Word document XML
  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${sanitize(resume.fullName)} Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.5in 0.5in 0.5in 0.5in;
        }
        body {
          font-family: '${cleanFont}', Arial, sans-serif;
          font-size: 10.5pt;
          line-height: 1.35;
          color: #111827;
          margin: 0;
          padding: 0;
        }
        h1 {
          font-size: 18pt;
          font-weight: bold;
          margin: 0 0 4pt 0;
          color: #0F172A;
          text-align: center;
        }
        .contact-line {
          text-align: center;
          font-size: 9pt;
          color: #4B5563;
          margin-bottom: 12pt;
          padding-bottom: 4pt;
          border-bottom: 1.5pt solid #0F172A;
        }
        h2 {
          font-size: 11.5pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          color: #0F172A;
          margin: 10pt 0 4pt 0;
          border-bottom: 1pt solid #D1D5DB;
          padding-bottom: 2pt;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-top: 4pt;
        }
        .item-sub {
          font-style: italic;
          color: #374151;
          font-size: 9.5pt;
          margin-bottom: 3pt;
        }
        ul {
          margin: 2pt 0 6pt 16pt;
          padding: 0;
        }
        li {
          margin-bottom: 2.5pt;
        }
        .skills-table {
          width: 100%;
          font-size: 10pt;
          margin-top: 4pt;
        }
        .skills-label {
          font-weight: bold;
          width: 110pt;
          color: #1F2937;
        }
      </style>
    </head>
    <body>
      <h1>${sanitize(resume.fullName)}</h1>
      <div class="contact-line">
        ${sanitize(resume.email)} &bull; ${sanitize(resume.phone)} &bull; ${sanitize(resume.location)}<br/>
        ${sanitize(resume.linkedin)} &bull; ${sanitize(resume.github)} &bull; ${sanitize(resume.portfolio)}
      </div>

      ${
        resume.summary
          ? `
        <h2>Professional Summary</h2>
        <p style="margin: 0 0 6pt 0;">${sanitize(resume.summary)}</p>
      `
          : ''
      }

      <h2>Education</h2>
      ${
        (resume.educations && resume.educations.length > 0 ? resume.educations : [resume.education])
          .map(
            (edu) => `
        <table style="width: 100%; margin-bottom: 4pt;">
          <tr>
            <td><strong>${sanitize(edu.college)}</strong>${edu.location ? ` &bull; <em>${sanitize(edu.location)}</em>` : ''}</td>
            <td style="text-align: right;">${sanitize(edu.duration || (edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ''))}</td>
          </tr>
          <tr>
            <td>${sanitize(edu.degree)}${edu.cgpa ? ` &bull; <strong>CGPA:</strong> ${sanitize(edu.cgpa)}` : ''}</td>
            <td style="text-align: right;"></td>
          </tr>
        </table>
        ${
          edu.coursework
            ? `<p style="margin: 2pt 0 6pt 0; font-size: 9pt; color: #4B5563;"><strong>Key Coursework:</strong> ${sanitize(edu.coursework)}</p>`
            : ''
        }
      `
          )
          .join('')
      }

      <h2>Technical Skills</h2>
      <table class="skills-table">
        ${resume.skills.languages ? `<tr><td class="skills-label">Languages:</td><td>${sanitize(resume.skills.languages)}</td></tr>` : ''}
        ${resume.skills.frameworks ? `<tr><td class="skills-label">Frameworks &amp; Libs:</td><td>${sanitize(resume.skills.frameworks)}</td></tr>` : ''}
        ${resume.skills.tools ? `<tr><td class="skills-label">Cloud, Tools &amp; DB:</td><td>${sanitize(resume.skills.tools)}</td></tr>` : ''}
      </table>

      ${
        resume.experiences && resume.experiences.length > 0
          ? `
        <h2>Work Experience</h2>
        ${resume.experiences
          .map(
            (exp) => `
          <table style="width: 100%; margin-top: 4pt;">
            <tr>
              <td><strong>${sanitize(exp.role)}</strong> &bull; ${sanitize(exp.company)}</td>
              <td style="text-align: right;">${sanitize(exp.duration)}</td>
            </tr>
            <tr>
              <td style="font-size: 9pt; color: #4B5563;">${sanitize(exp.location)}</td>
              <td></td>
            </tr>
          </table>
          <ul>
            ${exp.bullets.map((b) => `<li>${sanitize(b)}</li>`).join('')}
          </ul>
        `
          )
          .join('')}
      `
          : ''
      }

      ${
        resume.projects && resume.projects.length > 0
          ? `
        <h2>Technical Projects</h2>
        ${resume.projects
          .map(
            (proj) => `
          <table style="width: 100%; margin-top: 4pt;">
            <tr>
              <td><strong>${sanitize(proj.title)}</strong> ${proj.tech ? `| <em>${sanitize(proj.tech)}</em>` : ''}</td>
              <td style="text-align: right; font-size: 9pt;">${sanitize(proj.link)}</td>
            </tr>
          </table>
          <ul>
            ${proj.bullets.map((b) => `<li>${sanitize(b)}</li>`).join('')}
          </ul>
        `
          )
          .join('')}
      `
          : ''
      }
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docHtml], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${resume.fullName.replace(/\s+/g, '_')}_SWE_Resume.doc`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and trigger a high-fidelity printable PDF export
 */
export function exportResumeToPdf(
  previewContainerId: string = 'resume-preview-container',
  resume: ResumeExportData,
  fontFamily: string = 'Inter, sans-serif'
): void {
  const container = document.getElementById(previewContainerId);
  if (!container) {
    window.print();
    return;
  }

  const cleanFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Inter';

  // Create isolated print frame
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.fullName.replace(/\s+/g, '_')}_SWE_Resume</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Merriweather:wght@400;700&family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: letter portrait;
            margin: 0.4in;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: ${fontFamily};
            color: #0F172A;
            background: #FFFFFF;
            font-size: 10.5pt;
            line-height: 1.35;
          }
          .resume-preview-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        </style>
      </head>
      <body>
        ${container.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Trigger print dialog once fonts/images are ready
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 400);
}
