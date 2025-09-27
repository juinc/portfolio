import '@/assets/base.css'

import { createApp } from 'vue'
import App from '@/App.vue'

import { createI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Localization / The language switch
import en from '@/locales/en.json'
import ro from '@/locales/ro.json'
import es from '@/locales/es.json'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        ro,
        es
    }
})

const app = createApp(App)

app.use(i18n)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
