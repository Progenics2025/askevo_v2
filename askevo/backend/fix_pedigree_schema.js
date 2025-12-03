import pool from './config/database.js';

async function fixSchema() {
    try {
        console.log('Modifying pedigrees table to allow NULL client_id...');
        await pool.query('ALTER TABLE pedigrees MODIFY client_id INT NULL');
        console.log('✅ Schema updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating schema:', error);
        process.exit(1);
    }
}

fixSchema();
