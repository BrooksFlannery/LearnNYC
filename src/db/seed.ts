import { db } from './drizzle.ts';
import { character, question } from './schema.ts'

const characters = [
    {
        // Stocky Puerto Rican man in his late 40s with a Yankees cap, gold chain, and apron, standing behind a bodega counter with a cat lounging nearby.
        id: "bodega_tony",
        name: "Big Tony the Bodega Boss",
        prompt: "You're Big Tony, the wisecracking bodega owner from the Bronx. You’ve seen it all, and you don’t hold back. Speak with Bronx slang, throw in some Spanish, and keep it streetwise but warm. You love your city, you love your Mets (but you won’t admit it), and you're full of trivia about real NYC life.",
        borough: "the_bronx" as const,
        image: "blank url for now",
    },
    {
        // Elderly Black woman with silver locs, horn-rimmed glasses, and a silk scarf, sitting in a Harlem brownstone filled with books and jazz posters.
        id: "professor_lenox",
        name: "Professor Lenox",
        prompt: "You're Professor Lenox, a retired history professor who lives in Harlem. Speak with grace, intellect, and pride in Black NYC history. You prefer deep cultural and historical knowledge, and you treat every question as a chance to educate. You're warm but expect respect.",
        borough: "manhattan" as const,
        image: "blank url for now",
    },
    {
        // Young Hasidic man in a black coat and fedora, with a knowing smirk and a hot dog in one hand, standing near the Williamsburg Bridge.
        id: "brooklyn_benny",
        name: "Brooklyn Benny",
        prompt: "You're Brooklyn Benny — sarcastic, fast-talking, and always hungry. You blend old-school Brooklyn with new-school hustle. You love talking food, neighborhoods, and New York rivalries. Give your questions with a side of sass and a Yiddish phrase here and there.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Dominican drag queen in a neon jumpsuit and towering heels, holding a MetroCard and a folding fan, posing at a 7 train stop.
        id: "qtrain_queenie",
        name: "Q-Train Queenie",
        prompt: "You're Q-Train Queenie, the fabulous queen of Queens. You’re full of flair, attitude, and borough pride. You live for the drama of NYC life, and you ask your questions like you're hosting a game show on the subway. Keep it spicy, sassy, and full of multicultural references.",
        borough: "queens" as const,
        image: "blank url for now",
    },
    {
        // Burly Italian-American man in his 50s with a bushy mustache and orange vest, sipping coffee in front of the Staten Island Ferry terminal.
        id: "staten_sal",
        name: "Staten Sal the Ferry Captain",
        prompt: "You're Staten Sal, the blue-collar ferry captain who’s tired of being left out of the NYC conversation. You’ve got ferry facts, city pride, and a dry sense of humor. Talk like you’re on your 1000th trip to Manhattan, and make sure people know Staten Island is still part of the city.",
        borough: "staten_island" as const,
        image: "blank url for now",
    },
];

const questions = [
    {
        id: "q1",
        question: "Which Bronx park is bigger than Central Park?",
        answer: "Pelham Bay Park.",
        characterId: "bodega_tony",
        difficulty: 35,
    },
    {
        id: "q2",
        question: "What legendary hip-hop venue was located at 1520 Sedgwick Ave?",
        answer: "The birthplace of hip-hop.",
        characterId: "bodega_tony",
        difficulty: 45,
    },
    {
        id: "q3",
        question: "What sandwich do you *have* to order at a Bronx bodega?",
        answer: "Bacon, egg, and cheese on a roll.",
        characterId: "bodega_tony",
        difficulty: 10,
    },
    {
        id: "q4",
        question: "Which famous zoo is located in the Bronx?",
        answer: "The Bronx Zoo.",
        characterId: "bodega_tony",
        difficulty: 5,
    },
    {
        id: "q5",
        question: "What’s the name of the stadium where the Yankees play?",
        answer: "Yankee Stadium.",
        characterId: "bodega_tony",
        difficulty: 5,
    },
    {
        id: "q6",
        question: "Which subway line runs straight up through the South Bronx?",
        answer: "The 6 train.",
        characterId: "bodega_tony",
        difficulty: 25,
    },
    {
        id: "q7",
        question: "What's the Bronx nickname that shows its toughness?",
        answer: "The Boogie Down Bronx.",
        characterId: "bodega_tony",
        difficulty: 20,
    },
    {
        id: "q8",
        question: "Which Bronx-born rapper dropped 'Lean Back'?",
        answer: "Fat Joe.",
        characterId: "bodega_tony",
        difficulty: 15,
    },
    {
        id: "q9",
        question: "Which express bus crosses from the Bronx into Manhattan via the George Washington Bridge?",
        answer: "The BxM1.",
        characterId: "bodega_tony",
        difficulty: 60,
    },
    {
        id: "q10",
        question: "What’s a chopped cheese?",
        answer: "Ground beef, onions, and cheese on a hero roll.",
        characterId: "bodega_tony",
        difficulty: 10,
    },
    {
        id: "q11",
        question: "Which Bronx neighborhood is known for its authentic Italian food?",
        answer: "Arthur Avenue (aka Little Italy of the Bronx).",
        characterId: "bodega_tony",
        difficulty: 30,
    },
    {
        id: "q12",
        question: "What’s the name of the big shopping mall at 161st near Yankee Stadium?",
        answer: "The Bronx Terminal Market.",
        characterId: "bodega_tony",
        difficulty: 40,
    },
    {
        id: "q13",
        question: "Which Bronx street is famous for hosting a Dominican Day Parade?",
        answer: "Grand Concourse.",
        characterId: "bodega_tony",
        difficulty: 35,
    },
    {
        id: "q14",
        question: "What bridge connects the Bronx to Queens?",
        answer: "The Throgs Neck Bridge.",
        characterId: "bodega_tony",
        difficulty: 50,
    },
    {
        id: "q15",
        question: "Which Bronx high school was home to many famous rappers?",
        answer: "DeWitt Clinton High School.",
        characterId: "bodega_tony",
        difficulty: 55,
    },
    {
        id: "q16",
        question: "What local Bronx team plays minor league baseball?",
        answer: "The Staten Island FerryHawks moved; the Bronx Bombers are it.",
        characterId: "bodega_tony",
        difficulty: 75,
    },
    {
        id: "q17",
        question: "What’s the best drink to get with your bacon egg and cheese from Tony’s bodega?",
        answer: "An Arizona iced tea, 99 cents baby.",
        characterId: "bodega_tony",
        difficulty: 8,
    },
    {
        id: "q18",
        question: "What’s the name of the old elevated train line that used to run through the Bronx?",
        answer: "The Third Avenue El.",
        characterId: "bodega_tony",
        difficulty: 70,
    },
    {
        id: "q19",
        question: "Which Bronx museum is home to graffiti art and hip-hop history?",
        answer: "The Bronx Museum of the Arts.",
        characterId: "bodega_tony",
        difficulty: 45,
    },
    {
        id: "q20",
        question: "How much is a MetroCard swipe right now?",
        answer: "$2.90 — don’t ask me why it ain’t $2.75 no more.",
        characterId: "bodega_tony",
        difficulty: 15,
    },
];

async function seed() {
    console.log('clearing old data...')
    await db.delete(question)
    await db.delete(character)

    console.log('inserting tables...')
    await db.insert(character).values(characters)
    await db.insert(question).values(questions)

    console.log('seeding complete')
}

seed().catch((e) => {
    console.log('seeding error', e);
    process.exit(1)
})
