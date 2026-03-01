const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service for Natural Language Processing using Google Gemini.
 */
class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is missing from environment variables!');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    // Log status on startup
    this._listAvailableModels();
  }

  async _listAvailableModels() {
    try {
      console.log('AI Service initialized with model: gemini-flash-latest');
    } catch (e) {
      console.error('AI Init Log Error:', e.message);
    }
  }

  /**
   * Robustly extracts JSON from potentially conversational AI responses.
   */
  _extractJson(text) {
    let cleaned = text.trim();
    
    // Strip markdown code blocks
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
    }
    
    // Find the first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(cleaned);
  }

  /**
   * Helper to generate content with fallback and quota handling.
   */
  async _safeGenerateContent(contents, secondaryModel = 'gemini-pro-latest') {
    try {
      const result = await this.model.generateContent(contents);
      return await result.response;
    } catch (error) {
      const errorMsg = error.message.toLowerCase();
      
      // Handle Model Not Found (404)
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        console.warn(`Primary model not found. Falling back to '${secondaryModel}'...`);
        const fallbackModel = this.genAI.getGenerativeModel({ model: secondaryModel });
        const result = await fallbackModel.generateContent(contents);
        return await result.response;
      }
      
      // Handle Quota Exceeded (429)
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        console.error('AI Quota Exceeded (429).');
        throw new Error('AI Limit Reached: You have exceeded the free tier quota for Gemini. Please wait a minute or check your Google AI Studio billing settings.');
      }
      
      throw error;
    }
  }

  /**
   * Extracts structured invoice data from a natural language prompt.
   * @param {string} prompt - The user's natural language input.
   * @returns {Promise<Object>} - The structured invoice data.
   */
  async extractInvoiceData(prompt) {
    const systemInstruction = `
      You are an expert invoice data extractor. 
      Analyze the user's natural language input and extract structured invoice details.
      Return ONLY a valid JSON object in the following format:
      {
        "clientName": "string",
        "clientEmail": "string",
        "items": [
          {
            "name": "string",
            "quantity": number,
            "price": number
          }
        ],
        "tax": number (percentage value, e.g., 18),
        "currency": "string (3-letter code, default INR)",
        "dueDate": "ISO date string or relative description like 'next Friday'"
      }

      Important Rules:
      1. If information is missing, use empty strings or 0.
      2. If multiple items are mentioned, list them all.
      3. For "price", use the unit price.
      4. DO NOT include any text outside the JSON object.
      5. If the input is not related to an invoice, return an error object: {"error": "Invalid input"}.
    `;

    try {
      const response = await this._safeGenerateContent([systemInstruction, prompt]);
      let text = response.text().trim();

      console.log('AI Raw Response:', text);

      // Clean up markdown code blocks if present
      if (text.startsWith('```json')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (text.slice(0, 3) === '```') {
        text = text.replace(/^```/, '').replace(/```$/, '').trim();
      }

      try {
        const data = this._extractJson(text);
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message, 'Text:', text);
        throw new Error('AI returned an invalid response format.');
      }
    } catch (error) {
      console.error('Gemini AI Error:', error.message);
      throw error;
    }
  }

  /**
   * Modifies existing invoice data based on user instructions.
   * @param {Object} currentInvoice - The current invoice JSON data.
   * @param {string} instruction - The user's modification instruction.
   * @returns {Promise<Object>} - The updated invoice data.
   */
  async editInvoiceData(currentInvoice, instruction) {
    const systemInstruction = `
      You are an expert invoice editor.
      Modify the provided invoice JSON strictly according to the user's instructions.
      Return ONLY the updated valid JSON object.
      
      Current Invoice JSON:
      ${JSON.stringify(currentInvoice, null, 2)}

      Important Rules:
      1. ONLY modify the fields mentioned in the instruction.
      2. Keep all other fields exactly as they are.
      3. Ensure the result is a valid JSON object matching the input structure.
      4. DO NOT include any explanatory text or markdown outside the JSON.
      5. If the instruction is unclear or impossible, return the original JSON.
    `;

    try {
      const response = await this._safeGenerateContent([systemInstruction, instruction]);
      let text = response.text().trim();
      
      console.log('AI Edit Raw Response:', text);

      if (text.startsWith('```json')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (text.slice(0, 3) === '```') {
        text = text.replace(/^```/, '').replace(/```$/, '').trim();
      }

      try {
        return this._extractJson(text);
      } catch (parseError) {
        console.error('JSON Parse Error (Edit):', parseError.message, 'Text:', text);
        throw new Error('AI returned an invalid response during editing.');
      }
    } catch (error) {
      console.error('Gemini Edit Error:', error.message);
      throw error;
    }
  }

  /**
   * Generates business insights from a list of invoices.
   * @param {Array} invoices - Selected invoice data (last 20).
   * @returns {Promise<Object>} - The AI generated insights.
   */
  async generateBusinessInsights(invoices) {
    const summaryData = invoices.map(inv => ({
      client: inv.to?.name || 'Unknown',
      amount: inv.total || 0,
      status: inv.status,
      date: inv.issueDate,
      dueDate: inv.dueDate,
      paidAt: inv.paidAt
    }));

    const systemInstruction = `
      You are a strategic business analyst. 
      Analyze the provided invoice data (last 20 invoices) and provide actionable business insights.
      Return ONLY a valid JSON object in the following format:
      {
        "summary": "Short paragraph summarizing overall performance.",
        "topClient": {
          "name": "string",
          "revenue": number
        },
        "trends": "Description of revenue and payment trends.",
        "avgPaymentDelay": "string (e.g. '4 days')",
        "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
      }

      Context Data:
      ${JSON.stringify(summaryData, null, 2)}

      Rules:
      1. Be concise and professional.
      2. Suggestions should be actionable.
      3. Return valid JSON only.
    `;

    try {
      const response = await this._safeGenerateContent([systemInstruction, "Analyze data and provide insights."]);
      let text = response.text().trim();

      console.log('AI Insights Raw Response:', text);

      if (text.startsWith('```json')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (text.slice(0, 3) === '```') {
        text = text.replace(/^```/, '').replace(/```$/, '').trim();
      }

      try {
        return this._extractJson(text);
      } catch (parseError) {
        console.error('JSON Parse Error (Insights):', parseError.message, 'Text:', text);
        throw new Error('AI returned an invalid response during insights generation.');
      }
    } catch (error) {
      console.error('Gemini Insights Error:', error.message);
      throw error;
    }
  }
}

module.exports = new AIService();
