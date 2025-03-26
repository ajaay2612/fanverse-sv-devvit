<script>
    import General from "$lib/stores/General";
    import PostDataScore from "$lib/stores/PostDataScore";
    import TeamPickerDataScore from "$lib/stores/TeamPickerDataScore";
    import VoteDataScore from "$lib/stores/VoteDataScore";
    import { mount, onMount } from "svelte";
    import { fly, scale } from "svelte/transition";

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

    let showTiles = false
    onMount(()=>{
        setTimeout(() => {
            showTiles = true
        }, 100);
    })


</script>

<!-- <div class=" overflow-hidden"> -->
    
    <div 
        class="xsm:hidden  overflow-hidden brightness-[0.5]  absolute w-full h-[50%] top-0 left-0">
        {#if $postData?.allLoadedData[0]?.teamImage}
            {#if showTiles}
                <img in:fly={{y:40}} class="w-full h-full object-cover object-top" src={$postData.allLoadedData[0].teamImage} alt="">
            {/if}
        {/if}
    </div>

    <div
        class="xsm:hidden  overflow-hidden brightness-[0.5]   absolute w-full h-[50%] bottom-0 right-0">
        {#if $postData?.allLoadedData[1]?.teamImage}
            {#if showTiles}
                <img in:fly={{y:-40, delay:150}} class="w-full h-full object-cover object-top" src={$postData.allLoadedData[1].teamImage} alt="">
            {/if}
        {/if}
    </div>
    <div 
        style="clip-path: polygon(0px 100%, 67% 100%, 100% 0%, 0 0)"
        class="hidden xsm:block overflow-hidden brightness-[0.5]  absolute w-[60%] h-full top-0 left-0">
        {#if $postData?.allLoadedData[0]?.teamImage}
            {#if showTiles}
                <img in:fly={{x:40}} class="w-full h-full object-cover" src={$postData.allLoadedData[0].teamImage} alt="">
            {/if}
        {/if}
    </div>

    <div
        style="clip-path: polygon(100% 0px, 100% 100%, 0% 100%, 33% 0%)"
        class="hidden xsm:block overflow-hidden brightness-[0.5]   absolute w-[60%] h-full top-0 right-0">
        {#if $postData?.allLoadedData[1]?.teamImage}
            {#if showTiles}
                <img in:fly={{x:-40, delay:150}} class="w-full h-full object-cover" src={$postData.allLoadedData[1].teamImage} alt="">
            {/if}
        {/if}
    </div>


    {#if showTiles}
        <p 
        in:scale={{delay:200, duration:350}}
        class="bg-badge aspect-square size-[3em] flex justify-center items-center text-black rounded-full font-bold text-[3.8em] absolute top-[50%] left-1/2 -translate-1/2">
            VS
        </p>
    {/if}
<!-- </div> -->

<button
    class="px-[1.5em] w-full uppercase h-full justify-between relative text-center flex text-[1.25em] "
>
    <div class="w-[100%] mx-auto flex flex-col xsm:flex-row justify-center items-center gap-[20em] xsm:gap-[10em] lg:gap-[25em]">

       
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
                {#if showTiles}
                    <div    
                    in:fly={{y:-40, delay:550+(i*100)}}
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
                            <div class="w-full  flex">
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div on:click={()=> handleVote(i)} class=" {$General.mode == "afterVote" ? "bg-white text-black":""} hover:text-black hover:bg-white text-[1.8em] xsm:text-[1.1em] mx-auto capitalize border rounded-full py-[0.25em] min-w-7em px-[1em] whitespace-nowrap font-semibold text-center ">
                                    {#if $General.mode == "vote"}
                                        vote
                                    {:else}
                                        <div in:fly={{y:20}} class="flex justify-center items-center">{$PostDataScore.finalVoteArray[i] || 0} <div in:fly={{y:20, delay:100}} class="ml-[0.5em] text-[0.8em]">votes</div></div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            {/if}
        {/each}
    </div>
</button>
