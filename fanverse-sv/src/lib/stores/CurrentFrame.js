import { writable } from 'svelte/store';

const CurrentFrame = writable("score");

export default CurrentFrame;