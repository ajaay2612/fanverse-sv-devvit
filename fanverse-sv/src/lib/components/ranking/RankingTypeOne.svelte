
<script>
    import PostDataRanking from "$lib/stores/PostDataRanking";
    import General from "$lib/stores/General";
    import { text } from "@sveltejs/kit";
    import TeamPickerDataRanking from "$lib/stores/TeamPickerDataRanking";

    $: postDataRanking = PostDataRanking;
    // $: console.log($postDataRanking);


    $: isCreate = $General.mode == "create";


    // $:console.table($postDataRanking.allLoadedData);

    function addColumn() {
        $postDataRanking.allColumns = [...$postDataRanking.allColumns, ""]
    }
    function removeColumn(index) {
        $postDataRanking.allColumns = $postDataRanking.allColumns.filter((_, i) => i !== index)
    }
    function addRow() {
        $postDataRanking.allLoadedData = [...$postDataRanking.allLoadedData, { teamName: null, data: Array($postDataRanking.allColumns.length).fill(null) }]
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


    function removeRow(index) {
        $postDataRanking.allLoadedData = $postDataRanking.allLoadedData.filter((_, i) => i !== index)
    }

    function create(index){
        $TeamPickerDataRanking.showTeamPicker = true;
        $TeamPickerDataRanking.teamPickerIndex = index; 
    }
        
</script>

<div class="relative z-[5] h-full w-full pb-4hem pt-2em  font-bold font-inter uppercase">
    <div class="w-[90%] mx-auto">
        <div class=" w-[calc(100%-12.3em)] flex justify-end ml-[6.8em] h-2em mb-1em ">

            <div class="pr-[1.5em] w-full text-[1.25em]">
                <div class="w-full">
                    <div class="w-full flex justify-end items-center gap-1em">
                        {#if isCreate}
                            <button on:click={addColumn} class="text-[0.89em] hover:opacity-100 opacity-50 flex justify-center items-center gap-[0.5em]">
                                <p>ADD COLUMN</p>
                                <div class="w-[1.5em]">
                                    <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="29.0008" cy="28.9969" r="23.8344" stroke="white" stroke-width="1.2"/>
                                        <path d="M29 37.1172L29 20.8276" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                        <path d="M37.1562 28.9922L20.8666 28.9922" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                    </svg>                                    
                                </div>
                            </button>
                        {/if}
                        {#each $postDataRanking.allColumns as cols, i}
                            {#if isCreate}

                            <div style="width:{cols.length * 1.1}em" 
                                class="min-w-[3em] relative group">
                                <input type="text" placeholder="..."
                                bind:value={cols}
                                
                                class=" group-hover:opacity-75 opacity-50 uppercase w-full text-[0.8em] text-center" />

                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <button on:click={()=> removeColumn(i)} class="w-[1.25em] absolute top-[-0.5em] right-[-0.8em]">
                                    <svg class="rotate-45" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="29.0008" cy="28.9969" r="23.8344" stroke="white" stroke-width="1.2"/>
                                        <path d="M29 37.1172L29 20.8276" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                        <path d="M37.1562 28.9922L20.8666 28.9922" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                    </svg>                                   
                                </button>
                            
                            </div>
                            <!-- <span class="text-[0.8em]">{cols}</span> -->
                            
                            {:else}
                            <p
                            style="width:{cols.length * 1.1}em"
                            class="opacity-50 text-center"> <span class="uppercase text-[0.8em]">{cols || "..."}</span></p>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="h-full w-full overflow-auto thin-scrollbar ">
        <div class="w-[90%] mx-auto space-y-1em">
            {#each $postDataRanking.allLoadedData as rankers, i}
                <div class="relative flex justify-start items-center h-[4em] gap-2em">

                    {#if isCreate}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button on:click={()=> removeRow(i)} class="cursor-pointer w-[2.5em] absolute top-1/2 -translate-y-1/2 right-[1.5em]">
                            <svg class="rotate-45" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="29.0008" cy="28.9969" r="23.8344" stroke="white" stroke-width="1.2"/>
                                <path d="M29 37.1172L29 20.8276" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                                <path d="M37.1562 28.9922L20.8666 28.9922" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
                            </svg>                                   
                        </button>
                    {/if}

                    <div class="text-[1.7em] aspect-[5/4] h-full flex justify-center items-center">
                        <p>{i+1}</p>
                    </div>

                    <button
                    class="px-[1.5em] uppercase h-full justify-between relative text-center bg-pickem-box flex  text-[1.25em] w-[calc(100%-10em)] border-l-[0.25em] border-pickem-title cursor-pointer">
        
                        <div class="flex w-[50%]">
                            {#if $General.mode == "create"}
                                <!-- svelte-ignore node_invalid_placement_ssr -->
                                <button on:click={()=> create(i)} class="flex">
                                    {#if rankers.teamName == null}
                                        <div  class="w-[1.45em]">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.511719 11.6797H23.7734" stroke="#fff" stroke-width="3"/>
                                                <path d="M12.1406 23.3125L12.1406 0.0507812" stroke="#fff" stroke-width="3"/>
                                            </svg>
                                        </div>
                                    {:else}
                                        <div class="flex h-auto w-full gap-1hem items-center p-[0.4em] px-[0.4em]">
                                            {#if rankers.teamImage }
                                                <div class="rounded-[0.4em] overflow-hidden h-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={rankers.teamImage} alt=""></div>
                                            {/if}
                                            <p class="text-left text-[1.2em] grow">{rankers.teamName}</p>
                                        </div>
                                    {/if}
                                </button>
                            {:else}
                                <div class="flex h-auto w-full gap-1hem items-center p-[0.4em] px-[0.4em]">
                                    {#if rankers.teamImage }
                                        <div class="rounded-[0.4em] overflow-hidden h-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={rankers.teamImage} alt=""></div>
                                    {/if}
                                    <p class="text-left text-[1.2em] grow">{rankers.teamName}</p>
                                </div>
                            {/if}
                        </div>

                        <div class=" flex justify-end items-center gap-1em">
                            {#each $postDataRanking.allColumns as cols, i}
                                <!-- <p 
                                style="width:{cols.length * 1.1}em"
                                class="text-center ">{rankers.data[i] || "..."}</p> -->


                                {#if isCreate}
                                    <input type="text"
                                    style="width:{cols.length * 1.1}em"
                                    bind:value={rankers.data[i]} placeholder="..."
                                    class="min-w-[3em]  group-hover:opacity-75 opacity-50 uppercase text-center" />                                    
                                {:else}
                                    <p 
                                    style="width:{cols.length * 1.1}em"
                                    class="text-center ">{rankers.data[i] || "..."}</p>
                                 
                                {/if}


                            {/each}


                        </div>
                    </button>
                </div>
            {/each}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            {#if isCreate}
                <div class="w-[calc(100%-12.3em)] ml-[7em]">
                    <button on:click={addRow} class="
                    pr-[1.5em] w-full text-[1em]
                    cursor-pointer opacity-75 hover:opacity-100  bg-pickem-box flex justify-start items-center h-[4em] gap-2em">
                        <div class="w-[2em] mx-auto">
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

