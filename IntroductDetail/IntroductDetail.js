// 모듈 불러오기
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
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
console.log("tb_idx:", tb_idx);  // 로그로 확인
document.getElementById("idx").textContent = urlParams.get("id");

async function fetchData() {
    // Firestore에서 tb_introduct 문서를 가져옴
    const docRef = doc(db, "detail", "tb_introduct");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error("Firestore 문서가 존재하지 않음");
        return;
    }

    // 데이터 가져오기
    const userData = docSnap.data();
    console.log("가져온 데이터:", userData);

    // `tb_idx` 값으로 데이터 확인
    if (userData.tb_idx.toString() === tb_idx) {
        document.getElementById("name").textContent = userData.tb_name;
        document.getElementById("age").textContent = userData.tb_age;
        document.getElementById("desc").textContent = userData.tb_content;
    } else {
        console.error(`ID가 ${tb_idx}인 데이터를 찾을 수 없음`);
    }

}
fetchData();

window.fetchData = fetchData; // 이 코드 추가하면 콘솔에서 직접 실행 가능
window.onload = function () {
    console.log("페이지 로드 완료 fetchData 실행");
    fetchData(); // 페이지가 로드되면 실행
};