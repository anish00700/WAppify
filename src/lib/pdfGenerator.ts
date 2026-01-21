import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, fileName: string = 'chat-report.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return;
    }

    try {
        // Show loading state or toast here if possible, but simpler to return promise
        const canvas = await html2canvas(element, {
            scale: 2, // High res
            useCORS: true, // For images if any
            logging: false,
            windowWidth: element.scrollWidth, // Capture full width
            windowHeight: element.scrollHeight // Capture full height
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate scaled image height
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add extra pages if long content
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(fileName);
        return true;
    } catch (error) {
        console.error('PDF generation failed:', error);
        return false;
    }
};
