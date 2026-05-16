let currentPeriod = 'total'; 
let scores = JSON.parse(localStorage.getItem('DEEPHanScores')) || {
    1: Array(8).fill(0),
    2: Array(8).fill(0),
    3: Array(8).fill(0),
    4: Array(8).fill(0)
};

window.onload = function() {
    updateDisplay();
};

function updateDisplay() {
    // 새로운 차시로 바뀔 때마다 기존 우승 안내 문구와 하이라이트 초기화
    document.getElementById('winner-display').classList.add('hidden');

    for (let i = 0; i < 8; i++) {
        // 기존 하이라이트 클래스 제거
        document.getElementById(`card-i` ? `card-${i}` : `card-${i}`).classList.remove('highlight');

        let displayScore = 0;
        if (currentPeriod === 'total') {
            displayScore = scores[1][i] + scores[2][i] + scores[3][i] + scores[4][i];
        } else {
            displayScore = scores[currentPeriod][i];
        }

        document.getElementById(`score-team-${i}`).innerText = `${displayScore}점`;

        const isControlDisabled = currentPeriod === 'total';
        document.getElementById(`minus-${i}`).disabled = isControlDisabled;
        document.getElementById(`plus-${i}`).disabled = isControlDisabled;
    }
}

function updateScore(teamIndex, amount) {
    if (currentPeriod === 'total') return; 
    scores[currentPeriod][teamIndex] += amount;
    localStorage.setItem('DEEPHanScores', JSON.stringify(scores));
    updateDisplay();
}

function changePeriod(period) {
    currentPeriod = period;
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (period === 'total') {
        buttons[0].classList.add('active');
        document.getElementById('current-view').innerText = '현재 보기: 누적 점수 (전체 합산)';
    } else {
        buttons[period].classList.add('active');
        document.getElementById('current-view').innerText = `현재 보기: ${period}차시 점수`;
    }

    updateDisplay();
}

// 🏆 우승 모둠 계산 및 확인 함수
function checkWinner() {
    let currentScores = [];

    // 1. 현재 화면에 노출된 탭의 점수 모으기
    for (let i = 0; i < 8; i++) {
        if (currentPeriod === 'total') {
            currentScores.push(scores[1][i] + scores[2][i] + scores[3][i] + scores[4][i]);
        } else {
            currentScores.push(scores[currentPeriod][i]);
        }
    }

    // 2. 최고 점수 찾기
    const maxScore = Math.max(...currentScores);

    // 모든 모둠이 0점일 때는 우승자를 가리지 않음
    if (maxScore === 0) {
        alert("아직 획득한 점수가 없어 우승 모둠을 정할 수 없습니다.");
        return;
    }

    // 3. 최고 점수를 받은 모둠(동점자 포함) 추출
    let winners = [];
    currentScores.forEach((score, index) => {
        if (score === maxScore) {
            winners.push(`${index + 1}모둠`);
            // 해당 모둠 카드 테두리 빛나게 하기
            document.getElementById(`card-${index}`).classList.add('highlight');
        } else {
            // 우승자가 아닌 모둠은 하이라이트 제거
            document.getElementById(`card-${index}`).classList.remove('highlight');
        }
    });

    // 4. 화면에 우승 문구 출력
    const winnerDisplay = document.getElementById('winner-display');
    const periodText = currentPeriod === 'total' ? '🎉 최종 프로젝트' : `🎉 ${currentPeriod}차시`;
    
    winnerDisplay.innerText = `${periodText} 우승: ${winners.join(', ')} (${maxScore}점) 👏`;
    winnerDisplay.classList.remove('hidden');
}

function resetScores() {
    if (confirm("정말로 모든 차시의 점수를 초기화하시겠습니까?")) {
        scores = {
            1: Array(8).fill(0),
            2: Array(8).fill(0),
            3: Array(8).fill(0),
            4: Array(8).fill(0)
        };
        localStorage.setItem('DEEPHanScores', JSON.stringify(scores));
        updateDisplay();
    }
}
