// Глобальные переменные
let currentUser = null;
let texts = {};
let products = [
    {
        id: 1,
        name: "FC Pack",
        description: "Случайный набор футбольных карточек FIFA 23",
        price: 1,
        image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png"
    },
    {
        id: 2,
        name: "Новогодний шар",
        description: "Красивый шар для ёлки",
        price: 10,
        image: "images/gifts/gift1.png"
    },
    {
        id: 3,
        name: "Подарочная коробка",
        description: "Коробка с сюрпризом",
        price: 25,
        image: "images/gifts/gift2.png"
    }
];

// Загрузка текстов
async function loadTexts() {
    try {
        const res = await fetch('texts.json');
        texts = await res.json();
        updateTexts();
    } catch (e) {
        console.error("Не удалось загрузить texts.json", e);
        texts = {
            site_title: "🎄 Новогоднее Приключение 2026",
            welcome_message: "Добро пожаловать!",
            login_placeholder: "Логин",
            password_placeholder: "Пароль",
            login_button: "Войти",
            register_button: "Зарегистрироваться",
            coins_label: "Монеты:",
            tasks_title: "Активные задания",
            shop_title: "Магазин подарков",
            profile_title: "Ваш профиль",
            admin_online: "Администраторы онлайн:",
            daily_bonus: "Ежедневный бонус: +5 монет!",
            first_complete_bonus: "Вы первый! Получите удвоенную награду!",
            confirm_task: "Подтвердить выполнение",
            task_completed_by: "Выполнено пользователем",
            no_tasks: "Нет активных заданий",
            settings_title: "Настройки",
            chat_title: "Чат с админом",
            roulette_title: "Рулетка призов",
            roulette_cost: "Стоимость вращения: 150 монет",
            inventory_title: "Инвентарь",
            inventory_coins: "Баланс монет:",
            inventory_purchased: "Купленные предметы:",
            inventory_rewards: "Награды от админа:",
            fc_pack_name: "FC Pack",
            fc_pack_description: "Случайный набор футбольных карточек FIFA 23",
            fc_pack_price: "1",
            fc_pack_image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png"
        };
    }
}

// Обновление текстов на странице
function updateTexts() {
    document.querySelectorAll('[data-text]').forEach(el => {
        const key = el.getAttribute('data-text');
        if (texts[key]) el.textContent = texts[key];
    });
    document.title = texts.site_title || "🎄 Новогоднее Приключение 2026";
    if (document.getElementById('page-title')) document.getElementById('page-title').textContent = texts.site_title || "🎄 Новогоднее Приключение 2026";
    if (document.getElementById('site-title')) document.getElementById('site-title').textContent = texts.site_title || "🎄 Новогоднее Приключение 2026";
    if (document.getElementById('welcome-message')) document.getElementById('welcome-message').textContent = texts.welcome_message || "Добро пожаловать!";
    if (document.getElementById('login-btn')) document.getElementById('login-btn').textContent = texts.login_button || "Войти";
    if (document.getElementById('register-btn')) document.getElementById('register-btn').textContent = texts.register_button || "Зарегистрироваться";
    if (document.getElementById('login-input')) document.getElementById('login-input').placeholder = texts.login_placeholder || "Логин";
    if (document.getElementById('password-input')) document.getElementById('password-input').placeholder = texts.password_placeholder || "Пароль";
    if (document.getElementById('coins-label')) document.getElementById('coins-label').textContent = texts.coins_label || "Монеты:";
    if (document.getElementById('shop-title')) document.getElementById('shop-title').textContent = texts.shop_title || "Магазин подарков";
    if (document.getElementById('profile-title')) document.getElementById('profile-title').textContent = texts.profile_title || "Ваш профиль";
    if (document.getElementById('admin-online')) document.getElementById('admin-online').textContent = texts.admin_online || "Администраторы онлайн:";
    if (document.getElementById('daily-bonus')) document.getElementById('daily-bonus').textContent = texts.daily_bonus || "Ежедневный бонус: +5 монет!";
    if (document.getElementById('roulette-title')) document.getElementById('roulette-title').textContent = texts.roulette_title || "Рулетка призов";
    if (document.getElementById('roulette-cost')) document.getElementById('roulette-cost').textContent = texts.roulette_cost || "Стоимость вращения: 150 монет";
    if (document.getElementById('inventory-title')) document.getElementById('inventory-title').textContent = texts.inventory_title || "Инвентарь";
    if (document.getElementById('inventory-coins-label')) document.getElementById('inventory-coins-label').textContent = texts.inventory_coins || "Баланс монет:";
    if (document.getElementById('inventory-purchased-label')) document.getElementById('inventory-purchased-label').textContent = texts.inventory_purchased || "Купленные предметы:";
    if (document.getElementById('inventory-rewards-label')) document.getElementById('inventory-rewards-label').textContent = texts.inventory_rewards || "Награды от админа:";
    if (document.getElementById('fc-pack-name')) document.getElementById('fc-pack-name').textContent = texts.fc_pack_name || "FC Pack";
    if (document.getElementById('fc-pack-description')) document.getElementById('fc-pack-description').textContent = texts.fc_pack_description || "Случайный набор футбольных карточек FIFA 23";
    if (document.getElementById('fc-pack-price')) document.getElementById('fc-pack-price').textContent = texts.fc_pack_price || "1";
}

