document.addEventListener('DOMContentLoaded', function() {
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const issue = document.getElementById('issue').value;
            
            // Aquí normalmente enviarías los datos a un servidor
            console.log('Formulario enviado:', { name, email, issue });
            
            // Simulamos una respuesta exitosa
            alert('Gracias por contactarnos. Nos pondremos en contacto contigo pronto.');
            supportForm.reset();
        });
    }

    // Smooth scrolling para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
