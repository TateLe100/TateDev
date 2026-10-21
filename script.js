/* Tate — personal site
   jQuery: mobile menu, scrollspy, copy-email. */

$(function () {
  /* --- Mobile menu -------------------------------------- */

  var $menu = $(".menu");
  var $nav = $("#nav");

  $menu.on("click", function () {
    var open = $menu.attr("aria-expanded") === "true";
    $menu.attr("aria-expanded", !open);
    $nav.slideToggle(180);
  });

  // Close the menu after tapping a link on small screens.
  $nav.on("click", "a", function () {
    if (window.matchMedia("(max-width: 59.99rem)").matches) {
      $menu.attr("aria-expanded", "false");
      $nav.slideUp(140);
    }
  });

  // Clear inline styles jQuery leaves behind when resizing up to desktop.
  $(window).on("resize", function () {
    if (window.matchMedia("(min-width: 60rem)").matches) {
      $nav.removeAttr("style");
      $menu.attr("aria-expanded", "false");
    }
  });

  /* --- Scrollspy ---------------------------------------- */

  var $links = $(".nav a");
  var $sections = $("section[id]");

  function markCurrent() {
    var line = $(window).scrollTop() + $(window).height() * 0.3;
    var id = $sections.first().attr("id");

    $sections.each(function () {
      if ($(this).offset().top <= line) {
        id = this.id;
      }
    });

    $links
      .removeClass("is-current")
      .filter('[href="#' + id + '"]')
      .addClass("is-current");
  }

  // Throttle to one check per animation frame.
  var queued = false;
  $(window).on("scroll resize", function () {
    if (queued) {
      return;
    }
    queued = true;
    window.requestAnimationFrame(function () {
      markCurrent();
      queued = false;
    });
  });

  markCurrent();

  /* --- Copy email --------------------------------------- */

  $(".copy").on("click", function () {
    var $btn = $(this);
    var email = $btn.data("email");

    function done(ok) {
      $btn.text(ok ? "Copied" : "Press Ctrl+C").addClass("is-done");
      setTimeout(function () {
        $btn.text("Copy email").removeClass("is-done");
      }, 2200);
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(
        function () {
          done(true);
        },
        function () {
          done(false);
        },
      );
    } else {
      var $tmp = $("<input>").val(email).appendTo("body").select();
      try {
        document.execCommand("copy");
        done(true);
      } catch (e) {
        done(false);
      }
      $tmp.remove();
    }
  });
});

/* --- Screenshot viewer ---------------------------------- */
/* Without <dialog> support (or without JS) the thumbnails are plain links
   to the image, so they still work. */

$(function () {
  var dlg = document.getElementById("lightbox");
  if (!dlg || typeof dlg.showModal !== "function") {
    return;
  }

  var $img = $("#lightbox-img");
  var $title = $("#lightbox-title");

  $(".shot").on("click", function (e) {
    e.preventDefault();
    var $a = $(this);
    $img.attr({ src: $a.attr("href"), alt: $a.data("alt") });
    $title.text($a.data("title"));
    dlg.showModal();
    dlg.scrollTop = 0;
  });

  $("#lightbox-close").on("click", function () {
    dlg.close();
  });

  // Clicking the dimmed area outside the image closes it.
  $(dlg).on("click", function (e) {
    if (e.target === dlg) {
      dlg.close();
    }
  });
});
