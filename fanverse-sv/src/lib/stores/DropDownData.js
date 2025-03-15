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
        options: [1, 2],
        active:0
    },
    {
        name: 'select color',
        options: ['crimson', 'emerald','amethyst ', 'onyx'],
        optionsTwo: [{name:'blue', class:"blue"}, {name:'green', class:"green"}, {name:'light blue', class:"lBlue"}, {name:'light green', class:"lGreen"}, {name:"purple", class:"purple"}, {name:"dark", class:"dark"}],
        active:0
    },
    {
        name: 'select category'
    },

]);

export default DropDownData;