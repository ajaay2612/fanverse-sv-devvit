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

        if (noOfTeam != 4) {
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
    }
}

console.log(lowerBracket)




function handleAdvancement(roundIndex, matchIndex, lower = false) {
    if(!lower){
        if (roundIndex >= rounds - 1) {
            brackets[roundIndex][matchIndex].won = true;
            champion = brackets[roundIndex][matchIndex].team
            lowerBracket[roundIndex +1][matchIndex].won = false;
        };
    } else{
        if (roundIndex >= lowerRounds - 1) {
            lowerBracket[roundIndex][matchIndex].won = true;
            champion = lowerBracket[roundIndex][matchIndex].team
            brackets[roundIndex-1][matchIndex].won = false;
        }
    }

    let nextRoundMatchIndex = Math.floor(matchIndex / 2);

    if(lower){
        const currentTeam = lowerBracket[roundIndex][matchIndex].team;
        if (!currentTeam) return;

        if(roundIndex == 0){
            lowerBracket[roundIndex + 1][matchIndex > 1 ? 3 : 1].team = currentTeam;
        }else if(roundIndex == 1){
            lowerBracket[roundIndex + 1][nextRoundMatchIndex].team = currentTeam;
        }else if(roundIndex == 3){
            lowerBracket[roundIndex + 1][0].team = currentTeam;
        }else{
            lowerBracket[roundIndex + 1][nextRoundMatchIndex+1].team = currentTeam;
        }
        lowerBracket[roundIndex][matchIndex].won = true;
        
        // Find the pair match and mark it as loser
        const isPairEven = matchIndex % 2 === 0;
        const pairMatchIndex = isPairEven ? matchIndex + 1 : matchIndex - 1;
        


        // Make sure the pair exists (for odd number of teams)
        if (pairMatchIndex < lowerBracket[roundIndex].length) {
            lowerBracket[roundIndex][pairMatchIndex].won = false;
        }

        if (roundIndex == 0) {
            champion = null 
            lowerBracket[2][0].won = null;
            lowerBracket[2][1].won = null;
            lowerBracket[2][0].team = null;
            lowerBracket[2][1].team = null;

            lowerBracket[1][0].won = null;
            lowerBracket[1][1].won = null;
            lowerBracket[1][2].won = null;
            lowerBracket[1][3].won = null;

            lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;

            // lowerBracket[2][3].won = null;
            // lowerBracket[2][3].won = null;
            // lowerBracket[1][1].team = null;
            
            brackets[3][0].won = null;
        }
        if (roundIndex == 1) {
            champion = null
            lowerBracket[2][1].won = null;
            lowerBracket[2][0].won = null;

            lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;
            
            brackets[3][0].won = null;
        }
        if (roundIndex == 2) {
            champion = null
            // lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;
            
            brackets[3][0].won = null;
        }
        if (roundIndex == 3) {
            champion = null
            lowerBracket[4][0].won = null;
            
            brackets[3][0].won = null;
        }
        return
    }

    if(!lower){
        if (roundIndex == 0) {
            lowerBracket[2][0].won = null;
            lowerBracket[2][1].won = null;
            lowerBracket[2][0].team = null;
            lowerBracket[2][1].team = null;

            lowerBracket[1][0].won = null;
            lowerBracket[1][1].won = null;
            lowerBracket[1][2].won = null;
            lowerBracket[1][3].won = null;

            lowerBracket[1][3].team = null;
            lowerBracket[1][1].team = null;

            lowerBracket[0][0].won = null;
            lowerBracket[0][1].won = null;
            lowerBracket[0][2].won = null;
            lowerBracket[0][3].won = null;

            lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;
        };
        if (roundIndex == 1) {
            lowerBracket[2][0].won = null;
            lowerBracket[2][1].won = null;
            lowerBracket[2][0].team = null;
            lowerBracket[2][1].team = null;

            lowerBracket[1][0].won = null;
            lowerBracket[1][1].won = null;
            lowerBracket[1][2].won = null;
            lowerBracket[1][3].won = null;

            lowerBracket[1][3].team = null;
            lowerBracket[1][1].team = null;

            lowerBracket[0][0].won = null;
            lowerBracket[0][1].won = null;
            lowerBracket[0][2].won = null;
            lowerBracket[0][3].won = null;

            lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;
        };
        if (roundIndex == 2) {
           
            // lowerBracket[3][1].team = null;
            lowerBracket[3][1].won = null;
            lowerBracket[3][0].won = null;
            
            lowerBracket[4][0].team = null;
            lowerBracket[4][0].won = null;
        };
    }

    const currentTeam = brackets[roundIndex][matchIndex].team;
    if (!currentTeam) return;
    
    
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
        
        champion = null

        // Only clear team name for rounds after the next round
        if (r > roundIndex + 1) {
            brackets[r][affectedMatchIndex].team = null;
        }
        // lowerBracket[2][0].won = null;
        // lowerBracket[2][0].team = null;
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
        return lowerBracket[roundIndex][matchIndex].team || null
    }
    return brackets[roundIndex][matchIndex].team || null
}
$:console.table(brackets[1][0])


