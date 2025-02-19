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