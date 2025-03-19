import { writable } from 'svelte/store';

const VoteDataMulti = writable({
    canVote: false,
    bracketDataLeft:null,
    bracketDataRight:null,
    champion:null,
    totalVotes:0,
});

export default VoteDataMulti;