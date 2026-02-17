import fs from "fs";

async function listModels() {
  try {
    const envContent = fs.readFileSync(".env", "utf8");
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim() : null;

    console.log("Listing models for key...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
        console.log("Available models:");
        data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
        console.log("No models found or error in response:");
        console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log("Listing failed:", error.message);
  }
}
listModels();