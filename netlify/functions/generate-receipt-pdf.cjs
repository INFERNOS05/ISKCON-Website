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

    let currentY = 60;

    // ISKCON Header
    currentY = addCenteredText('INTERNATIONAL SOCIETY FOR KRISHNA CONSCIOUSNESS (ISKCON)', currentY, 16, 'Helvetica-Bold');
    currentY = addCenteredText('Founder Acharya: His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada', currentY, 10);
    currentY = addCenteredText('(Head Office: Hare Krishna Land, Juhu, Mumbai - 400 049)', currentY, 10);
    currentY += 10;
    currentY = addCenteredText('Branch: 4 Tarapore Road, Next to Dastur Boys School, Pune Maharashtra 411001 Ph: 8686957575', currentY, 10);
    
    currentY += 20;
    currentY = addLine(currentY);
    currentY += 20;

    // Receipt Title
    currentY = addCenteredText('RECEIPT', currentY, 18, 'Helvetica-Bold');
    currentY += 20;

    // Receipt Details
    const leftMargin = 80;
    const rightMargin = doc.page.width - 80;
    const lineHeight = 25;

    doc.font('Helvetica').fontSize(11);

    // Receipt Date
    doc.text('Receipt Date:', leftMargin, currentY);
    doc.text(receiptDate, leftMargin + 100, currentY);
    currentY += lineHeight;

    // Receipt Number
    const receiptNo = donationId ? `DR/API/${donationId}` : `DR/API/${paymentId.slice(-4)}`;
    doc.text('Receipt No:', leftMargin, currentY);
    doc.text(receiptNo, leftMargin + 100, currentY);
    currentY += lineHeight;

    // Donor Name
    doc.text('Received with thanks from:', leftMargin, currentY);
    doc.font('Helvetica-Bold').text(donorName, leftMargin + 160, currentY);
    doc.font('Helvetica');
    currentY += lineHeight;

    // Address
    doc.text('Address:', leftMargin, currentY);
    if (donorAddress) {
      const addressLines = donorAddress.match(/.{1,50}(\s|$)/g) || [donorAddress];
      addressLines.forEach((line, index) => {
        doc.text(line.trim(), leftMargin + 100, currentY + (index * 15));
      });
      currentY += lineHeight + (addressLines.length - 1) * 15;
    } else {
      currentY += lineHeight;
    }

    currentY += 10;

    // PAN Number
    doc.text('Donor PAN No:', leftMargin, currentY);
    doc.text(donorPAN || '', leftMargin + 100, currentY);
    currentY += lineHeight;

    // Amount
    doc.text('Amount:', leftMargin, currentY);
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
    
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

    const amountInWords = numberToWords(Math.floor(amount));
    
    doc.font('Helvetica-Bold').text(`${formattedAmount} (${amountInWords} Only)`, leftMargin + 100, currentY);
    doc.font('Helvetica');
    currentY += lineHeight;

    // Payment Details
    const paymentDate = new Date(timestamp).toLocaleDateString('en-GB');
    doc.text('Mode Of Payment:', leftMargin, currentY);
    doc.text(`ONLINE No. ${paymentId} | Dated: ${paymentDate} | Bank: | Branch:`, leftMargin + 120, currentY);
    currentY += lineHeight;

    // On Account of
    doc.text('On Account of:', leftMargin, currentY);
    doc.font('Helvetica-Bold').text('Donation', leftMargin + 100, currentY);
    doc.font('Helvetica');
    currentY += lineHeight * 3;

    // Footer
    currentY += 100;
    doc.text('Yours in the service of Lord Sri Krishna. ', leftMargin, currentY);
    doc.fillColor('blue').text('Click here to visit iskconpunecamp.com', leftMargin + 280, currentY);
    currentY += lineHeight;

    doc.fillColor('black').fontSize(10).text('Note: This is a computer generated receipt. No signature is required.', leftMargin, currentY);
    currentY += lineHeight;

    // Hare Krishna Mantra
    currentY += 20;
    currentY = addLine(currentY);
    currentY += 10;
    
    doc.fillColor('red').fontSize(12).font('Helvetica-Bold');
    currentY = addCenteredText('Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare', currentY);

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
