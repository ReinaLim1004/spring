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
    for (let i = 0; i < 8; i++) {
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
        document.getElementById('current-view').innerText = '누적 점수 (전체 합산)';
    } else {
        buttons[period].classList.add('active');
        document.getElementById('current-view').innerText = `${period}차시 점수`;
    }

    updateDisplay();
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
