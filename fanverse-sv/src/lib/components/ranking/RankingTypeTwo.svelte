
<script>
    import PostDataRanking from "$lib/stores/PostDataRanking";
    import General from "$lib/stores/General";
    import { text } from "@sveltejs/kit";
    import TeamPickerDataRanking from "$lib/stores/TeamPickerDataRanking";
    import { onMount } from "svelte";

    import VoteDataRanking from "$lib/stores/VoteDataRanking";

    $: postDataRanking = PostDataRanking;
    // $: console.log($postDataRanking);


    $: myVote = $VoteDataRanking?.votesArrayData?.map((vote) => {
        // find() returns a single object or undefined, not an array
        let userVote = vote.find((v) => v.name == $General.userName);
        
        // Return true for upvote, false for downvote, null for no vote
        return userVote ? (userVote.points == 1) : null;
    });



    $: isCreate = $General.mode == "create";

    onMount (() => {
        $postDataRanking.allColumns = [""]
    })


    function addRow() {
        $postDataRanking.allLoadedData = [...$postDataRanking.allLoadedData, { teamName: null, data: ["subtitle"] }]
    }

    $: if($postDataRanking){

        let isNull = false;

        for(let i = 0; i < $postDataRanking.allLoadedData.length; i++){
            if($postDataRanking.allLoadedData[i].teamName == null){
                isNull = true;
                break;
            }
        }

        if($postDataRanking.allLoadedData.length == 0){
            isNull = true;
        }

        console.log(isNull);

        if(isNull){
            $postDataRanking.canPost = false;
        }else{
            $postDataRanking.canPost = true;
        }
    }

    function handleUpVote(i) {
        if ($General.mode != "vote" ) return;
        // console.table($VoteDataRanking);

        // $VoteDataRanking.votesArray[i] = $VoteDataRanking.votesArray[i] || 0

        // $VoteDataRanking.votesArray[i] = $VoteDataRanking.votesArray[i] +  1;

        // console.table($VoteDataRanking);
        window.parent.postMessage({
            type: 'setVoteDataRanking',
            data: { "voteData" : 
                {
                    userName : $General.userName,
                    index : i,
                    upVote: true
                } 
            }
        }, '*');
    }
    function handleDownVote(i) {
        if ($General.mode != "vote" ) return;

        // $VoteDataRanking.votesArray[i] = $VoteDataRanking.votesArray[i] || 0


        // $VoteDataRanking.votesArray[i] = $VoteDataRanking.votesArray[i]  - 1;


        window.parent.postMessage({
            type: 'setVoteDataRanking',
            data: { "voteData" : 
                {
                    userName : $General.userName,
                    index : i,
                    upVote: false
                } 
            }
        }, '*');
    }

    // [
    //     [ { name: 'Worldly_Store8035', points: 1 } ],
    //     [ { name: 'Worldly_Store8035', points: -1 } ]
    // ]


    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;

            if (message.type === 'voteDataRankedUpdated') {
                // voteData = message.data.voteData;
                $VoteDataRanking.votesArray = message.data.voteData;
                $VoteDataRanking.votesArrayData = message.data.voteDataArray;
                // voteData.set(message.data.voteData);
                // $General.mode = "afterVote";
                // refreshData();
            }
            
            
        }
    };


    function removeRow(index) {
        $postDataRanking.allLoadedData = $postDataRanking.allLoadedData.filter((_, i) => i !== index)
    }

    function create(index){
        $TeamPickerDataRanking.showTeamPicker = true;
        $TeamPickerDataRanking.teamPickerIndex = index; 
    }
        
</script>
<svelte:window on:message={handleMessage}/>

