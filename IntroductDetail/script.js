document.addEventListener("DOMContentLoaded", function () {
    const thumbnails = Array.from(document.querySelectorAll(".thumbnail"));
    const detailContainer = document.getElementById("detail-container");
    const verticalThumbnails = document.getElementById("vertical-thumbnails");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const container = document.querySelector(".container");

    // 상세 내용 불러오기
    function loadDetail(thumbnail) {
        const detailPage = thumbnail.getAttribute("data-detail");

        // 기존 썸네일 숨기기
        thumbnailContainer.style.display = "none";
        container.style.display = "flex";

        // 클릭된 썸네일 왼쪽으로 이동 & 상세 내용 불러오기
        fetch(detailPage)
            .then(response => response.text())
            .then(html => {
                detailContainer.innerHTML = html;
                detailContainer.style.display = "block";
            })
            .catch(error => console.error("불러오기 실패:", error));

        // 세로 썸네일 초기화 (클릭된 썸네일을 제외한 나머지만 추가)
        verticalThumbnails.innerHTML = "";
        verticalThumbnails.style.display = "flex";

        // 기존 썸네일 배열을 기준으로 필터링해서 사용
        thumbnails
            .filter(img => img !== thumbnail)  // 클릭된 썸네일 제외
            .forEach(img => {
                const clone = img.cloneNode(true);
                clone.style.width = "80px";
                clone.style.height = "80px";
                clone.classList.add("vertical-thumbnail");

                // 세로 썸네일 클릭 이벤트 리스너 추가
                clone.addEventListener("click", function (event) {
                    event.stopPropagation();  // 바깥 클릭으로 초기화 방지
                    loadDetail(img); // 클릭된 썸네일에 맞는 상세 페이지 로드 (원본 사용)
                });

                verticalThumbnails.appendChild(clone);
            });
    }

    // 초기화 함수
    function resetView() {
        container.style.display = "none"; // 상세보기 영역 숨기기
        detailContainer.innerHTML = ""; // 상세 내용 삭제
        thumbnailContainer.style.display = "flex"; // 초기 썸네일 다시 표시
        verticalThumbnails.innerHTML = ""; // 오른쪽 썸네일 삭제
        verticalThumbnails.style.display = "none";
    }

    // 썸네일 클릭 시 상세 페이지 로드
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", function (event) {
            event.stopPropagation(); // 바깥 클릭 이벤트가 전파되지 않도록
            loadDetail(thumbnail); // 클릭된 썸네일에 맞는 상세 페이지 로드
        });
    });

    // 바깥을 클릭하면 초기 상태로 복귀
    document.addEventListener("click", function (event) {
        // 상세보기 영역 안을 클릭한 경우에는 초기화 안 됨
        if (!container.contains(event.target) && !thumbnailContainer.contains(event.target)) {
            resetView(); // 초기 상태로 되돌리기
        }
    });
});