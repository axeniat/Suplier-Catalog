const products = [

    {
        id: 1,
        name: "Laptop Lenovo IdeaPad",
        code: "LAP-001",
        category: "laptop",
        stock: 12,

        prices: {
            abc: 12500,
            xyz: 13200,
            delta: 12000
        }
    },

    {
        id: 2,
        name: "Laptop HP 15",
        code: "LAP-002",
        category: "laptop",
        stock: 8,

        prices: {
            abc: 11800,
            xyz: 12400,
            delta: 11500
        }
    },

    {
        id: 3,
        name: "Mouse Logitech M185",
        code: "MOU-001",
        category: "peripherals",
        stock: 50,

        prices: {
            abc: 450,
            xyz: 500,
            delta: 420
        }
    },

    {
        id: 4,
        name: "Tastatura Logitech K120",
        code: "KEY-001",
        category: "peripherals",
        stock: 30,

        prices: {
            abc: 850,
            xyz: 900,
            delta: 800
        }
    },

    {
        id: 5,
        name: "Monitor Samsung 24",
        code: "MON-001",
        category: "monitors",
        stock: 15,

        prices: {
            abc: 4200,
            xyz: 4500,
            delta: 4000
        }
    },

    {
        id: 6,
        name: "Monitor LG 27",
        code: "MON-002",
        category: "monitors",
        stock: 9,

        prices: {
            abc: 5200,
            xyz: 5500,
            delta: 4950
        }
    },

    {
        id: 7,
        name: "Casti JBL Tune",
        code: "JBL-001",
        category: "audio",
        stock: 25,

        prices: {
            abc: 1800,
            xyz: 1950,
            delta: 1700
        }
    },

    {
        id: 8,
        name: "Webcam Logitech",
        code: "WEB-001",
        category: "other",
        stock: 20,

        prices: {
            abc: 1500,
            xyz: 1650,
            delta: 1400
        }
    },

    {
        id: 9,
        name: "Imprimanta Canon",
        code: "CAN-001",
        category: "other",
        stock: 10,

        prices: {
            abc: 3200,
            xyz: 3500,
            delta: 3000
        }
    }

];

const clientSelect =
    document.getElementById("clientSelect");

const searchInput =
    document.getElementById("searchInput");

const categorySelect =
    document.getElementById("categorySelect");

const sortSelect =
    document.getElementById("sortSelect");

const productsContainer =
    document.getElementById("productsContainer");

const productsCount =
    document.getElementById("productsCount");

const emptyMessage =
    document.getElementById("emptyMessage");

const cartContainer =
    document.getElementById("cartContainer");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const clearCartButton =
    document.getElementById("clearCartButton");

const notification =
    document.getElementById("notification");

    function getCategoryName(category) {

    const categories = {

        laptop: "Laptop",

        peripherals: "Periferic",

        monitors: "Monitor",

        audio: "Audio",

        other: "Altele"

    };

    return categories[category] || "Altele";
}

