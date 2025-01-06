import {writable} from "svelte/store";

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    CONTRAST: 'contrast'
};

export const theme = writable(
    // Check localStorage first, then system preference, default to light
    typeof window !== 'undefined'
        ? localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT)
        : THEMES.LIGHT
);

export function setTheme(newTheme) {
    theme.set(newTheme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }
};

if (typeof window !== 'undefined') {
    theme.subscribe(value => {
        document.documentElement.setAttribute('data-theme', value);
    });
};