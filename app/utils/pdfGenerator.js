import jsPDF from 'jspdf';

export const generatePDF = async (formData) => {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const maxWidth = pageWidth - (margin * 2);

  // Professional Color Palette
  const colors = {
    primary: [26, 35, 126],    // Deep Navy
    secondary: [63, 81, 181],  // Royal Blue
    accent: [0, 121, 107],     // Dark Teal
    border: [210, 214, 220],
    lightBg: [245, 247, 251],
    textDark: [15, 23, 42]
  };

  // Image Loading Logic
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const logoImage = await loadImage('/cm.png');
  // HR Digital Signature - Rani Shreya (Auto included)
  const hrSignature = await loadImage('/hrs-ign.jpeg');

  // --- MODIFIED PREMIUM HEADER ---
  const addHeader = () => {
    // 1. Full Header Background Block
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 52, 'F');

    // 2. Decorative Bottom Accent Line for Header
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(0, 52, pageWidth, 2, 'F');

    // 3. Logo Placement (with a subtle white glass background to pop)
    if (logoImage) {
      doc.setFillColor(255, 255, 255, 0.15);
      doc.roundedRect(margin - 2, 10, 32, 32, 3, 3, 'F');
      doc.addImage(logoImage, 'PNG', margin, 12, 28, 28);
    }

    const infoX = margin + 35;
    // 4. Company Name (White Text)
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', infoX, 20);
    
    // 5. Address Details (White Text with slightly smaller font)
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('1st Floor, Siyaram Mansion, Opp. Telephone Exchange', infoX, 27);
    doc.text('Near P&M Mall, Khurji, Patna, Bihar – 800010', infoX, 32);
    
    // 6. Contact Information Bar (Subtle White Highlight)
    doc.setFont('helvetica', 'bold');
    doc.text('PH: +91 9973725719  |  WEB: www.creatorsmind.co.in', infoX, 40);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GSTIN: 10AAJCV6337M1Z2  |  EMAIL: hr@creatorsmind.co.in', infoX, 46);

    return 65; // Next Y Position
  };

  // Draw Page Border
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  let yPosition = addHeader();

  // --- REST OF THE CONTENT ---
  
  // Document Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('OFFER LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Ref & Date
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(`REF: OFF/VC/${new Date().getFullYear()}/${formData.name.substring(0, 3).toUpperCase()}`, margin, yPosition);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 35, yPosition);
  yPosition += 12;

  // Candidate Info Box
  doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2]);
  doc.roundedRect(margin, yPosition, maxWidth, 28, 2, 2, 'F');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('TO,', margin + 5, yPosition + 7);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(formData.name.toUpperCase(), margin + 5, yPosition + 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.designation} | ${formData.department}`, margin + 5, yPosition + 21);
  yPosition += 40;

  // Body Text
  doc.setFont('helvetica', 'bold');
  doc.text('Subject: Letter of Offer for Employment', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Dear ${formData.name},`, margin, yPosition);
  yPosition += 7;

  const intro = `Following our recent discussions, we are pleased to offer you a full-time position at VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD. We are confident that your expertise will be a significant asset to our digital growth and creative excellence.`;
  const splitIntro = doc.splitTextToSize(intro, maxWidth);
  doc.text(splitIntro, margin, yPosition);
  yPosition += (splitIntro.length * 6) + 10;

  // Terms Table
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, yPosition, maxWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('REMUNERATION & KEY TERMS', margin + 5, yPosition + 5.5);
  yPosition += 15;

  const terms = [
    ['Date of Joining', formData.joiningDate],
    ['Annual CTC', `Rs. ${formData.ctc} /-`],
    ['Designation', formData.designation],
    ['Work Location', formData.workLocation],
    ['Probation', formData.probationPeriod || '3 Months'],
    ['Notice Period', formData.noticePeriod || '1 Month'], 
    ['Working Hours', '10:00 AM - 07:00 PM'],
    ['Working Days', 'Tuesday to Sunday']
  ];

  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  terms.forEach((term, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + (col * (maxWidth / 2));
    const y = yPosition + (row * 9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${term[0]}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${term[1]}`, x + 35, y);
  });

  yPosition += 45;

  // ==============================================
  // DIGITAL SIGNATURE SECTION - RANI SHREYA (HR)
  // ==============================================
  doc.setFont('helvetica', 'bold');
  doc.text('For VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD.', margin, yPosition);
  
  // Digital Signature of Rani Shreya (HR Department)
  if (hrSignature) {
    doc.addImage(hrSignature, 'PNG', margin + 5, yPosition + 2, 50, 20);
  } else {
    // Fallback text signature if image not available
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    // doc.text('Rani Shreya', margin + 5, yPosition + 12);
    // doc.setFont('helvetica', 'normal');
    // doc.setFontSize(9);
    // doc.text('(Digitally Signed)', margin + 5, yPosition + 18);
  }
  
  yPosition += 28; 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Rani Shreya', margin, yPosition);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('HR Manager - Human Resources Department', margin, yPosition + 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('(Digitally Authorized Signature)', margin, yPosition + 10);

  // Acceptance Box for Candidate
  yPosition += 22;
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPosition, maxWidth, 30, 'F');
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(margin, yPosition, maxWidth, 30, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text('DECLARATION & ACCEPTANCE', margin + 5, yPosition + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('I accept the above offer and agree to the terms and conditions.', margin + 5, yPosition + 14);

  doc.line(margin + 5, yPosition + 23, margin + 60, yPosition + 23);
  doc.text('Candidate Signature & Date', margin + 5, yPosition + 27);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('VATS CREATIVE DIGITAL SOLUTIONS PVT. LTD. | Confidential', pageWidth / 2, pageHeight - 10, { align: 'center' });

  doc.save(`Offer_Letter_${formData.name.replace(/\s+/g, '_')}.pdf`);
};