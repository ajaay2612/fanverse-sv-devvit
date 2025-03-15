<script>
    import CurrentFrame from '$lib/stores/CurrentFrame.js';
    import Home from '../lib/frames/Home.svelte';
    import RootLayout from '../lib/layout/RootLayout.svelte';
    import PickemsLayout from '../lib/layout/PickemsLayout.svelte';
    import Create from '../lib/frames/Create.svelte';
    import General from '$lib/stores/General';
    
    import Pickems from '../lib/frames/Pickems.svelte';


    let messageOutput = '';
    let mounted = false;

    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;
            // Always output full message
            messageOutput = JSON.stringify(message, undefined, 2);

            // Load initial data
            if (message.type === 'initialData') {

                if(mounted) return;

                mounted = true;
                $General.userName = message.data.username;
                $General.mode = "create";


            }
        }
    };
    
    const interval = setInterval(() => {
        if (!mounted) {
            window.parent.postMessage({
                type: 'webViewReady'
            }, '*');
        } else {
            clearInterval(interval); // Stop the interval once mounted is true
        }
    }, 500); 
   
</script>
<svelte:window on:message={handleMessage}/>

<!-- {$General.userName} -->

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


<pre class="bg-gray-200 text-black p-0hem rounded overflow-auto max-h-10em">
    output: 
    {messageOutput}
</pre>


