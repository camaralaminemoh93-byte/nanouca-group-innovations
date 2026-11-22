(function () {
  var page = document.body.getAttribute("data-page");
  var links = document.querySelectorAll(".site-nav a[data-page], .footer-nav a[data-page]");
  links.forEach(function (link) {
    if (link.getAttribute("data-page") === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 4);
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

  var form = document.querySelector("#contact-form");
  if (!form) return;

  var success = document.querySelector("#form-success");
  var fields = {
    nom: form.querySelector('[name="nom"]'),
    email: form.querySelector('[name="email"]'),
    sujet: form.querySelector('[name="sujet"]'),
    message: form.querySelector('[name="message"]')
  };

  function setError(input, message) {
    var slot = input.closest(".field").querySelector(".error");
    slot.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  [fields.nom, fields.email, fields.sujet, fields.message].forEach(function (input) {
    function clear() {
      setError(input, "");
    }
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

    var entry = {
      nom: nom,
      email: email,
      telephone: form.querySelector('[name="telephone"]').value.trim(),
      sujet: sujet,
      message: message,
      date: new Date().toISOString()
    };

    try {
      var key = "nanouca-messages";
      var all = JSON.parse(localStorage.getItem(key) || "[]");
      all.push(entry);
      localStorage.setItem(key, JSON.stringify(all));
    } catch (err) {
      /* La confirmation reste affichée même si le stockage local est bloqué. */
    }

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
