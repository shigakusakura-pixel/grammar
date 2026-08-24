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

// 生徒IDを「URL」および「ポータルのログイン記録」から確実に特定する
function resolveStudentId() {
  // 1. URLパラメータを確認
  const params = new URLSearchParams(window.location.search);
  let id = params.get('student') || params.get('id') || params.get('studentId');
  
  // 2. URLに無ければ、ポータルでログインした時のブラウザ保存情報を確認
  if (!id || id === 'guest' || id === 'ゲスト') {
    id = localStorage.getItem('shigaku_student_id') || localStorage.getItem('mystudy_student_id');
  }

  // 3. それでも無ければゲスト
  if (!id) return "guest";

  id = id.trim();
  if (id === "guest" || id === "ゲスト") return "guest";

  // @shigaku.local が無ければ補完
  if (!id.includes('@')) {
    id = `${id}@shigaku.local`;
  }
  return id;
}

// 送信関数
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  const finalId = resolveStudentId();
  
  try {
    const subjectName = "中学英語";
    await addDoc(collection(db, "learning_records"), {
      studentId: finalId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: duration,
      timestamp: serverTimestamp()
    });
    console.log(`✅ 【英文法 送信成功】 対象ID: ${finalId} | 単元: ${unitName} | 時間: ${duration}秒`);
  } catch (e) {
    console.error("❌ 送信失敗:", e);
  }
};
