import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

async function test() {
  try {
    const envContent = fs.readFileSync(".env", "utf8");
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim() : null;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello!");
    const response = await result.response;
    console.log("SUCCESS");
    console.log(response.text());
  } catch (error) {
    console.log("FAILURE");
    console.log(error.message);
  }
}
test();