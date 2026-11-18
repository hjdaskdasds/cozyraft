(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("primary-nav");
  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      links.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) setOpen(false);
    });
  }

  /* Reveal sections as they come into view */
  var revealables = document.querySelectorAll(".reveal");
  var revealAll = function () {
    revealables.forEach(function (item) { item.classList.add("is-visible"); });
  };
  if ("IntersectionObserver" in window && revealables.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (item) { revealObserver.observe(item); });
    /* Safety net: nothing stays hidden if the observer never fires. */
    window.setTimeout(revealAll, 1600);
  } else {
    revealAll();
  }

  /* Legal table of contents: highlight the section being read */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".legal-toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var sections = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var setActive = function (id) {
      tocLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { spy.observe(section); });
    if (sections[0]) setActive(sections[0].id);
  }
})();
