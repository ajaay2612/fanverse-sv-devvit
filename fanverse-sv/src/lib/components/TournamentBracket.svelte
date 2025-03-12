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
        if (startRound < rounds - 1) {
            champion = "...";
        }
    }
    
    // Default champion
    $: champion = "...";
</script>

<div class="w-full h-fit px-2 py-10 text-white">
    <div class="text-xs lg:text-xs flex gap-8 justify-center items-center w-full h-full">
        {#each Array(rounds) as _, roundIndex}
            <div class="flex flex-col gap-8 justify-around h-full w-56 relative">
                <h3 class="text-center font-bold text-pickem-title">
                    {roundIndex === 0 ? 'Round 1' : 
                     roundIndex === rounds - 1 ? 'Finals' : 
                     `Round ${roundIndex + 1}`}
                </h3>
                
                {#each matches[roundIndex] as match, matchIndex}
                    <div class="relative">
                        <!-- Match container -->
                        <div class="flex flex-col w-full">
                            <!-- Team 1 -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-base font-bold w-full border-l-1 border-pickem-title cursor-pointer transition-all duration-200 hover:brightness-125"
                                class:border-l-4={match.winner === match.team1}
                                class:border-green-500={match.winner === match.team1}
                                on:click={() => selectWinner(roundIndex, matchIndex, match.team1)}
                            >
                                {match.team1 || "..."}
                            </div>
                            <!-- vs divider -->
                            <div
                                class="text-sm text-center text-gray-500 px-4"
                            >
                                vs
                            </div>
                            <!-- Team 2 -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-base font-bold w-full border-l-1 border-pickem-title cursor-pointer transition-all duration-200 hover:brightness-125"
                                class:border-l-4={match.winner === match.team2}
                                class:border-green-500={match.winner === match.team2}
                                on:click={() => selectWinner(roundIndex, matchIndex, match.team2)}
                            >
                                {match.team2 || "..."}
                            </div>
                        </div>

                        <!-- Connector lines (only for non-final rounds) -->
                        {#if roundIndex < rounds - 1}
                            <div
                                class="absolute top-1/2 left-full w-16 h-px bg-pickem-title"
                            ></div>

                            <!-- Vertical connector (for every second match) -->
                            {#if matchIndex % 2 === 0 && matchIndex + 1 < matches[roundIndex].length}
                                <div
                                    class="absolute h-[calc(100%+2rem)] top-1/2 -right-16 w-px bg-pickem-title"
                                ></div>
                            {/if}
                        {/if}
                        
                        <!-- Right side connection point -->
                        {#if roundIndex < rounds}
                            <div
                                class="absolute top-[calc(50%-0.5rem)] right-0 w-px h-4 bg-pickem-title"
                            ></div>
                        {/if}
                        
                        <!-- Left side connection point (except first round) -->
                        {#if roundIndex < rounds && roundIndex !== 0}
                            <div
                                class="absolute top-1/2 right-full w-16 h-px bg-pickem-title"
                            ></div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
        
        <!-- Champion block at the end -->
        <div class="flex flex-col items-center justify-center h-full w-56">
            <h3 class="text-center font-bold text-yellow-500 mb-8">Champion</h3>
            <div class="w-full relative">
                <!-- Champion container with trophy icon -->
                <div
                    class="bg-[#3d2424] aspect-[2/1] flex justify-center items-center text-xl font-bold w-full border-1 border-yellow-500 border text-center relative"
                >
                    <!-- Trophy icon -->
                    <div class="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 text-yellow-400 text-xl">
                        🏆
                    </div>
                    
                    <!-- Champion name -->
                    <div>
                        {champion}
                    </div>
                </div>
                
                <!-- Connector line to final match -->
                <div
                    class="absolute top-1/2 right-full w-16 h-px bg-pickem-title"
                ></div>
            </div>
        </div>
    </div>
</div>