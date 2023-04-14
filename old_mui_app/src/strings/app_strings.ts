let appLang = 'es'
let fallbackLang = 'en'

interface LangValues {
    en?: string
    es?: string
}

interface stringKeyValue {
    [key: string]: string
}

function isLangValues(obj: LangValues | string): obj is stringKeyValue {
    return typeof obj !== 'string'
}

export function lang(values: LangValues | string | stringKeyValue) {
    return {
        get text(): string {
            if (isLangValues(values)) {
                return values[appLang] || values[fallbackLang] || 'no text';
            }
            if (typeof values === 'string') {
                return values;
            }
            return 'no text'
        }
    }
}

const appStrings = {
    login: lang({
        en: 'Login',
        es: 'Iniciar sesión',
    }),
    assets: lang({
        en: 'Assets',
        es: 'Equipos',
    }),
    calendar: lang({
        en: 'Calendar',
        es: 'calendar',
    }),
    home: lang({
        en: 'Home',
        es: 'Inicio',
    }),
    new_request: lang({
        en: 'New request',
        es: 'Nuevo pedido',
    })
}

export { appLang, appStrings }
