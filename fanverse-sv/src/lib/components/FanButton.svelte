<script>
    import CurrentFrame from '$lib/stores/CurrentFrame.js';

    export let to = '', type = 1;

    const navigate = () => {
        if (!to) return
        $CurrentFrame = to;
    }

</script>
<!-- noTransition group-hover:-translate-y-[30%]  -->
<button on:click={navigate} class="group block cursor-pointer relative w-[7.5em]">
    {#if type == 2}
        <div class=" w-[calc(100%+10px)] absolute -top-[5px]  left-[calc(50%-0.05px)] -translate-x-1/2">
            <div class="transition-all w-full h-[0.8em] border-1 border-b-0"></div>     
        </div>
        <div class=" w-[calc(100%+10px)] absolute -bottom-[5px]  left-[calc(50%-0.05px)] -translate-x-1/2">
            <div class=" transition-all w-full h-[0.8em] border-1 border-t-0"></div>     
        </div>
    {:else}
        <div class="w-[3.3em] absolute top-[-0.32em] left-1/2 -translate-x-1/2">
            <svg  viewBox="0 0 79 4"  xmlns="http://www.w3.org/2000/svg">
                <path class="fill-(--color-sec)" d="M0 4L5.17467 0H73.8253L79 4H0Z" />
            </svg>                
        </div>

        <div class="w-[1.8em] absolute bottom-[-0.2em] left-1/2 -translate-x-1/2">
            <svg viewBox="0 0 44 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="fill-(--color-sec)" d="M0 0L2.8821 2H41.1179L44 0H0Z"/>
            </svg>                                         
        </div>
    {/if}
    <div class="{type == 2 ? "orange-button-two" : "orange-button" } ">
        <slot/>
    </div>
 
  
</button>