// Загрузка пользователя из localStorage
function loadUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        currentUser = JSON.parse(userStr);
        updateUserUI();
    }
}

// Сохранение пользователя в localStorage
function saveUser() {
    localStorage.setItem('user', JSON.stringify(currentUser));
}

// Обновление UI после входа
function updateUserUI() {
    if (!currentUser) return;

    const loginEl = document.getElementById('user-login');
    const rankEl = document.getElementById('user-rank');
    const coinsEl = document.getElementById('user-coins');

    if (loginEl) loginEl.textContent = currentUser.login;
    if (rankEl) rankEl.textContent = getRankName(currentUser.rank);
    if (coinsEl) coinsEl.textContent = currentUser.coins;

    // Обновляем все страницы
    if (document.getElementById('balance-display')) {
        document.getElementById('balance-display').textContent = currentUser.coins;
    }
    if (document.getElementById('user-coins')) {
        document.getElementById('user-coins').textContent = currentUser.coins;
    }

    // Для инвентаря
    if (window.location.pathname.includes('inventory.html')) {
        updateInventory();
    }
}

// Получить название ранга
function getRankName(rank) {
    const ranks = ["Новичок", "Друг", "Герой", "Легенда", "Администратор"];
    return ranks[rank - 1] || "Неизвестный";
}

// Вход
function handleLogin(e) {
    e.preventDefault();
    const login = document.getElementById('login-input')?.value.trim();
    const password = document.getElementById('password-input')?.value;

    if (!login || !password) {
        showError("Введите логин и пароль");
        return;
    }

    // Проверяем, есть ли пользователь
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.login === login);

    if (!user) {
        // Регистрация нового пользователя
        user = {
            login: login,
            password: password, // В реальном проекте хэшируйте!
            coins: 35, // Первый вход = 35 монет
            rank: 1,
            avatar: 'avatars/default.png',
            frame: 'frames/default-frame.png',
            last_login: new Date().toISOString().split('T')[0],
            purchased: [],
            rewards: []
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = user;
        saveUser();
        window.location.href = 'index.html';
    } else if (user.password === password) {
        // Вход
        currentUser = user;
        // Ежедневный бонус
        const today = new Date().toISOString().split('T')[0];
        if (user.last_login !== today) {
            user.coins += 5;
            user.last_login = today;
        }
        saveUser();
        window.location.href = 'index.html';
    } else {
        showError("Неверный логин или пароль");
    }
}

// Регистрация (просто перенаправляет на вход)
function handleRegister() {
    document.getElementById('register-btn').addEventListener('click', () => {
        alert("Регистрация происходит при первом входе.");
    });
}

// Показать ошибку
function showError(msg) {
    const el = document.getElementById('error-message');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
    }
}

// Таймер обратного отсчета
function updateCountdown() {
    const now = new Date();
    const newYear = new Date(2026, 0, 1, 0, 0, 0);
    const diff = newYear - now;
    if (diff <= 0) {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) countdownEl.textContent = "С Новым Годом! 🎉";
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) countdownEl.textContent = `${days}д ${hours}ч до Нового года!`;
    setTimeout(updateCountdown, 60000);
}

// Админы онлайн (заглушка)
function updateAdminsOnline() {
    const admins = ['admin']; // В реальности это бы бралось с сервера
    const el = document.getElementById('admins-online');
    if (el) {
        const list = admins.length ? admins.join(', ') : 'не в сети';
        el.innerHTML = `<h3>${texts.admin_online || "Администраторы онлайн:"}</h3><p>${list}</p>`;
    }
}

// Смена цветовой схемы
function applyTheme(color) {
    document.documentElement.style.setProperty('--theme-color', color);
}

// Сохранение настроек
function saveSettings() {
    const themeColor = document.getElementById('theme-color')?.value || '#ff6b6b';
    const telegramHandle = document.getElementById('telegram-handle')?.value || '@skywakker';
    const mobileLayout = document.getElementById('mobile-layout')?.checked || false;

    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('telegramHandle', telegramHandle);
    localStorage.setItem('mobileLayout', mobileLayout);

    applyTheme(themeColor);
    if (mobileLayout) {
        document.body.classList.add('mobile-layout');
    } else {
        document.body.classList.remove('mobile-layout');
    }

    alert("Настройки сохранены!");
}

