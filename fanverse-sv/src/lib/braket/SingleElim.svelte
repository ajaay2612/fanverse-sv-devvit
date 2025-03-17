<script>
    import BoxButton from '../components/BoxButton.svelte';
    import General from '$lib/stores/General';
    import TeamPicker from '../components/TeamPicker.svelte';
    import PostData from '$lib/stores/PostData';
    import { onMount } from 'svelte';
    import VoteData from '$lib/stores/VoteData';
    export let noOfTeam = 4;
    
    let rounds = Math.log2(noOfTeam) + 1
    
    let teamData = []
    let teamDataImagefinder = {}

    function handleTeamNames() {
        teamData = []
        for (let i = 0; i < noOfTeam; i++) {
            teamData.push({teamName : $PostData?.allTeamLoadedData[i]?.teamName, teamImage : $PostData?.allTeamLoadedData[i]?.teamImage})
        }

        teamDataImagefinder = {}
        for (let i = 0; i < teamData.length; i++) {
            teamDataImagefinder[teamData[i]?.teamName] = teamData[i]?.teamImage
        }
    }

    handleTeamNames()

    // console.log(teamDataImagefinder)

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

        if($General.mode == "afterVote") return
        
        if($General.mode == "create"){
            if (roundIndex != 0) return
            
            console.log("create")
            handleCreate(matchIndex)
            return
        }

        console.log("vote")

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
    
    function showTeamName(roundIndex, matchIndex) {
        return brackets[roundIndex][matchIndex].team || null
    }
    // $:console.log(brackets)


    function handleCreate(matchIndex) {
        showTeamPicker = true
        TeamPickerIndex = matchIndex
    }

    $:if($PostData?.allTeamLoadedData){
        handleTeamNames()
        initiateBracket()
    }


    // $:console.table($PostData?.allTeamLoadedData)

    let showTeamPicker = false
    let TeamPickerIndex = 0

    $: if(brackets){
        $VoteData.bracketData = brackets

        function checkBracketNull () {
            let nullBracket = false
            brackets.forEach((round, roundIndex) => {
                round.forEach((matchup, matchIndex) => {
                    if (matchup.team === null || matchup.team === undefined) {
                        nullBracket = true
                    }
                });
            });

            return nullBracket
        }

        console.log(checkBracketNull())
       
        if(checkBracketNull()){
            $VoteData.canVote = false
        }else{
            $VoteData.canVote = true
        }
    }

    // $:console.log(JSON.stringify(brackets))
    
    $:if($VoteData.bracketData && $General.mode == "afterVote"){
        brackets = $VoteData.bracketData
    }


</script>


    {#if showTeamPicker}
        <TeamPicker bind:showTeamPicker={showTeamPicker} bind:TeamPickerIndex={TeamPickerIndex}/>
    {/if}
    {#key showTeamPicker}
        <div class="customMatchFont-{noOfTeam} overflow-x-scroll xsm:overflow-visible w-full h-[fit] px-4em xsm:px-2em py-[2.5em] text-white">
            <div class="text-[1.4em] w-fit xsm:w-full xsm:text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center  h-full">
                {#each brackets as round, roundIndex}
                    <div class="flex flex-col justify-center h-full w-[14em]">
                        {#each round as match, matchIndex }
                            <div class="odd:mt-2em relative">
                                
                                
    
                                <button 
                                class:winnerTeam={brackets[roundIndex][matchIndex].won}
                                class:loserTeam={!brackets[roundIndex][matchIndex].won && brackets[roundIndex][matchIndex].won != null}
                                on:click={()=> handleAdvancement(roundIndex,matchIndex) }
                                class="relative text-center bg-pickem-box aspect-[5.8/2] flex justify-center  text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer">
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
    
                                    <!-- <div class="absolute top-[-0.2em] right-[0] h-[0.55em] size-[0.5em] text-[1.1em] text-center">
                                        <BoxButton>
                                            <div class="w-[0.55em] absolute top-1/2 left-1/2 -translate-1/2">
                                                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0205 4.64387L10.9388 3.72558C11.6606 3.00377 11.6606 1.83348 10.9388 1.11167C10.217 0.38986 9.0467 0.389859 8.32489 1.11167L7.38886 2.0477C8.00598 3.13595 8.91598 4.03738 10.0205 4.64387ZM5.93422 3.50234L1.99303 7.44354C1.56797 7.8686 1.35544 8.08113 1.2157 8.34222C1.07597 8.60332 1.01702 8.89805 0.899131 9.4875L0.630258 10.8319C0.563736 11.1645 0.530475 11.3308 0.625083 11.4254C0.719691 11.52 0.885996 11.4867 1.21861 11.4202L2.56297 11.1513L2.56298 11.1513C3.15243 11.0334 3.44715 10.9745 3.70825 10.8348C3.96934 10.695 4.18187 10.4825 4.60692 10.0575L4.60693 10.0575L4.60693 10.0574L8.56156 6.10282C7.5086 5.43087 6.61352 4.54282 5.93422 3.50234Z" fill="white"/>
                                                </svg>
                                            </div>
                                        </BoxButton>
                                    </div> -->
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
        </div>
    {/key}