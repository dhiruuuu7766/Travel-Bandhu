(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });

  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");
    const themeLabel = themeToggle.querySelector("span");

    const setTheme = (theme) => {
      const isDark = theme === "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.bsTheme = theme;
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${isDark ? "light" : "dark"} mode`,
      );
      themeIcon.className = isDark
        ? "fa-regular fa-sun"
        : "fa-regular fa-moon";
      themeLabel.textContent = isDark ? "Light mode" : "Dark mode";

      try {
        localStorage.setItem("wanderlust-theme", theme);
      } catch (error) {
        // Keep the current-page toggle working if storage is unavailable.
      }
    };

    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });

    setTheme(document.documentElement.dataset.theme || "light");
  }
})();
