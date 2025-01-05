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
        background-color: var(--clr-background);
        color: var(--clr-text);
        border: 1px solid var(--clr-border);
        cursor: pointer;

        /* Remove default styles */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    select {
        background-image: linear-gradient(45deg, transparent 50%, var(--clr-text) 50%),
        linear-gradient(135deg, var(--clr-text) 50%, transparent 50%);
        background-position:
                calc(100% - 20px) calc(1em + 2px),
                calc(100% - 15px) calc(1em + 2px);
        background-size:
                5px 5px,
                5px 5px;
        background-repeat: no-repeat;
        padding-right: 30px;
    }

    select option {
        background-color: var(--clr-background);
        color: var(--clr-text);
    }

    select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 var(--clr-text);
    }

    select::-ms-expand {
        display: none;
    }

    select:hover {
        border-color: var(--clr-border);
    }

    select:focus {
        outline: none;
        border-color: var(--clr-border);
        box-shadow: 0 0 0 2px var(--clr-border);
        opacity: 0.8;
    }
</style>