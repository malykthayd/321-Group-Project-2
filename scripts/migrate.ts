import { initializeDatabase } from '../lib/database.js'

async function migrateDatabase() {
  console.log('Starting database migration...')
  
  try {
    // Initialize database (creates tables and indexes)
    initializeDatabase()
    
    console.log('Database migration completed successfully!')
  } catch (error) {
    console.error('Database migration failed:', error)
    throw error
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export { migrateDatabase }
