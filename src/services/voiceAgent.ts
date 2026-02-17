import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { properties } from "../data/properties";

// Initialize the client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Prepare system instruction with the property database
const SYSTEM_INSTRUCTION = `
You are a professional and friendly Real Estate Agent for 'DEALS HUB'.
Your goal is to help users find their best property money can buy from our exclusive list on DEALS HUB.

You are interacting via VOICE. Keep your responses relatively short and conversational.
Do not read out long lists of IDs or raw data. Summarize enthusiastically.

IMPORTANT IDENTITY RULES:
- Whenever asked, YOU SHOULD ALWAYS SAY YOU ARE AN AI TRAINED TO HELP YOU FIND THE BEST PROPERTY MONEY CAN BUY ON DEALS HUB.
- You are always an AI of DEALS HUB and not gemini.

AVAILABLE LISTINGS (Use this data strictly):
${JSON.stringify(properties, null, 2)}

CRITICAL RULES FOR DETAILS:
1. INTERNAL CODES: If a property has an 'internalCode' (e.g., "bh 123"), use it to identify the property if asked, or mention it when confirming details.
2. AVAILABLE UNITS: For project listings (especially ID 5), the 'description' field contains a specific "AVAILABLE INVENTORY" list. 
   - You MUST read this inventory carefully. 
   - If a user asks for a unit type NOT listed there (e.g., a 4-bedroom apartment in a project that only lists 1-3 beds), you must clearly state it is NOT available.
   - Accurately quote the specific sizes (sqm) and starting prices for each unit type.
3. FINANCIALS: Always be precise about 'paymentPlan', 'downPayment', and 'price'. Distinguish between "Cash" and "Installment" options.
4. SPECS: Use 'landArea', 'bua', 'finishing', and 'deliveryDate' to provide complete answers.

GENERAL RULES:
1. Always be polite and enthusiastic.
2. Only recommend properties from the AVAILABLE LISTINGS list.
3. If the user asks for a feature we don't have, politely inform them.
4. Keep responses concise (under 3 sentences) unless asked for specific details.
5. If a user wants to view a house, ask for their preferred date and time.
6. ACCENT RULE: If the user speaks in Arabic, you MUST respond in Arabic using a friendly Egyptian accent. If the user speaks in English, proceed normally in English.
`;

export interface VoiceSession {
    disconnect: () => void;
}

export const connectVoiceAgent = async (
    onAudioData: (base64: string) => void,
    onTranscript: (text: string) => void
): Promise<VoiceSession> => {
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    let isConnected = false;

    // Get Microphone Stream
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            channelCount: 1,
            sampleRate: 16000
        }
    });

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
            onopen: () => {
                isConnected = true;
                // Setup Audio Processor to stream mic data to Gemini
                const source = inputAudioContext.createMediaStreamSource(stream);
                const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);

                processor.onaudioprocess = (e) => {
                    if (!isConnected) return;

                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcmData = floatTo16BitPCM(inputData);
                    const base64Data = arrayBufferToBase64(pcmData);

                    sessionPromise.then(session => {
                        try {
                            if (isConnected) {
                                session.sendRealtimeInput({
                                    media: {
                                        mimeType: 'audio/pcm;rate=16000',
                                        data: base64Data
                                    }
                                });
                            }
                        } catch (err) {
                            console.error("Error sending audio input:", err);
                            isConnected = false;
                        }
                    });
                };

                source.connect(processor);
                processor.connect(inputAudioContext.destination);
            },
            onmessage: (msg: LiveServerMessage) => {
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    onAudioData(audioData);
                }

                const text = msg.serverContent?.modelTurn?.parts?.[0]?.text;
                if (text) {
                    onTranscript(text);
                }
            },
            onclose: () => {
                console.log("Voice session closed");
                isConnected = false;
            },
            onerror: (err) => {
                console.error("Voice session error:", err);
                isConnected = false;
            }
        }
    });

    // Wait for connection to ensure we return a valid session object controller
    const session = await sessionPromise;

    return {
        disconnect: () => {
            isConnected = false;
            try { session.close(); } catch (e) { }
            stream.getTracks().forEach(track => track.stop());
            inputAudioContext.close();
        }
    };
};

/* --- UTILS --- */

function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
