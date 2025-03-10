

<div class="homeScreenGradient h-screen w-full ">
        
    <div class="pointer-events-none absolute top-[1.3em] flex justify-between w-full px-[1.3em]">
        {#each Array.from({length:2}) as _,i}
            <div class="flex gap-[0.2em]">
                <div class="size-[0.4em] bg-pri"></div>
                <div class="size-[0.4em] border-pri border-[0.01em] "></div>
                <div class="size-[0.4em] bg-pri"></div>
            </div>
        {/each}
    </div>

    <div class="pointer-events-none flex absolute items-center left-0 top-0 w-full h-full justify-between">
        <div class="h-[70%]">
            <svg viewBox="0 0 80 475" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.53674e-07 474L79 378.029L79 96.971L9.53674e-07 0.999998" stroke="#414141" stroke-width="0.5"/>
                <path d="M-9.53674e-07 356L40 307.913L40 167.087L-9.53674e-07 119" stroke="#414141" stroke-width="0.5"/>
                <line x1="56.25" y1="197" x2="56.25" y2="279" stroke="#414141" stroke-width="0.5"/>
                <line x1="62.25" y1="197" x2="62.25" y2="279" stroke="#414141" stroke-width="0.5"/>
            </svg>
        </div>
        <div class="h-[70%]">
            <svg viewBox="0 0 80 475" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M80 1L1 96.971V378.029L80 474" stroke="#414141" stroke-width="0.5"/>
                <path d="M80 119L40 167.087V307.913L80 356" stroke="#414141" stroke-width="0.5"/>
                <line x1="16.25" y1="197" x2="16.25" y2="279" stroke="#414141" stroke-width="0.5"/>
                <line x1="22.25" y1="197" x2="22.25" y2="279" stroke="#414141" stroke-width="0.5"/>
            </svg>
        </div>
    </div>
    <slot/>
</div>
