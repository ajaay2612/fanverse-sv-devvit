import { writable } from 'svelte/store';

const DropDownData = writable([
    {
        name: 'select type',
        options: ['pwr rank', 'battle pol'],
        active:0
    },
    {
        name: 'select style',
        options: [1, 2],
        optionsTwo: [1],
        active:0
    },
    {
        name: 'select color',
        options: ['crimson', 'emerald','amethyst ', 'onyx'],
        optionsTwo: [{name:'blue', class:"blue"}, {name:'green', class:"green"}, {name:'light blue', class:"lBlue"}, {name:'light green', class:"lGreen"}, {name:"purple", class:"purple"}, {name:"dark", class:"dark"}],
        secOptions: [{name:'blue', class:"secBlue"},{name:"purple", class:"secPurple"}, {name:'red', class:"secRed"}, {name:'light green', class:"secGreen"}, {name:'dark', class:"secDark"}],
        active:0
    }

]);

export default DropDownData;