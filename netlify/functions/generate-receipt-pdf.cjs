// netlify/functions/generate-receipt-pdf.cjs
const PDFDocument = require('pdfkit');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const {
      donorName,
      amount,
      paymentId,
      donationId,
      donorAddress = '',
      donorPAN = '',
      receiptDate = new Date().toLocaleDateString('en-GB'),
      timestamp = new Date().toISOString()
    } = JSON.parse(event.body);

    if (!donorName || !amount || !paymentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: donorName, amount, paymentId'
        })
      };
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Buffer to store PDF
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    const pdfPromise = new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });

    // Helper function to add centered text
    const addCenteredText = (text, y, fontSize = 12, font = 'Helvetica') => {
      doc.font(font).fontSize(fontSize);
      const textWidth = doc.widthOfString(text);
      const x = (doc.page.width - textWidth) / 2;
      doc.text(text, x, y);
      return y + fontSize + 10;
    };

    // Helper function to add line
    const addLine = (y, margin = 50) => {
      doc.moveTo(margin, y)
         .lineTo(doc.page.width - margin, y)
         .stroke();
      return y + 10;
    };

    let currentY = 30;

    // Add ISKCON Header as single image (logo + text from template)
    try {
      const fs = require('fs');
      const path = require('path');
      const headerImagePath = path.join(__dirname, '../../public/iskcon-header.png');
      
      if (fs.existsSync(headerImagePath)) {
        // Use the header screenshot directly - fits full width with margins
        const headerWidth = doc.page.width - 80; // 40px margin on each side
        doc.image(headerImagePath, 40, currentY, { 
          width: headerWidth,
          fit: [headerWidth, 120] // Max height 120px, maintain aspect ratio
        });
        currentY += 95; // Move down after header image (further reduced)
        console.log('✅ Header image added successfully');
      } else {
        console.warn('⚠️ iskcon-header.png not found in public folder');
        console.warn('Please save the header screenshot as iskcon-header.png in public folder');
        
        // Fallback: show message in PDF
        doc.font('Helvetica').fontSize(12).fillColor('red');
        doc.text('Header image not found. Please add iskcon-header.png to public folder', 40, currentY);
        currentY += 30;
      }
    } catch (headerError) {
      console.error('❌ Header image error:', headerError.message);
      doc.font('Helvetica').fontSize(10).fillColor('black');
      doc.text('Error loading header image', 40, currentY);
      currentY += 30;
    }
    
    currentY += 5; // Minimal gap after header

    // Horizontal line
    doc.moveTo(50, currentY)
       .lineTo(doc.page.width - 50, currentY)
       .stroke();
    currentY += 25;

    // Receipt Title
    doc.font('Helvetica-Bold').fontSize(16);
    headerText = 'RECEIPT';
    textWidth = doc.widthOfString(headerText);
    headerX = (doc.page.width - textWidth) / 2;
    doc.text(headerText, headerX, currentY);
    currentY += 30;

    // Receipt Details - Matching template layout
    const leftMargin = 60;
    const labelColumn = leftMargin;
    const valueColumn = leftMargin + 200;
    const lineHeight = 20;
    const fontSize = 10;

    // Amount in words function
    const numberToWords = (num) => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

      if (num === 0) return 'Zero';
      
      const convertHundreds = (n) => {
        let result = '';
        if (n >= 100) {
          result += ones[Math.floor(n / 100)] + ' Hundred ';
          n %= 100;
        }
        if (n >= 20) {
          result += tens[Math.floor(n / 10)] + ' ';
          n %= 10;
        } else if (n >= 10) {
          result += teens[n - 10] + ' ';
          return result;
        }
        if (n > 0) {
          result += ones[n] + ' ';
        }
        return result;
      };

      let result = '';
      let place = 0;
      
      while (num > 0) {
        if (num % 1000 !== 0) {
          result = convertHundreds(num % 1000) + thousands[place] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        place++;
      }
      
      return result.trim();
    };

    const formattedAmount = 'Rs. ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    const amountInWords = numberToWords(Math.floor(amount));
    const receiptNo = donationId ? `DR/API/${donationId}` : `DR/API/${paymentId.slice(-4)}`;
    const paymentDate = new Date(timestamp).toLocaleDateString('en-GB');

    // Set consistent font for receipt details - labels regular, values bold
    doc.fillColor('black').font('Helvetica').fontSize(fontSize);

    // Receipt Date - label regular, value bold
    doc.font('Helvetica').text('Receipt Date: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(receiptDate);
    currentY += lineHeight;

    // Receipt Number - label regular, value bold
    doc.font('Helvetica').text('Receipt No: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(receiptNo);
    currentY += lineHeight;

    // Donor Name - label regular, value bold
    doc.font('Helvetica').text('Received with thanks from: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(donorName);
    currentY += lineHeight;

    // Address - label regular, value on same line
    doc.font('Helvetica').text('Address:', labelColumn, currentY);
    if (donorAddress) {
      doc.text(' ' + donorAddress, { continued: false });
    }
    currentY += lineHeight;

    currentY += 5;

    // PAN Number - label regular, value on same line
    doc.font('Helvetica').text('Donor PAN No:', labelColumn, currentY);
    currentY += lineHeight;

    // Amount - label regular, value bold
    doc.font('Helvetica').text('Amount: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(`${formattedAmount} (${amountInWords} Only)`);
    currentY += lineHeight;

    // Payment Details - All on one line, label regular, ONLINE and payment details bold
    doc.font('Helvetica').text('Mode Of Payment: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(`ONLINE`, { continued: true });
    doc.font('Helvetica').text(` No: ${paymentId} | Dated: ${paymentDate} | Bank: | Branch:`);
    currentY += lineHeight;

    // On Account of - label regular, value bold
    doc.font('Helvetica').text('On Account of: ', labelColumn, currentY, { continued: true });
    doc.font('Helvetica-Bold').text('Donation');
    currentY += lineHeight * 2;

    // Footer - matching template
    currentY += 80;
    const footerMargin = 60;
    
    // First line: "Yours in the service..." with clickable link on same line
    doc.fillColor('black').fontSize(10).font('Helvetica');
    doc.text('Yours in the service of Lord Sri Krishna. ', footerMargin, currentY, { continued: true });
    doc.fillColor('blue').text('Click here to visit iskconpunecamp.com', {
      link: 'https://www.iskconpunecamp.com/',
      underline: true,
      continued: false
    });
    currentY += 20;

    // Note in italic font
    doc.fillColor('black').fontSize(9).font('Helvetica-Oblique');
    doc.text('Note: This is a computer generated receipt. No signature is required.', footerMargin, currentY);
    currentY += 30;

    // Hare Krishna Mantra - centered, red/maroon, regular font (not bold), smaller size
    doc.fillColor('maroon').fontSize(9).font('Helvetica');
    const mantraText = 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare';
    const mantraWidth = doc.widthOfString(mantraText);
    const mantraX = (doc.page.width - mantraWidth) / 2;
    doc.text(mantraText, mantraX, currentY);
    currentY += 20;

    // Dotted line below mantra
    doc.strokeColor('black')
       .lineWidth(1)
       .dash(5, 5) // 5px dash, 5px gap
       .moveTo(50, currentY)
       .lineTo(doc.page.width - 50, currentY)
       .stroke()
       .undash(); // Reset to solid line for future use

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    const pdfBuffer = await pdfPromise;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ISKCON_Receipt_${receiptNo.replace(/\//g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('PDF generation failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to generate PDF receipt'
      })
    };
  }
};
