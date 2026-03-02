const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pdfParse = require('pdf-parse');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
console.log("API Key present:", !!process.env.GEMINI_API_KEY);
console.log("API Key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = multer({ storage: multer.memoryStorage() });

// Extract PDF text route
app.post('/api/parse-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF uploaded' });
        }
        const data = await pdfParse(req.file.buffer);
        res.json({ text: data.text });
    } catch (error) {
        console.error("PDF Parse Error:", error);
        res.status(500).json({ error: `Parsing error: ${error.message || error}` });
    }
});

// Mock Data for Fallback
const mockQuestions = [
    "Tell me about a challenging project you worked on.",
    "How do you handle tight deadlines?",
    "Describe a time you had a conflict with a team member.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?"
];

// Mock AI Response for Interview (Fallback)
const getMockResponse = () => {
    const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
    return {
        feedback: "I am currently running in offline mode (API Key missing or invalid). Here is a general behavioral question.",
        score: 5,
        nextQuestion: randomQuestion,
        strengths: ["N/A"],
        weaknesses: ["Offline Mode"]
    };
};

app.post('/api/interview', async (req, res) => {
    const { question, answer, history, role = "Frontend Developer" } = req.body;

    console.log(`Received answer for role: ${role}`, answer);

    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using mock response.");
        return res.json(getMockResponse());
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0
            }
        });

        const prompt = `
        You are an expert technical interviewer for a ${role} role.
        
        Context:
        - The user just answered the previous question: "${question || 'Introduction'}"
        - User's Answer: "${answer}"
        - Previous History: ${JSON.stringify(history)}

        Task:
        1. Evaluate the user's answer. Give a score out of 10.
        2. Provide constructive feedback (strengths and weaknesses).
        3. Ask the NEXT technical question relevant to ${role}.
        
        Output JSON format ONLY:
        {
            "feedback": "string",
            "score": number,
            "nextQuestion": "string",
            "strengths": ["string"],
            "weaknesses": ["string"]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON string if necessary (remove markdown code blocks)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        res.json(data);

    } catch (error) {
        console.error("Error calling Gemini API:", error);

        let feedbackMessage = "I am currently experiencing high traffic and hit an API rate limit. Please wait a moment.";
        if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
            feedbackMessage = "API Rate Limit Exceeded. You have made too many requests. Please wait a minute or try again tomorrow.";
        }

        res.json({
            feedback: feedbackMessage,
            score: 0,
            nextQuestion: "Let's pause. Please try answering again in a minute when the server API limits refresh.",
            strengths: ["N/A"],
            weaknesses: ["API Offline/Rate Limited"]
        });
    }
});

// Mock AI Response for Resume Review
app.post('/api/resume', async (req, res) => {
    const { resumeText } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using mock response.");
        return res.json({
            score: 85,
            summary: "Strong resume with good technical skills (Mock Response - API Key missing).",
            improvements: [
                "Quantify your achievements (e.g., 'Improved performance by 20%')",
                "Add a link to your portfolio",
                "Check for minor typos in the Experience section"
            ]
        });
    }

    try {
        // Use gemini-1.5-flash-001 which is the specific version
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0
            }
        });

        const prompt = `
        You are an expert technical recruiter and resume reviewer. 
        Analyze the following resume content:
        "${resumeText}"

        Task:
        1. Evaluate the resume based on clarity, impact, technical depth, and formatting (implied). Give a score out of 100.
        2. Write a concise summary of the candidate's profile.
        3. Provide 3-5 specific, actionable improvements to make the resume stand out.

        Output JSON format ONLY:
        {
            "score": number,
            "summary": "string",
            "improvements": ["string", "string", ...]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON extraction
        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(jsonStr);

        res.json(data);

    } catch (error) {
        console.error("Error calling Gemini API for resume:", error);

        let errorMessage = error.message;
        if (errorMessage.includes("429") || errorMessage.includes("quota")) {
            errorMessage = "API Rate Limit Exceeded. You have made too many requests. Please wait a minute or try again tomorrow.";
        } else if (errorMessage.includes("404")) {
            errorMessage = "The selected AI model is currently unavailable on this API key.";
        }

        res.json({
            score: 0,
            summary: "Error analyzing resume. Please try again.",
            improvements: [
                errorMessage,
                "The server could not process your request at this time."
            ]
        });
    }
});

app.get('/', (req, res) => {
    res.send('InterPrep AI Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
