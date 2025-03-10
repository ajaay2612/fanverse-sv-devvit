<script>
    import CurrentFrame from '$lib/stores/CurrentFrame.js';
    import Home from '../lib/frames/Home.svelte';
    import RootLayout from '../lib/layout/RootLayout.svelte';
    import PickemsLayout from '../lib/layout/PickemsLayout.svelte';
    import Create from '../lib/frames/Create.svelte';
    
    
    import Pickems from '../lib/frames/Pickems.svelte';


</script>

{#if $CurrentFrame === 'home' || $CurrentFrame === 'create'}
    <RootLayout>
        {#if $CurrentFrame === 'home'}
            <Home/>
        {:else if $CurrentFrame === 'create'}
            <Create/>
        {/if}
    </RootLayout>
{:else}
    <PickemsLayout>
        <Pickems/>
    </PickemsLayout>
{/if}





