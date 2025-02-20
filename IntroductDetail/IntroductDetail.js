// 모듈 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function () {
    const thumbnails = Array.from(document.querySelectorAll(".thumbnail"));

    // 썸네일 클릭 시 새 페이지로 이동
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", function (event) {
            event.stopPropagation(); // 이벤트 전파 방지

            const detailPage = thumbnail.getAttribute("data-detail"); // 상세 페이지 URL 가져오기
            if (detailPage) {
                window.location.href = detailPage; // 새 페이지로 이동
            } else {
                console.error("data-detail 속성이 없음");
            }
        });
    });
});

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
    document.getElementById("mbti").textContent = userData.tb_mbti || "MBTI 없음";
    document.getElementById("desc").textContent = userData.tb_content || "설명 없음";
    document.getElementById("imge").src = userData.tb_imge || "사진 없음";

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
            timestamp: serverTimestamp()
        });

        document.getElementById("commentInput").value = ""; // 입력창 초기화
    } catch (error) {
        console.error("댓글 저장 중 오류 발생:", error);
    }
}

// 댓글 삭제하기
async function deleteComment(commentId) {
    const confirmDelete = confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "detail", tb_idx, "comments", commentId));
        console.log("댓글 삭제 완료:", commentId);
    } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
    }
}

// 날짜 포맷팅 함수 (YYYY-MM-DD HH:MM)
function formatTimestamp(timestamp) {
    if (!timestamp) return "시간 없음";

    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
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
            const formattedTime = commentData.timestamp ? formatTimestamp(commentData.timestamp) : "시간 없음";

            // 삭제 버튼 생성
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "삭제";
            deleteButton.onclick = () => deleteComment(doc.id);

            // 댓글 내용 표시
            li.innerHTML = `<strong>${formattedTime}</strong> - ${commentData.text} `;
            li.appendChild(deleteButton);
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