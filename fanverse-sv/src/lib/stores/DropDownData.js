import { writable } from 'svelte/store';

const DropDownData = writable([
    {
        name: 'select type',
        options: ['single', 'double',"multi"],
        active:0
    },
    {
        name: 'number of teams',
        options: [4, 8],
        active:0
    },
    {
        name: 'select style',
        
    },
    {
        name: 'select color',
        options: ['crimson', 'emerald','amethyst ', 'onyx'],
        active:0
    },
    {
        name: 'select category'
    },

]);

export default DropDownData;