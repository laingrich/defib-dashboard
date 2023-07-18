import { initializeApp } from 'firebase/app'
import { getFirestore, onSnapshot, collectionGroup, query, where, orderBy, limit, collection } from 'firebase/firestore'
import config from '../config'

let _app
function fbApp () {
  if (_app) return _app
  _app = initializeApp(config.firebase)
  return _app
}

let _db
const db = function () {
  if (_db) return _db
  _db = getFirestore(fbApp())
  return _db
}

// deployments
export const deploymentStream = (cb) => onSnapshot(query(collectionGroup(db(), 'events'), where('event', '==', 'DEPLOYED'), orderBy('timestamp', 'desc'), limit(6)), cb)
// events
export const eventStream = (cb) => onSnapshot(query(collectionGroup(db(), 'events'), orderBy('timestamp', 'desc'), limit(5)), cb)
// markers
export const cabinetStream = (cb) => onSnapshot(query(collection(db(), 'cabinets'), where('installed', '==', true)), cb)
