<script>
    import BoxButton from '$lib/components/BoxButton.svelte';
    import General from '$lib/stores/General';
    import TeamPickerData from '$lib/stores/TeamPickerData';
    import PostDataMulti from '$lib/stores/PostDataMulti'; 

    import { onMount } from 'svelte';
    import VoteDataMulti from '$lib/stores/VoteDataMulti';

    export let leftWon=null, champion=null, rightWon=null, championImage=null;
    export let noOfTeam = 4;
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from 'svelte/transition';
    const dispatch = createEventDispatcher();

    let rounds = Math.log2(noOfTeam) + 1
    
    // $:console.log("PostDataMulti", $PostDataMulti)

    // teamnames
    let teamData = []
    let teamDataImagefinder = {}

    function handleTeamNames() {
        teamData = []
        for (let i = 0; i < noOfTeam; i++) {
            teamData.push({teamName : $PostDataMulti?.allTeamLoadedDataLeft[i]?.teamName, teamImage : $PostDataMulti?.allTeamLoadedDataLeft[i]?.teamImage})
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
        if (roundIndex >= rounds - 1) {
            dispatch("champion", { champion: brackets[roundIndex][matchIndex].team, championImage: teamDataImagefinder[`${showTeamName(roundIndex, matchIndex)}`], from:"left"});
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
        
        // to add won to final match
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
        $TeamPickerData.updateArray = "allTeamLoadedDataLeft"

    }

    // Store previous value for comparison
    let previousTeamLefts = [];

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
        const allTeamLefts = $PostDataMulti.allTeamLoadedDataLeft;
        
        if (allTeamLefts && hasTeamDataChanged(allTeamLefts, previousTeamLefts)) {
            handleTeamNames();
            initiateBracket();
            previousTeamLefts = JSON.parse(JSON.stringify(allTeamLefts)); // Create deep copy
        }
    }

    // all the dynamic stuff
    $: if(brackets){
        $VoteDataMulti.bracketDataLeft = brackets
    }
    // Store previous value for comparison
    // let previousBrackets = null;

    // // Function to perform deep comparison
    // function hasBracketsChanged(newBrackets, oldBrackets) {
    //     if (!newBrackets || !oldBrackets) return true;
    //     return JSON.stringify(newBrackets) !== JSON.stringify(oldBrackets);
    // }

    // // Modified reactive statement that only updates when brackets actually change
    // $: {
    //     if (brackets && hasBracketsChanged(brackets, previousBrackets)) {
    //         // Update the store with a deep copy
    //         $VoteDataMulti.bracketDataLeft = JSON.parse(JSON.stringify(brackets));
    //         // Update previous brackets for next comparison
    //         previousBrackets = JSON.parse(JSON.stringify(brackets));
    //     }
    // }

    
    // $:console.log(JSON.stringify(brackets))
    
    let prevVoteDataMultiLeft = null

    $:if($VoteDataMulti.bracketDataLeft && $General.mode == "afterVote"){
        if(prevVoteDataMultiLeft != JSON.stringify($VoteDataMulti.bracketDataLeft)){
            
            let isNull = false

            for(let i = 0; i < $VoteDataMulti.bracketDataLeft[0].length; i++){
                if($VoteDataMulti.bracketDataLeft[0][i].team == null || $VoteDataMulti.bracketDataLeft[0][i].team == undefined){
                    isNull = true
                }
            }

            if(!isNull){
                brackets = $VoteDataMulti.bracketDataLeft
            }

            prevVoteDataMultiLeft = JSON.stringify($VoteDataMulti.bracketDataLeft)
            // console.table($VoteDataMulti)
        }
    }

    $: isAFterVote = $General.mode == "afterVote"
    $: allRightBrackets = $General?.finalBracketDataLeft || []
    $: afterVoteUi = []
    $: afterVoteUiUser = []

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


    function calculateMatchingPointsForUser(userBrackets, finalBrackets) {
        
        let userArray = [];

        console.table(userBrackets)


        for (let i = 0; i < userBrackets.length; i++) {
            userArray.push([])
            for (let j = 0; j < userBrackets[i].length; j++) {
                if(userBrackets[i][j].won == true){
                    userArray[i][j] = afterVoteUi[i][j]
                }else{
                    userArray[i][j] = null
                }
            }
        }

        userArray[userArray.length-1][0] = userBrackets[userBrackets.length-1][0].team == $General?.finalChampion?.champion ?  true : false

        return userArray;
    }

    let mounted = false
    onMount(()=>{
        mounted = true
    })

  

    $: if($General.mode == "afterVote" && allRightBrackets && allRightBrackets.length > 0 && brackets && brackets.length > 0){
        
        console.log(afterVoteUi)

        afterVoteUi = calculateMatchingPoints(brackets, allRightBrackets)

        afterVoteUiUser = calculateMatchingPointsForUser(brackets, allRightBrackets)


        console.log(allRightBrackets)
        
        console.log(afterVoteUi)
    }

    let showTiles = false
    onMount(()=>{
        setTimeout(() => {
            showTiles = true
        }, 100);
    })
</script>



<div class="w-full text-[0.65em]  flex gap-[8em] justify-start items-center  h-full">
    {#each brackets as round, roundIndex}
        <div class="flex flex-col justify-center h-full w-[14em]">
            {#each round as match, matchIndex }
                <div class="odd:mt-2em relative">
                    {#if showTiles}
                        <button 
                        in:fly={{x:-50,delay:500+(100 * (roundIndex+1)), duration: 500}}

    
                        class:winnerTeam={roundIndex == brackets.length-1 ? leftWon : brackets[roundIndex][matchIndex].won}
                        class:loserTeam={roundIndex == brackets.length-1 ? !leftWon && leftWon != null : !brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                        on:click={() =>  handleAdvancement(roundIndex,matchIndex) }
                        class="
                        {afterVoteUiUser && afterVoteUiUser.length > 0 ?  afterVoteUiUser[roundIndex][matchIndex] == true ? "userAnswerRight": afterVoteUiUser[roundIndex][matchIndex] == false ? "userAnswerFalse" : "": ""}
                        relative text-center bg-pickem-box aspect-[5.8/2] flex justify-center  text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
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
                    {/if}
                    {#if showTiles}
                        <div 
                        in:fade={{delay:900, duration: 500}}
                        class:hidden={matchIndex % 2 != 0 || roundIndex == rounds - 1 } class="relative leading-0 py-[0.5em] text-center text-[#666]">
                            <p class="text-[1.1em] ">vs</p>
                            
                            <div class="left-full absolute {roundIndex == rounds - 2  ? "w-8em" : "w-4em"} h-[1px] bg-pickem-title">                                
                            </div>
                            
                            <div
                                class:hidden={roundIndex == 0}
                                class="right-full absolute w-4em h-[1px] bg-pickem-title">
                            </div>
                            
                            
                        </div>
                        <div
                            in:fade={{delay:900, duration: 500}}

                            class:hidden={roundIndex > rounds - 3 || matchIndex % 4 != 0}
                            class="left-[calc(100%+4em-1px)] top-[calc(100%-3px)] absolute w-[1px] h-[12.7em] bg-pickem-title">
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
</div>
