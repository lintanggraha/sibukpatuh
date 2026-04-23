export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_KEY tidak dikonfigurasi di server.' });
  }

  const { messages, cveContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Field "messages" diperlukan dan harus berupa array.' });
  }

  // Build system instruction with CVE context - only on first message
  const isFirstMessage = messages.length === 1 || (messages.length === 2 && messages[0].role === 'user' && messages[1].role === 'assistant');
  
  let systemInstruction;
  if (cveContext && isFirstMessage) {
    systemInstruction = `Kamu adalah asisten AI yang helpful dan friendly. Namamu adalah AI Assistant dari SibukPatuh.

Konteks CVE yang sedang dibahas (hanya untuk referensi):
- CVE ID: ${cveContext.id}
- Judul: ${cveContext.title}
- Vendor: ${cveContext.vendor}
- Produk: ${cveContext.product}
- Deskripsi: ${cveContext.shortDescription || ''}

Guidelines:
- Jawab dalam Bahasa Indonesia yang natural dan conversational
- Jika pertanyaan terkait CVE, berikan jawaban yang informatif dan praktisi
- Jika pertanyaan tidak terkait CVE, tetap jawab dengan baik dan ramah
- Jangan memaksa mengarahkan percakapan ke topik CVE jika tidak relevan
- Jawaban boleh singkat tapi tetap helpful`;
  } else {
    systemInstruction = `Kamu adalah asisten AI yang helpful dan friendly dari SibukPatuh. Jawab dalam Bahasa Indonesia yang natural dan conversational.`;
  }

  // Convert messages to Gemini format
  const geminiContents = messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: geminiContents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
      topP: 0.95
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API Error:', response.status, errBody);
      
      let errorMessage = 'Gemini API error';
      try {
        const errData = JSON.parse(errBody);
        if (response.status === 429) {
          errorMessage = 'Limit penggunaan Gemini sudah tercapai (quota habis). Silakan coba lagi besok atau upgrade ke paid plan.';
        } else if (errData?.error?.message) {
          errorMessage = errData.error.message;
        }
      } catch (e) {
        errorMessage = errBody;
      }
      
      return res.status(response.status).json({ error: errorMessage, detail: errBody });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Respons dari Gemini kosong.' });
    }

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Gemini Proxy Error:', error.message);
    return res.status(502).json({ error: 'Gagal menghubungi Gemini API', message: error.message });
  }
}
