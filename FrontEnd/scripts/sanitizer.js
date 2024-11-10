/**
 * Module de sanitization des entrées utilisateur
 */

export const sanitizer = {
    /**
     * Nettoie une chaîne de caractères des caractères spéciaux HTML
     */
    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Nettoie les entrées d'un formulaire
     */
    sanitizeFormData: formData => Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
            key,
            typeof value === 'string' ? this.sanitizeString(value.trim()) : value
        ])
    ),

    /**
     * Valide une adresse email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};