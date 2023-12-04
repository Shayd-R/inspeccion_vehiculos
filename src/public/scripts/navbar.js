// const menu = document.querySelector(".cont-ul");
// const openMenuBtn = document.querySelector(".open-menu");
// const closeMenuBtn = document.querySelector(".close-menu");

// function toggleMenu() {
//     menu.classList.toggle("menu-opend");
// }

// openMenuBtn.addEventListener("click", toggleMenu);
// closeMenuBtn.addEventListener("click", toggleMenu);

// const menuLinks = document.querySelectorAll('.menu a[id]');

// function handleMenuClick() {
//     document.querySelectorAll(".menu a.selected").forEach(el => el.classList.remove("selected"));
//     this.classList.add("selected");
//     localStorage.setItem('selectedMenuItem', this.id);
//     menu.classList.remove("menu-opend");
// }

// menuLinks.forEach(link => link.addEventListener('click', handleMenuClick));

// document.addEventListener('DOMContentLoaded', function () {
//     const selectedMenuItemId = localStorage.getItem('selectedMenuItem');
//     if (selectedMenuItemId) {
//         const selectedMenuItem = document.getElementById(selectedMenuItemId);
//         if (selectedMenuItem) {
//             selectedMenuItem.classList.add("selected");
//         }
//     }
// });

// const observer = new IntersectionObserver(
//     (entries) => {
//         entries.forEach((entry) => {
//             const id = entry.target.getAttribute("id");
//             const menuLink = document.querySelector(`.cont-ul a[id="${id}"]`);
//             if (entry.isIntersecting) {
//                 document.querySelectorAll(".cont-ul a.selected").forEach(el => el.classList.remove("selected"));
//                 menuLink.classList.add("selected");
//                 localStorage.setItem('selectedMenuItem', id);
//             }
//         });
//     },
//     { rootMargin: "-30% 0px -70% 0px" }
// );

// const logoLink = document.getElementById('logo');
// const inicioOption = document.getElementById('inicio');

// logoLink.addEventListener('click', function () {
//     document.querySelectorAll(".cont-ul a.selected").forEach(el => el.classList.remove("selected"));
//     inicioOption.classList.add("selected");
//     localStorage.setItem('selectedMenuItem', 'inicio');
// });


menuLinks.forEach(menuLink => {
    menuLink.addEventListener("click", function () {
        menu.classList.remove("menu_opened");
    });
});