// Обновление инвентаря
function updateInventory() {
    if (!currentUser) return;

    const balanceEl = document.getElementById('balance-display');
    const purchasedEl = document.getElementById('purchased-items');
    const rewardsEl = document.getElementById('rewards-items');

    if (balanceEl) balanceEl.textContent = currentUser.coins;

    if (purchasedEl) {
        if (!currentUser.purchased || currentUser.purchased.length === 0) {
            purchasedEl.innerHTML = '<p>Пока ничего не куплено.</p>';
        } else {
            purchasedEl.innerHTML = currentUser.purchased.map(item => `
                <div class="item">
                    <img src="${getProductImage(item.name)}" alt="${item.name}" style="width: 50px; vertical-align: middle;">
                    <span>${item.name} — ${item.price} монет (${item.date})</span>
                </div>
            `).join('');
        }
    }

    if (rewardsEl) {
        if (!currentUser.rewards || currentUser.rewards.length === 0) {
            rewardsEl.innerHTML = '<p>Пока нет наград.</p>';
        } else {
            rewardsEl.innerHTML = currentUser.rewards.map(reward => `
                <div class="item">
                    <img src="${reward.image || 'images/coins/coin.png'}" alt="${reward.name}" style="width: 50px; vertical-align: middle;">
                    <span>${reward.name} — ${reward.description || ''} (${reward.date})</span>
                </div>
            `).join('');
        }
    }
}

// Получить изображение товара по имени
function getProductImage(name) {
    const product = products.find(p => p.name === name);
    return product ? product.image : 'images/coins/coin.png';
}

// Покупка товара
function buyProduct(productId) {
    if (!currentUser) {
        alert("Войдите, чтобы купить товар");
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (currentUser.coins < product.price) {
        alert("Недостаточно монет!");
        return;
    }

    currentUser.coins -= product.price;
    currentUser.purchased = currentUser.purchased || [];
    currentUser.purchased.push({
        id: product.id,
        name: product.name,
        price: product.price,
        date: new Date().toLocaleString()
    });

    saveUser();
    updateUserUI();
    renderProducts(); // Обновляем магазин
    alert(`Вы купили "${product.name}" за ${product.price} монет!`);
}

// Отображение товаров в магазине
function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    let sortedProducts = [...products];

    const sortValue = document.getElementById('sort-select')?.value;
    if (sortValue === 'price-asc') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    container.innerHTML = sortedProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${product.price} монет</div>
            <button onclick="buyProduct(${product.id})">Купить</button>
        </div>
    `).join('');
}

// Вращение колеса рулетки
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

    // Призы
    const prizes = [
        { name: "FC Pack", image: "https://www.futwiz.com/assets/images/fifa23/packs/gold.png", value: 1 },
        { name: "Новогодний шар", image: "images/gifts/gift1.png", value: 10 },
        { name: "Подарочная коробка", image: "images/gifts/gift2.png", value: 25 },
        { name: "50 монет", image: "images/coins/coin.png", value: 50 },
        { name: "100 монет", image: "images/coins/coin.png", value: 100 },
        { name: "Ранжирование", image: "images/ranks/rank3.png", value: 0 }
    ];

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

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadTexts();
    loadUser();

    // Если на странице входа — инициализируем форму
    if (window.location.pathname.includes('login.html')) {
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('register-btn')?.addEventListener('click', handleRegister);
    }

    // Обновляем UI
    updateUserUI();

    // Запускаем таймер
    updateCountdown();

    // Обновляем админов онлайн
    updateAdminsOnline();
    setInterval(updateAdminsOnline, 30000);

    // Настройки
    if (document.getElementById('save-settings')) {
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        const savedColor = localStorage.getItem('themeColor') || '#ff6b6b';
        const savedHandle = localStorage.getItem('telegramHandle') || '@skywakker';
        const savedMobile = localStorage.getItem('mobileLayout') === 'true';

        document.getElementById('theme-color')?.value = savedColor;
        document.getElementById('telegram-handle')?.value = savedHandle;
        document.getElementById('mobile-layout')?.checked = savedMobile;

        applyTheme(savedColor);
        if (savedMobile) {
            document.body.classList.add('mobile-layout');
        }
    }

    // Магазин
    if (window.location.pathname.includes('shop.html')) {
        renderProducts();
        document.getElementById('sort-select')?.addEventListener('change', renderProducts);
    }

    // Рулетка
    if (window.location.pathname.includes('roulette.html')) {
        document.getElementById('spin-button')?.addEventListener('click', spinWheel);
    }

    // Инвентарь
    if (window.location.pathname.includes('inventory.html')) {
        updateInventory();
    }

    // Анимация перехода
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });

    // Плавное появление контента
    document.body.classList.add('fade-in');
});
