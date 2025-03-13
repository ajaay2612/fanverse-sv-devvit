<script>
    import BoxButton from '../components/BoxButton.svelte';
    import SingleElim from '../braket/SingleElim.svelte';
    import DoubleElim from '../braket/DoubleElim.svelte';
    import DropDownData from '../stores/DropDownData';

    let teams = ["SEN", "DRX", "100T", "C9"];

    $: noOfTeam = $DropDownData[1].options[$DropDownData[1].active];

    // let teams = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"];

</script>

<div class="h-screen w-full">
    <div class="pickem-main-bg-gradient translate-y-[10%] h-full w-full absolute top-0 left-0 z-0 pointer-events-none"></div>


    <!-- title -->
    <div class="border-b py-2em xsm:py-1em border-pickem-border-bottom">
        <div class="text-[1.2em] xsm:text-[0.7em] lg:text-[0.62em] w-fit mx-auto  relative pr-1hem ">
            <div class="flex justify-center items-center gap-[1.1em]">
                <div class="w-[2.8em]">
                    <img class="w-full h-full" src="/images/pickems/logo.svg" alt="">
                </div>
                <div class="">
                    <p class="text-center font-inter leading-[1em] font-bold text-pickem-title text-[1.2em]">PICKE’EMS</p>
                    <p class="text-center font-inter font-bold text-[0.55em]">SUBTITLE</p>
                </div>
            </div>
            <div class="absolute top-[-0.2em] right-[0] h-[0.55em] size-[0.5em] text-[1.1em] text-center">
                <BoxButton>
                    <div class="w-[0.55em] absolute top-1/2 left-1/2 -translate-1/2">
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0205 4.64387L10.9388 3.72558C11.6606 3.00377 11.6606 1.83348 10.9388 1.11167C10.217 0.38986 9.0467 0.389859 8.32489 1.11167L7.38886 2.0477C8.00598 3.13595 8.91598 4.03738 10.0205 4.64387ZM5.93422 3.50234L1.99303 7.44354C1.56797 7.8686 1.35544 8.08113 1.2157 8.34222C1.07597 8.60332 1.01702 8.89805 0.899131 9.4875L0.630258 10.8319C0.563736 11.1645 0.530475 11.3308 0.625083 11.4254C0.719691 11.52 0.885996 11.4867 1.21861 11.4202L2.56297 11.1513L2.56298 11.1513C3.15243 11.0334 3.44715 10.9745 3.70825 10.8348C3.96934 10.695 4.18187 10.4825 4.60692 10.0575L4.60693 10.0575L4.60693 10.0574L8.56156 6.10282C7.5086 5.43087 6.61352 4.54282 5.93422 3.50234Z" fill="white"/>
                        </svg>
                    </div>
                </BoxButton>
            </div>
        </div>
    </div>

    <!-- bracket -->
    <div class="text-[0.5em] h-[80%] flex items-center">
        {#key noOfTeam}
            <SingleElim  noOfTeam={noOfTeam}/>
        {/key}
        <!-- <DoubleElim /> -->
    </div>


</div>