$: console.table(lowerBracket)

$: lowerBracket[0][0].team = brackets[0][0].won ? brackets[0][1].team : brackets[0][0].won === false ? brackets[0][0].team : null
$: lowerBracket[0][1].team = brackets[0][2].won ? brackets[0][3].team : brackets[0][2].won === false ? brackets[0][2].team : null

$: lowerBracket[0][2].team = brackets[0][4].won ? brackets[0][5].team : brackets[0][4].won === false ? brackets[0][4].team : null
$: lowerBracket[0][3].team = brackets[0][6].won ? brackets[0][7].team : brackets[0][6].won === false ? brackets[0][6].team : null


$: lowerBracket[1][0].team = brackets[1][0].won ? brackets[1][1].team : brackets[1][0].won === false ? brackets[1][0].team : null
$: lowerBracket[1][2].team = brackets[1][2].won ? brackets[1][3].team : brackets[1][2].won === false ? brackets[1][2].team : null

$: lowerBracket[3][0].team = brackets[2][0].won ? brackets[2][1].team : brackets[2][0].won === false ? brackets[2][0].team : null

let champion = null

</script>

<div class="w-full h-full px-4em py-[2.5em] text-white mb-[25em] xsm:mb-[12em] lg:mb-[20em]">
    <div class="w-[135em] xsm:w-[130em] text-[1.4em]  xsm:text-[0.5em] lg:text-[0.5em] flex justify-center items-center gap-[4em]">
        <div class="shrink-0">
            <div class=" w-fit xsm:w-full flex gap-[8em] items-center  h-full">
                {#each brackets as round, roundIndex}
                    <div class="flex flex-col justify-center h-full ">
                        {#each round as match, matchIndex }
                            <div class="w-[14em] odd:mt-2em relative">
                                <button
                                class:winnerTeam={brackets[roundIndex][matchIndex].won}
                                class:loserTeam={!brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                                on:click={handleAdvancement(roundIndex,matchIndex) }
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
                                    {showTeamName(roundIndex, matchIndex) || "..."}
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
                                    class:hidden={roundIndex != rounds - 1}
                                    class="left-full absolute w-[30em] h-[1px] top-1/2 -translate-y-1/2 bg-pickem-title">
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
            <div class=" w-fit xsm:w-full flex gap-[8em] justify-center items-center  h-full">
                {#each lowerBracket as round, roundIndex}
                    <div class="{ roundIndex === 0 ? "translate-y-[30%]" : ""} flex flex-col justify-center h-full ">
                        {#each round as match, matchIndex }
                            <div
                             class=" w-[14em] odd:mt-2em relative">
                                <button
                                class:winnerTeam={lowerBracket[roundIndex][matchIndex].won}
                                class:loserTeam={!lowerBracket[roundIndex][matchIndex].won && lowerBracket[roundIndex][matchIndex].won != null}
                                on:click={handleAdvancement(roundIndex,matchIndex, true)}
                                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
                                    {showTeamName(roundIndex, matchIndex, true) || "..."}
                                </button>
                                <div class:hidden={matchIndex % 2 != 0 || roundIndex == lowerRounds - 1 } class="relative leading-0 py-[0.5em] text-center text-[#666]">
                                    <p class="text-[1.1em] ">vs</p>
        
                                    <div class="left-full absolute {roundIndex == lowerRounds - 2  ? "w-8em" : "w-4em"} h-[1px] bg-pickem-title">
                                    </div>
        
                                    <div
                                        class:hidden={roundIndex == 0}
                                        class="right-full absolute w-4em h-[1px] bg-pickem-title">
                                    </div>
                                    <div
                                        class:hidden={roundIndex != 0}
                                        class="left-[calc(100%+4em)] top-[-7em] absolute w-[1px] h-[7.7em] bg-pickem-title">
                                    </div>
        
        
        
                                </div>
                                <div
                                    class:hidden={roundIndex != lowerRounds - 1}
                                    class="left-full absolute w-8em h-[1px] top-1/2 -translate-y-1/2 bg-pickem-title">
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
        <div class="shrink-0  mr-[12em] xsm:mr-[17em] 2xl:mr-[5em] relative translate-y-[150%] translate-x-[8em] w-[14em]">
            <button
                class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-[0.25em] border-pickem-box-champ cursor-pointer">
                {champion || "..."}
            </button>
            <div class="w-[1px] h-[38em] absolute left-[calc(-4em-1px)] top-1/2 -translate-y-1/2 bg-pickem-title"></div>
            <div class="w-4em h-[1px] absolute right-full top-1/2 -translate-y-1/2 bg-pickem-title"></div>
        </div>
    </div>
</div>