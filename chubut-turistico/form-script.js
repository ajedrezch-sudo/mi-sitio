// Form Script for Registration Page

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');

    if (!form) return;

    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if terms are accepted
        const acceptTerms = document.getElementById('acepto');
        if (!acceptTerms.checked) {
            alert('Debe aceptar las bases y condiciones del torneo para continuar.');
            return;
        }

        // Get form data
        const formData = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            sexo: document.getElementById('sexo').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            ciudad: document.getElementById('ciudad').value,
            club: document.getElementById('club').value,
            elo: document.getElementById('elo').value,
            fidaId: document.getElementById('fidaId').value,
            titulo: document.getElementById('titulo').value,
            comida: document.getElementById('comida').checked,
            alojamiento: document.getElementById('alojamiento').value,
            observaciones: document.getElementById('observaciones').value
        };

        // Calculate age
        const birthDate = new Date(formData.fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        // Calculate registration fee based on date
        const cutoffDate = new Date('2025-01-31');
        const registrationFee = today <= cutoffDate ? 50000 : 60000;

        // Create WhatsApp message
        let message = `*INSCRIPCIÓN - 5° Abierto Internacional Chubut Turístico*\n\n`;
        message += `*DATOS PERSONALES*\n`;
        message += `Nombre: ${formData.nombre}\n`;
        message += `DNI: ${formData.dni}\n`;
        message += `Fecha de Nacimiento: ${formData.fechaNacimiento} (${age} años)\n`;
        message += `Sexo: ${formData.sexo}\n\n`;

        message += `*DATOS DE CONTACTO*\n`;
        message += `Email: ${formData.email}\n`;
        message += `Teléfono: ${formData.telefono}\n`;
        message += `Ciudad: ${formData.ciudad}\n`;
        if (formData.club) message += `Club: ${formData.club}\n`;
        message += `\n`;

        message += `*DATOS DE AJEDREZ*\n`;
        if (formData.elo) message += `Rating ELO: ${formData.elo}\n`;
        if (formData.fidaId) message += `FIDA ID: ${formData.fidaId}\n`;
        if (formData.titulo) message += `Título FIDE: ${formData.titulo}\n`;
        message += `\n`;

        message += `*SERVICIOS ADICIONALES*\n`;
        message += `Comida: ${formData.comida ? 'Sí ($9.000)' : 'No'}\n`;
        message += `Alojamiento: ${formData.alojamiento === 'si' ? 'Necesita información' : 'No necesita'}\n`;
        if (formData.observaciones) message += `Observaciones: ${formData.observaciones}\n`;
        message += `\n`;

        message += `*PAGO*\n`;
        message += `Tarifa de inscripción: $${registrationFee.toLocaleString('es-AR')}\n`;
        if (formData.comida) {
            const total = registrationFee + 9000;
            message += `Comida: $9.000\n`;
            message += `Total: $${total.toLocaleString('es-AR')}\n`;
        }

        // Show confirmation modal
        showConfirmationModal(formData, message);
    });

    function showConfirmationModal(formData, message) {
        const modalHtml = `
            <div class="modal fade" id="confirmationModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #024887 0%, #0d5ab9 100%); color: white;">
                            <h5 class="modal-title">Confirmar Inscripción</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Desea enviar su inscripción?</p>
                            <p class="text-muted"><small>Se abrirá WhatsApp con sus datos pre-cargados. Por favor, adjunte también el comprobante de pago.</small></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-tournament-primary" id="sendWhatsApp">Enviar por WhatsApp</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('confirmationModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();

        // WhatsApp button click handler
        document.getElementById('sendWhatsApp').addEventListener('click', function() {
            // Replace with actual WhatsApp number
            const whatsappNumber = '5492945000000'; // TODO: Replace with real number
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            modal.hide();

            // Show success message
            setTimeout(() => {
                showSuccessMessage();
            }, 500);
        });
    }

    function showSuccessMessage() {
        const successHtml = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #024887 0%, #0d5ab9 100%); color: white;">
                            <h5 class="modal-title">¡Gracias por inscribirse!</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <div style="font-size: 60px; margin: 20px 0;">✓</div>
                            <h4>Su inscripción ha sido enviada</h4>
                            <p>Recibirá una confirmación una vez procesemos su pago.</p>
                            <p class="text-muted"><small>No olvide adjuntar el comprobante de pago por WhatsApp.</small></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-tournament-primary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', successHtml);
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Reset form after modal is closed
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
            document.getElementById('registrationForm').reset();
            this.remove();
        });
    }

    // Real-time validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Phone number formatting
    const phoneInput = document.getElementById('telefono');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });

    // Calculate and display age
    const birthDateInput = document.getElementById('fechaNacimiento');
    birthDateInput.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 5 || age > 120) {
            this.setCustomValidity('Por favor, ingrese una fecha de nacimiento válida');
        } else {
            this.setCustomValidity('');
        }
    });

    // Update total cost when services change
    const comidaCheckbox = document.getElementById('comida');
    comidaCheckbox.addEventListener('change', updateTotalCost);

    function updateTotalCost() {
        // This could be used to show a live total at the bottom of the form
        // For now, it's calculated in the submission
    }
});
