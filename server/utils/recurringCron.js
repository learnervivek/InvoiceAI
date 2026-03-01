const cron = require('node-cron');
const { processRecurringInvoices } = require('../services/recurringService');

// ─── Recurring Invoice Cron Job ───────────────────────────────────────────────
// Runs daily at midnight to process recurring invoices.

let task = null;

/**
 * Start the recurring invoice cron job.
 * Schedule: Every day at 00:05 AM (gives buffer after midnight).
 */
const startRecurringCron = () => {
  task = cron.schedule('5 0 * * *', async () => {
    console.log('[Recurring Cron] Running daily check...');
    const startTime = Date.now();

    try {
      const result = await processRecurringInvoices();
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(
        `[Recurring Cron] Completed in ${duration}s — ` +
        `${result.processed} generated, ${result.errors} failed.`
      );
    } catch (error) {
      console.error('[Recurring Cron] Fatal error:', error.message);
    }
  });

  console.log('[Recurring Cron] Scheduled — runs daily at 00:05 AM.');
};

/**
 * Stop the recurring invoice cron job.
 */
const stopRecurringCron = () => {
  if (task) {
    task.stop();
    task = null;
    console.log('[Recurring Cron] Stopped.');
  }
};

module.exports = { startRecurringCron, stopRecurringCron };
