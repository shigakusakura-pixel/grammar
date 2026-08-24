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

// 送信直前にURL・Storageから生徒IDを厳密に抽出
function getExactStudentId() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get('student') || params.get('id') || params.get('studentId');
  
  if (!id || id === 'guest' || id === 'ゲスト') {
    id = localStorage.getItem('shigaku_student_id') || localStorage.getItem('mystudy_student_id');
  }

  if (!id) return "guest";

  id = id.trim();
  if (id === "guest" || id === "ゲスト") return "guest";

  if (!id.includes('@')) {
    id = `${id}@shigaku.local`;
  }
  return id;
}

// 英文法用 送信関数
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  const targetStudentId = getExactStudentId();
  
  try {
    const subjectName = "中学英語";
    await addDoc(collection(db, "learning_records"), {
      studentId: targetStudentId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: Number(duration) || 0,
      timestamp: serverTimestamp()
    });
    console.log(`✅ 【英文法 送信成功】 対象: ${targetStudentId} | 単元: ${unitName} | 時間: ${duration}秒`);
  } catch (e) {
    console.error("❌ 送信失敗:", e);
  }
};
