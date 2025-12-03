import pool from '../config/database.js';
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'gemma3n:latest';

// Define the conversation flow steps
const STEPS = {
    WELCOME: 'WELCOME',
    PROBAND_ID: 'PROBAND_ID',
    PROBAND_HISTORY: 'PROBAND_HISTORY',
    REPRODUCTIVE_HISTORY: 'REPRODUCTIVE_HISTORY',
    PARENTS_INFO: 'PARENTS_INFO',
    SIBLINGS_CHECK: 'SIBLINGS_CHECK',
    SIBLINGS_INFO: 'SIBLINGS_INFO',
    CHILDREN_CHECK: 'CHILDREN_CHECK',
    CHILDREN_INFO: 'CHILDREN_INFO',
    EXTENDED_FAMILY: 'EXTENDED_FAMILY',
    ANCESTRY: 'ANCESTRY',
    SUMMARY: 'SUMMARY',
    COMPLETE: 'COMPLETE'
};

export const pedigreeService = {
    async startSession(counselorId) {
        const [result] = await pool.query(
            `INSERT INTO pedigrees(client_id, counselor_id, status, conversation_state, conversation_history, tree_data)
VALUES(NULL, ?, 'DRAFT', '${STEPS.PROBAND_ID}', '[]', '[]')`,
            [counselorId]
        );

        const initialMessage = "Hello! I'm your AI Genetic Counselor. To build your pedigree chart, I need to ask you a series of questions.\n\nFirst, let's identify the patient (Proband). Please tell me your **Full Name**, **Age**, **Biological Sex**, **Gender Identity**, and **Ethnicity**.";

        const history = [{ role: 'bot', content: initialMessage }];
        await pool.query('UPDATE pedigrees SET conversation_history = ? WHERE id = ?', [JSON.stringify(history), result.insertId]);

        return { sessionId: result.insertId, state: STEPS.PROBAND_ID, message: initialMessage };
    },

    async processMessage(sessionId, userMessage) {
        const [rows] = await pool.query('SELECT * FROM pedigrees WHERE id = ?', [sessionId]);
        if (rows.length === 0) throw new Error('Session not found');

        const session = rows[0];
        let state = session.conversation_state;
        let treeData = session.tree_data || [];
        let history = session.conversation_history || [];

        history.push({ role: 'user', content: userMessage });

        let botResponse = '';
        let nextState = state;
        let extractedData = null;

        try {
            // --- STATE MACHINE ---
            switch (state) {
                case STEPS.PROBAND_ID:
                    extractedData = await this.extractWithLLM(userMessage, 'proband_detailed');
                    if (extractedData && extractedData.name) {
                        // Create Client
                        const [clientResult] = await pool.query(
                            'INSERT INTO clients (counselor_id, name, dob, sex, notes) VALUES (?, ?, ?, ?, ?)',
                            [session.counselor_id, extractedData.name, null, extractedData.sex || 'Unknown', `Ethnicity: ${extractedData.ethnicity}, Gender: ${extractedData.gender} `]
                        );
                        await pool.query('UPDATE pedigrees SET client_id = ? WHERE id = ?', [clientResult.insertId, sessionId]);

                        // Add to Tree
                        treeData.push({
                            id: 'I1',
                            name: extractedData.name,
                            sex: extractedData.sex,
                            age: extractedData.age,
                            ethnicity: extractedData.ethnicity,
                            proband: true,
                            affected: false
                        });

                        nextState = STEPS.PROBAND_HISTORY;
                        botResponse = `Thank you, ${extractedData.name}. I've created your record.\n\nNow, what is the **main medical issue** you want to discuss? Also, do you have any **chronic illnesses**, **birth defects**, **seizures**, or history of **cancer**?`;
                    } else {
                        botResponse = "I missed some details. Could you please provide your Name, Age, Sex, and Ethnicity again?";
                    }
                    break;

                case STEPS.PROBAND_HISTORY:
                    extractedData = await this.extractWithLLM(userMessage, 'medical_history');
                    const proband = treeData.find(p => p.id === 'I1');
                    if (proband) {
                        proband.conditions = Array.isArray(extractedData.conditions) ? extractedData.conditions : [];
                        proband.main_issue = extractedData.main_issue;
                        proband.affected = (proband.conditions.length > 0 || !!proband.main_issue);
                    }

                    nextState = STEPS.REPRODUCTIVE_HISTORY;
                    botResponse = "Noted. Now, regarding reproductive history: Have you been pregnant? If so, how many times? Any miscarriages, stillbirths, or terminations?";
                    break;

                case STEPS.REPRODUCTIVE_HISTORY:
                    // Just store this in notes for now, or add to tree metadata
                    // In a real app, we'd parse pregnancies
                    nextState = STEPS.PARENTS_INFO;
                    botResponse = "Thank you. Let's move to your **Parents**. Please tell me about your **Father** and **Mother**: Name, Age (or age at death), and any health conditions/cancers for each.";
                    break;

                case STEPS.PARENTS_INFO:
                    extractedData = await this.extractWithLLM(userMessage, 'parents');
                    if (extractedData && (extractedData.father || extractedData.mother)) {
                        if (extractedData.father) {
                            treeData.push({
                                id: 'I3', name: extractedData.father.name, sex: 'Male', age: extractedData.father.age,
                                conditions: extractedData.father.conditions || [], affected: (extractedData.father.conditions?.length > 0)
                            });
                            const p = treeData.find(x => x.id === 'I1'); if (p) p.father_id = 'I3';
                        }
                        if (extractedData.mother) {
                            treeData.push({
                                id: 'I2', name: extractedData.mother.name, sex: 'Female', age: extractedData.mother.age,
                                conditions: extractedData.mother.conditions || [], affected: (extractedData.mother.conditions?.length > 0)
                            });
                            const p = treeData.find(x => x.id === 'I1'); if (p) p.mother_id = 'I2';
                        }

                        nextState = STEPS.SIBLINGS_CHECK;
                        botResponse = "Parents recorded. Do you have any **siblings** (brothers or sisters)? If yes, how many?";
                    } else {
                        botResponse = "Could you please describe your parents again? (e.g. 'Father is Bob, 60, healthy. Mother is Alice, 58, has diabetes')";
                    }
                    break;

                case STEPS.SIBLINGS_CHECK:
                    if (userMessage.toLowerCase().includes('no') || userMessage.toLowerCase().includes('none')) {
                        nextState = STEPS.CHILDREN_CHECK;
                        botResponse = "Okay, no siblings. Do you have any **children**? If yes, how many?";
                    } else {
                        nextState = STEPS.SIBLINGS_INFO;
                        botResponse = "Please list your siblings: Name, Sex, Age, and any health issues for each.";
                    }
                    break;

                case STEPS.SIBLINGS_INFO:
                    extractedData = await this.extractWithLLM(userMessage, 'relatives_list'); // Extract list of people
                    if (extractedData && Array.isArray(extractedData.people)) {
                        extractedData.people.forEach((sib, idx) => {
                            treeData.push({
                                id: `SIB${idx + 1}`, name: sib.name, sex: sib.sex, age: sib.age,
                                conditions: sib.conditions || [], affected: (sib.conditions?.length > 0),
                                father_id: 'I3', mother_id: 'I2' // Link to same parents
                            });
                        });
                    }
                    nextState = STEPS.CHILDREN_CHECK;
                    botResponse = "Siblings added. Now, do you have any **children**? If yes, how many?";
                    break;

                case STEPS.CHILDREN_CHECK:
                    if (userMessage.toLowerCase().includes('no') || userMessage.toLowerCase().includes('none')) {
                        nextState = STEPS.EXTENDED_FAMILY;
                        botResponse = "Okay, no children. Let's ask about **Extended Family**. Any significant health issues with Grandparents, Aunts, Uncles, or Cousins (Maternal or Paternal)?";
                    } else {
                        nextState = STEPS.CHILDREN_INFO;
                        botResponse = "Please list your children: Name, Sex, Age, and any health issues/symptoms.";
                    }
                    break;

                case STEPS.CHILDREN_INFO:
                    extractedData = await this.extractWithLLM(userMessage, 'relatives_list');
                    if (extractedData && Array.isArray(extractedData.people)) {
                        extractedData.people.forEach((child, idx) => {
                            treeData.push({
                                id: `CHILD${idx + 1}`, name: child.name, sex: child.sex, age: child.age,
                                conditions: child.conditions || [], affected: (child.conditions?.length > 0),
                                father_id: 'I1' // Linked to Proband
                            });
                        });
                    }
                    nextState = STEPS.EXTENDED_FAMILY;
                    botResponse = "Children recorded. Moving to **Extended Family**. Are there any known genetic conditions, cancers, or major illnesses in your Grandparents, Aunts, Uncles, or Cousins?";
                    break;

                case STEPS.EXTENDED_FAMILY:
                    // We can extract general notes or specific people here. For simplicity, we'll just note it or extract generic people.
                    // For now, let's move to Ancestry.
                    nextState = STEPS.ANCESTRY;
                    botResponse = "Noted. Finally, **Ancestry & Consanguinity**: Are you and your partner related by blood (e.g. cousins)? Do you belong to any specific founder population (e.g. Ashkenazi, etc.)?";
                    break;

                case STEPS.ANCESTRY:
                    nextState = STEPS.SUMMARY;
                    botResponse = "Thank you. I have gathered all the information. \n\n**Summary:**\n" +
                        `Proband: ${treeData[0].name}\n` +
                        `Total Family Members: ${treeData.length}\n\n` +
                        "Is this correct? (Yes/No)";
                    break;

                case STEPS.SUMMARY:
                    if (userMessage.toLowerCase().includes('yes')) {
                        nextState = STEPS.COMPLETE;
                        botResponse = "Pedigree Chart Completed! You can now export the data.";
                    } else {
                        botResponse = "What would you like to correct?";
                        // Logic to handle correction is complex, for now just stay here
                    }
                    break;

                case STEPS.COMPLETE:
                    botResponse = "The session is complete. You can start a new one if needed.";
                    break;
            }

        } catch (error) {
            console.error('LLM Extraction Error:', error);
            botResponse = "I'm having trouble understanding. Could you try rephrasing that?";
        }

        history.push({ role: 'bot', content: botResponse });
        await pool.query(
            `UPDATE pedigrees 
       SET conversation_state = ?, conversation_history = ?, tree_data = ?
       WHERE id = ?`,
            [nextState, JSON.stringify(history), JSON.stringify(treeData), sessionId]
        );

        return { sessionId, state: nextState, message: botResponse, treeData };
    },

    async extractWithLLM(text, type) {
        let prompt = '';
        if (type === 'proband_detailed') {
            prompt = `Extract JSON: {"name": string, "age": number, "sex": "Male"|"Female", "gender": string, "ethnicity": string}. Text: "${text}"`;
        } else if (type === 'medical_history') {
            prompt = `Extract JSON: {"main_issue": string, "conditions": string[]}. Text: "${text}"`;
        } else if (type === 'parents') {
            prompt = `Extract JSON: {"father": {"name": string, "age": number, "conditions": string[]}, "mother": {"name": string, "age": number, "conditions": string[]}}. Text: "${text}"`;
        } else if (type === 'relatives_list') {
            prompt = `Extract JSON: {"people": [{"name": string, "sex": "Male"|"Female", "age": number, "conditions": string[]}]}. Text: "${text}"`;
        }

        try {
            const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
                model: MODEL_NAME,
                prompt: prompt + " Return ONLY JSON. No markdown.",
                stream: false,
                format: "json"
            });
            return JSON.parse(response.data.response);
        } catch (e) {
            console.error('Ollama Error:', e);
            return null;
        }
    }
};
