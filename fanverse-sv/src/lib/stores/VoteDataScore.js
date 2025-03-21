import { writable } from 'svelte/store';

const VoteDataRanking = writable({
    canVote: false,
    votesArray: [0,0],
});

export default VoteDataRanking;