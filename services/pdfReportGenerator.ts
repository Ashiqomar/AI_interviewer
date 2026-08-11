import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PerformanceReportData {
  candidateName?: string;
  targetRole: string;
  interviewType: string;
  overallScore: number;
  date: string;
  summary: string;
  categoryBreakdown: {
    technicalAccuracy: number;
    communicationClarity: number;
    problemSolving: number;
    starAlignment: number;
  };
  speechStats?: {
    wpm: number;
    fillerCount: number;
    confidenceScore: number;
  };
  questionsAndAnswers: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
    keyImprovement?: string;
  }>;
  strengths: string[];
  recommendations: string[];
}

export async function generateInterviewPDFReport(elementId: string, filename: string = 'InterviewIQ_Diagnostic_Report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#020617' // Slate-950 dark background matching dark theme
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
}
