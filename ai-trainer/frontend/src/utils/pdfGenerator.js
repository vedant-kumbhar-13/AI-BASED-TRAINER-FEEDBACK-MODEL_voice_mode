// PDF report generator — uses html2canvas to capture ReportTemplate div, then jsPDF for multi-page output

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * generateInterviewPDF — captures the hidden #interview-report-pdf element and saves as PDF.
 *
 * @param {string} candidateName — used in filename (special chars replaced with _)
 * @param {string} sessionDate   — used in filename (e.g. '2026-03-20')
 */
export async function generateInterviewPDF(
  candidateName = 'Candidate',
  sessionDate   = new Date().toISOString().split('T')[0]
) {
  // 1. Locate the hidden report element
  const el = document.getElementById('interview-report-pdf');
  if (!el) {
    console.error('[pdfGenerator] Element #interview-report-pdf not found. Make sure <ReportTemplate> is rendered.');
    return;
  }

  // 2. Reveal the element so html2canvas can render it
  el.style.display = 'block';

  try {
    // 3. Capture at 2× resolution for crisp PDF text
    const canvas = await html2canvas(el, {
      scale:           2,
      useCORS:         true,
      backgroundColor: '#ffffff',
      logging:         false,
    });

    // 4. Hide again immediately after capture
    el.style.display = 'none';

    // 5. Create A4 portrait PDF
    const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW    = pdf.internal.pageSize.getWidth();   // 210mm
    const pageH    = pdf.internal.pageSize.getHeight();  // 297mm

    const imgData  = canvas.toDataURL('image/png');
    const imgH     = (canvas.height * pageW) / canvas.width; // scaled height in mm

    // 6. First page
    pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH);

    // 7. Additional pages if content overflows
    let heightLeft = imgH - pageH;
    let offset     = -pageH;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, offset, pageW, imgH);
      offset     -= pageH;
      heightLeft -= pageH;
    }

    // 8. Save with sanitised filename
    const safeName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Interview_Report_${safeName}_${sessionDate}.pdf`);

  } catch (err) {
    // Ensure the element is hidden even on error
    el.style.display = 'none';
    console.error('[pdfGenerator] PDF generation failed:', err);
    throw err;
  }
}
