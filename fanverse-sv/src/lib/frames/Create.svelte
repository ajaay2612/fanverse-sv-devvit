<script>

    let createCards = [
        {
            name: "tournament bracket",
            pic: "/images/create-page/tb.svg",
        },
        {
            name: "rankings",
            pic: "/images/create-page/r.svg",
        },
        {
            name: "scoreboard",
            pic: "/images/create-page/s.svg",
        },
        {
            name: "performance",
            pic: "/images/create-page/p.svg",
        }
    ]
</script>

<div class="text-[1.12em] h-full w-full flex justify-center flex-col gap-[1em] items-center">

    <h1 class="text-[0.7em] font-inter-italic font-bold text-center">What Will You Create?</h1>
    <div class="w-[500px] grid grid-cols-2 gap-[0.5em]">
        {#each createCards as card}
        <button class="cursor-pointer pb-[0.5em] pt-[0.3em] border border-preHover hover:border-white justify-center gap-[0.68em] flex flex-col items-center">
            <div class="space-y-[0.18em]">
                <p class="capitalize text-pri text-center text-[0.55em] font-inter-italic font-bold">{card.name}</p>
                <div class="w-[3.2em] mx-auto">
                    <svg viewBox="0 0 87 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L5.69869 4H81.3013L87 0H0Z" fill="#FF4C00"/>
                    </svg>
                </div>
            </div>

            <div class="w-[90%] mx-auto"><img src={card.pic} alt={card.name} class="w-full"/></div>
        </button>
        {/each}
    </div>
        
</div>
