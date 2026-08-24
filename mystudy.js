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

function getStudentId() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('student') || urlParams.get('id') || urlParams.get('studentId');
  if (!id && window.location.hash.includes('student=')) {
    const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
    id = hashParams.get('student');
  }
  if (!id) {
    id = localStorage.getItem('shigaku_student_id') || localStorage.getItem('mystudy_student_id');
  }
  return id ? id.trim() : "";
}

let rawStudentId = getStudentId() || "guest";
const studentId = (rawStudentId && !rawStudentId.includes('@') && rawStudentId !== 'guest') 
  ? `${rawStudentId}@shigaku.local` 
  : rawStudentId;

// ② 英文法用 送信関数（教科名を「中学英語（英文法）」として保存）
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  try {
    const subjectName = "中学英語"; // 管理画面の英語バー（赤色）に確実に集計される名称
    await addDoc(collection(db, "learning_records"), {
      studentId: studentId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: duration,
      timestamp: serverTimestamp()
    });
    console.log("学習記録を保存しました:", unitName, duration + "秒");
  } catch (e) {
    console.error("保存失敗:", e);
  }
};
