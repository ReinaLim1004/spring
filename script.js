// 상태 관리 데이터 구조 (1차시~4차시까지 8개 모둠의 점수를 0으로 초기화)
let currentPeriod = 'total'; // 기본값: 누적 점수 보기
let scores = JSON.parse(localStorage.getItem('hanmunScores')) || {
    1: Array(8).fill(0),
    2: Array(8).fill(0),
    3: Array(8).fill(0),
    4: Array(8).fill(0)
};

// 화면 최초 로드 시 실행
window.onload = function() {
    renderScoreboard();
};

// 점수판 그리기 함수
function renderScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // 기존 내용 초기화

    // 8개 모둠 카드 생성
    for (let i = 0; i < 8; i++) {
        let displayScore = 0;

        // 누적 점수 보기일 경우 1~4차시의 해당 모둠 점수를 모두 더함
        if (currentPeriod === 'total') {
            displayScore = scores[1][i] + scores[2][i] + scores[3][i] + scores[4][i];
        } else {
            // 특정 차시 보기일 경우 해당 차시 점수만 노출
            displayScore = scores[currentPeriod][i];
        }

        // 누적 점수 모드일 때는 개별 점수 수정을 막기 위해 버튼 비활성화 속성 부여
        const isButtonDisabled = currentPeriod === 'total' ? 'disabled' : '';

        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <div class="team-name">${i + 1}모둠</div>
            <div class="score-display" id="score-team-${i}">${displayScore}점</div>
            <div class="control-btns">
                <button class="btn btn-minus" onclick="updateScore(${i}, -1)" ${isButtonDisabled}>-</button>
                <button class="btn btn-plus" onclick="updateScore(${i}, 1)" ${isButtonDisabled}>+</button>
            </div>
        `;
        scoreboard.appendChild(card);
    }
}

// 점수 변경 함수 (모둠 번호, 증감량)
function updateScore(teamIndex, amount) {
    if (currentPeriod === 'total') return; // 누적 모드에서는 수정 불가

    // 점수 업데이트 (음수 점수도 가능하게 하려면 Math.max 제거, 여기선 최소 0점 제한 안 둠)
    scores[currentPeriod][teamIndex] += amount;
    
    // 로컬 스토리지에 저장
    localStorage.setItem('hanmunScores', JSON.stringify(scores));
    
    // 화면 갱신
    renderScoreboard();
}

// 차시 탭 변경 함수
function changePeriod(period) {
    currentPeriod = period;

    // 탭 버튼 활성화 스타일 변경
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 클릭한 버튼에 active 클래스 추가
    if (period === 'total') {
        buttons[0].classList.add('active');
        document.getElementById('current-view').innerText = '누적 점수 (전체 합산)';
    } else {
        buttons[period].classList.add('active');
        document.getElementById('current-view').innerText = `${period}차시 점수`;
    }

    // 변경된 차시 기준으로 점수판 다시 그리기
    renderScoreboard();
}

// 전체 점수 초기화 함수
function resetScores() {
    if (confirm("정말로 모든 차시의 점수를 초기화하시겠습니까?")) {
        scores = {
            1: Array(8).fill(0),
            2: Array(8).fill(0),
            3: Array(8).fill(0),
            4: Array(8).fill(0)
        };
        localStorage.setItem('hanmunScores', JSON.stringify(scores));
        renderScoreboard();
    }
}
