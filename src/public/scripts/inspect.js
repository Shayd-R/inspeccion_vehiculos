document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        allInput = form.querySelectorAll(".first input");
    nextBtn.addEventListener("click", () => {
        allInput.forEach(input => {
            if (input.value != "") {
                form.classList.add('secActive');
            } else {
                form.classList.remove('secActive');
            }
        })
    });

    backBtn.addEventListener("click", () => {
        form.classList.remove('secActive');
    });

});

// Modal Firma

document.addEventListener("DOMContentLoaded", function () {
    // try {
    //     document.getElementById('inputFirma').addEventListener('change', function () {
    //         var inputFirma = document.getElementById('inputFirma');
    //         var firmaPrevia = document.getElementById('firmaPrevia');

    //         if (inputFirma.files.length > 0) {
    //             var selectedImage = inputFirma.files[0];
    //             var reader = new FileReader();

    //             reader.onload = function (e) {
    //                 var imageData = e.target.result;
    //                 firmaPrevia.src = imageData;
    //                 firmaPrevia.style.display = 'block';

    //                 $('#modalFirma').modal('hide');
    //             };

    //             reader.readAsDataURL(selectedImage);
    //         }
    //     });
    // } catch (error) {
    //     console.error("Se produjo un error:", error);
    // }


    try {
        const firmaForm = document.getElementById('forms');
        var canvas = document.getElementById('signature');
        var signaturePad = new SignaturePad(canvas);
        const modal = document.getElementById("dibujarFirmaModal");

        document.getElementById('guardarFirma').addEventListener('click', function () {
            var signatureData = signaturePad.toDataURL(); // Obtiene la firm como una imagen en formato base64

            // Actualiza la fuente de la imagen con la firm previa
            var firmaPrevia = document.getElementById('firmaPrevia');
            firmaPrevia.src = signatureData;
            firmaPrevia.style.background = 'var(--theme-color)';
            firmaPrevia.style.display = 'block';

            //const firmImagen = canvas.toDataURL('image/png');
            const firmaInput = document.createElement('input');
            firmaInput.type = 'hidden';
            firmaInput.name = 'signature';
            firmaInput.value = signatureData;
            firmaForm.appendChild(firmaInput);

            modal.style.display = 'none';
        });

        document.getElementById('borrarFirma').addEventListener('click', function () {
            signaturePad.clear();
            var firmaPrevia = document.getElementById('firmaPrevia');
            firmaPrevia.src = '';
            firmaPrevia.style.display = 'none';
        });
    } catch (error) {
        console.error("Se produjo un error:", error);
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



var selectElement = document.getElementById("licenseCategoryId");
var options = selectElement.options;
var selectedValue = "{{driver.idLicenseCategory}}";

for (var i = 1; i < options.length; i++) {
    var option = options[i];
    if (option.value === selectedValue) {

        option.style.display = "none";
    } else {
        option.style.display = "";
    }
}