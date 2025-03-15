<script>
    export let noOfTeam = 4;
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    let rounds = Math.log2(noOfTeam) + 1
    let TeamNames = [ "TSM", "EG", "T1", "GEN", "DK", "FPX", "MAD", "RNG"]
    
    let brackets = []
    export let rightWon=null, champion=null, leftWon=null

    for (let i = 0; i < rounds; i++) {
        if (i == 0) {
            brackets.push([])
            for (let j = 0; j < noOfTeam; j++) {
                brackets[i].push({team : TeamNames[j], won : null})
            }
        } else {
            brackets.push([])
            for (let j = 0; j < noOfTeam / 2 ** i; j++) {
                brackets[i].push({team : null, won : null})
            }
        }
    }
        
    function handleAdvancement(roundIndex, matchIndex) {
        const currentTeam = brackets[roundIndex][matchIndex].team;
        if (!currentTeam) return;
        console.log(roundIndex, matchIndex)
        if (roundIndex >= rounds - 1) {
            dispatch("champion", { champion: brackets[roundIndex][matchIndex].team, from:"right" });
            return;
        };
        brackets[rounds-1][0].team = null
        leftWon = null
        rightWon = null
        champion = null


    
        
        // Calculate the position in the next round
        const nextRoundMatchIndex = Math.floor(matchIndex / 2);
        
        // Update the team in the next round
        brackets[roundIndex + 1][nextRoundMatchIndex].team = currentTeam;
        brackets[roundIndex][matchIndex].won = true;
        
        // Find the pair match and mark it as loser
        const isPairEven = matchIndex % 2 === 0;
        const pairMatchIndex = isPairEven ? matchIndex + 1 : matchIndex - 1;
        
        // Make sure the pair exists (for odd number of teams)
        if (pairMatchIndex < brackets[roundIndex].length) {
            brackets[roundIndex][pairMatchIndex].won = false;
        }
    
        // Clear affected matches in all subsequent rounds
        for (let r = roundIndex + 1; r < rounds; r++) {
            const affectedMatchIndex = Math.floor(nextRoundMatchIndex / (2 ** (r - (roundIndex + 1))));
            
            // Only clear team name for rounds after the next round
            if (r > roundIndex + 1) {
                brackets[r][affectedMatchIndex].team = null;
            }
            
            // Clear won status for the match and its pair
            brackets[r][affectedMatchIndex].won = null;
            
            const pairIndex = affectedMatchIndex - (affectedMatchIndex % 2 === 0 ? -1 : 1);
            if (pairIndex < brackets[r].length) {
                brackets[r][pairIndex].won = null;
            }
        }
        
        console.log(`Advanced ${currentTeam} to round ${roundIndex + 1}, match ${nextRoundMatchIndex}`);
    }
    
    function showTeamName(roundIndex, matchIndex) {
        return brackets[roundIndex][matchIndex].team || "..."
    }
    $:console.log(brackets)
</script>
    
    
<div class="w-full text-[0.65em]  flex flex-row-reverse gap-[8em] justify-start items-center  h-full">
    {#each brackets as round, roundIndex}
        <div class="flex flex-col justify-center h-full w-[14em]">
            {#each round as match, matchIndex }
                <div class="odd:mt-2em relative">
                    <button 
                    class:winnerTeam={roundIndex == brackets.length-1 ? rightWon : brackets[roundIndex][matchIndex].won}
                    class:loserTeam={roundIndex == brackets.length-1 ? !rightWon && rightWon != null : !brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                    on:click={() => handleAdvancement(roundIndex,matchIndex) }
                    class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
                        {showTeamName(roundIndex, matchIndex)}
                    </button>
                    <div class:hidden={matchIndex % 2 != 0 || roundIndex == rounds - 1 } class="relative leading-0 py-[0.5em] text-center text-[#666]">
                        <p class="text-[1.1em] ">vs</p>
                        
                        <div class="right-full absolute {roundIndex < rounds - 1  ? "w-4em" : ""} h-[1px] bg-pickem-title">                                
                        </div>
                        
                        <div
                            class:hidden={roundIndex != rounds - 2}
                            class="right-full absolute w-8em h-[1px] bg-pickem-title">
                        </div>
                        <div
                            class:hidden={roundIndex == 0}
                            class="left-full absolute w-4em h-[1px] bg-pickem-title">
                        </div>
                        
                        
                    </div>
                    <div
                        class:hidden={roundIndex > rounds - 3 || matchIndex % 4 != 0}
                        class="right-[calc(100%+4em-1px)] top-[calc(100%-3px)] absolute w-[1px] h-[12.7em] bg-pickem-title">
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>