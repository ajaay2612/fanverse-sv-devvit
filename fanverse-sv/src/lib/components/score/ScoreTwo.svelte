<script>
    import General from "$lib/stores/General";
    import PostDataScore from "$lib/stores/PostDataScore";
    import TeamPickerDataScore from "$lib/stores/TeamPickerDataScore";
    import VoteDataScore from "$lib/stores/VoteDataScore";
    import { mount, onMount } from "svelte";

    $: postData = PostDataScore;
    $: voteData = VoteDataScore;
    function create(index){
        $TeamPickerDataScore.showTeamPicker = true;
        $TeamPickerDataScore.teamPickerIndex = index; 
    }


    let mounted = false;
    onMount(() => {
        mounted = true;
    });
    
    $: if(mounted && $postData && $postData.allLoadedData){
        // console.log($postData.allLoadedData);
        let isNull = false;

        for(let i = 0; i < $postData.allLoadedData.length; i++){
            if($postData.allLoadedData[i].teamName == null || $postData.allLoadedData[i].teamName == ""){
                isNull = true;
                break;
            }
        }

        // for(let i = 0; i < $voteData?.votesArray.length; i++){
        //     if($voteData.votesArray[i] == null || $voteData.votesArray[i] == ""){
                
        //         isNull = true;
        //         break;
        //     }
        // }

        // if( $voteData?.votesArray.length != 2 ) {
        //     isNull = true;
        // }


        console.log(isNull);

        if(isNull){
            $postData.canPost = false;
        }else{
            $postData.canPost = true;
        }
    }

    function handleVote(i) {
        if ($General.mode != "vote" ) return;

        $voteData.votesArray[i] = $voteData.votesArray[i] + 1;
        $PostDataScore.finalVoteArray[i] = $PostDataScore.finalVoteArray[i] || 0 + 1;

        $voteData.canVote = false;

        $General.mode = "afterVote";

        window.parent.postMessage({
            type: 'setVoteDataScore',
            data: { "voteData" : $voteData}
        }, '*');
    }


</script>

<!-- <div class=" overflow-hidden"> -->
    
    <div 
        style="clip-path: polygon(0px 100%, 67% 100%, 100% 0%, 0 0)"
        class="overflow-hidden brightness-[0.5]  absolute w-[60%] h-full top-0 left-0">
        {#if $postData?.allLoadedData[0]?.teamImage}
            <img class="w-full h-full object-cover" src={$postData.allLoadedData[0].teamImage} alt="">
        {/if}
    </div>

    <div
        style="clip-path: polygon(100% 0px, 100% 100%, 0% 100%, 33% 0%)"
        class="overflow-hidden brightness-[0.5]   absolute w-[60%] h-full top-0 right-0">
        {#if $postData?.allLoadedData[1]?.teamImage}
            <img class="w-full h-full object-cover" src={$postData.allLoadedData[1].teamImage} alt="">
        {/if}
    </div>
    <p class="bg-white aspect-square size-[3em] flex justify-center items-center text-black rounded-full font-bold text-[3.8em] absolute top-[50%] left-1/2 -translate-1/2">
        VS
    </p>
<!-- </div> -->

<button
    class="px-[1.5em] w-full uppercase h-full justify-between relative text-center flex text-[1.25em] "
>
    <div class="w-[80%] mx-auto flex justify-center items-center gap-[20em] lg:gap-[25em]">

       
        {#each $postData.allLoadedData as team, i}

    
            {#if $General.mode == "create"}
                <!-- svelte-ignore node_invalid_placement_ssr -->
                <div  class="w-full ">
                    {#if team.teamName == null || team.teamName == ""}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div on:click={() => $General.mode == "create" ? create(i) : ""} class="cursor-pointer w-[5em] flex mx-auto justify-center items-center">
                            <div class="w-[3em]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0.511719 11.6797H23.7734"
                                        stroke="#fff"
                                        stroke-width="3"
                                    />
                                    <path
                                        d="M12.1406 23.3125L12.1406 0.0507812"
                                        stroke="#fff"
                                        stroke-width="3"
                                    />
                                </svg>
                            </div>
                        </div>
                    {:else}
                        <div
                            class="flex flex-col h-auto w-full gap-[1.8em] items-center p-[0.4em] px-[0.4em]"
                        >
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- {#if team.teamImage} -->
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- <div
                                on:click={() => $General.mode == "create" ? create(i) : ""}
                                    class=" cursor-pointer rounded-[0.4em] overflow-hidden w-[11em] aspect-square shrink-0"
                                >
                                    <img
                                        class="w-full h-full object-cover"
                                        src={team.teamImage}
                                        alt=""
                                    />
                                </div> -->
                            <!-- {/if} -->
                            <div class="space-y-[0.8em]">
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <p 
                                on:click={() => $General.mode == "create" ? create(i) : ""}
                                class="cursor-pointer text-center font-bold text-[2.1em] grow">
                                    {team.teamName || "Name"}
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <div    
                    class="flex flex-col h-auto w-full gap-[1.8em] items-center p-[0.4em] px-[0.4em]"
                >
                    <!-- {#if team.teamImage}
                        <div
                            class="rounded-[0.4em] overflow-hidden w-[11em] aspect-square shrink-0"
                        >
                            <img
                                class="w-full h-full object-cover"
                                src={team.teamImage}
                                alt=""
                            />
                        </div>
                    {/if} -->
                    <div class="space-y-[0.45em]">
                        <p class="text-center font-bold text-[2.1em] grow">
                            {team.teamName}
                        </p>

                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                        <p on:click={()=> handleVote(i)} class=" {$General.mode == "afterVote" ? "bg-white text-black":""} text-[1.1em] mx-auto capitalize border rounded-full py-[0.25em] min-w-7em px-[1em] whitespace-nowrap font-semibold text-center ">
                            {#if $General.mode == "vote"}
                                vote
                            {:else}
                                {$PostDataScore.finalVoteArray[i] || 0} <span class="ml-[0.5em] text-[0.8em]">votes</span>
                            {/if}
                        </p>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</button>
