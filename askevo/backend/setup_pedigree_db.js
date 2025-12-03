import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'remote_user',
    password: process.env.DB_PASSWORD || 'Prolab#05',
    database: process.env.DB_NAME || 'progenics_ai',
    multipleStatements: true
};

const createTablesSql = `
-- Clients Table: Stores patient information
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  counselor_id INT NOT NULL, -- The user (counselor) managing this client
  name VARCHAR(255) NOT NULL,
  reference_id VARCHAR(50), -- Hospital MRN or internal ID
  dob DATE,
  sex ENUM('Male', 'Female', 'Other', 'Unknown'),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pedigrees Table: Stores the family tree data for a client
CREATE TABLE IF NOT EXISTS pedigrees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  counselor_id INT NOT NULL,
  status ENUM('DRAFT', 'COMPLETED', 'ARCHIVED') DEFAULT 'DRAFT',
  conversation_state VARCHAR(50) DEFAULT 'INIT', -- Tracks where we are in the interview
  conversation_history JSON, -- Stores the chat history
  tree_data JSON, -- Stores the structured pedigree data (individuals, relationships)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

async function setupDatabase() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Creating pedigree tables...');
        await connection.query(createTablesSql);

        console.log('✅ Pedigree tables created successfully!');
    } catch (error) {
        console.error('❌ Error setting up database:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
