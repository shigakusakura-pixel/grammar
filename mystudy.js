// grammar / mystudy.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQjnlOfeVvWQJHDxGE9cq-jGsYF3uo0PY",
  authDomain: "mystudy-portal.firebaseapp.com",
  projectId: "mystudy-portal",
  storageBucket: "mystudy-portal.firebasestorage.app",
  messagingSenderId: "62253255474",
  appId: "1:62253255474:web:817a3cbd1ab3ea63e7e52b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ① 生徒IDの取得（?student=teacher などの短縮IDもそのまま受け入れる）
const urlParams = new URLSearchParams(window.location.search);
let rawStudentId = urlParams.get('student') || urlParams.get('id');

const PORTAL_URL = "https://shigakusakura-pixel.github.io/mystudyroom/";

// 完全な空欄・nullの場合のみポータルへ戻す
if (!rawStudentId || rawStudentId.trim() === '') {
  alert("ログインが必要です。ポータルへ戻ります。");
  window.location.replace(PORTAL_URL);
}

// @shigaku.local がついていない場合は付与して統一
const studentId = (rawStudentId && !rawStudentId.includes('@') && rawStudentId !== 'guest') 
  ? `${rawStudentId}@shigaku.local` 
  : rawStudentId;

// 画面ロック表示
function showLock() {
  const lock = document.createElement("div");
  lock.id = "lock-screen";
  lock.innerHTML = `<div style="background:#fff;padding:16px 24px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.3);font-weight:bold;">⏳ 記録を保存中...</div>`;
  Object.assign(lock.style, {
    position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "99999"
  });
  document.body.appendChild(lock);
  return lock;
}

// ② 英文法用 送信関数
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  const lock = showLock();
  try {
    const subjectName = "英文法";
    await addDoc(collection(db, "learning_records"), {
      studentId: studentId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: duration, // 所要秒数を保存
      timestamp: serverTimestamp()
    });
    lock.remove();
    
    const timeText = duration > 0 ? `（所要時間: ${Math.floor(duration / 60)}分${duration % 60}秒）` : '';
    alert(`【記録完了】${unitName} の学習を記録しました！\n${timeText}`);
  } catch (e) {
    console.error("保存失敗:", e);
    lock.remove();
    alert("⚠️ 保存に失敗しました。電波の良い場所で再度お試しください。");
  }
};
