/**
 * Новогодний сайт 2026 — main.js
 * Все данные хранятся в sessionStorage.
 * Автор: Tihon Metelkin
 */

const app = {
    // Глобальное состояние
    state: {
        currentUser: null,
        products: [
            { id: 1, name: "FC Pack", description: "Случайный набор футбольных карточек FIFA 23", price: 1, image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png" },
            { id: 2, name: "Новогодний шар", description: "Красивый шар для ёлки", price: 10, image: "https://via.placeholder.com/250/ffffff/333333?text=Ball" },
            { id: 3, name: "Подарочная коробка", description: "Коробка с сюрпризом", price: 25, image: "https://via.placeholder.com/250/ffffff/333333?text=Box" }
        ]
    },

    // Инициализация приложения
    init() {
        this.loadUser();
        this.renderAll();
        this.bindEvents();
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 60000);
    },

    // Загрузка пользователя из sessionStorage
    loadUser() {
        const userStr = sessionStorage.getItem('user');
        this.state.currentUser = userStr ? JSON.parse(userStr) : null;
    },

    // Сохранение пользователя
    saveUser() {
        if (this.state.currentUser) {
            sessionStorage.setItem('user', JSON.stringify(this.state.currentUser));
        }
    },

    // Получение названия ранга
    getRankName(rank) {
        const ranks = ["Новичок", "Друг", "Герой", "Легенда", "Администратор"];
        return ranks[rank - 1] || "Неизвестный";
    },

    // Обновление UI на всех страницах
    renderAll() {
        this.updateUserInfo();
        this.renderShop();
        this.renderInventory();
    },

    // Обновление информации о пользователе
    updateUserInfo() {
        const user = this.state.currentUser;
        if (!user) {
            document.querySelectorAll('[id^="user-login"], [id^="coins-"]').forEach(el => el.textContent = "Гость");
            document.getElementById('user-rank').textContent = "Новичок";
            return;
        }

        // Все поля с логином/монетами
        ['user-login', 'user-login-settings'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = user.login;
        });

        // Все поля с монетами
        ['user-coins', 'coins-shop', 'coins-inventory', 'coins-roulette'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = user.coins;
        });

        // Ранг
        const rankEl = document.getElementById('user-rank');
        if (rankEl) rankEl.textContent = this.getRankName(user.rank);
    },

    // Показать секцию
    showSection(sectionId) {
        document.querySelectorAll('.page').forEach(el => el.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        window.scrollTo(0, 0);

        // Специфическая логика для секций
        if (sectionId === 'shop') this.renderShop();
        if (sectionId === 'inventory') this.renderInventory();
        if (sectionId === 'login' && !this.state.currentUser) return;
        
        // Если не авторизован — показываем логин
        if (!this.state.currentUser && sectionId !== 'login') {
            this.showSection('login');
        }
    },

    // Вход в систему
    login(login, password) {
        if (login === 'admin' && password === 'metla2025') {
            this.state.currentUser = {
                login: 'admin',
                coins: 35,
                rank: 5,
                purchased: [],
                rewards: []
            };
        } else {
            // Регистрация нового пользователя
            this.state.currentUser = {
                login,
                coins: 35,
                rank: 1,
                purchased: [],
                rewards: []
            };
        }
        this.saveUser();
        this.renderAll();
        this.showSection('home');
    },

    // Покупка товара
    buyProduct(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product || this.state.currentUser.coins < product.price) {
            alert("Недостаточно монет!");
            return;
        }

        this.state.currentUser.coins -= product.price;
        this.state.currentUser.purchased.push({
            id: product.id,
            name: product.name,
            price: product.price,
            date: new Date().toLocaleString()
        });
        this.saveUser();
        this.renderAll();
        alert(`Вы купили "${product.name}" за ${product.price} монет!`);
    },

    // Вращение рулетки
    spinWheel() {
        if (this.state.currentUser.coins < 150) {
            alert("Нужно 150 монет!");
            return;
        }

        const prizes = [
            { name: "FC Pack", image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png", value: 1 },
            { name: "50 монет", image: "https://via.placeholder.com/50/ffffff/333333?text=💰", value: 50 },
            { name: "100 монет", image: "https://via.placeholder.com/50/ffffff/333333?text=💰", value: 100 },
            { name: "Ранжирование", image: "https://via.placeholder.com/50/ffffff/333333?text=⭐", value: 0 }
        ];

        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        this.state.currentUser.coins -= 150;

        if (prize.value > 0) {
            this.state.currentUser.coins += prize.value;
        } else if (prize.name === "Ранжирование" && this.state.currentUser.rank < 5) {
            this.state.currentUser.rank++;
        }

        this.state.currentUser.purchased.push({
            id: Date.now(),
            name: prize.name,
            price: 150,
            date: new Date().toLocaleString()
        });

        this.saveUser();
        this.renderAll();
        document.getElementById('result').innerHTML = `<h3>🎉 Вы выиграли: ${prize.name}!</h3>`;
    },

    // Рендер магазина
    renderShop() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        container.innerHTML = this.state.products.map(p => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="price">${p.price} монет</div>
                <button onclick="app.buyProduct(${p.id})">Купить</button>
            </div>
        `).join('');
    },

    // Рендер инвентаря
    renderInventory() {
        const user = this.state.currentUser;
        if (!user) return;

        document.getElementById('balance-display').textContent = user.coins;

        // Купленные
        const purchased = user.purchased || [];
        document.getElementById('purchased-items').innerHTML = purchased.length 
            ? purchased.map(item => `<div>${item.name} — ${item.price} монет (${item.date})</div>`).join('')
            : '<p>Пока ничего не куплено.</p>';

        // Награды
        const rewards = user.rewards || [];
        document.getElementById('rewards-items').innerHTML = rewards.length
            ? rewards.map(item => `<div>${item.name} — ${item.description || ''} (${item.date})</div>`).join('')
            : '<p>Пока нет наград.</p>';
    },

    // Обновление таймера
    updateCountdown() {
        const now = new Date();
        const newYear = new Date(2026, 0, 1);
        const diff = newYear - now;
        if (diff <= 0) {
            document.getElementById('countdown').textContent = "С Новым Годом! 🎉";
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('countdown').textContent = `${days}д ${hrs}ч до Нового года!`;
    },

    // Привязка событий
    bindEvents() {
        // Вход
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('login-input').value.trim();
            const pass = document.getElementById('password-input').value;
            if (login && pass) this.login(login, pass);
        });

        // Рулетка
        document.getElementById('spin-button')?.addEventListener('click', () => this.spinWheel());

        // Настройки
        document.getElementById('save-settings')?.addEventListener('click', () => {
            const color = document.getElementById('theme-color').value;
            document.documentElement.style.setProperty('--theme-color', color);
            alert("Настройки сохранены!");
        });

        // Навигация
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
    }
};

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => app.init());
