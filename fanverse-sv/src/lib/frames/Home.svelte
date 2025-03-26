<script>
    import { fade, scale } from 'svelte/transition';
    import FanButton from '../components/FanButton.svelte';


    let showKnowMore = false;

    const openKnowMore = () => {
        showKnowMore = !showKnowMore;
    }

    const closeKnowMore = () => {
        showKnowMore = false;
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

{#if showKnowMore}
    <div transition:fade={{duration:300}} on:click={closeKnowMore} class="fixed text-[1.0em] xsm:text-[0.7em]  font-inter-italic font-bold leading-[1.2em] flex flex-col justify-center items-center h-full w-full ">
        <div in:scale={{start:0.8}} out:fade class="w-[85%] xsm:w-[70%] space-y-1em">
            <p>Fanverse is a community-driven platform where you can create, vote, and track tournaments, rankings, and match results across sports, esports, anime, and more.</p>
            <p>Create and predict tournament brackets for real-world sports events, esports matchups, or fan-favorite showdowns. Vote on winners and compete in pick’ems with the community.</p>
            <p>Rank anything from teams and players to anime characters and TV shows. Compare rankings and see how your favorites stack up.</p>
            <p>Track live scores and match results across different categories. Stay updated and see how your predictions play out.</p>
            <p>Join global leaderboards and see how your picks and rankings measure up. Compete with the community and prove your knowledge!</p>
        </div>
    </div>
{:else}
    <div transition:fade={{duration:200}} class="relative text-[1.5em] xsm:text-[1em] h-full w-full flex justify-center flex-col gap-[2.1em] items-center">
        <div class="pt-[1.8em] text-[1.1em] rotate-[-5deg] origin-bottom-left ">
            <h1 class="leading-[1em] font-inter-italic font-bold text-pri text-[2.8em]">FAN<span class="text-stroke text-black">VERSE</span></h1>
            <p class="text-[0.75em] text-right leading-[1em] font-inter-italic font-bold text-pri">WHERE FANS <span class="text-sec">UNITE</span></p>
        </div>
        
        <div class="space-y-[1.5em]">
            <FanButton  to="create">create</FanButton>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div  on:click={openKnowMore}>
                <FanButton type={2} >KNOW MORE</FanButton>
            </div>
        </div>
    </div>
{/if}