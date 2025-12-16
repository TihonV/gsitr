// Призы в рулетке
const prizes = [
    { name: "FC Pack", image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png", value: 1 },
    { name: "Новогодний шар", image: "images/gifts/gift1.png", value: 10 },
    { name: "Подарочная коробка", image: "images/gifts/gift2.png", value: 25 },
    { name: "50 монет", image: "images/coins/coin.png", value: 50 },
    { name: "100 монет", image: "images/coins/coin.png", value: 100 },
    { name: "Ранжирование", image: "images/ranks/rank3.png", value: 0 } // Увеличение ранга
];

// Вращение колеса
function spinWheel() {
    if (!currentUser) {
        alert("Войдите, чтобы крутить рулетку");
        return;
    }

    if (currentUser.coins < 150) {
        alert("Недостаточно монет! Нужно 150 монет");
        return;
    }

    const wheel = document.getElementById('wheel');
    const resultEl = document.getElementById('result');

    // Выбираем случайный приз
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIndex];

    // Анимация вращения
    const rotation = 360 * 5 + (prizeIndex * (360 / prizes.length)); // 5 полных оборотов + позиция приза
    wheel.style.transform = `rotate(${rotation}deg)`;

    // После завершения анимации
    setTimeout(() => {
        currentUser.coins -= 150;
        currentUser.purchased = currentUser.purchased || [];
        currentUser.purchased.push({
            id: Date.now(),
            name: prize.name,
            price: 150,
            date: new Date().toLocaleString()
        });

        // Если приз — монеты, добавляем их
        if (prize.value > 0) {
            currentUser.coins += prize.value;
        }

        // Если приз — ранг, повышаем ранг
        if (prize.name === "Ранжирование") {
            if (currentUser.rank < 5) {
                currentUser.rank++;
            }
        }

        saveUser();
        updateUserUI();

        resultEl.innerHTML = `
            <h3>🎉 Вы выиграли: ${prize.name}!</h3>
            <img src="${prize.image}" alt="${prize.name}" style="max-width: 100px; margin: 10px 0;">
        `;
    }, 5000); // 5 секунд — длительность анимации

    // Блокируем кнопку на время вращения
    document.getElementById('spin-button').disabled = true;
    setTimeout(() => {
        document.getElementById('spin-button').disabled = false;
    }, 5000);
}

// Инициализация рулетки
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('spin-button')) {
        document.getElementById('spin-button').addEventListener('click', spinWheel);
    }
});
