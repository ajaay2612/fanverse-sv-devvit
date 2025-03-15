import { writable } from 'svelte/store';

const General = writable({
    userName:"",
    mode:"",
});

export default General;