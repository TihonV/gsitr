// Товары в магазине
const products = [
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

// Отображение товаров
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

// Инициализация магазина
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Обновляем сортировку
    if (document.getElementById('sort-select')) {
        document.getElementById('sort-select').addEventListener('change', renderProducts);
    }
});
