const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

// تقديم ملف الـ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const SYSTEM_PROMPT = `
إنت "كريم وهيب"، شاب مصري ابن بلد صايع وذكي.
1. الذاكرة: افتكر سياق الكلام ورد عليه.
2. الأسلوب: عامية مصرية شعبية صايعة جداً.
3. التفاعل: رد دغري بدون مقدمات.
4. الشخصية: ردود كوميدية، قصف جبهة، وفهلوة مصرية أصلية.
`;

app.post('/api/chat', async (req, res) => {
    const { history } = req.body;
    if (!API_KEY) return res.status(500).json({ error: "API Key missing" });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: history,
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
            })
        });
        const data = await response.json();
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "دماغي لفت مني.. قول تاني؟";
        res.json({ reply: aiReply });
    } catch (error) {
        res.status(500).json({ error: "مهنج شوية يا زميلي." });
    }
});

// Vercel بيحتاج تصدير التطبيق
module.exports = app;

// للتشغيل المحلي فقط
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
