(() => {
  "use strict";

  const searchForm = document.getElementById("listing-search-form");
  const searchInput = document.getElementById("listing-search");
  const categoryButtons = document.querySelectorAll(".filter[data-category]");
  const listingCards = document.querySelectorAll(".listing-result");
  const taxSwitch = document.getElementById("tax-switch");
  const emptyState = document.getElementById("listing-empty-state");
  const resultsMessage = document.getElementById("listing-results-message");
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
  let selectedCategory = "all";

  const updateListings = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    listingCards.forEach((card) => {
      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;
      const matchesSearch = card.dataset.search.includes(searchTerm);
      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
    resultsMessage.textContent = `${visibleCount} ${
      visibleCount === 1 ? "stay" : "stays"
    }`;
  };

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateListings();
    });
    searchInput.addEventListener("input", updateListings);
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      categoryButtons.forEach((categoryButton) => {
        const isSelected = categoryButton === button;
        categoryButton.classList.toggle("is-active", isSelected);
        categoryButton.setAttribute("aria-pressed", String(isSelected));
      });
      updateListings();
    });
  });

  const updateTaxDisplay = () => {
    const showTaxIncluded = taxSwitch.checked;

    document.querySelectorAll(".listing-price").forEach((priceElement) => {
      const price = Number(priceElement.dataset.price);
      const basePrice = priceElement.querySelector(".price-base");
      const taxPrice = priceElement.querySelector(".tax-info");

      if (!Number.isFinite(price) || !basePrice || !taxPrice) return;

      basePrice.hidden = showTaxIncluded;
      taxPrice.hidden = !showTaxIncluded;
      taxPrice.textContent = `${currencyFormatter.format(
        price * 1.18,
      )} incl. 18% GST`;
    });

    document.querySelectorAll(".price-period").forEach((period) => {
      period.textContent = showTaxIncluded
        ? " / night (tax included)"
        : " / night";
    });
  };

  if (taxSwitch) {
    taxSwitch.addEventListener("change", updateTaxDisplay);
    updateTaxDisplay();
  }

  updateListings();
})();
