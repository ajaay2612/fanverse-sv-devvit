<script>
    // Input is now an array of teams instead of just a number
    export let teams = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"];
    
    // Calculate number of teams from the array length
    $: noOfTeams = teams.length;
    
    // Calculate number of rounds based on number of teams
    $: rounds = Math.ceil(Math.log2(noOfTeams));

    // Generate match data for the bracket
    $: matches = generateMatches(teams);

    function generateMatches(teamsArray) {
        const teamCount = teamsArray.length;
        const totalRounds = Math.ceil(Math.log2(teamCount));
        let allMatches = [];

        // Generate initial round matches
        let roundMatches = [];
        for (let i = 0; i < teamCount; i += 2) {
            if (i + 1 < teamCount) {
                roundMatches.push({
                    team1: teamsArray[i],
                    team2: teamsArray[i + 1],
                });
            } else {
                roundMatches.push({
                    team1: teamsArray[i],
                    team2: null, // Bye
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
                }));
            allMatches.push(roundMatches);
        }

        return allMatches;
    }
    
    // Default champion is the first team
    $: champion = teams[0] || "TBD";
</script>

<div class="w-full h-fit px-2em py-[2.5em] text-white">
    <div class="text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center w-full h-full">
        {#each Array(rounds) as _, roundIndex}
            <div class="flex flex-col gap-[2em] justify-around h-full w-[14em] relative">
                {#each matches[roundIndex] as match, matchIndex}
                    <div class="relative">
                        <!-- Match container -->
                        <div class="flex flex-col w-full">
                            <!-- Team 1 -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title"
                            >
                                {match.team1 || "TBD"}
                            </div>
                            <!-- vs divider -->
                            <div
                                class="text-[0.8em] text-center text-[#666] px-[1em]"
                            >
                                vs
                            </div>
                            <!-- Team 2 -->
                            <div
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title"
                            >
                                {match.team2 || "TBD"}
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