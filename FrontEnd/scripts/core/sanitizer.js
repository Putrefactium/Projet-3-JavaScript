/**
 * Module de sanitization des entrées utilisateur
 */

import DOMPurify from '../../../Backend/node_modules/dompurify/dist/purify.es.mjs';

export const sanitizer = {
    /**
     * Nettoie une chaîne de caractères des caractères spéciaux HTML
     * @param {string} str - La chaîne à nettoyer
     * @returns {string} - La chaîne nettoyée
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return DOMPurify.sanitize(str, {
            ALLOWED_TAGS: [], // N'autorise aucune balise HTML
            ALLOWED_ATTR: [], // N'autorise aucun attribut
            RETURN_DOM: false, // Retourne une chaîne de caractères
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM_IMPORT: false,
            WHOLE_DOCUMENT: false,
            FORCE_BODY: false
        });
    },

    /**
     * Nettoie les entrées d'un formulaire
     * @param {Object} formData - Les données du formulaire
     * @returns {Object} - Les données nettoyées
     */
    sanitizeFormData(formData) {
        return Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                typeof value === 'string' ? this.sanitizeString(value.trim()) : value
            ])
        );
    },

    /**
     * Valide une adresse email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Protection contre les injections SQL
     * @param {string} value - La valeur à sécuriser
     * @returns {string} - La valeur sécurisée
     */
    sanitizeSQLInput(value) {
        if (typeof value !== 'string') return '';
        // Échapper les caractères spéciaux SQL
        return value
            .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
                switch (char) {
                    case "\0":
                        return "\\0";
                    case "\x08":
                        return "\\b";
                    case "\x09":
                        return "\\t";
                    case "\x1a":
                        return "\\z";
                    case "\n":
                        return "\\n";
                    case "\r":
                        return "\\r";
                    case "\"":
                    case "'":
                    case "\\":
                    case "%":
                        return "\\"+char; // préfixe avec un backslash
                }
            });
    },

    /**
     * Nettoie les données pour la base de données
     * @param {Object} data - Les données à nettoyer
     * @returns {Object} - Les données nettoyées
     */
    sanitizeDatabaseInput(data) {
        const sanitizedData = this.sanitizeFormData(data);
        return Object.fromEntries(
            Object.entries(sanitizedData).map(([key, value]) => [
                key,
                typeof value === 'string' ? this.sanitizeSQLInput(value) : value
            ])
        );
    }
};