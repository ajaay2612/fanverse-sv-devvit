<script>
    import { fade, scale } from 'svelte/transition';
    import BoxButton from './BoxButton.svelte';
    import DropDowns from './DropDowns.svelte';
    import Themedrop from './Themedrop.svelte';
    import AddBackground from './AddBackground.svelte';
    import { cubicOut } from 'svelte/easing';
    import DropDownData from '../stores/DropDownData';
    import PostData from '$lib/stores/PostData';
    import General from '$lib/stores/General';
    import VoteData from '$lib/stores/VoteData';
    import LeaderBoard from './leaderBoard.svelte';
    import { getContext } from 'svelte';

    const refreshData = getContext('refreshData');


    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }
    function closeMenu() {
        showMenu = false;
    }

    function handlePost() {
        console.log("post sent");
        window.parent.postMessage({
            type: 'setPostData',
            data: { "allPostData" :{"postdata": $PostData, "dropDownData":$DropDownData} }
        }, '*');
    }

    function handleVote() {
        console.log("vote sent");
        $VoteData.totalVotes = $VoteData.totalVotes + 1;
        window.parent.postMessage({
            type: 'setVoteData',
            data: { "voteData" : $VoteData }
        }, '*');
    }

    function handleFinishOff() {
        console.log("finish off sent");
        console.log($VoteData);
        window.parent.postMessage({
            type: 'finishOff',
            data: { "voteData" : $VoteData }
        }, '*');
    }

    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;

            if (message.type === 'voteDataUpdated') {
                $VoteData = message.data.voteData;
                $General.mode = "afterVote";
                refreshData();
            }
            
            
        }
    };

    let showLeaderboard = false;
    function toggleLeaderboard() {
        showLeaderboard = !showLeaderboard;
    }
    function closeLeaderBoard(){
        showLeaderboard = false
    }

</script>
<svelte:window on:message={handleMessage}/>

{#if showLeaderboard}
    <button on:click|self={closeLeaderBoard} transition:fade={{duration:400, easing: cubicOut}} class="z-[10] h-screen backdrop-blur-[5px] absolute left-0 top-0 w-full bg-pickem-header-bg flex justify-center items-center">
        <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="w-full">
            <LeaderBoard bind:showLeaderboard={showLeaderboard}/>
        </div>
    </button>
{/if}

<div class="text-[0.9em] xsm:text-[1em] pointer-events-none  z-[10] fixed p-[1.2em] h-screen w-full ">
    <div class="flex flex-row-reverse justify-between w-full gap-[1em]">
        
        {#if $PostData.isCreator && $General.mode != "create"}
            <button
            on:click={handleFinishOff}
                class=" cursor-pointer h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[5em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">update bracket</div>
                </BoxButton>
            </button>
        {/if}
       
        {#if  $General.mode === "vote" }
            {#if !$PostData.isCreator}
                <button
                disabled={!$VoteData.canVote}
                on:click={$VoteData.canVote ? handleVote:""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">vote</div>
                    </BoxButton>
                </button>
            {/if}
        {/if}
        {#if $General.mode != "create"}
            
            <!-- <div class="flex flex-col gap-[0.8em]"> -->
                <!-- <button
                class=" h-[0.72em] group pointer-events-none z-[20]  text-[2em] xsm:text-[1em] relative w-[5em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">total votes: <span class="ml-0hem">{$VoteData.totalVotes}</span></div>
                    </BoxButton>
                </button> -->
                
                <button
                on:click={toggleLeaderboard}
                class="mr-auto h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[5em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">leaderboard</div>
                    </BoxButton>
                </button>
            <!-- </div> -->


        {/if}
        {#if $General.mode === "create"}
            <button 
            disabled={!$PostData.canPost}
            on:click={$PostData.canPost ? handlePost : ""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em]  group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">post</div>
                </BoxButton>
            </button>

            <div class=" flex flex-col-reverse xsm:flex-row-reverse w-fit gap-[1em]">
                <AddBackground/>
                
                <Themedrop bind:drop={$DropDownData[3]} />
                
                <button on:click={toggleMenu} class="pointer-events-auto z-[25]  text-[2em] xsm:text-[1em] relative size-[0.72em] block ml-auto">
                    <BoxButton>
                        <div class="leading-0 text-[0.75em] absolute top-1/2 left-1/2 -translate-1/2">&#9881;</div>
                    </BoxButton>
                </button>
            </div>
        {/if}
    </div>

    {#if showMenu && $General.mode === "create"}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div on:click|self={closeMenu} transition:fade={{duration:400, easing: cubicOut}} class="z-20 pointer-events-auto backdrop-blur-[5px] text-[2.8em] bg-pickem-header-bg absolute left-0 top-0 h-full w-full  mx-auto flex justify-center items-center
        xsm:text-[1.5em]">
            <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex flex-col justify-center items-center gap-[1em]">
                {#each $DropDownData as drop}
                    {#if drop.name !== "select color"}
                        <DropDowns bind:drop={drop} />
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>