import {
	writable
} from 'svelte/store';

const TeamPickerData = writable({
	showTeamPicker: false,
	teamPickerIndex: 0,
	updateArray: null,
});

export default TeamPickerData;