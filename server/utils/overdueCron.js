const cron = require('node-cron');
const invoiceRepository = require('../repositories/invoiceRepository');
const User = require('../models/User');

// ─── Overdue Invoice Cron Job ────────────────────────────────────────────────
// Runs daily to mark invoices as overdue if they are past their due date.

let task = null;

/**
 * Check for overdue invoices and mark them.
 */
const checkOverdueInvoices = async () => {
  console.log('[Overdue Cron] Running daily check...');
  const startTime = Date.now();

  try {
    const overdueInvoices = await invoiceRepository.findOverdueInvoices();

    if (overdueInvoices.length === 0) {
      console.log('[Overdue Cron] No new overdue invoices found.');
      return;
    }

    const ids = overdueInvoices.map((inv) => inv._id);
    const result = await invoiceRepository.bulkMarkOverdue(ids);

    console.log(`[Overdue Cron] Marked ${result.modifiedCount} invoice(s) as overdue.`);

    // ── Optional: Automated Reminders ────────────────────────────────────────
    if (process.env.AUTO_SEND_OVERDUE_REMINDERS === 'true') {
      const { buildOverdueEmailBody, sendInvoiceEmail } = require('../services/emailService');
      const { createPaymentLink } = require('../services/paymentService');
      const { generatePDF } = require('../services/invoiceService');

      for (const invoice of overdueInvoices) {
        try {
          const user = await User.findById(invoice.userId);
          if (!user || !user.refreshToken) continue;

          // 1. Generate Payment Link
          let paymentLink = null;
          try {
            paymentLink = await createPaymentLink(invoice._id, user._id);
          } catch (pe) {
            console.error(`[Overdue Cron] Payment link fail for ${invoice._id}:`, pe.message);
          }

          // 2. We need a PDF for the attachment
          const pdfResult = await generatePDF(invoice.toObject(), {
            userId: user._id,
            invoiceId: invoice._id,
          });

          if (!pdfResult.success) continue;

          // 3. Send Email
          const filename = `invoice-${invoice.invoiceNumber || invoice._id}.pdf`;
          
          // Re-use sendInvoiceEmail but with overdue specific template
          // We'll need to modify sendInvoiceEmail slightly or pass a specific template builder
          // Since we already modified sendInvoiceEmail to accept paymentLink, 
          // we can add a 'template' or 'isOverdue' option.
          
          await sendInvoiceEmail(user._id, user.refreshToken, {
            invoice: invoice.toObject(),
            pdfBuffer: pdfResult.pdfBuffer,
            filename,
            paymentLink,
            subject: `REMINDER: Invoice #${invoice.invoiceNumber} is Overdue`,
            isOverdue: true, // We'll handle this in emailService
          });

          console.log(`[Overdue Cron] Sent reminder for invoice ${invoice.invoiceNumber} to ${invoice.to.email}`);
        } catch (err) {
          console.error(`[Overdue Cron] Failed to send reminder for ${invoice._id}:`, err.message);
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Overdue Cron] Cycle completed in ${duration}s.`);
  } catch (error) {
    console.error('[Overdue Cron] Error:', error.message);
  }
};

/**
 * Start the daily overdue cron job.
 * Schedule: Every day at 00:01 AM.
 */
const startOverdueCron = () => {
  // Run once immediately on startup to catch any missed while server was down
  checkOverdueInvoices();

  task = cron.schedule('1 0 * * *', checkOverdueInvoices);

  console.log('[Overdue Cron] Scheduled — runs daily at 00:01 AM.');
};

/**
 * Stop the overdue cron job.
 */
const stopOverdueCron = () => {
  if (task) {
    task.stop();
    task = null;
    console.log('[Overdue Cron] Stopped.');
  }
};

module.exports = { startOverdueCron, stopOverdueCron, checkOverdueInvoices };
