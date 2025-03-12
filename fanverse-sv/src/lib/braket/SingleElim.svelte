<script>
    import DropDownData from '../stores/DropDownData';

    // Input is now an array of teams instead of just a number
    $: noOfTeams = $DropDownData[1].options[$DropDownData[1].active];
    // $: noOfTeams = 8
    
    // Calculate number of rounds based on number of teams
    $: rounds = Math.ceil(Math.log2(noOfTeams));
    
    // Store previous team count to detect changes
    let prevTeamCount = noOfTeams;
    
    // Generate match data for the bracket
    $: matches = generateMatches(noOfTeams);

    function generateMatches(teamCount) {
        const totalRounds = Math.ceil(Math.log2(teamCount));
        let allMatches = [];

        // Generate initial round matches
        let roundMatches = [];
        for (let i = 0; i < teamCount; i += 2) {
            if (i + 1 < teamCount) {
                roundMatches.push({
                    team1: `Team ${i + 1}`,
                    team2: `Team ${i + 2}`,
                    winner: null
                });
            } else {
                roundMatches.push({
                    team1: `Team ${i + 1}`,
                    team2: null, // Bye
                    winner: `Team ${i + 1}` // Automatic win for odd team
                });
            }
        }
        allMatches.push(roundMatches);

        // Generate subsequent rounds with empty matches
        let matchCount = Math.ceil(teamCount / 2);
        for (let round = 1; round < totalRounds; round++) {
            matchCount = Math.ceil(matchCount / 2);
            roundMatches = Array(matchCount)
                .fill()
                .map(() => ({
                    team1: null,
                    team2: null,
                    winner: null
                }));
            allMatches.push(roundMatches);
        }

        // If we have matches from previous generation, try to preserve existing information
        if (prevTeamCount !== teamCount && prevTeamCount > 0) {
            prevTeamCount = teamCount;
        }

        return allMatches;
    }
    
    // Update winner when a team is selected
    function selectWinner(roundIndex, matchIndex, team) {
        // Only allow selecting winners in completed matches
        if (!matches[roundIndex][matchIndex].team1 || 
            (!matches[roundIndex][matchIndex].team2 && roundIndex === 0)) {
            return;
        }
        
        matches[roundIndex][matchIndex].winner = team;
        
        // If not the final round, update the next match
        if (roundIndex < rounds - 1) {
            const nextMatchIndex = Math.floor(matchIndex / 2);
            const isTopTeam = matchIndex % 2 === 0;
            
            // Update the next match with this winner
            if (isTopTeam) {
                matches[roundIndex + 1][nextMatchIndex].team1 = team;
            } else {
                matches[roundIndex + 1][nextMatchIndex].team2 = team;
            }
            
            // Clear subsequent rounds
            clearSubsequentRounds(roundIndex + 1);
        } else if (roundIndex === rounds - 1) {
            // Final round - update champion
            champion = team;
        }
        
        // Trigger reactivity
        matches = [...matches];
    }
    
    // Clear data in rounds after the specified round
    function clearSubsequentRounds(startRound) {
        for (let r = startRound + 1; r < rounds; r++) {
            for (let m = 0; m < matches[r].length; m++) {
                matches[r][m].team1 = null;
                matches[r][m].team2 = null;
                matches[r][m].winner = null;
            }
        }
        
        // Clear champion if clearing after semifinals
        // if (startRound < rounds - 1) {
            champion = "...";
        // }
    }
    
    $:console.log(matches);

    // Default champion
    $: champion = "...";
</script>

<div class="customMatchFont-{noOfTeams} overflow-x-scroll  w-full h-fit px-4em xsm:px-2em py-[2.5em] text-white">
    <div class="text-[1.4em] w-fit xsm:w-full xsm:text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center  h-full">
        {#each Array(rounds) as _, roundIndex}
            <div class="flex flex-col gap-[2em] justify-around h-full w-[14em] relative">
                {#each matches[roundIndex] as match, matchIndex}
                    <div class="relative">
                        <!-- Match container -->
                        <div class="flex flex-col w-full">
                            <!-- Team 1 -->
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer"
                                class:winnerTeam={match.winner === match.team1 && match.winner}
                                class:loserTeam={match.winner !== match.team1 && match.winner}
                                on:click={() => selectWinner(roundIndex, matchIndex, match.team1)}
                            >
                                {match.team1 || "..."}
                            </div>
                            <!-- vs divider -->
                            <div
                                class="text-[0.8em] text-center text-[#666] px-[1em]"
                            >
                                vs
                            </div>
                            <!-- Team 2 -->
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer"
                                class:winnerTeam={match.winner === match.team2 && match.winner}
                                class:loserTeam={match.winner !== match.team2 && match.winner}
                                on:click={() => selectWinner(roundIndex, matchIndex, match.team2)}
                            >
                                {match.team2 || "..."}
                            </div>
                        </div>

                        <!-- Connector lines (only for non-final rounds) -->
                        {#if roundIndex < rounds - 1}
                            <div
                                class="absolute top-[calc(50%-0.5px)] left-full w-[4em] h-[1px] bg-pickem-title"
                            ></div>

                            <!-- Vertical connector (for every second match) -->
                            {#if matchIndex % 2 === 0 && matchIndex + 1 < matches[roundIndex].length}
                                <div
                                    class="absolute h-[calc(100%+2em)] top-1/2 -right-[4em] w-[1px] bg-pickem-title"
                                ></div>
                            {/if}
                        {/if}
                        {#if roundIndex < rounds }
                            <div
                                class="absolute top-[calc(50%-0.5em)] right-0 w-[1px] h-[1em] bg-pickem-title"
                            ></div>
                        {/if}
                        {#if roundIndex < rounds && roundIndex !== 0}
                            <div
                                class="absolute top-[calc(50%-0.5px)] right-full w-[4em] h-[1px] bg-pickem-title"
                            ></div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
        
        <!-- Champion block at the end -->
        <div class="flex items-center justify-center h-full w-[14em]">
            <div class="w-full relative">
                <!-- Champion container with trophy icon -->
                <div
                    class="bg-[#3d2424] aspect-[2/1] flex justify-center items-center text-[1.5em] font-bold w-full border-l-[0.25em] border-[#ff9500] border-[0.25em] text-center relative"
                >
                    <!-- Trophy icon -->
                    <div class="absolute top-[-1em] left-1/2 transform -translate-x-1/2 text-[#ffcc00] text-[1.25em]">
                        🏆
                    </div>
                    
                    <!-- Champion name -->
                    <div>
                        {champion}
                    </div>
                </div>
                
                <!-- Connector line to final match -->
                <div
                    class="absolute top-[calc(50%-0.5px)] right-full w-[8em] h-[1px] bg-pickem-title"
                ></div>
            </div>
        </div>
    </div>
</div>