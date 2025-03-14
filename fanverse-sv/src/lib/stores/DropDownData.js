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
        name: 'select color'
    },
    {
        name: 'select category'
    },

]);

export default DropDownData;