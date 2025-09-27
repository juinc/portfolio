import { ref, markRaw } from 'vue'

import VueLogo from '@/assets/icons/tech/vue.svg'
import TailwindLogo from '@/assets/icons/tech/tailwind.svg'
import JavascriptLogo from '@/assets/icons/tech/js.svg'
import PythonLogo from '@/assets/icons/tech/python.svg'
import LuaLogo from '@/assets/icons/tech/lua.svg'
import cppLogo from '@/assets/icons/tech/cpp.svg'

import GithubIcon from '@/assets/icons/socials/githubFilled.svg'
import LinkedinIcon from '@/assets/icons/socials/linkedin.svg'
import DiscordLogo from '@/assets/icons/socials/discord.svg'
import RobloxLogo from '@/assets/icons/tech/roblox-icon.svg'

const iconRegistry = {
    tech: {
        'vue': markRaw(VueLogo),
        'vuejs': markRaw(VueLogo),
        'tailwind': markRaw(TailwindLogo),
        'tailwindcss': markRaw(TailwindLogo),
        'javascript': markRaw(JavascriptLogo),
        'python': markRaw(PythonLogo),
        'luau': markRaw(LuaLogo),
        'lua': markRaw(LuaLogo),
        'Discord.py': markRaw(PythonLogo),
        'C++': markRaw(cppLogo),
    },

    social: {
        'github': markRaw(GithubIcon),
        'linkedin': markRaw(LinkedinIcon),
        'discord': markRaw(DiscordLogo),
        'roblox': markRaw(RobloxLogo),
    },

    general: {
    }
}

const getAllIcons = () => {
    const allIcons = {}
    Object.values(iconRegistry).forEach(category => {
        Object.assign(allIcons, category)
    })
    return allIcons
}

export const useIcons = () => {
    const normalizeIconName = (name) => {
        return name.toLowerCase().replace(/[\s.-]/g, '')
    }

    const getIcon = (iconName, category = null) => {
        const normalizedName = normalizeIconName(iconName)

        if (category && iconRegistry[category]) {
            const categoryIcon = iconRegistry[category][normalizedName]
            if (categoryIcon) return categoryIcon
        }

        const allIcons = getAllIcons()
        return allIcons[normalizedName] || null
    }

    const getIconFromCategory = (iconName, category) => {
        const normalizedName = normalizeIconName(iconName)

        if (!iconRegistry[category]) {
            console.warn(`Icon category "${category}" does not exist`)
            return null
        }

        return iconRegistry[category][normalizedName] || null
    }

    const addIcon = (iconName, iconComponent, category = 'general') => {
        const normalizedName = normalizeIconName(iconName)

        if (!iconRegistry[category]) {
            iconRegistry[category] = {}
        }

        iconRegistry[category][normalizedName] = markRaw(iconComponent)
    }

    const addIconCategory = (categoryName, icons = {}) => {
        if (!iconRegistry[categoryName]) {
            iconRegistry[categoryName] = {}
        }

        Object.entries(icons).forEach(([name, component]) => {
            const normalizedName = normalizeIconName(name)
            iconRegistry[categoryName][normalizedName] = markRaw(component)
        })
    }

    const getAvailableCategories = () => {
        return Object.keys(iconRegistry)
    }

    const getAvailableIcons = (category = null) => {
        if (category) {
            return iconRegistry[category] ? Object.keys(iconRegistry[category]) : []
        }

        return Object.keys(getAllIcons())
    }

    const iconExists = (iconName, category = null) => {
        return getIcon(iconName, category) !== null
    }

    return {
        getIcon,
        getIconFromCategory,

        addIcon,
        addIconCategory,

        getAvailableCategories,
        getAvailableIcons,
        iconExists,
        normalizeIconName,

        iconRegistry: ref(iconRegistry)
    }
}

export const useTechIcons = () => {
    const { getIconFromCategory, addIcon, getAvailableIcons } = useIcons()

    return {
        getTechnologyIcon: (techName) => getIconFromCategory(techName, 'tech'),
        addTechnologyIcon: (name, component) => addIcon(name, component, 'tech'),
        availableTechIcons: getAvailableIcons('tech')
    }
}

export const useSocialIcons = () => {
    const { getIconFromCategory, addIcon, getAvailableIcons } = useIcons()

    return {
        getSocialIcon: (socialName) => getIconFromCategory(socialName, 'social'),
        addSocialIcon: (name, component) => addIcon(name, component, 'social'),
        availableSocialIcons: getAvailableIcons('social')
    }
}