<div class="relative z-[5] h-full w-full pb-4hem pt-2em  font-bold font-bigShoulders uppercase">
    <div class="h-full w-[90%] mx-auto overflow-auto pt-1em thin-scrollbar ">
        <div class="w-[calc(100%-15em)] mx-auto space-y-1em">
            {#each $postDataRanking.allLoadedData as rankers, i}
                <div class="relative flex justify-center items-center h-[6em] gap-0em">

                    <div class="flex gap-[0.5em] items-center font-inter-italic absolute left-[calc(100%-3em)] text-[1.45em] bottom-[0em]">
                        {$VoteDataRanking.votesArray[i] || 0} 
                        {#if myVote && myVote.length > 0 && myVote[i] !== null}
                            {#if myVote[i] === true}
                                <div class="mt-[0.1em] w-[0.6em]">
                                    <svg viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.5 2L16 9M8.5 2L1 9M8.5 2L8.5 3.32169" stroke="#00B928" stroke-width="3"/>
                                        <path d="M8.5 11L16 18M8.5 11L1 18M8.5 11L8.5 12.3217" stroke="#00B928" stroke-width="3"/>
                                    </svg>                                        
                                </div>
    
                            {:else if myVote[i] === false}
                                <div class="mt-[0.2em] w-[0.6em]">
                                    <svg viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.48438 17L0.984375 10M8.48438 17L15.9844 10M8.48438 17L8.48438 15.6783" stroke="#B92800" stroke-width="3"/>
                                        <path d="M8.48438 8L0.984375 1M8.48438 8L15.9844 0.999999M8.48438 8L8.48438 6.67831" stroke="#B92800" stroke-width="3"/>
                                    </svg>                                        
                                </div>
                            {/if}
                        {/if}
                    
                    </div>
                    <!-- upvote Downvote -->
                    <div class="flex gap-[0.5em] absolute right-[-2.2em] top-0">
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button on:click={()=>handleUpVote(i)} class="hover:opacity-65 bg-ranking-vote p-[1em]">
                            <div class="w-[1em]">
                                <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.1031 3.04992L22.6875 13.6343M12.1031 3.04992L1.51867 13.6343M12.1031 3.04992L12.1031 24.2188" stroke="#00B928" stroke-width="4"/>
                                </svg>
                            </div>
                        </button >
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button on:click={()=>handleDownVote(i)} class="hover:opacity-65 bg-ranking-vote p-[1em]">
                            <div class="w-[1em]">
                                <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.3657 21.2157L1.78125 10.6313M12.3657 21.2157L22.9501 10.6313M12.3657 21.2157L12.3657 0.046875" stroke="#B90000" stroke-width="4"/>
                                </svg>
                            </div>
                        </button >
                    </div>


                    {#if isCreate}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button on:click={()=> removeRow(i)} class="cursor-pointer w-[2.5em] absolute top-1/2 -translate-y-1/2 right-[-5.5em]">
                            <svg class="rotate-45" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="29.0008" cy="28.9969" r="23.8344" stroke="white" stroke-width="1.2"/>
                                <path d="M29 37.1172L29 20.8276" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                <path d="M37.1562 28.9922L20.8666 28.9922" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                            </svg>                                   
                        </button>
                    {/if}

                    <div class="text-[3.5em] aspect-[3/4] h-full flex justify-center items-center">
                        <p>{i+1}</p>
                    </div>

                    <button on:click|self={()=> create(i)}
                    class="p-[0.5em] cursor-pointer pb-[0.2em] uppercase h-full justify-between relative text-center bg-ranking-blocks flex  text-[1.25em] w-[calc(100%-10em)] mr-[2em] cursor-pointer">
        
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div on:click={()=> create(i)} class="flex w-[50%]">
                            {#if $General.mode == "create"}
                                <!-- svelte-ignore node_invalid_placement_ssr -->
                                <button  class="flex ">
                                    {#if rankers.teamName == null}
                                        <div  class="pointer-events-none w-[1.45em]">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.511719 11.6797H23.7734" stroke="#fff" stroke-width="3"/>
                                                <path d="M12.1406 23.3125L12.1406 0.0507812" stroke="#fff" stroke-width="3"/>
                                            </svg>
                                        </div>
                                    {:else}
                                        <div class="  w-full flex h-auto  gap-1hem items-start pb-[0.4em] pr-[0.4em]">
                                            {#if rankers.teamImage }
                                                <div class=" w-full h-full absolute left-0 top-0 overflow-hidden "><img class="w-full h-full object-cover" src={rankers.teamImage} alt=""></div>
                                                <div class="ranking-style-two w-full h-full absolute left-0 top-0 overflow-hidden "></div>
                                            {/if}
                                            <p class="font-inter relative text-left translate-y-[-0.2em] text-[0.9em] grow">{rankers.teamName}</p>
                                        </div>
                                    {/if}
                                </button>
                            {:else}
                                <div class="  w-full flex h-auto  gap-1hem items-start pb-[0.4em] pr-[0.4em]">
                                    {#if rankers.teamImage }
                                        <div class=" w-full h-full absolute left-0 top-0 overflow-hidden "><img class="w-full h-full object-cover" src={rankers.teamImage} alt=""></div>
                                        <div class="ranking-style-two w-full h-full absolute left-0 top-0 overflow-hidden "></div>
                                    {/if}
                                    <p class="font-inter relative text-left translate-y-[-0.2em] text-[0.9em] grow">{rankers.teamName}</p>
                                </div>
                            {/if}
                        </div>

                        <div class="font-inter flex justify-end items-end gap-1em">
                            {#each $postDataRanking.allColumns as cols, i}
                                <!-- <p 
                                style="width:{cols.length * 1.1}em"
                                class="text-center ">{rankers.data[i] || "..."}</p> -->


                                {#if isCreate}
                                    <input type="text"
                                    bind:value={rankers.data[i]} placeholder="..."
                                    class="min-w-[3em] text-[0.8em] group-hover:opacity-75 opacity-[0.9] uppercase text-right" />                                    
                                {:else}
                                    <p 
                                    class="text-right text-[0.8em]">{rankers.data[i] || "..."}</p>
                                 
                                {/if}


                            {/each}


                        </div>
                    </button>
                </div>
            {/each}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            {#if isCreate}
                <div class="w-[calc(100%-12.4em)] ml-[7.2em]">
                    <button on:click={addRow} class="
                    w-full text-[1em]
                    cursor-pointer opacity-75 hover:opacity-100  bg-pickem-box flex justify-start items-center h-[6em] gap-2em">
                        <div class="w-[3em] mx-auto">
                            <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="29.0008" cy="28.9969" r="23.8344" stroke="white" stroke-width="1.2"/>
                                <path d="M29 37.1172L29 20.8276" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                <path d="M37.1562 28.9922L20.8666 28.9922" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                            </svg>
                        </div>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

