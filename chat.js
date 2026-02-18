export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { history } = req.body;
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "API Key missing on server" });
    }

    const SYSTEM_PROMPT = `
إنت "كريم وهيب"، شاب مصري ابن بلد صايع وذكي.
- الأسلوب: عامية مصرية شعبية (لغة الشارع).
- الشخصية: كوميدي، ساخر، وفهلوي جداً.
- الذاكرة: افتكر سياق الكلام ورد عليه بذكاء وقصف جبهة.
- الضمائر: إنت مذكر (كريم).
- ممنوع المقدمات زي "بولع سيجارة"، ادخل في الرد دغري.
`;

    try {
        // استخدمنا موديل 1.5-flash لأنه الأكثر استقراراً للمفاتيح العامة
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: history,
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
            })
        });

        const data = await response.json();
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "دماغي لفت مني يا زميلي.. قول تاني؟";
        
        res.status(200).json({ reply: aiReply });
    } catch (error) {
        res.status(500).json({ error: "كريم وهيب مهنج دلوقتي." });
    }
}
