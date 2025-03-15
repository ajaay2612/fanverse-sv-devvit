import { writable } from 'svelte/store';

const BackgroundImage = writable({
    url:"",
});

export default BackgroundImage;