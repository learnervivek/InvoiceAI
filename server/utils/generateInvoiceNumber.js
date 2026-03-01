/**
 * Generate a professional invoice number in the format INV-YYYYMMDD-XXXX.
 * @returns {string}
 */
const generateInvoiceNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomId = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${randomId}`;
};

module.exports = generateInvoiceNumber;
