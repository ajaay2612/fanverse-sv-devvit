import { writable } from 'svelte/store';

const DropDownData = writable([
    {
        name: 'select type',
        options: ['plain', 'votable'],
        active:0
    },
    {
        name: 'select color',
        options: [{name:'dark blue', class:"scoreDarkBlue"}, {name:'blue', class:"scoreBlue"}, {name:'light blue', class:"scoreLightBlue"} , {name:'green', class:"scoreGreen"}],
        optionsTwo: [{name:'blue', class:"blue"}, {name:'green', class:"green"}, {name:'light blue', class:"lBlue"}, {name:'light green', class:"lGreen"}, {name:"purple", class:"purple"}, {name:"dark", class:"dark"}],
        active:0
    }

]);

export default DropDownData;