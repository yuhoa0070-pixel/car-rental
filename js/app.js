const searchInput = document.querySelector("#dashboardSearch");
const searchableCards = [...document.querySelectorAll("[data-search]")];
const quickAddButton = document.querySelector("#quickAddButton");
const quickAddModal = document.querySelector("#quickAddModal");
const closeModalButton = document.querySelector("#closeModalButton");
const toast = document.querySelector("#toast");
const quickActions = [...document.querySelectorAll(".quick-actions button")];
const navItems = [...document.querySelectorAll(".nav-item")];

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openQuickAdd() {
  quickAddModal.classList.add("open");
  quickAddModal.setAttribute("aria-hidden", "false");
  closeModalButton.focus();
}

function closeQuickAdd() {
  quickAddModal.classList.remove("open");
  quickAddModal.setAttribute("aria-hidden", "true");
  quickAddButton.focus();
}

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  searchableCards.forEach((card) => {
    const text = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    card.classList.toggle("is-hidden", query.length > 0 && !text.includes(query));
  });

  if (query.length > 1) {
    const visibleCount = searchableCards.filter((card) => !card.classList.contains("is-hidden")).length;
    showToast(`${visibleCount} dashboard sections match "${query}".`);
  }
});

quickAddButton.addEventListener("click", openQuickAdd);
closeModalButton.addEventListener("click", closeQuickAdd);

quickAddModal.addEventListener("click", (event) => {
  if (event.target === quickAddModal) {
    closeQuickAdd();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quickAddModal.classList.contains("open")) {
    closeQuickAdd();
  }
});

quickActions.forEach((button) => {
  button.addEventListener("click", () => {
    closeQuickAdd();
    showToast(`${button.textContent.trim()} started.`);
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    navItems.forEach((navItem) => {
      navItem.classList.remove("active");
      navItem.removeAttribute("aria-current");
    });
    item.classList.add("active");
    item.setAttribute("aria-current", "page");
    showToast(`${item.textContent.trim()} selected.`);
  });
});
