<script>
    import { fade, scale } from 'svelte/transition';
    import BoxButton from './BoxButton.svelte';
    import DropDowns from './DropDowns.svelte';
    import { cubicOut } from 'svelte/easing';
    import DropDownData from '../stores/DropDownData';
   

    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }
    function closeMenu() {
        showMenu = false;
    }

</script>

<div class="pointer-events-none  z-[10] fixed p-[1.2em] h-screen w-full ">
    <button on:click={toggleMenu} class="pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative size-[0.72em] block ml-auto">
        <BoxButton>
            <div class="leading-0 text-[0.75em] absolute top-1/2 left-1/2 -translate-1/2">&#9881;</div>
        </BoxButton>
    </button>

    {#if showMenu}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div on:click|self={closeMenu} transition:fade={{duration:400, easing: cubicOut}} class="pointer-events-auto backdrop-blur-[5px] text-[2.8em] bg-pickem-header-bg absolute left-0 top-0 h-full w-full  mx-auto flex justify-center items-center
        xsm:text-[1.5em]">
            <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex flex-col justify-center items-center gap-[1em]">
                {#each $DropDownData as drop}
                    <DropDowns bind:drop={drop} />
                {/each}
            </div>
        </div>
    {/if}
</div>