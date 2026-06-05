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
      false
    );
  });

  // Language dropdown functionality
  const langBtn = document.getElementById("lang-btn");
  const langOption = document.getElementById("lang-option");

  // Load saved language from localStorage
  let currentLang = localStorage.getItem("selectedLanguage") || "en";
  updateLangDisplay(currentLang);

  // Handle dropdown item click to toggle language
  langOption.addEventListener("click", (e) => {
    e.preventDefault();
    currentLang = currentLang === "en" ? "hi" : "en";
    updateLangDisplay(currentLang);
    localStorage.setItem("selectedLanguage", currentLang);
    // Here you can add code to actually switch the language of the page content
  });

  function updateLangDisplay(lang) {
    if (lang === "en") {
      langBtn.textContent = "English";
      langOption.textContent = "Hindi";
      langOption.setAttribute("data-lang", "hi");
    } else if (lang === "hi") {
      langBtn.textContent = "Hindi";
      langOption.textContent = "English";
      langOption.setAttribute("data-lang", "en");
    }
  }
})();


// cards animation

const cards = document.querySelectorAll(".more-explore-card");

cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 20; // left-right
        const rotateX = -((y / rect.height) - 0.5) * 20; // up-down

        card.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform =
            "rotateX(0deg) rotateY(0deg) scale(1)";
    });
});





