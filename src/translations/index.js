import i18next from "i18next";
import {en} from "./en";
import {es} from "./es";
i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: window.location.pathname.substring(1,2) === 'es' ? 'es' : 'en', // language to use
    resources: {
        en: {
            translation: en
        },
        es: {
            translation: es
        }
    },
});
export default i18next;
