
import { openDB } from './node_modules/idb/build/index.js';

const DB_NAME = 'AutoScamDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';


let dbPromise = null;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const store = db.createObjectStore(USERS_STORE, { 
            keyPath: 'id',
            autoIncrement: true 
          });
          store.createIndex('email', 'email', { unique: true });
        }
      },
    });
  }
  return dbPromise;
}

export async function addUser(userData) {
  const db = await initDB();
  
  const existingUser = await db.getFromIndex(USERS_STORE, 'email', userData.email);
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  try {
    const userId = await db.add(USERS_STORE, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    });
    return userId;
  } catch (error) {
    if (error.name === 'ConstraintError') {
      throw new Error('Пользователь с таким email уже существует');
    }
    throw error;
  }
}

export async function findUserByEmail(email) {
  const db = await initDB();
  return db.getFromIndex(USERS_STORE, 'email', email);
}

export async function findUserById(id) {
  const db = await initDB();
  return db.get(USERS_STORE, id);
}

export async function getAllUsers() {
  const db = await initDB();
  return db.getAll(USERS_STORE);
}