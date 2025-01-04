<script>

    import { theme, THEMES, setTheme } from '../stores/theme';

    function handleChange(e) {
        const newTheme = e.currentTarget.value;
        setTheme(newTheme);
    }

</script>

<div class="theme-switch">
    <select
            value={$theme}
            on:change={handleChange}
    >
        <option value={THEMES.LIGHT}>Light Mode</option>
        <option value={THEMES.DARK}>Dark Mode</option>
        <option value={THEMES.CONTRAST}>High Contrast</option>
    </select>
</div>

<style>
    .theme-switch {
        padding: 1rem;
    }
    select {
        padding: 0.5rem;
        border-radius: 4px;
        background-color: var(--background-color);
        color: var(--text-color);
        border: 1px solid var(--secondary-color);
    }
</style>