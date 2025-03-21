import { writable } from 'svelte/store';

const VoteDataRanking = writable({
    canVote: true,
    votesArray: [0,0],
});

export default VoteDataRanking;