import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { JournalEntry } from '../types'

interface JournalDB extends DBSchema {
  journals: {
    key: string
    value: JournalEntry
    indexes: { 'by-date': string; 'by-type': string }
  }
}

let db: IDBPDatabase<JournalDB>

export const initDB = async () => {
  db = await openDB<JournalDB>('journal-flow-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('journals', {
        keyPath: 'id'
      })
      store.createIndex('by-date', 'date')
      store.createIndex('by-type', 'type')
    }
  })
  return db
}

export const saveJournal = async (journal: JournalEntry) => {
  if (!db) await initDB()
  return await db.add('journals', journal)
}

export const getJournals = async () => {
  if (!db) await initDB()
  return await db.getAll('journals')
}

export const getJournalsByType = async (type: string) => {
  if (!db) await initDB()
  return await db.getAllFromIndex('journals', 'by-type', type)
}

export const getJournalsByDateRange = async (startDate: string, endDate: string) => {
  if (!db) await initDB()
  const range = IDBKeyRange.bound(startDate, endDate)
  return await db.getAllFromIndex('journals', 'by-date', range)
}

export const deleteJournal = async (id: string) => {
  if (!db) await initDB()
  return await db.delete('journals', id)
}

export const updateJournal = async (journal: JournalEntry) => {
  if (!db) await initDB()
  return await db.put('journals', journal)
}