function displayProducts() {

    const selectedClient =
        clientSelect.value;

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categorySelect.value;

    const sortType =
        sortSelect.value;


    let filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||
                product.code
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch &&
                   matchesCategory;

        });


    filteredProducts.sort((a, b) => {

        const priceA =
            a.prices[selectedClient];

        const priceB =
            b.prices[selectedClient];


        if (sortType === "price-asc") {
            return priceA - priceB;
        }


        if (sortType === "price-desc") {
            return priceB - priceA;
        }


        if (sortType === "stock") {
            return b.stock - a.stock;
        }


        return 0;

    });


    productsContainer.innerHTML = "";


    productsCount.textContent =
        `${filteredProducts.length} produse găsite`;


    if (filteredProducts.length === 0) {

        emptyMessage.classList.remove("hidden");

        return;
    }


    emptyMessage.classList.add("hidden");


    filteredProducts.forEach(product => {

        const price =
            product.prices[selectedClient];


        let stockClass =
            "stock-available";

        let stockText =
            `${product.stock} buc.`;


        if (product.stock === 0) {

            stockClass = "stock-empty";

            stockText = "Stoc epuizat";

        }
        else if (product.stock <= 5) {

            stockClass = "stock-low";

            stockText =
                `${product.stock} buc. - stoc redus`;
        }


        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <h3>
                ${product.name}
            </h3>

            <div class="product-code">
                Cod: ${product.code}
            </div>

            <span class="product-category">
                ${getCategoryName(product.category)}
            </span>

            <div class="product-stock">

                Stoc:

                <span class="${stockClass}">
                    ${stockText}
                </span>

            </div>

            <div class="client-price">
                Preț pentru clientul selectat
            </div>

            <div class="product-price">

                ${price.toLocaleString("ro-RO")}
                MDL

            </div>

            <button
                class="order-button"
                onclick="addToCart(${product.id})"
                ${product.stock === 0 ? "disabled" : ""}
            >

                ${
                    product.stock === 0
                    ? "Stoc epuizat"
                    : "Adaugă în comandă"
                }

            </button>

        `;


        productsContainer.appendChild(card);

    });

}

displayProducts();

clientSelect.addEventListener(
    "change",
    displayProducts
);

searchInput.addEventListener(
    "input",
    displayProducts
);

categorySelect.addEventListener(
    "change",
    displayProducts
);

sortSelect.addEventListener(
    "change",
    displayProducts
);

let cart = [];

function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(
            item => item.productId === productId
        );

    if (existingItem) {

        if (existingItem.quantity >= product.stock) {

            showNotification(
                "Cantitatea depășește stocul disponibil."
            );

            return;
        }

        existingItem.quantity++;

    } else {

        cart.push({
            productId: productId,
            quantity: 1
        });
    }

    renderCart();

    showNotification(
        "Produsul a fost adăugat în comandă."
    );
}

function renderCart() {

    const selectedClient =
        clientSelect.value;

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="cart-empty">

                <p>
                    Comanda este goală.
                </p>

            </div>

        `;

        cartTotal.textContent = "0 MDL";

        cartCount.textContent = "0 produse";

        return;
    }

    let total = 0;

    let totalQuantity = 0;

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );

        if (!product) {
            return;
        }

        const price =
            product.prices[selectedClient];

        const subtotal =
            price * item.quantity;

        total += subtotal;

        totalQuantity += item.quantity;

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";

        cartItem.innerHTML = `

            <div class="cart-product">

                <strong>
                    ${product.name}
                </strong>

                <small>
                    ${product.code}
                </small>

            </div>

            <div>

                ${price.toLocaleString("ro-RO")}
                MDL

            </div>

            <div class="quantity-control">

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        -1
                    )">

                    −

                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        1
                    )">

                    +

                </button>

            </div>

            <div>

                ${subtotal.toLocaleString("ro-RO")}
                MDL

            </div>

            <button
                class="remove-button"
                onclick="removeFromCart(
                    ${product.id}
                )">

                Șterge

            </button>

        `;

        cartContainer.appendChild(cartItem);

    });

    cartTotal.textContent =
        `${total.toLocaleString("ro-RO")} MDL`;

    cartCount.textContent =
        `${totalQuantity} produse`;
}

function changeQuantity(productId, change) {

    const item =
        cart.find(
            item => item.productId === productId
        );

    const product =
        products.find(
            product => product.id === productId
        );

    if (!item || !product) {
        return;
    }

    const newQuantity =
        item.quantity + change;

    if (newQuantity <= 0) {

        removeFromCart(productId);

        return;
    }

    if (newQuantity > product.stock) {

        showNotification(
            "Cantitatea depășește stocul disponibil."
        );

        return;
    }

    item.quantity =
        newQuantity;

    renderCart();
}

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.productId !== productId
        );

    renderCart();

    showNotification(
        "Produsul a fost eliminat."
    );
}

clearCartButton.addEventListener(
    "click",
    () => {

        cart = [];

        renderCart();

        showNotification(
            "Comanda a fost golită."
        );

    }
);