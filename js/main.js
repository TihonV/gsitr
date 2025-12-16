// Глобальные переменные
let currentUser = null;
let texts = {};

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
            welcome_message: "Добро пожаловать!"
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
    document.getElementById('page-title').textContent = texts.site_title || "🎄 Новогоднее Приключение 2026";
    document.getElementById('site-title').textContent = texts.site_title || "🎄 Новогоднее Приключение 2026";
    document.getElementById('welcome-message').textContent = texts.welcome_message || "Добро пожаловать!";
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

    document.getElementById('user-login').textContent = currentUser.login;
    document.getElementById('user-rank').textContent = getRankName(currentUser.rank);
    document.getElementById('user-coins').textContent = currentUser.coins;
    document.getElementById('user-info').style.display = 'block';

    // Обновляем все страницы
    if (document.getElementById('balance-display')) {
        document.getElementById('balance-display').textContent = currentUser.coins;
    }
    if (document.getElementById('user-coins')) {
        document.getElementById('user-coins').textContent = currentUser.coins;
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
    const login = document.getElementById('login-input').value.trim();
    const password = document.getElementById('password-input').value;

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

// Регистрация
function handleRegister() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
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
        document.getElementById('countdown').textContent = "С Новым Годом! 🎉";
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById('countdown').textContent = `${days}д ${hours}ч до Нового года!`;
    setTimeout(updateCountdown, 60000);
}

// Админы онлайн (заглушка — в реальности можно использовать Firebase или WebSocket)
function updateAdminsOnline() {
    const admins = ['admin']; // В реальности это бы бралось с сервера
    const el = document.getElementById('admins-online');
    if (el) {
        const list = admins.length ? admins.join(', ') : 'не в сети';
        el.innerHTML = `<h3>Администраторы онлайн:</h3><p>${list}</p>`;
    }
}

// Смена цветовой схемы
function applyTheme(color) {
    document.documentElement.style.setProperty('--theme-color', color);
}

// Сохранение настроек
function saveSettings() {
    const themeColor = document.getElementById('theme-color').value;
    const telegramHandle = document.getElementById('telegram-handle').value;
    const mobileLayout = document.getElementById('mobile-layout').checked;

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

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadTexts();
    loadUser();

    // Если на странице входа — инициализируем форму
    if (window.location.pathname.includes('login.html')) {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('register-btn').addEventListener('click', handleRegister);
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

        document.getElementById('theme-color').value = savedColor;
        document.getElementById('telegram-handle').value = savedHandle;
        document.getElementById('mobile-layout').checked = savedMobile;

        applyTheme(savedColor);
        if (savedMobile) {
            document.body.classList.add('mobile-layout');
        }
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
