<script>
    import Header from '../components/Header.svelte';
    import DropDownData from '$lib/stores/DropDownData';
    import { fade } from 'svelte/transition';

</script>


<div class="{$DropDownData[3].options[$DropDownData[3].active]}  h-screen w-full overflow-hidden relative">
    
    {#key $DropDownData[3].active}
        <div in:fade={{duration:500}} class="absolute bottom-[-1.5em] left-[-7.5em] w-[15em] blur-[100px]">
            <svg viewBox="0 0 531 667" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect class="transition-[fill] duration-500 fill-(--color-pickem-left-box)" x="343.363" y="0.132812" width="221" height="647.837" transform="rotate(32 343.363 0.132812)" />
            </svg>            
        </div>

        <div in:fade={{duration:500}} class="absolute bottom-[-5em] left-[6em] w-[20em] blur-[85px]">
            <svg viewBox="0 0 752 1020" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect class="transition-[fill] fill-(--color-pickem-right-box)" x="564.438" y="0.355469" width="221" height="1063.82" transform="rotate(32 564.438 0.355469)"/>
            </svg>            
        </div>
    {/key}

    
    <div class="relative h-full w-full">
        <Header/>
        <slot/>
    </div>
</div>
