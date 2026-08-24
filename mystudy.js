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

// 生徒IDの安全な抽出関数
function getCurrentStudentId() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('student') || urlParams.get('id') || urlParams.get('studentId');
  
  if (!id && window.location.hash.includes('student=')) {
    const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
    id = hashParams.get('student');
  }

  if (!id) {
    id = localStorage.getItem('shigaku_student_id') || localStorage.getItem('mystudy_student_id');
  }

  id = id ? id.trim() : "guest";

  if (id !== "guest" && !id.includes('@')) {
    id = `${id}@shigaku.local`;
  }
  return id;
}

// ② 英文法用 送信関数
window.sendLearningRecord = async function(unitName, actionName = "学習完了", duration = 0) {
  const currentId = getCurrentStudentId(); // 送信時に確実にIDを特定
  try {
    const subjectName = "中学英語";
    await addDoc(collection(db, "learning_records"), {
      studentId: currentId,
      subject: subjectName,
      unit: unitName,
      action: actionName,
      duration: duration,
      timestamp: serverTimestamp()
    });
    console.log(`【記録完了】送信先ID: ${currentId} / 単元: ${unitName} / 時間: ${duration}秒`);
  } catch (e) {
    console.error("保存失敗:", e);
  }
};
