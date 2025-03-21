<script>
    import { fade, scale } from 'svelte/transition';
    import BoxButton from './BoxButton.svelte';
    import DropDowns from './DropDowns.svelte';
    import ThemedropScore from './ThemedropScore.svelte';
    import AddBackground from './AddBackground.svelte';
    import { cubicOut } from 'svelte/easing';
    import DropDownDataScore from '../stores/DropDownDataScore';

    import PostDataScore from '../stores/PostDataScore';

    import General from '$lib/stores/General';
    import VoteDataScore from '../stores/VoteDataScore';

    import { getContext } from 'svelte';

    const refreshData = getContext('refreshData');

    $: postData = $PostDataScore;
    $: voteData = $VoteDataScore

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
            data: { "allPostData" :{"postdata": postData,   postType: $DropDownDataScore[0].active == 0 ? "score" : "scoreVotable" , "dropDownData":$DropDownDataScore} }
        }, '*');
    }

    function handleUpdate() {
        console.log("update sent");

        console.log(voteData);

        window.parent.postMessage({
            type: 'updateVoteDataScore',
            data: { "voteData" : voteData }
        }, '*');
    }
   
  


</script>

<div class="mix-blend-difference text-[0.9em] xsm:text-[1em] pointer-events-none  z-[10] fixed p-[1.2em] h-screen w-full ">
    <div class="flex flex-row-reverse justify-start w-full gap-[1em]">
        
        {#if $General.mode === "vote" && $DropDownDataScore[0]?.active == 0}
            {#if postData.isCreator}
                <button
                on:click={handleUpdate} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[3em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">update</div>
                    </BoxButton>
                </button>
            {/if}
        {/if}
        {#if $General.mode === "create"}
            <button 
            disabled={!postData.canPost}
            on:click={postData.canPost ? handlePost : ""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em]  group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">post</div>
                </BoxButton>
            </button>

            <div class=" flex flex-col-reverse xsm:flex-row-reverse w-fit gap-[1em]">
                <AddBackground/>
                
                <ThemedropScore bind:drop={$DropDownDataScore[1]} />
                
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
                {#each $DropDownDataScore as drop}
                    {#if drop.name !== "select color"}
                        <DropDowns bind:drop={drop} />
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>