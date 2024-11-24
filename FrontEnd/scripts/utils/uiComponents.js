/**
 * Composants UI réutilisables
 * @module uiComponents
 */

/**
 * Crée une boîte de dialogue de confirmation
 * @param {string} message - Le message à afficher
 * @returns {HTMLElement} L'élément de dialogue créé
 */
export function createConfirmDialog(message) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <p>${message}</p>
            <div class="dialog-buttons">
                <button class="dialog-button confirm-button">Confirmer</button>
                <button class="dialog-button cancel-button">Annuler</button>
            </div>
        </div>
    `;
    return dialog;
}

/**
 * Affiche une boîte de dialogue de confirmation de suppression
 * @param {number} workId - L'ID du work à supprimer
 * @returns {Promise<boolean>} La réponse de l'utilisateur
 */
export function showDeleteConfirmation(workId) {
    return new Promise((resolve) => {
        const dialog = createConfirmDialog('Êtes-vous sûr de vouloir supprimer ce projet ?');
        document.body.appendChild(dialog);

        const confirmBtn = dialog.querySelector('.confirm-button');
        const cancelBtn = dialog.querySelector('.cancel-button');

        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(false);
        });
    });
}

/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification ('success' ou 'error')
 */
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.add('hide');
    }, 2700);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
} 