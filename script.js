document.addEventListener("DOMContentLoaded", () => {

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

function initCarousel(trackId, speed = 0.5) {
  const track = document.getElementById(trackId);
  let position = 0;

  track.innerHTML += track.innerHTML;

  function animate() {
    position -= speed;
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

initCarousel("publisherTrack");
initCarousel("genreTrack");

  /* =====================================
     GAMES ON SALE (4 PER PAGE PAGINATION)
  ======================================*/
  const games = Array.from($$(".games-sale .game-card"));
  const prevBtn = $("#prev-page");
  const nextBtn = $("#next-page");

  const perPage = 4;
  let currentPage = 1;
  const totalPages = Math.ceil(games.length / perPage);

  function renderSalePage() {
    games.forEach((game, index) => {
      const start = (currentPage - 1) * perPage;
      const end = currentPage * perPage;

      game.style.display = index >= start && index < end ? "block" : "none";
    });

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderSalePage();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderSalePage();
      }
    });
  }

  renderSalePage();

  /* =====================================
     CART SYSTEM
  ======================================*/
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCartPreview() {
    const preview = $(".cart-preview");
    if (!preview) return;

    preview.innerHTML = "";

    if (cart.length === 0) {
      preview.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

    cart.forEach((item, index) => {
      preview.innerHTML += `
        <div class="cart-preview-item">
          <img src="${item.img}" width="40">
          <span>${item.title}</span>
          <button class="remove-preview" data-index="${index}">🗑</button>
        </div>
      `;
    });

    preview.innerHTML += `
      <button class="view-cart-btn">GO TO CART</button>
    `;
  }

  function renderCartModal() {
    const container = $("#cart-items");
    const total = $("#cart-total");
    if (!container) return;

    container.innerHTML = "";
    let sum = 0;

    cart.forEach((item, index) => {
      sum += item.price;

      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" width="60">
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

  /* =====================================
     GLOBAL CLICK HANDLER
  ======================================*/
  document.addEventListener("click", (e) => {

    /* ADD TO CART */
    if (e.target.classList.contains("btn-cart")) {

      const card = e.target.closest(".game-card");
      const title = card.querySelector("img").alt;
      const priceText = card.querySelector(".new-price")?.textContent ||
                        card.querySelector(".price").textContent;

      const price = parseInt(priceText.replace(/\D/g, ""));
      const img = card.querySelector("img").src;

      cart.push({ title, price, img });

      saveCart();
      renderCartPreview();
      renderCartModal();
    }

    /* REMOVE FROM PREVIEW */
    if (e.target.classList.contains("remove-preview")) {
      cart.splice(e.target.dataset.index, 1);
      saveCart();
      renderCartPreview();
      renderCartModal();
    }

    /* REMOVE FROM MODAL */
    if (e.target.classList.contains("remove")) {
      cart.splice(e.target.dataset.index, 1);
      saveCart();
      renderCartPreview();
      renderCartModal();
    }

    /* OPEN CART */
    if (e.target.closest("#cart-icon") || e.target.classList.contains("view-cart-btn")) {
      $("#cart-modal").style.display = "flex";
    }

    /* CLOSE CART */
    if (e.target.classList.contains("close-cart") || e.target.id === "cart-modal") {
      $("#cart-modal").style.display = "none";
    }

  });

  /* ========================= AUTH MODAL ==========================*/
  const signInBtn = $(".sign-in"); // кнопка у хедері 
  const formModal = $("#form-modal"); // модалка 
  const authClose = $(".auth-close"); // кнопка X 
  const authForms = $$(".auth-form"); // всі форми 
  const loginFormElement = $("#login-form"); // форма логіну 
  function openAuthModal() {
    formModal.style.display = "flex";
  }
  function closeAuthModal() {
    formModal.style.display = "none";

    authForms.forEach(form => {
      form.querySelectorAll("input").forEach(input => input.value = "");
    });
  }
  if (signInBtn && formModal) {
    window.addEventListener("click", (e) => {
      if (e.target === formModal) {
        formModal.style.display = "none";
      }
    });
    // Відкрити модалку 
    signInBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openAuthModal();
    });
    // Закрити по кнопці X 
    if (authClose) {
      authClose.addEventListener("click", closeAuthModal);
    }
    // Закрити по кліку поза формою 
    formModal.addEventListener("click", (e) => {
      if (e.target === formModal) {
        closeAuthModal();
      }
    });
    // ОБРОБКА КНОПКИ SIGN IN (submit) 
    if (loginFormElement) {
      loginFormElement.addEventListener("submit", (e) => {
        e.preventDefault(); // зупиняємо перезавантаження 
        const email = loginFormElement.querySelector("input[type='email']").value;
        const password = loginFormElement.querySelector("input[type='password']").value;

        if (email.trim() === "" || password.trim() === "") {
          alert("Please fill in all fields");
          return;
        }
        // тут можна додати перевірку або авторизацію
        alert("Successfully signed in!");
        closeAuthModal(); // закриваємо і очищаємо 
      });
    }
  }

  /* ========================= AUTH TABS ==========================*/
  const tabLogin = $("#tab-login");
  const tabRegister = $("#tab-register");
  const loginForm = $("#login-form");
  const registerForm = $("#register-form");
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabRegister.classList.remove("active");
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
    });
    tabRegister.addEventListener("click", () => {
      tabRegister.classList.add("active");
      tabLogin.classList.remove("active");
      registerForm.classList.add("active");
      loginForm.classList.remove("active");
    });
  }

  /* ========================= MODAL LOGIC ==========================*/
  const modal = $("#modal");
  const modalImg = $("#modal-img");
  const modalTitle = $("#modal-title");
  const modalDesc = $("#modal-desc");
  const closeBtn = $(".close-btn");

  function openModal(card) {
    if (!modal) return;
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.description;

    modal.style.display = "flex";
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
  /* ========================= EVENT DELEGATION (CARDS) ==========================*/
  document.addEventListener("click", (e) => {
    const publisher = e.target.closest(".publisher-card");
    const genre = e.target.closest(".genres-card");

    if (publisher) openModal(publisher);
    if (genre) openModal(genre);
  });

  /* =====================================
   CART HOVER DELAY LOGIC
=====================================*/
const cartIcon = document.querySelector("#cart-icon");
const cartPreview = document.querySelector(".cart-preview");

if (cartIcon && cartPreview) {

  let hideTimeout;

  function showCart() {
    clearTimeout(hideTimeout);
    cartPreview.classList.add("active");
  }

  function hideCart() {
    hideTimeout = setTimeout(() => {
      cartPreview.classList.remove("active");
    }, 300); // затримка 300мс
  }

  cartIcon.addEventListener("mouseenter", showCart);
  cartIcon.addEventListener("mouseleave", hideCart);

  cartPreview.addEventListener("mouseenter", showCart);
  cartPreview.addEventListener("mouseleave", hideCart);
}

  renderCartPreview();
  renderCartModal();

});