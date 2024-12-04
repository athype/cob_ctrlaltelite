import App from './App.svelte'
import {mount} from "svelte";

import './app.css'
import './style/modernnormalize.css'
import './style/utils.css'
import './style/style.css'


const app = mount(App, {
    target: document.getElementById('app'),
})

export default app
