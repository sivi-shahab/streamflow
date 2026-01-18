import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a Senior Data Engineer and Solutions Architect specializing in Real-Time Streaming Analytics.
Your expertise covers:
- Apache Kafka, Google Cloud Pub/Sub
- Apache Spark Structured Streaming, Apache Flink
- Delta Lake, Apache Iceberg, Hudi
- Real-time BI, ML Feature Stores

When answering questions:
1. Be technical but accessible.
2. Use analogies where appropriate (e.g., comparing stream processing to water pipes).
3. Focus on the core pillars: Exactly-once semantics, Event-time processing, Scalability, and Fault Tolerance.
4. If asked about the diagram, refer to the flow: Source -> Ingestion -> Processing -> Storage -> Serving.

Keep answers concise (under 200 words unless asked for detail).
`;

export const sendMessageToGemini = async (history: { role: string; content: string }[], newMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "API Key is missing. Please check your configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Format history for the API
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I processed that, but couldn't generate a text response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the architecture knowledge base right now. Please try again later.";
  }
};