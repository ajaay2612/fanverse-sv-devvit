<script>
    import FanButton from '../components/FanButton.svelte';
</script>
<div class="text-[1.5em] xsm:text-[1em] h-full w-full flex justify-center flex-col gap-[2.1em] items-center">
    <div class="pt-[1.8em] text-[1.1em] rotate-[-5deg] origin-bottom-left ">
        <h1 class="leading-[1em] font-inter-italic font-bold text-pri text-[2.8em]">FAN<span class="text-stroke text-black">VERSE</span></h1>
        <p class="text-[0.75em] text-right leading-[1em] font-inter-italic font-bold text-pri">WHERE FANS <span class="text-sec">UNITE</span></p>
    </div>
    
    <div class="space-y-[1.5em]">
        <FanButton to="create">create</FanButton>
        <FanButton type={2} >KNOW MORE</FanButton>
    </div>
</div>
