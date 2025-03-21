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


</script>

<p class="font-bold text-[3.5em] absolute top-[50%] left-1/2 -translate-1/2">
    VS
</p>

<button
    class="px-[1.5em] w-full uppercase h-full justify-between relative text-center flex text-[1.25em] "
>
    <div class="w-[80%] mx-auto flex justify-center items-center gap-[10em] lg:gap-[10em]">

       
        {#each $postData.allLoadedData as team, i}

    
            {#if $General.mode == "create" || ($General.mode == "vote" && $postData.isCreator) }
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
                            {#if team.teamImage}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <div
                                on:click={() => $General.mode == "create" ? create(i) : ""}
                                    class="cursor-pointer rounded-[0.4em] overflow-hidden w-[11em] aspect-square shrink-0"
                                >
                                    <img
                                        class="w-full h-full object-cover"
                                        src={team.teamImage}
                                        alt=""
                                    />
                                </div>
                            {/if}
                            <div class="space-y-[0.8em]">
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <p 
                                on:click={() => $General.mode == "create" ? create(i) : ""}
                                class="cursor-pointer text-center text-[1.2em] grow">
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
                    {#if team.teamImage}
                        <div
                            class="rounded-[0.4em] overflow-hidden w-[11em] aspect-square shrink-0"
                        >
                            <img
                                class="w-full h-full object-cover"
                                src={team.teamImage}
                                alt=""
                            />
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</button>
