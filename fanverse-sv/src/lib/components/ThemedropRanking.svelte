<script>    
    import BoxButton from './BoxButton.svelte';
    import DropDownDataRanking from '../stores/DropDownDataRanking';

    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    export let drop;
    
    let showDropDown = false;
    function toggleDropDown() {
        showDropDown = !showDropDown;
    }
    function closeDropDown() {
        showDropDown = false;
    }
    function selectOption(option) {
        drop.active = option;
        console.log(option);
        // showDropDown = false;
    }

    let dropDownElement = null
</script>

<svelte:window on:click={(e) => {!dropDownElement.contains(e.target) ? showDropDown = false:'' } } />


<button bind:this={dropDownElement} class="  text-center relative">
    <div on:click={toggleDropDown}  class="pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative size-[0.72em] block ml-auto">
        <BoxButton>
            <div class="leading-0 text-[0.78em] size-[0.7em] absolute top-1/2 left-1/2 -translate-1/2"> 
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM11 17.925C12.9833 17.675 14.6458 16.8042 15.9875 15.3125C17.3292 13.8208 18 12.05 18 10C18 7.95 17.3292 6.17917 15.9875 4.6875C14.6458 3.19583 12.9833 2.325 11 2.075V17.925Z" fill="var(--color-badge)"/>
                </svg>
            </div>
        </BoxButton>
    </div>
    {#if drop.options && showDropDown}
        <div transition:fade={{duration:400, easing: cubicOut}} class="text-[2.2em] xsm:text-[1em]  w-[4.7em] pointer-events-auto z-[15] absolute top-full mt-[0.5em] left-[-5px]  bg-header-hover">
            
            <div class="z-[17] relative pointer-events-none opacity-50 text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">{drop.name}</div>
            {#if $DropDownDataRanking[0]?.active == 0}
                {#if $DropDownDataRanking[1].active == 0}
                    {#each drop.options as option, i}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div
                        class:activeTheme={drop.active === i}
    
                        on:click={()=>selectOption(i)} class="z-[17] relative  hover:bg-white hover:text-black text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">
                            {option}
                        </div>
                    {/each}
                {:else}
                    {#each drop.optionsTwo as option, i}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div 
                        class:activeTheme={drop.active === i}
                        on:click={()=>selectOption(i)} class="z-[17] relative  hover:bg-white hover:text-black text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">
                            {option.name}
                        </div>
                    {/each}
                {/if}
            {:else}                       
                {#each drop.secOptions as option, i}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <div
                    class:activeTheme={drop.active === i}

                    on:click={()=>selectOption(i)} class="z-[17] relative  hover:bg-white hover:text-black text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">
                        {option.name}
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</button>