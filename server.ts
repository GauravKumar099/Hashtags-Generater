import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: any = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is missing. AI generations will fall back to mockup responses.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// AI Generation endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { type, topic, platform, language, style, count } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: "Topic or keyword is required" });
    }

    const ai = getAIClient();
    
    if (!ai) {
      // Return a robust mock response if API key is not set
      return res.json({
        success: true,
        isMock: true,
        data: getMockGeneration(type, topic, platform, language, style, count)
      });
    }

    let prompt = "";
    if (type === "hashtag") {
      prompt = `You are HashtagAI, an elite social media strategist and search engine optimization expert.
Generate a comprehensive list of trending, highly engaging, and viral hashtags for the following topic.
Topic: "${topic}"
Target Platform: ${platform || "Any"}
Language: ${language || "English"}
Requested Hashtags Count: ${count || 30}

Your response must be in strict JSON format with exactly the following structure. Do not include markdown code block formatting (like \`\`\`json) or any other text before or after the JSON. Just pure JSON:
{
  "trending": ["#tag1", "#tag2", ...],
  "viral": ["#tag1", "#tag2", ...],
  "niche": ["#tag1", "#tag2", ...],
  "lowCompetition": ["#tag1", "#tag2", ...],
  "highReach": ["#tag1", "#tag2", ...],
  "popularityScores": {
    "#tag1": 98,
    "#tag2": 85
  },
  "explanation": "Brief description of why these tags are selected and how to use them."
}

Distribute the total ${count || 30} hashtags reasonably across the 5 categories (trending, viral, niche, lowCompetition, highReach). Every hashtag must start with '#'. Ensure popularityScores has an entry for every generated hashtag.`;
    } else if (type === "caption") {
      prompt = `You are HashtagAI, an elite copywriter. Create 5 engaging social media captions for the following topic:
Topic: "${topic}"
Target Platform: ${platform || "Any"}
Language: ${language || "English"}
Style: ${style || "Viral"}

Your response must be in strict JSON format with exactly the following structure. Do not include markdown block formatting (like \`\`\`json) or other text. Just return pure JSON:
{
  "captions": [
    {
      "text": "Caption text with emojis...",
      "engagementHook": "Why this hook works",
      "suggestedTags": ["#tag1", "#tag2"]
    }
  ]
}`;
    } else if (type === "title") {
      prompt = `You are HashtagAI, an SEO title specialist. Generate 10 highly clickable, viral, and search-optimized titles for the following topic:
Topic: "${topic}"
Target Content Type: ${platform || "YouTube Videos"}
Language: ${language || "English"}

Your response must be in strict JSON format with exactly the following structure. Do not include markdown block formatting (like \`\`\`json). Just return pure JSON:
{
  "titles": [
    {
      "title": "SEO Optimized Clickable Title Here",
      "ctrStrategy": "Brief description of why this title drives high click-through-rate (e.g., urgency, curiosity, benefit)"
    }
  ]
}`;
    } else if (type === "keyword") {
      prompt = `You are HashtagAI, a search engine optimization expert. Generate related SEO keywords and creative content ideas based on:
Topic: "${topic}"
Target Platform: ${platform || "Google / YouTube / Social"}
Language: ${language || "English"}

Your response must be in strict JSON format with exactly the following structure. Do not include markdown block formatting (like \`\`\`json). Just return pure JSON:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "contentIdeas": [
    {
      "title": "Creative video/post idea",
      "format": "E.g., Short-form video, Carousel, blog post",
      "outline": "Brief step-by-step outline of how to present this content."
    }
  ]
}`;
    } else {
      return res.status(400).json({ error: "Invalid type specified" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    // Clean responseText of any ```json ... ``` markdown block wrappers
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    try {
      const parsedData = JSON.parse(cleanText);
      res.json({ success: true, isMock: false, data: parsedData });
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON. Raw response was:", responseText);
      res.json({
        success: true,
        isMock: true,
        warning: "Failed to parse raw AI response. Showing structured mock results.",
        data: getMockGeneration(type, topic, platform, language, style, count)
      });
    }

  } catch (err: any) {
    console.error("AI Generation error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Mock generation helper
function getMockGeneration(type: string, topic: string, platform: string, language: string, style: string, count: number) {
  const cleanTopic = topic.replace(/#/g, "").trim();
  const words = cleanTopic.toLowerCase().split(/\s+/);
  const baseTag = words.join("");
  
  if (type === "hashtag") {
    const limit = count || 30;
    const list: string[] = [];
    const suffixes = [
      "viral", "trending", "marketing", "hacks", "growth", "life", "tips", "tricks", "style", 
      "daily", "creator", "insights", "expert", "pro", "mastery", "hub", "network", "buzz",
      "vibe", "love", "goals", "success", "motivation", "community", "now", "today", "best",
      "squad", "universe", "world", "trends", "ideas", "thoughts", "guide", "essentials"
    ];
    
    for (let i = 0; i < limit; i++) {
      const suffix = suffixes[i % suffixes.length];
      const tag = `#${baseTag}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`;
      list.push(tag);
    }

    const trending = list.slice(0, Math.ceil(limit * 0.2));
    const viral = list.slice(Math.ceil(limit * 0.2), Math.ceil(limit * 0.4));
    const niche = list.slice(Math.ceil(limit * 0.4), Math.ceil(limit * 0.6));
    const lowCompetition = list.slice(Math.ceil(limit * 0.6), Math.ceil(limit * 0.8));
    const highReach = list.slice(Math.ceil(limit * 0.8));

    const popularityScores: Record<string, number> = {};
    list.forEach(tag => {
      popularityScores[tag] = Math.floor(Math.random() * 40) + 60;
    });

    return {
      trending,
      viral,
      niche,
      lowCompetition,
      highReach,
      popularityScores,
      explanation: `These hashtags have been optimized for #${cleanTopic} on ${platform || "all platforms"}. Using a mix of trending, niche, and low competition hashtags ensures optimal reach and discoverability.`
    };
  } else if (type === "caption") {
    const styles = [
      `Ready to take your ${cleanTopic} game to the next level? 🚀 Here's exactly how we do it! Check this out and let us know your thoughts below!`,
      `The secret to ${cleanTopic} that nobody is telling you... 🔥 Swipe to see the ultimate blueprint!`,
      `Honestly, ${cleanTopic} has completely changed my perspective on social media growth. Here is my 3-step formula ✨`,
      `Pro tip: Stop making the common mistakes with ${cleanTopic}. Instead, focus on consistency and high value. Let's grow together! 🎯`,
      `Behind the scenes of creating epic ${cleanTopic} content 💡 Which one is your favorite? Comment below!`
    ];
    return {
      captions: styles.map((txt, index) => ({
        text: txt,
        engagementHook: `Hook #${index + 1} targets curiosity and urgency.`,
        suggestedTags: [`#${baseTag}`, `#${baseTag}Growth`, `#${baseTag}Tips`]
      }))
    };
  } else if (type === "title") {
    return {
      titles: [
        { title: `How to MASTER ${cleanTopic.toUpperCase()} in 2026! 🚀`, ctrStrategy: "Uses power words (MASTER, 2026) and urgency." },
        { title: `The Ultimate Guide to ${cleanTopic} (For Beginners) 💡`, ctrStrategy: "Speaks directly to beginners looking for a guide." },
        { title: `5 Shocking Mistakes You're Making with ${cleanTopic} ❌`, ctrStrategy: "Triggers fear of missing out or failure." },
        { title: `I tried ${cleanTopic} for 30 days and THIS happened... 😱`, ctrStrategy: "Storytelling and high curiosity loop." },
        { title: `Stop ignoring this ${cleanTopic} growth hack! 🤫`, ctrStrategy: "Intrigue and exclusivity." },
        { title: `How to get 10k followers using ${cleanTopic} fast! 🔥`, ctrStrategy: "Promises clear, actionable benefit." },
        { title: `Is ${cleanTopic} actually dead in 2026? 💀`, ctrStrategy: "Controversy and relevance." },
        { title: `The exact blueprint I use for ${cleanTopic} success 🎯`, ctrStrategy: "Authority and social proof." },
        { title: `This simple ${cleanTopic} trick will double your reach! ✨`, ctrStrategy: "High ROI/value hook." },
        { title: `Everything you need to know about ${cleanTopic} today! 📣`, ctrStrategy: "Timeliness and completeness." }
      ]
    };
  } else if (type === "keyword") {
    return {
      keywords: [
        cleanTopic,
        `best ${cleanTopic}`,
        `how to do ${cleanTopic}`,
        `${cleanTopic} trends`,
        `${cleanTopic} tips`,
        `${cleanTopic} 2026`,
        `${cleanTopic} strategies`,
        `${cleanTopic} hack`,
        `${cleanTopic} online`,
        `${cleanTopic} creator`
      ],
      contentIdeas: [
        { title: `The Ultimate ${cleanTopic} Checklist`, format: "Infographic / Carousel", outline: "1. Intro hook. 2. 5-point bullet list checklist. 3. Call to action to save post." },
        { title: `3 Tools to Speed Up your ${cleanTopic}`, format: "Short-form video (Reels/TikTok)", outline: "Show tool 1 with screen share, then tool 2, then tool 3. Keep edits fast-paced." },
        { title: `My biggest regret with ${cleanTopic}`, format: "Long-form YouTube video", outline: "Share personal story, lessons learned, and the correct approach." },
        { title: `A day in the life of a ${cleanTopic} specialist`, format: "Vlog / Behind the scenes", outline: "Show your setup, daily workflow, and coffee break. Highly relatable." },
        { title: `Why most creators fail at ${cleanTopic}`, format: "Blog Post / Thread", outline: "Detail the top 3 structural issues and how to fix them." }
      ]
    };
  }
  return {};
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
