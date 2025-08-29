'use client';



import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// NOTE: You need to install jspdf and html2canvas
// npm install jspdf html2canvas

const PdfExportButton = () => {
  const handleExport = () => {
    const input = document.getElementById('calendar-to-print');
    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('calendar.pdf');
        });
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Export to PDF
    </button>
  );
};

export default PdfExportButton;