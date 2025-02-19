// 모듈 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyD2HNqOwPMK5OmK6GSavTT3s7DTdyChE88",
    authDomain: "introductdetail-f351f.firebaseapp.com",
    projectId: "introductdetail-f351f",
    storageBucket: "introductdetail-f351f.firebasestorage.app",
    messagingSenderId: "600863448642",
    appId: "1:600863448642:web:685b113cbc73eac76917db"
};

console.log("IntroductDetail.js 실행됨!");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// URL에서 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const tb_idx = urlParams.get("id");
console.log("tb_idx:", tb_idx);

document.getElementById("idx").textContent = tb_idx;

async function fetchData() {
    if (!tb_idx) {
        console.error("URL에서 ID를 찾을 수 없음");
        return;
    }

    // Firestore에서 tb_idx 값에 해당하는 문서 가져오기
    const docRef = doc(db, "detail", tb_idx);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error(`Firestore에서 ID가 ${tb_idx}인 문서를 찾을 수 없음`);
        return;
    }

    // 데이터 가져오기
    const userData = docSnap.data();
    console.log("가져온 데이터:", userData);

    document.getElementById("name").textContent = userData.tb_name || "이름 없음";
    document.getElementById("age").textContent = userData.tb_age || "나이 없음";
    document.getElementById("desc").textContent = userData.tb_content || "설명 없음";
}

fetchData();

window.fetchData = fetchData;
window.onload = function () {
    console.log("페이지 로드 완료, fetchData 실행");
    fetchData();
};