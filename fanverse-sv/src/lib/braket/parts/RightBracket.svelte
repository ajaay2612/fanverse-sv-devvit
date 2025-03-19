<script>
    import BoxButton from '$lib/components/BoxButton.svelte';
    import General from '$lib/stores/General';
    import TeamPickerData from '$lib/stores/TeamPickerData';
    import PostDataMulti from '$lib/stores/PostDataMulti';
    import { onMount } from 'svelte';
    import VoteDataMulti from '$lib/stores/VoteDataMulti';
    export let rightWon=null, champion=null, leftWon=null, championImage=null;
    export let noOfTeam = 4;
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    let rounds = Math.log2(noOfTeam) + 1

    // teamnames
    let teamData = []
    let teamDataImagefinder = {}

    function handleTeamNames() {
        teamData = []
        for (let i = 0; i < noOfTeam; i++) {
            teamData.push({teamName : $PostDataMulti?.allTeamLoadedDataRight[i]?.teamName, teamImage : $PostDataMulti?.allTeamLoadedDataRight[i]?.teamImage})
        }

        teamDataImagefinder = {}
        for (let i = 0; i < teamData.length; i++) {
            teamDataImagefinder[teamData[i]?.teamName] = teamData[i]?.teamImage
        }
    }
    
    handleTeamNames()
    
    let brackets = []
    
    function initiateBracket() {
        brackets = []
        for (let i = 0; i < rounds; i++) {
            if (i == 0) {
                brackets.push([])
                for (let j = 0; j < noOfTeam; j++) {
                    brackets[i].push({team : teamData[j]?.teamName || null , won : null})
                }
            } else {
                brackets.push([])
                for (let j = 0; j < noOfTeam / 2 ** i; j++) {
                    brackets[i].push({team : null, won : null})
                }
            }
        }
    }
    
    initiateBracket()
        
    function handleAdvancement(roundIndex, matchIndex) {

        if($General.mode == "afterVote" && !$PostDataMulti.isCreator) return

        if($General.mode == "create"){
            if (roundIndex != 0) return
            
            console.log("create")
            handleCreate(matchIndex)
            return
        }

        console.log("vote")
        //  end restraints

        const currentTeam = brackets[roundIndex][matchIndex].team;
        if (!currentTeam) return;
        console.log(roundIndex, matchIndex)
        if (roundIndex >= rounds - 1) {
            dispatch("champion", { champion: brackets[roundIndex][matchIndex].team,championImage: teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`], from:"right" });
            return;
        };
        brackets[rounds-1][0].team = null
        leftWon = null
        rightWon = null
        champion = null
        championImage = null
        $VoteDataMulti.champion = null

    
        
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
        if(roundIndex == rounds - 2){
            brackets[roundIndex + 1][nextRoundMatchIndex].won = true
        }
    }
   // $:console.table(brackets)
    
   function showTeamName(roundIndex, matchIndex) {
        return brackets[roundIndex][matchIndex].team || null
    }
    // $:console.log(brackets)


    function handleCreate(matchIndex) {
        $TeamPickerData.showTeamPicker = true
        $TeamPickerData.teamPickerIndex = matchIndex
        $TeamPickerData.updateArray = "allTeamLoadedDataRight"

    }

    // Store previous value for comparison
    let previousTeamRights = [];

    // Function to perform deep comparison
    function hasTeamDataChanged(newData, oldData) {
        if (!newData || !oldData) return true;
        if (newData.length !== oldData.length) return true;
        
        for (let i = 0; i < newData.length; i++) {
            const newTeam = newData[i];
            const oldTeam = oldData[i];
            
            if (!newTeam || !oldTeam) return true;
            if (newTeam.teamName !== oldTeam.teamName) return true;
            if (newTeam.teamImage !== oldTeam.teamImage) return true;
        }
        
        return false;
    }

    // Modified reactive statement
    $: {
        // console.log('Checking for team data changes...');
        const allTeamRights = $PostDataMulti.allTeamLoadedDataRight;
        
        if (allTeamRights && hasTeamDataChanged(allTeamRights, previousTeamRights)) {
            handleTeamNames();
            initiateBracket();
            previousTeamRights = JSON.parse(JSON.stringify(allTeamRights)); // Create deep copy
        }
    }

    // all the dynamic stuff
    $: if(brackets){
        $VoteDataMulti.bracketDataRight = brackets

        // function checkBracketNull () {
        //     let nullBracket = false
        //     brackets.forEach((round, roundIndex) => {
        //         round.forEach((matchup, matchIndex) => {
        //             if (matchup.team === null || matchup.team === undefined) {
        //                 nullBracket = true
        //             }
        //         });
        //     });

        //     return nullBracket
        // }

        // console.log(checkBracketNull())
       
        // if(checkBracketNull()){
        //     $VoteDataMulti.canVote = false
        // }else{
        //     $VoteDataMulti.canVote = true
        // }
    
        // if($General.mode == "create"){
        //     function checkBracketNull () {
        //         let nullBracket = false
        //         brackets[0].forEach((matchup, matchIndex) => {
        //             if (matchup.team === null || matchup.team === undefined) {
        //                 nullBracket = true
        //             }
        //         });

        //         return nullBracket
        //     }

        //     console.log(checkBracketNull())
        
        //     if(checkBracketNull()){
        //         // $PostDataMulti.canPost = false
        //     }else{
        //         // $PostDataMulti.canPost = true
        //     }
        // }
    }


    // $:console.log(JSON.stringify(brackets))
    
    $:if($VoteDataMulti.bracketDataRight && $General.mode == "afterVote"){
        let isNull = false

        for(let i = 0; i < $VoteDataMulti.bracketDataRight[0].length; i++){
            if($VoteDataMulti.bracketDataRight[0][i].team == null || $VoteDataMulti.bracketDataRight[0][i].team == undefined){
                isNull = true
            }
        }

        if(!isNull){
            brackets = $VoteDataMulti.bracketDataRight
        }

        // console.table($VoteDataMulti)

    }

    $: isAFterVote = $General.mode == "afterVote"
    $: allRightBrackets = $General?.finalBracketDataRight || []
    $: afterVoteUi = []

    function calculateMatchingPoints(userBrackets, finalBrackets) {
        // Initialize points counter
        let wonArray = [];
        
        // Check if both bracket arrays exist
        if (!userBrackets || !finalBrackets) {
            return 0;
        }
        
        // Initialize wonArray with empty arrays for each round
        for (let i = 0; i < Math.min(userBrackets.length, finalBrackets.length); i++) {
            wonArray[i] = [];
        }
        
        // Iterate through each round
        for (let roundIndex = 0; roundIndex < Math.min(userBrackets.length, finalBrackets.length); roundIndex++) {
            const userRound = userBrackets[roundIndex];
            const finalRound = finalBrackets[roundIndex];
            
            // Iterate through each matchup in the round
            for (let matchIndex = 0; matchIndex < Math.min(userRound.length, finalRound.length); matchIndex++) {
                const userMatch = userRound[matchIndex];
                const finalMatch = finalRound[matchIndex];
                
                // console.table(userMatch, finalMatch)
                // Check if team names match
                if (userMatch.team === finalMatch.team && userMatch.team !== null) {
                    wonArray[roundIndex][matchIndex] = true;
                    if(!finalMatch.won &&  finalMatch.won != null){
                        wonArray[roundIndex][matchIndex] = false;
                    }
                } else {
                    wonArray[roundIndex][matchIndex] = false;
                }
            }
        }
        
        return wonArray;
    }

    let mounted = false
    onMount(()=>{
        mounted = true
    })

    $: if(mounted && $General.mode == "afterVote" && allRightBrackets && allRightBrackets.length > 0 && brackets && brackets.length > 0){
        afterVoteUi = calculateMatchingPoints(brackets, allRightBrackets)

        // console.table(afterVoteUi)
    }
</script>
    
    
<div class="w-full text-[0.65em]  flex flex-row-reverse gap-[8em] justify-start items-center  h-full">
    {#each brackets as round, roundIndex}
        <div class="flex flex-col justify-center h-full w-[14em]">
            {#each round as match, matchIndex }
                <div class="odd:mt-2em relative">
                    <button 
                    class:rightWinnerTeam={afterVoteUi && afterVoteUi.length > 0 ?  afterVoteUi[roundIndex][matchIndex] : false}

                    class:winnerTeam={roundIndex == brackets.length-1 ? rightWon : brackets[roundIndex][matchIndex].won}
                    class:loserTeam={roundIndex == brackets.length-1 ? !rightWon && rightWon != null : !brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                    on:click={() => handleAdvancement(roundIndex,matchIndex) }
                    class="relative text-center bg-pickem-box aspect-[5.8/2] flex justify-center  text-[1.25em] font-bold w-full border-r-[0.25em] border-pickem-title cursor-pointer">
                        {#if $General.mode == "create" && roundIndex == 0}
                            {#if showTeamName(roundIndex, matchIndex) == null}
                                <div class="w-[1.45em]">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.511719 11.6797H23.7734" stroke="#fff" stroke-width="3"/>
                                        <path d="M12.1406 23.3125L12.1406 0.0507812" stroke="#fff" stroke-width="3"/>
                                    </svg>
                                </div>       
                            {:else}
                                <div class="flex h-auto w-full justify-between items-center p-[0.3em] px-[0.4em]">
                                    {#if teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`]}
                                        <div class="rounded-[0.4em] overflow-hidden h-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`]} alt=""></div>
                                    {/if}      
                                    <p class="text-center grow">{showTeamName(roundIndex, matchIndex)}</p>
                                </div>
                            {/if}                        
                        {:else}
                            <div class="flex h-auto w-full justify-between items-center p-[0.3em] px-[0.4em]">
                                {#if teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`]}
                                    <div class="rounded-[0.4em] overflow-hidden h-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`]} alt=""></div>
                                {/if}
                                <p class="text-center grow">{showTeamName(roundIndex, matchIndex) || '...' }</p>
                            </div>    
                        {/if}
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