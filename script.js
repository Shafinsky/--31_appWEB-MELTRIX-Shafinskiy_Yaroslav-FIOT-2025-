// === CAROUSELS ===
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const nextBtn = carousel.querySelector('.carousel-btn.right');
  const prevBtn = carousel.querySelector('.carousel-btn.left');

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
  });
});


// === BURGER MENU ===
const burger = document.querySelector(".burger-menu");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  navLinks.classList.toggle("active");
});


// === MODAL LOGIC ===
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const closeBtn = document.querySelector(".close-btn");

// Відкрити модалку
function openModal(card) {
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.description;
    modal.style.display = "flex";
}

// Закрити модалку
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});


// === ДЕЛЕГУВАННЯ ПОДІЙ ДЛЯ КАРТОК ===

// SHOP BY PUBLISHER
document.querySelector(".publishers .carousel-track")
  .addEventListener("click", (e) => {
    const card = e.target.closest(".publisher-card");
    if (card) openModal(card);
});

// SHOP BY GENRE
document.querySelector(".genres .carousel-track")
  .addEventListener("click", (e) => {
    const card = e.target.closest(".genre-card");
    if (card) openModal(card);
});


// === SIGN IN MODAL ===
const signInBtn = document.querySelector(".sign-in");
const formModal = document.getElementById("form-modal");

signInBtn.addEventListener("click", () => {
    formModal.style.display = "flex";
});

window.addEventListener("click", (e) => {
    if (e.target === formModal) formModal.style.display = "none";
});

// ========= CART ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// відкриття / закриття
const cartModal = document.getElementById("cart-modal");
document.getElementById("open-cart").onclick = () => cartModal.style.display = "flex";
document.querySelector(".close-cart").onclick = () => cartModal.style.display = "none";

// збереження
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// рендер
function renderCart() {
    const container = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    container.innerHTML = "";

    let sum = 0;

    cart.forEach((item, index) => {
        sum += item.price;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}₴</p>
                    <span class="remove" data-index="${index}">Remove</span>
                </div>
            </div>
        `;
    });

    total.textContent = sum + "₴";
}

// видалення товару
document.getElementById("cart-items").addEventListener("click", e => {
    if (e.target.classList.contains("remove")) {
        cart.splice(e.target.dataset.index, 1);
        saveCart();
        renderCart();
    }
});

renderCart();

// ADD TO CART
document.querySelector(".games-grid").addEventListener("click", e => {
    if (e.target.classList.contains("btn-cart")) {
        const card = e.target.closest(".game-card");

        const title = card.querySelector("img").alt;
        const price = parseInt(card.querySelector(".new-price")?.textContent 
                          || card.querySelector(".price").textContent);

        const img = card.querySelector("img").src;

        cart.push({ title, price, img });

        saveCart();
        renderCart();
        alert("Added to cart!");
    }
});

// ===== PAGINATION for GAMES ON SALE =====
const games = Array.from(document.querySelectorAll(".games-grid .game-card"));
let currentPage = 1;
const perPage = 4;

function renderGames() {
    games.forEach((game, idx) => {
        game.style.display =
            idx >= (currentPage - 1) * perPage && idx < currentPage * perPage
            ? "block"
            : "none";
    });
}

document.getElementById("next-page").onclick = () => {
    if (currentPage * perPage < games.length) {
        currentPage++;
        renderGames();
    }
};

document.getElementById("prev-page").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderGames();
    }
};

renderGames();