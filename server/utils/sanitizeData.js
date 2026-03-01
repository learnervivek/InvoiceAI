/**
 * Remove empty string dates to prevent Mongoose CastError.
 * Mongoose cannot cast "" to a Date type.
 */
const sanitizeDates = (data) => {
  if (data.issueDate === '') delete data.issueDate;
  if (data.dueDate === '') delete data.dueDate;
  return data;
};

/**
 * Prevent overwriting an existing invoice number with a blank value.
 */
const sanitizeInvoiceNumber = (data) => {
  if (!data.invoiceNumber || data.invoiceNumber.trim() === '') {
    delete data.invoiceNumber;
  }
  return data;
};

module.exports = { sanitizeDates, sanitizeInvoiceNumber };
