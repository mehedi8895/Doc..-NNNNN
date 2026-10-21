"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

function closeMenu() {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "মেনু খুলুন");
  navLinks.classList.remove("is-open");
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "মেনু খুলুন" : "মেনু বন্ধ করুন");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("is-open") &&
      !navLinks.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 781px)").matches) closeMenu();
  });
}

const appointmentForm = document.querySelector("#appointment-form");
const formMessage = document.querySelector("#form-message");

if (appointmentForm && formMessage) {
  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent =
      "এটি একটি ফর্ম—আপনার তথ্য পাঠানো হয়নি। কোনো তথ্য সার্ভারে পাঠানো বা সংরক্ষণ করা হয়নি।";
    formMessage.classList.add("is-confirmed");
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());