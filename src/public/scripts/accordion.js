document.addEventListener("DOMContentLoaded", function () {
    const acordionContent = document.querySelectorAll(".accordion-content");


    acordionContent.forEach((item, index) => {
        let header = item.querySelector(".header");
        header.addEventListener("click", () => {
            item.classList.toggle("open");

            let description = item.querySelector(".description");
            if (item.classList.contains("open")) {
                description.style.height = `${description.scrollHeight}px`;
                item.querySelector("i").classList.replace("fa-plus", "fa-minus");
            } else {
                description.style.height = "0px";
                item.querySelector("i").classList.replace("fa-minus", "fa-plus");
            }
            removeOpen(index);
        })
    })

    function removeOpen(index1) {
        acordionContent.forEach((item2, index2) => {
            if (index1 != index2) {
                item2.classList.remove("open");

                let des = item2.querySelector(".description");
                des.style.height = "0px";
                item2.querySelector("i").classList.replace("fa-minus", "fa-plus");
            }
        })
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modal = document.getElementById("dibujarFirmaModal");

    // Mostrar el modal al hacer clic en el botón
    openModalBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Ocultar el modal al hacer clic en el botón de cierre
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Ocultar el modal al hacer clic fuera del contenido del modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
