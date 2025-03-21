import { writable } from 'svelte/store';

const PostDataRanking = writable({
    BackgroundImageUrl:"",
    BackgroundImageUrlBrightness:25,
    BackgroundImageUrlBlur:0,
    logo:"/images/pickems/logo.svg",
    title:"PICKE'EMS",
    subTitle:"SUBTITLE",
    allLoadedData:[
        {"teamName":"","teamImage":""},
        {"teamName":"","teamImage":""}
    ],
    // allLoadedData:[
    //     {"teamName":"3-gatsu no lion","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/023/596/383/small/generative-ai-an-neon-gamer-anime-fashion-boy-or-man-wearing-headphones-lost-in-his-music-abstract-background-that-evokes-the-feeling-of-different-genres-of-music-banner-music-concept-photo.jpg"},
    //     {"teamName":"Solo Levelling","teamImage":"https://img.freepik.com/premium-vector/vector-young-man-animestyle-character-vector-illustration-design-manga-anime-boy_147933-12515.jpg"}
    // ],
    allColumns : [],
    isCreator:false,
    canPost:false,
    finalVoteArray:[0,0],
});

export default PostDataRanking;