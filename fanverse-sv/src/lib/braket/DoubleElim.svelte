<script>

let noOfTeam = 8
let rounds = Math.log2(noOfTeam) + 1
let lowerRounds =  (2 * Math.log2(noOfTeam) - 1)

let TeamNames = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"]

// console.log(lowerRounds)

let brackets = []

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

// console.log(brackets)
let lowerBracket = []

for (let i = 0; i < lowerRounds; i++) {
    lowerBracket.push([]);

    if (i == 0) {
        let numMatches = noOfTeam / 2;
        for (let j = 0; j < numMatches; j++) {
            lowerBracket[i].push({team: null, won: null});
        }
    }
    else {
        let upperRoundMatches = noOfTeam / 2 ** i;
        let preUpperRoundMatches = noOfTeam / 2 ** (i - 1);
        let numMatches = Math.ceil((upperRoundMatches/2) + (Math.log2(preUpperRoundMatches/2)));



        // console.log('upperRoundMatches', upperRoundMatches/2 )
        // console.log('preUpperRoundMatches', Math.log2(preUpperRoundMatches/2) )
        // console.log('numMatches', numMatches)

        if (lowerBracket.length > 3) {
            if (numMatches == 1) {
                for (let j = 0; j < 2; j++) {
                    lowerBracket[i].push({team: null, won: null});
                }            
            } else if(numMatches < 1) {
                lowerBracket[i].push({team: null, won: null});
    
            } else {    
                for (let j = 0; j < numMatches; j++) {
                    lowerBracket[i].push({team: null, won: null});
                }
            }
        }else{
            for (let j = 0; j < numMatches; j++) {
                lowerBracket[i].push({team: null, won: null});
            }
        }

    

        // console.log(upperRoundMatches)
    }
}

console.log(lowerBracket)




function handleAdvancement(roundIndex, matchIndex) {
    if (roundIndex >= rounds - 1) return;

    const currentTeam = brackets[roundIndex][matchIndex].team;
    if (!currentTeam) return;
    
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
    
    // console.log(`Advanced ${currentTeam} to round ${roundIndex + 1}, match ${nextRoundMatchIndex}`);
    
}

function showTeamName(roundIndex, matchIndex, lower = false) {
    if (lower) {
        return lowerBracket[roundIndex][matchIndex].team || "..."
    }
    return brackets[roundIndex][matchIndex].team || "..."
}
// $:console.log(brackets)
</script>

<div class="customMatchFont-{noOfTeam} overflow-x-scroll xsm:overflow-visible w-full h-[fit] px-4em xsm:px-2em py-[2.5em] text-white">
    <div class="text-[1.4em] w-fit xsm:w-full xsm:text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center  h-full">
        {#each brackets as round, roundIndex}
            <div class="flex flex-col justify-center h-full w-[14em]">
                {#each round as match, matchIndex }
                    <div class="odd:mt-2em relative">
                        <button 
                        class:winnerTeam={brackets[roundIndex][matchIndex].won}
                        class:loserTeam={!brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                        on:click={handleAdvancement(roundIndex,matchIndex) }
                        class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
                            {showTeamName(roundIndex, matchIndex)}
                        </button>
                        <div class:hidden={matchIndex % 2 != 0 || roundIndex == rounds - 1 } class="relative leading-0 py-[0.5em] text-center text-[#666]">
                            <p class="text-[1.1em] ">vs</p>
                            
                            <div class="left-full absolute {roundIndex == rounds - 2  ? "w-8em" : "w-4em"} h-[1px] bg-pickem-title">                                
                            </div>
                            
                            <div
                                class:hidden={roundIndex == 0}
                                class="right-full absolute w-4em h-[1px] bg-pickem-title">
                            </div>
                            
                            
                        </div>
                        <div
                            class:hidden={roundIndex > rounds - 3 || matchIndex % 4 != 0}
                            class="left-[calc(100%+4em-1px)] top-[calc(100%-3px)] absolute w-[1px] h-[12.7em] bg-pickem-title">
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <div class="text-[1.4em] w-fit xsm:w-full xsm:text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center  h-full">
        {#each lowerBracket as round, roundIndex}
            <div class="flex flex-col justify-center h-full w-[14em]">
                {#each round as match, matchIndex }
                    <div class="odd:mt-2em relative">
                        <button 
                        class:winnerTeam={lowerBracket[roundIndex][matchIndex].won}
                        class:loserTeam={!lowerBracket[roundIndex][matchIndex].won && lowerBracket[roundIndex][matchIndex].won != null}
                        
                        class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
                            {showTeamName(roundIndex, matchIndex, true)}
                        </button>
                        <div class:hidden={matchIndex % 2 != 0 || roundIndex == lowerRounds - 1 } class="relative leading-0 py-[0.5em] text-center text-[#666]">
                            <p class="text-[1.1em] ">vs</p>
                            
                            <div class="left-full absolute {roundIndex == lowerRounds - 2  ? "w-8em" : "w-4em"} h-[1px] bg-pickem-title">                                
                            </div>
                            
                            <div
                                class:hidden={roundIndex == 0}
                                class="right-full absolute w-4em h-[1px] bg-pickem-title">
                            </div>
                            
                            
                        </div>
                        <div

                            class:hidden={roundIndex > lowerRounds - 3 || matchIndex % 4 != 0 || round.length < 3 || round.length === lowerBracket[roundIndex + 1].length}
                            class="left-[calc(100%+4em-1px)] top-[calc(100%-3px)] absolute w-[1px] h-[12.7em] bg-pickem-title">
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>