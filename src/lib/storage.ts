import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { BoardState } from '../data/types'

interface NorahDB extends DBSchema {
  board: {
    key: string
    value: BoardState
  }
}

const DB_NAME = 'norah-speech'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<NorahDB>> | null = null

function getDB(): Promise<IDBPDatabase<NorahDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NorahDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('board')) {
          db.createObjectStore('board')
        }
      },
    })
  }
  return dbPromise
}

export async function loadBoard(): Promise<BoardState | undefined> {
  const db = await getDB()
  return db.get('board', 'current')
}

export async function saveBoard(board: BoardState): Promise<void> {
  const db = await getDB()
  await db.put('board', board, 'current')
}
