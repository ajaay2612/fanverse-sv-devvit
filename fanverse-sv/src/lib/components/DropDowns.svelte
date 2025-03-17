<script>    
    import BoxButton from './BoxButton.svelte';
    export let drop;
    
    let showDropDown = false;
    function toggleDropDown() {
        showDropDown = !showDropDown;
    }
    function closeDropDown() {
        showDropDown = false;
    }
    function selectOption(option) {
        drop.active = drop.options.indexOf(option);
        showDropDown = false;
    }

    let dropDownElement = null
</script>

<svelte:window on:click={(e) => {!dropDownElement.contains(e.target) ? showDropDown = false:'' } } />


<button bind:this={dropDownElement} on:click={toggleDropDown} class="w-[4.7em] text-center relative">
    <BoxButton>
        <p class="text-[0.35em] py-[0.5em] font-inter-italic font-bold uppercase">
            {#if drop.active > -1}
                {#if drop.name == "select style" || drop.name == "number of teams"}
                   <div class="flex items-center justify-center gap-[0.5em]">{drop.name} <span class="text-[0.9em]">&#62;</span> {drop.options[drop.active]}</div>
                {:else}
                    {drop.options[drop.active]}
                {/if}
            {:else}
                {drop.name}
            {/if}
        </p>
    </BoxButton>
    {#if drop.options && showDropDown}
        <div class="z-[15] absolute top-full mt-[0.2em] left-[-5px] w-[calc(100%+10px)] bg-header-hover">
            
            <div class="z-[17] relative pointer-events-none opacity-50 text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">{drop.name}</div>
            {#each drop.options as option}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div on:click={()=>selectOption(option)} class="z-[17] relative  hover:bg-white hover:text-black text-[0.35em] uppercase font-inter-italic font-bold text-center py-[0.8em]">{option}</div>
            {/each}
        </div>
    {/if}
</button>