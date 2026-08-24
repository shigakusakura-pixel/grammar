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

// 英文法用 送信関数
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  // ① HTML側で保持しているグローバル変数を最優先
  let targetId = window.CURRENT_STUDENT_ID;
  
  // ② 無ければURLから取得
  if (!targetId || targetId === "guest") {
    const params = new URLSearchParams(window.location.search);
    targetId = params.get('student') || params.get('id');
  }

  // ③ それでも無ければローカルストレージから取得
  if (!targetId || targetId === "guest") {
    try {
      targetId = localStorage.getItem('shigaku_student_id');
    } catch(e){}
  }

  targetId = targetId ? targetId.trim() : "guest";
  if (targetId !== "guest" && targetId !== "ゲスト" && !targetId.includes('@')) {
    targetId = `${targetId}@shigaku.local`;
  }

  try {
    const subjectName = "中学英語";
    await addDoc(collection(db, "learning_records"), {
      studentId: targetId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: Number(duration) || 0,
      timestamp: serverTimestamp()
    });
    console.log(`✅ 【送信成功】 ID: ${targetId} / 単元: ${unitName} / 時間: ${duration}秒`);
  } catch (e) {
    console.error("❌ 送信失敗:", e);
  }
};
