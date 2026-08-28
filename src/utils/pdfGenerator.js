import { jsPDF } from 'jspdf';

export const generateInvoicePDF = (invoice) => {
  if (!invoice) {
    console.warn('generateInvoicePDF: No invoice provided');
    return false;
  }

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [79, 70, 229]; // #4f46e5
    const slateDark = [15, 23, 42]; // #0f172a
    const slateMuted = [100, 116, 139]; // #64748b

    // Page borders / Header background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 42, 'F');

    // Header Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('AUCO & AIWA', 16, 18);

    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Industrial Automation & Precision AV Systems', 16, 24);
    doc.text('GSTIN: 27AABCA1234F1Z8 • contact@auco-aiwa.com • +91 20 6789 0000', 16, 30);

    // Invoice Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('TAX INVOICE', 194, 18, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${invoice.invoiceNumber || 'INV-000'}`, 194, 25, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${(invoice.paymentStatus || 'SENT').toUpperCase()}`, 194, 30, { align: 'right' });

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(16, 42, 194, 42);

    // Info Section: Bill To & Invoice Meta
    let startY = 52;

    // Bill To Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('BILLED TO (BUYER):', 16, startY);

    doc.setFontSize(11);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(invoice.companyName || invoice.clientName || 'Client Company', 16, startY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`Attn: ${invoice.contactPerson || invoice.clientName || 'Authorized Signatory'}`, 16, startY + 11);
    
    // Wrap address
    const splitAddress = doc.splitTextToSize(invoice.billingAddress || 'Maharashtra, India', 85);
    doc.text(splitAddress, 16, startY + 16);
    doc.text(`Phone: ${invoice.phone || '—'}  |  Email: ${invoice.email || '—'}`, 16, startY + 16 + (splitAddress.length * 4));

    // Invoice Details Box (Right column)
    const metaX = 130;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('INVOICE DETAILS:', metaX, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

    doc.text('Invoice Date:', metaX, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.issueDate || '—', 194, startY + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Due Date:', metaX, startY + 12);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.paymentDueDate || '—', 194, startY + 12, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Payment Terms:', metaX, startY + 18);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.paymentTerms || 'Net 30', 194, startY + 18, { align: 'right' });

    if (invoice.orderId) {
      doc.setFont('helvetica', 'normal');
      doc.text('Order Reference:', metaX, startY + 24);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.orderId, 194, startY + 24, { align: 'right' });
    }

    // Table Header
    const tableStartY = 88;
    doc.setFillColor(241, 245, 249);
    doc.rect(16, tableStartY, 178, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(16, tableStartY, 178, 8, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('#', 19, tableStartY + 5.5);
    doc.text('PRODUCT CODE', 28, tableStartY + 5.5);
    doc.text('DESCRIPTION / SERVICE', 62, tableStartY + 5.5);
    doc.text('QTY', 125, tableStartY + 5.5, { align: 'right' });
    doc.text('PRICE (INR)', 155, tableStartY + 5.5, { align: 'right' });
    doc.text('TOTAL (INR)', 190, tableStartY + 5.5, { align: 'right' });

    // Table Rows
    let itemY = tableStartY + 14;
    const items = invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 ? invoice.items : [
      { productCode: 'AUC-101', name: 'Industrial Controller & Hardware Package', quantity: 1, price: invoice.subtotal || invoice.totalAmount || 0, total: invoice.subtotal || invoice.totalAmount || 0 }
    ];

    items.forEach((item, index) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

      doc.text(String(index + 1), 19, itemY);
      doc.setFont('helvetica', 'bold');
      doc.text(item.productCode || '—', 28, itemY);

      doc.setFont('helvetica', 'normal');
      const splitName = doc.splitTextToSize(item.name || 'Product Item', 58);
      doc.text(splitName, 62, itemY);

      doc.text(String(item.quantity || 1), 125, itemY, { align: 'right' });
      doc.text(Number(item.price || 0).toLocaleString('en-IN'), 155, itemY, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(Number(item.total || ((item.price || 0) * (item.quantity || 1))).toLocaleString('en-IN'), 190, itemY, { align: 'right' });

      itemY += Math.max(8, splitName.length * 5 + 3);

      doc.setDrawColor(241, 245, 249);
      doc.line(16, itemY - 2, 194, itemY - 2);
    });

    // Summary / Totals Section
    const summaryY = itemY + 8;
    const sumLabelX = 130;
    const sumValX = 190;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

    doc.text('Subtotal (Excl. Tax):', sumLabelX, summaryY);
    doc.text(`INR ${Number(invoice.subtotal || 0).toLocaleString('en-IN')}`, sumValX, summaryY, { align: 'right' });

    const taxVal = invoice.taxAmount || Math.round(Number(invoice.subtotal || 0) * 0.18);
    doc.text(`GST @ 18% (CGST 9% + SGST 9%):`, sumLabelX, summaryY + 6);
    doc.text(`INR ${taxVal.toLocaleString('en-IN')}`, sumValX, summaryY + 6, { align: 'right' });

    // Grand Total Box
    doc.setFillColor(79, 70, 229);
    doc.rect(sumLabelX - 4, summaryY + 10, 68, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Total Invoice Value:', sumLabelX, summaryY + 16.5);
    doc.text(`INR ${Number(invoice.totalAmount || 0).toLocaleString('en-IN')}`, sumValX, summaryY + 16.5, { align: 'right' });

    // Amount Paid & Balance Due
    doc.setFontSize(8.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Amount Paid:', sumLabelX, summaryY + 25);
    doc.text(`INR ${Number(invoice.amountPaid || 0).toLocaleString('en-IN')}`, sumValX, summaryY + 25, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(invoice.balance > 0 ? 185 : 4, invoice.balance > 0 ? 28 : 120, invoice.balance > 0 ? 28 : 87);
    doc.text('Balance Due / Outstanding:', sumLabelX, summaryY + 31);
    doc.text(`INR ${Number(invoice.balance || 0).toLocaleString('en-IN')}`, sumValX, summaryY + 31, { align: 'right' });

    // Payment Instructions (Left side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('BANK TRANSFER / PAYMENT DETAILS:', 16, summaryY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('Bank Name: HDFC Bank Ltd', 16, summaryY + 5);
    doc.text('Account Name: Auco & Aiwa Technologies Pvt Ltd', 16, summaryY + 10);
    doc.text('Account Number: 50200084920192', 16, summaryY + 15);
    doc.text('IFSC Code: HDFC0000182  |  Branch: Shivaji Nagar, Pune', 16, summaryY + 20);
    doc.text('UPI ID: aucoaiwa@hdfcbank', 16, summaryY + 25);

    // Footer & Authorized Signatory
    const footerY = 265;
    doc.setDrawColor(226, 232, 240);
    doc.line(16, footerY, 194, footerY);

    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('This is a computer-generated tax invoice verified under the Indian GST regime.', 16, footerY + 6);
    doc.text('Terms: Goods once sold are subject to manufacturer warranty. Interest @18% p.a. charged on overdue amounts.', 16, footerY + 10);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('For AUCO & AIWA TECHNOLOGIES PVT LTD', 194, footerY + 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', 194, footerY + 18, { align: 'right' });

    // Save the PDF
    doc.save(`${invoice.invoiceNumber || 'Invoice'}_Auco_Aiwa.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Generation failed, falling back to print:', err);
    window.print();
    return false;
  }
};

export const generateDeliveryChallanPDF = (dispatch) => {
  if (!dispatch) {
    console.warn('generateDeliveryChallanPDF: No dispatch provided');
    return false;
  }

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [79, 70, 229]; // #4f46e5 Indigo
    const slateDark = [15, 23, 42]; // #0f172a
    const slateMuted = [100, 116, 139]; // #64748b

    // Header Background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 44, 'F');

    // Header Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('AUCO & AIWA', 16, 18);

    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Industrial Automation & Precision AV Systems', 16, 24);
    doc.text('GSTIN: 27AABCA1234F1Z8 • MIDC Industrial Estate, Pune, Maharashtra - 411026', 16, 30);
    doc.text('Dispatch Ops: logistics@auco-aiwa.com • +91 20 6789 0044', 16, 35);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('DELIVERY CHALLAN', 194, 18, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('(Rule 55 - CGST Rules, 2017)', 194, 23, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${dispatch.challanNumber || dispatch.id || 'DC-2026-000'}`, 194, 29, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${(dispatch.dispatchStatus || 'IN TRANSIT').toUpperCase()}`, 194, 34, { align: 'right' });

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(16, 44, 194, 44);

    // Section 1: Consignee (Left) & Dispatch Logistics (Right)
    let startY = 52;

    // Consignee / Ship To Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('CONSIGNEE (DELIVERY ADDRESS):', 16, startY);

    doc.setFontSize(11);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(dispatch.companyName || dispatch.clientName || 'Client Company', 16, startY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`Attn / Contact: ${dispatch.contactPerson || dispatch.clientName || 'Store Incharge'}`, 16, startY + 11);

    const splitAddress = doc.splitTextToSize(dispatch.shippingAddress || 'Client Facility Address, India', 85);
    doc.text(splitAddress, 16, startY + 16);
    doc.text(`Phone: ${dispatch.phone || '—'}  |  Email: ${dispatch.email || '—'}`, 16, startY + 16 + (splitAddress.length * 4));

    // Logistics & Dispatch Meta Box (Right)
    const metaX = 120;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('TRANSPORT & SHIPMENT DETAILS:', metaX, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

    doc.text('Dispatch Date:', metaX, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(dispatch.dispatchDate || '—', 194, startY + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Carrier / Transporter:', metaX, startY + 11);
    doc.setFont('helvetica', 'bold');
    doc.text(dispatch.courierCarrier || 'BlueDart Express', 194, startY + 11, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('AWB / Docket #:', metaX, startY + 16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(dispatch.trackingNumber || 'BLU-8829103', 194, startY + 16, { align: 'right' });

    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('E-Way Bill #:', metaX, startY + 21);
    doc.setFont('helvetica', 'bold');
    doc.text(dispatch.ewayBillNumber || '2410-9876-5432', 194, startY + 21, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Order Ref #:', metaX, startY + 26);
    doc.setFont('helvetica', 'bold');
    doc.text(dispatch.orderId || '—', 194, startY + 26, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Est. Delivery Date:', metaX, startY + 31);
    doc.setFont('helvetica', 'bold');
    doc.text(dispatch.estimatedDelivery || '—', 194, startY + 31, { align: 'right' });

    // Package details banner
    const pkgY = startY + 40;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(16, pkgY, 178, 10, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(16, pkgY, 178, 10, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`Total Packages: ${dispatch.packageCount || '1 Carton'}`, 22, pkgY + 6.5);
    doc.text(`Gross Weight: ${dispatch.packageWeight || '4.5 kg'}`, 80, pkgY + 6.5);
    doc.text(`Dispatched By: ${dispatch.dispatchedBy || dispatch.assignedTechnician || 'Warehouse Dispatch Desk'}`, 130, pkgY + 6.5);

    // Items Table
    const tableStartY = pkgY + 16;
    doc.setFillColor(241, 245, 249);
    doc.rect(16, tableStartY, 178, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(16, tableStartY, 178, 8, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('#', 19, tableStartY + 5.5);
    doc.text('PRODUCT CODE', 28, tableStartY + 5.5);
    doc.text('ITEM DESCRIPTION / HARDWARE SPEC', 62, tableStartY + 5.5);
    doc.text('QTY', 150, tableStartY + 5.5, { align: 'right' });
    doc.text('PURPOSE OF SUPPLY', 190, tableStartY + 5.5, { align: 'right' });

    // Table Rows
    let itemY = tableStartY + 14;
    const items = dispatch.items && Array.isArray(dispatch.items) && dispatch.items.length > 0 ? dispatch.items : [
      { productCode: 'AUC-101', name: 'Industrial Controller Hardware Package', quantity: 1 }
    ];

    items.forEach((item, index) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

      doc.text(String(index + 1), 19, itemY);
      doc.setFont('helvetica', 'bold');
      doc.text(item.productCode || '—', 28, itemY);

      doc.setFont('helvetica', 'normal');
      const splitName = doc.splitTextToSize(item.name || 'Equipment Unit', 80);
      doc.text(splitName, 62, itemY);

      doc.setFont('helvetica', 'bold');
      doc.text(`${item.quantity || 1} Nos`, 150, itemY, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text('Supply vs Order', 190, itemY, { align: 'right' });

      itemY += Math.max(8, splitName.length * 5 + 3);

      doc.setDrawColor(241, 245, 249);
      doc.line(16, itemY - 2, 194, itemY - 2);
    });

    // Special Instructions & Notes
    const notesY = itemY + 6;
    doc.setFillColor(254, 252, 232); // amber-50
    doc.roundedRect(16, notesY, 178, 16, 2, 2, 'F');
    doc.setDrawColor(254, 240, 138); // amber-200
    doc.roundedRect(16, notesY, 178, 16, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text('SPECIAL HANDLING / DISPATCH INSTRUCTIONS:', 22, notesY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(146, 64, 14);
    const splitNotes = doc.splitTextToSize(dispatch.notes || 'Precision electronics. Handle with extreme care. Keep upright and protect against moisture during transit.', 166);
    doc.text(splitNotes, 22, notesY + 10.5);

    // Terms & Conditions of Movement
    const termsY = notesY + 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('DISPATCH TERMS & ACKNOWLEDGEMENT OF RECEIPT:', 16, termsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('1. Goods mentioned above are dispatched for delivery against customer order reference.', 16, termsY + 4.5);
    doc.text('2. The consignee must inspect all packaging seals, carton counts, and test certificates before endorsing the challan.', 16, termsY + 8.5);
    doc.text('3. Any transit discrepancies must be recorded on the carrier receipt and reported within 24 hours.', 16, termsY + 12.5);

    // Signatures Section (Dual sign-off)
    const signY = 248;
    doc.setDrawColor(226, 232, 240);
    doc.line(16, signY, 194, signY);

    // Left Signature: Consignee Receiver
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('Received above materials in sound and complete condition:', 16, signY + 6);
    doc.setDrawColor(203, 213, 225);
    doc.line(16, signY + 22, 85, signY + 22);
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text("Receiver's Signature, Seal & Date", 16, signY + 26);

    // Right Signature: Auco & Aiwa Authorized Signatory
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('For AUCO & AIWA TECHNOLOGIES PVT LTD', 194, signY + 6, { align: 'right' });
    doc.line(125, signY + 22, 194, signY + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('Authorized Dispatch / Logistics Officer', 194, signY + 26, { align: 'right' });

    // Footer note
    doc.setFontSize(7);
    doc.text('Computer-generated Delivery Challan & Dispatch Manifest • Valid without physical seal when verified electronically.', 105, 286, { align: 'center' });

    // Save the PDF
    doc.save(`${dispatch.challanNumber || dispatch.id || 'Delivery_Challan'}_Auco_Aiwa.pdf`);
    return true;
  } catch (err) {
    console.error('Delivery Challan PDF Generation failed:', err);
    window.print();
    return false;
  }
};
