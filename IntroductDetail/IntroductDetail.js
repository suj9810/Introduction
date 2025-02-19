// 모듈 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// 데이터 불러오기
async function fetchData() {
    if (!tb_idx) {
        console.error("URL에서 ID를 찾을 수 없음");
        return;
    }

    const docRef = doc(db, "detail", tb_idx);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error(`Firestore에서 ID가 ${tb_idx}인 문서를 찾을 수 없음`);
        return;
    }

    const userData = docSnap.data();
    console.log("가져온 데이터:", userData);

    document.getElementById("name").textContent = userData.tb_name || "이름 없음";
    document.getElementById("age").textContent = userData.tb_age || "나이 없음";
    document.getElementById("desc").textContent = userData.tb_content || "설명 없음";

    // 댓글 가져오기 실행
    fetchComments();
}

// 댓글 저장하기
async function saveComment() {
    const commentInput = document.getElementById("commentInput").value.trim();

    if (!commentInput) {
        alert("댓글을 입력하세요!");
        return;
    }

    try {
        await addDoc(collection(db, "detail", tb_idx, "comments"), {
            text: commentInput,
            timestamp: new Date()
        });

        document.getElementById("commentInput").value = ""; // 입력창 초기화
    } catch (error) {
        console.error("댓글 저장 중 오류 발생:", error);
    }
}

// 댓글 불러오기 (실시간 업데이트)
function fetchComments() {
    const commentsRef = collection(db, "detail", tb_idx, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        const commentList = document.getElementById("commentList");
        commentList.innerHTML = ""; // 기존 목록 초기화

        snapshot.forEach((doc) => {
            const commentData = doc.data();
            const li = document.createElement("li");
            li.textContent = commentData.text;
            commentList.appendChild(li);
        });
    });
}

// 이벤트 리스너 추가
document.getElementById("submitComment").addEventListener("click", saveComment);

fetchData();
window.fetchData = fetchData;
window.onload = function () {
    console.log("페이지 로드 완료, fetchData 실행");
    fetchData();
};