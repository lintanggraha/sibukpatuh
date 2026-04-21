export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY tidak dikonfigurasi di server.' });
  }

  const { messages, cveContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Field "messages" diperlukan dan harus berupa array.' });
  }

  // Build system instruction with CVE context
  const systemInstruction = cveContext
    ? `Kamu adalah CVE AI Analyst — asisten intelijen keamanan siber berbahasa Indonesia yang berspesialisasi dalam analisis kerentanan (CVE).

Konteks CVE aktif saat ini:
- ID: ${cveContext.id}
- Nama: ${cveContext.title}
- Vendor: ${cveContext.vendor}
- Produk: ${cveContext.product}
- Deskripsi: ${cveContext.shortDescription || ''}
- Tindakan yang Diperlukan: ${cveContext.requiredAction || ''}
- Terkait Ransomware: ${cveContext.isRansomware ? 'Ya' : 'Tidak'}

Selalu jawab dalam Bahasa Indonesia yang profesional, terstruktur, dan mudah dipahami oleh praktisi keamanan. Fokus pada dampak praktis, mitigasi, dan relevansi terhadap regulasi Indonesia (SEOJK, PBI, BSSN, dll). Jawaban harus ringkas namun informatif. Jika pengguna mengirim pesan yang tidak berkaitan dengan CVE atau keamanan siber, tetap jawab dengan ramah dan arahkan kembali ke konteks analisis.`
    : `Kamu adalah CVE AI Analyst — asisten intelijen keamanan siber berbahasa Indonesia dari platform SibukPatuh. Jawab semua pertanyaan dalam Bahasa Indonesia yang profesional.`;

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
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API Error:', response.status, errBody);
      return res.status(response.status).json({ error: 'Gemini API error', detail: errBody });
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
