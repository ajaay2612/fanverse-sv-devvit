import { writable } from 'svelte/store';

const VoteData = writable({
    canVote: false,
    bracketData:null,
    totalVotes:0,
});

export default VoteData;