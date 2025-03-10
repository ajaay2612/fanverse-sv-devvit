<script>
    import BoxButton from './BoxButton.svelte';
    let dropDowns = [
        {
            name: 'select type'
        },
        {
            name: 'number of teams'
        },
        {
            name: 'select style'
        },
        {
            name: 'select color'
        },
        {
            name: 'select category'
        },

    ]
</script>

<div class="py-[1.2em] w-full bg-pickem-header-bg">
    <div class="flex justify-center items-center gap-[1em] mx-auto">
        {#each dropDowns as drop}            
            <div class="w-[4.7em] text-center">
                <BoxButton>
                    <p class="text-[0.35em] py-[0.5em] font-inter-italic font-bold uppercase">
                        {drop.name}
                    </p>
                </BoxButton>
            </div>
        {/each}
    </div>
</div>