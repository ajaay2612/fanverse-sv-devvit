import { writable } from 'svelte/store';

const VoteDataRanking = writable({
    canVote: false,
    votesArray: [],
});

export default VoteDataRanking;