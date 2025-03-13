<script>
    let noOfTeam = 4;
    let rounds = Math.log2(noOfTeam) + 1;
    let lowerRounds = 2 * Math.log2(noOfTeam) - 1;

    let TeamNames = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"];

    console.log(lowerRounds);

    let brackets = [];

    for (let i = 0; i < rounds; i++) {
        if (i == 0) {
            brackets.push([]);
            for (let j = 0; j < noOfTeam; j++) {
                brackets[i].push({ team: TeamNames[j], won: null });
            }
        } else {
            brackets.push([]);
            for (let j = 0; j < noOfTeam / 2 ** i; j++) {
                brackets[i].push({ team: null, won: null });
            }
        }
    }

    // Generate lower bracket
    // The pattern of matches is more complex in the lower bracket
    for (let i = 0; i < lowerRounds; i++) {
        lowerBracket.push([]);

        // First round of lower bracket has teams that lost in first round of upper bracket
        if (i == 0) {
            let numMatches = noOfTeam / 4;
            for (let j = 0; j < numMatches; j++) {
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    loserFrom: { round: 0, match: j * 2 },
                });
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    loserFrom: { round: 0, match: j * 2 + 1 },
                });
            }
        }
        // Even numbered rounds after first round get losers from upper bracket
        else if (i % 2 == 1) {
            let upperRound = Math.floor(i / 2) + 1;
            let numMatches = noOfTeam / 2 ** (upperRound + 1);

            for (let j = 0; j < numMatches; j++) {
                // Team coming from previous lower bracket round
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    winnerFrom: { bracket: "lower", round: i - 1, match: j },
                });
                // Team dropping from upper bracket
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    loserFrom: {
                        bracket: "upper",
                        round: upperRound,
                        match: j,
                    },
                });
            }
        }
        // Odd numbered rounds after first round have teams from previous lower bracket round
        else {
            let numMatches = lowerBracket[i - 1].length / 2;
            for (let j = 0; j < numMatches; j++) {
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    winnerFrom: {
                        bracket: "lower",
                        round: i - 1,
                        match: j * 2,
                    },
                });
                lowerBracket[i].push({
                    team: null,
                    won: null,
                    winnerFrom: {
                        bracket: "lower",
                        round: i - 1,
                        match: j * 2 + 1,
                    },
                });
            }
        }
    }

    // Create a final match between upper and lower bracket winners
    let finalMatch = [
        {
            team: null,
            won: null,
            winnerFrom: { bracket: "upper", round: upperRounds - 2, match: 0 },
        },
        {
            team: null,
            won: null,
            winnerFrom: { bracket: "lower", round: lowerRounds - 1, match: 0 },
        },
    ];

    console.log("Upper Bracket:", upperBracket);
    console.log("Lower Bracket:", lowerBracket);
    console.log("Final Match:", finalMatch);

    function handleAdvancement(roundIndex, matchIndex) {
        if (roundIndex >= rounds - 1) return;

        const currentTeam = brackets[roundIndex][matchIndex].team;
        if (!currentTeam) return;

        // Calculate the position in the next round
        const nextRoundMatchIndex = Math.floor(matchIndex / 2);

        // Update the team in the next round
        brackets[roundIndex + 1][nextRoundMatchIndex].team = currentTeam;
        brackets[roundIndex][matchIndex].won = true;

        // Find the pair match and mark it as loser
        const isPairEven = matchIndex % 2 === 0;
        const pairMatchIndex = isPairEven ? matchIndex + 1 : matchIndex - 1;

        // Make sure the pair exists (for odd number of teams)
        if (pairMatchIndex < brackets[roundIndex].length) {
            brackets[roundIndex][pairMatchIndex].won = false;
        }

        // Clear affected matches in all subsequent rounds
        for (let r = roundIndex + 1; r < rounds; r++) {
            const affectedMatchIndex = Math.floor(
                nextRoundMatchIndex / 2 ** (r - (roundIndex + 1)),
            );

            // Only clear team name for rounds after the next round
            if (r > roundIndex + 1) {
                brackets[r][affectedMatchIndex].team = null;
            }

            // Clear won status for the match and its pair
            brackets[r][affectedMatchIndex].won = null;

            const pairIndex =
                affectedMatchIndex - (affectedMatchIndex % 2 === 0 ? -1 : 1);
            if (pairIndex < brackets[r].length) {
                brackets[r][pairIndex].won = null;
            }
        }

        // console.log(`Advanced ${currentTeam} to round ${roundIndex + 1}, match ${nextRoundMatchIndex}`);
    }

    function showTeamName(roundIndex, matchIndex) {
        return brackets[roundIndex][matchIndex].team || "...";
    }
    // $:console.log(brackets)
</script>

<div
    class="customMatchFont-{noOfTeam} overflow-x-scroll xsm:overflow-visible w-full h-[fit] px-4em xsm:px-2em py-[2.5em] text-white"
>
    <div
        class="text-[1.4em] w-fit xsm:w-full xsm:text-[0.65em] lg:text-[0.61em] flex gap-[8em] justify-center items-center h-full"
    >
        {#each brackets as round, roundIndex}
            <div class="flex flex-col justify-center h-full w-[14em]">
                {#each round as match, matchIndex}
                    <div class="odd:mt-2em relative">
                        <button
                            class:winnerTeam={brackets[roundIndex][matchIndex]
                                .won}
                            class:loserTeam={!brackets[roundIndex][matchIndex]
                                .won &&
                                brackets[roundIndex][matchIndex].won != null}
                            on:click={handleAdvancement(roundIndex, matchIndex)}
                            class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-l-[0.25em] border-pickem-title cursor-pointer"
                        >
                            {showTeamName(roundIndex, matchIndex)}
                        </button>
                        <div
                            class:hidden={matchIndex % 2 != 0 ||
                                roundIndex == rounds - 1}
                            class="relative leading-0 py-[0.5em] text-center text-[#666]"
                        >
                            <p class="text-[1.1em]">vs</p>

                            <div
                                class="left-full absolute {roundIndex ==
                                rounds - 2
                                    ? 'w-8em'
                                    : 'w-4em'} h-[1px] bg-pickem-title"
                            ></div>

                            <div
                                class:hidden={roundIndex == 0}
                                class="right-full absolute w-4em h-[1px] bg-pickem-title"
                            ></div>
                        </div>
                        <div
                            class:hidden={roundIndex > rounds - 3 ||
                                matchIndex % 4 != 0}
                            class="left-[calc(100%+4em-1px)] top-[calc(100%-3px)] absolute w-[1px] h-[12.7em] bg-pickem-title"
                        ></div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
