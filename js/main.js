(function () {
  var WA = "224611491149";

  function waUrl(text) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  }

  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".site-nav a[data-page], .footer-nav a[data-page]").forEach(function (link) {
    if (link.getAttribute("data-page") === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var box = document.querySelector(".nav-check");
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      setTimeout(function () {
        if (box) box.checked = false;
      }, 300);
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (!document.querySelector(".wa-float")) {
    var floatLink = document.createElement("a");
    floatLink.className = "wa-float";
    floatLink.href = waUrl("Bonjour Nanouca Group Innovations, je vous contacte depuis le site.");
    floatLink.target = "_blank";
    floatLink.rel = "noopener";
    floatLink.setAttribute("aria-label", "Écrire sur WhatsApp au +224 611 49 11 49");
    floatLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.87c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.2-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.36.24-.26.64-.38.86-.38.2 0 .42 0 .6.01.2.01.46-.07.72.55.26.64.9 2.2.98 2.36.08.16.14.36.03.57-.1.22-.16.35-.32.54-.16.19-.33.42-.47.56-.16.16-.32.33-.14.64.18.32.82 1.35 1.76 2.19 1.21 1.08 2.23 1.42 2.55 1.58.32.16.5.13.69-.08.18-.2.8-.93 1.02-1.25.21-.32.43-.26.72-.16.3.1 1.87.88 2.19 1.04.32.16.54.24.62.37.08.13.08.76-.16 1.44z"/></svg><span>WhatsApp</span>';
    document.body.appendChild(floatLink);
  }

  var form = document.querySelector("#contact-form");
  if (!form) return;

  var success = document.querySelector("#form-success");
  var fields = {
    nom: form.querySelector('[name="nom"]'),
    email: form.querySelector('[name="email"]'),
    sujet: form.querySelector('[name="sujet"]'),
    message: form.querySelector('[name="message"]')
  };

  var sujetParam = new URLSearchParams(window.location.search).get("sujet");
  if (sujetParam) {
    Array.prototype.forEach.call(fields.sujet.options, function (option) {
      if (option.text === sujetParam) fields.sujet.value = option.value || option.text;
    });
  }

  function setError(input, message) {
    var slot = input.closest(".field").querySelector(".error");
    slot.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  [fields.nom, fields.email, fields.sujet, fields.message].forEach(function (input) {
    function clear() { setError(input, ""); }
    input.addEventListener("input", clear);
    input.addEventListener("change", clear);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var honey = form.querySelector('[name="societe"]');
    if (honey && honey.value.trim()) return;

    var nom = fields.nom.value.trim();
    var email = fields.email.value.trim();
    var sujet = fields.sujet.value;
    var message = fields.message.value.trim();
    var telephone = form.querySelector('[name="telephone"]').value.trim();
    var ok = true;

    if (nom.length < 2) {
      setError(fields.nom, "Indiquez votre nom.");
      ok = false;
    } else setError(fields.nom, "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(fields.email, "Indiquez un e-mail valide.");
      ok = false;
    } else setError(fields.email, "");

    if (!sujet) {
      setError(fields.sujet, "Choisissez un sujet.");
      ok = false;
    } else setError(fields.sujet, "");

    if (message.length < 10) {
      setError(fields.message, "Écrivez au moins quelques mots (10 caractères).");
      ok = false;
    } else setError(fields.message, "");

    if (!ok) {
      var first = form.querySelector("[aria-invalid='true']");
      if (first) first.focus();
      return;
    }

    var lines = [
      "Bonjour Nanouca Group Innovations,",
      "",
      "Je suis " + nom + ".",
      "E-mail : " + email,
      telephone ? "Téléphone : " + telephone : "",
      "Sujet : " + sujet,
      "",
      message
    ].filter(function (line) { return line !== ""; });

    var url = waUrl(lines.join("\n"));
    var opener = success.querySelector("#wa-open");
    if (opener) opener.href = url;

    var popup = window.open(url, "_blank");
    if (popup) popup.opener = null;

    form.hidden = true;
    success.hidden = false;
    success.querySelector("[data-name]").textContent = nom;
    success.querySelector("[data-sujet]").textContent = sujet;
    success.focus();
  });

  var again = document.querySelector("#write-again");
  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      fields.nom.focus();
    });
  }
})();
