<script>
    import { fade, scale } from 'svelte/transition';
    import BoxButton from './BoxButton.svelte';
    import DropDowns from './DropDowns.svelte';
    import ThemedropRanking from './ThemedropRanking.svelte';
    import AddBackground from './AddBackground.svelte';
    import { cubicOut } from 'svelte/easing';
    import DropDownDataRanking from '../stores/DropDownDataRanking';

    import PostDataRanking from '../stores/PostDataRanking';

    import General from '$lib/stores/General';
    import VoteDataRanking from '../stores/VoteDataRanking';

    import { getContext } from 'svelte';

    const refreshData = getContext('refreshData');

    $: postData = $PostDataRanking;
    $: voteData = $VoteDataRanking

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
            data: { "allPostData" :{"postdata": postData,  postType: $DropDownDataRanking[0]?.active  == 1 ? "rankingVote" : "ranking"  , "dropDownData":$DropDownDataRanking} }
        }, '*');
    }

   
    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;

            if (message.type === 'voteDataUpdated') {
                // voteData = message.data.voteData;
                voteData.set(message.data.voteData);
                $General.mode = "afterVote";
                refreshData();
            }
            
            
        }
    };


</script>
<svelte:window on:message={handleMessage}/>


<div class="text-[0.9em] xsm:text-[1em] pointer-events-none  z-[10] fixed p-[1.2em] h-screen w-full ">
    <div class="flex flex-row-reverse justify-between w-full gap-[1em]">
        
        <!-- {#if $General.mode === "vote"}
            {#if !postData.isCreator}
                <button
                disabled={!voteData.canVote}
                on:click={voteData.canVote ? handleVote:""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase {$DropDownDataRanking[0]?.active  == 0 ? "font-inter-italic  ":"font-bigShoulders" } font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">vote</div>
                    </BoxButton>
                </button>
            {/if}
        {/if} -->
        {#if $General.mode === "create"}
            <button 
            disabled={!postData.canPost}
            on:click={postData.canPost ? handlePost : ""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em]  group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase {$DropDownDataRanking[0]?.active  == 0 ? "font-inter-italic  ":"font-bigShoulders" } font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">post</div>
                </BoxButton>
            </button>

            <div class=" flex flex-col-reverse xsm:flex-row-reverse w-fit gap-[1em]">
                <AddBackground/>
                
                <ThemedropRanking bind:drop={$DropDownDataRanking[2]} />
                
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
                {#each $DropDownDataRanking as drop}
                    {#if drop.name !== "select color"}
                        <DropDowns bind:drop={drop} />
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>