import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'; // 匯入 listAll 和 getDownloadURL
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBfQZmkxpe18E1ekNaks0VPQ-yDBfCUi6Y",
    authDomain: "sweet-potato-firebase.firebaseapp.com",
    databaseURL: "https://sweet-potato-firebase-default-rtdb.firebaseio.com",
    projectId: "sweet-potato-firebase",
    storageBucket: "sweet-potato-firebase.appspot.com",
    messagingSenderId: "698206342209",
    appId: "1:698206342209:web:9e5019f14a9c788df2cac0",
    measurementId: "G-N78W71429Q"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // 如果已經初始化，使用該實例
}

const storage = getStorage(app);  // Firebase v9 的正確初始化方式
const database = getDatabase(app);

export { storage, database, ref, listAll, getDownloadURL, getMetadata };  // 匯出 listAll 和 getDownloadURL
