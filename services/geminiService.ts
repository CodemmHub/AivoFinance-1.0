
import { FunctionDeclaration, GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Transaction, Wallet, Categories, TransactionType } from "../types.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const addTransactionFunctionDeclaration: FunctionDeclaration = {
    name: 'addTransaction',
    parameters: {
        type: Type.OBJECT,
        description: 'Adds a new income or expense transaction.',
        properties: {
            description: { type: Type.STRING, description: 'A detailed description of the transaction, e.g., "Monthly Salary" or "Groceries from Carrefour".' },
            amount: { type: Type.NUMBER, description: 'The monetary value of the transaction.' },
            type: { type: Type.STRING, enum: [TransactionType.INCOME, TransactionType.EXPENSE], description: 'The type of transaction, either INCOME or EXPENSE.' },
            category: { type: Type.STRING, description: 'The category of the transaction.' },
            walletName: { type: Type.STRING, description: 'The name of the wallet to associate the transaction with.' }
        },
        required: ["description", "amount", "type", "category", "walletName"]
    }
};

export const getAIAssistantResponse = async (
    history: { role: string, parts: { text: string }[] }[],
    prompt: string,
    allData: any // contains wallets, categories, transactions, etc.
): Promise<GenerateContentResponse | null> => {
    const { wallets, categories } = allData;
    const allCategories = [...categories.INCOME, ...categories.EXPENSE];
    const walletNames = wallets.map((w: Wallet) => w.name);
    
    if (walletNames.length === 0) {
        // Return a mock response object if no wallets exist
        return {
            text: "Please add a wallet first before using the AI Assistant.",
            functionCalls: undefined,
            candidates: [],
            promptFeedback: undefined,
        };
    }

    // Sanitize allData for the prompt to keep it concise
    const promptData = {
        wallets: allData.wallets.map(({id, name, currency}: Wallet) => ({name, currency})),
        categories: allData.categories,
        budgets: allData.budgets,
        goals: allData.goals.map(({id, name, targetAmount, savedAmount}: any) => ({name, targetAmount, savedAmount})),
        recentTransactions: allData.transactions.slice(0, 10),
        netWorth: allData.netWorth, // Assuming net worth is pre-calculated and passed in
    };
    
    const systemInstruction = `You are a helpful and friendly personal finance assistant named AivoFinance AI. Your goal is to help the user manage their finances.

You have two main capabilities:
1.  **Add Transactions:** If the user's message is clearly stating a transaction they want to record (e.g., "I bought coffee for 5", "received 2000 salary"), you MUST call the \`addTransaction\` function with the extracted details.
    -   Infer the transaction type (INCOME/EXPENSE).
    -   You MUST select a category from the provided list. If the user mentions a category not on the list, choose the most appropriate one from the list.
    -   You MUST select a wallet from the provided list. If the user doesn't specify a wallet, use the first one in the list.
2.  **Answer Questions:** If the user asks a question about their finances (e.g., "how much did I spend on groceries?", "what's my net worth?", "show me my budgets"), you MUST answer in a conversational, helpful tone.
    -   Use the provided JSON data to answer the user's questions accurately.
    -   You can perform calculations like sums, averages, and comparisons.
    -   Present data in a clear, easy-to-understand format. Use markdown for lists, bolding, etc. if it helps with clarity.
    -   If you don't have enough information to answer, politely ask the user for clarification.

**Available Wallets:** ${walletNames.join(', ')}
**Available Categories:** ${allCategories.join(', ')}

**User's Financial Data (for answering questions):**
\`\`\`json
${JSON.stringify(promptData, null, 2)}
\`\`\`

Analyze the user's latest prompt and decide whether to call the function or provide a text-based answer.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: [addTransactionFunctionDeclaration] }],
                temperature: 0,
            },
        });
        
        return response; // Return the full response object
    } catch (error) {
        console.error("Error processing AI request:", error);
        return null;
    }
};
