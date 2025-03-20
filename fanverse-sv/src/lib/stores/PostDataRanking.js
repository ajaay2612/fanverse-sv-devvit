import { writable } from 'svelte/store';

const PostDataRanking = writable({
    BackgroundImageUrl:"",
    BackgroundImageUrlBrightness:25,
    BackgroundImageUrlBlur:0,
    logo:"/images/pickems/logo.svg",
    title:"PICKE'EMS",
    subTitle:"SUBTITLE",
    allLoadedData:[
        // {"teamName":"3-gatsu no lion","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/023/596/383/small/generative-ai-an-neon-gamer-anime-fashion-boy-or-man-wearing-headphones-lost-in-his-music-abstract-background-that-evokes-the-feeling-of-different-genres-of-music-banner-music-concept-photo.jpg", data:[1,2]},
        // {"teamName":"Solo Levelling","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/023/596/383/small/generative-ai-an-neon-gamer-anime-fashion-boy-or-man-wearing-headphones-lost-in-his-music-abstract-background-that-evokes-the-feeling-of-different-genres-of-music-banner-music-concept-photo.jpg", data:[1,2]}
    ],
    allColumns : [],
    isCreator:false,
    canPost:false,
});

export default PostDataRanking;