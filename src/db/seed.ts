import { db } from './drizzle.ts';
import { character, question } from './schema.ts'

// const characters = [
//     {
//         // Stocky Puerto Rican man in his late 40s with a Yankees cap, gold chain, and apron, standing behind a bodega counter with a cat lounging nearby.
//         id: "bodega_tony",
//         name: "Big Tony the Bodega Boss",
//         prompt: "You're Big Tony, the wisecracking bodega owner from the Bronx. You’ve seen it all, and you don’t hold back. Speak with Bronx slang, throw in some Spanish, and keep it streetwise but warm. You love your city, you love your Mets (but you won’t admit it), and you're full of trivia about real NYC life.",
//         borough: "the_bronx" as const,
//         image: "blank url for now",
//     },
//     {
//         // Elderly Black woman with silver locs, horn-rimmed glasses, and a silk scarf, sitting in a Harlem brownstone filled with books and jazz posters.
//         id: "professor_lenox",
//         name: "Professor Lenox",
//         prompt: "You're Professor Lenox, a retired history professor who lives in Harlem. Speak with grace, intellect, and pride in Black NYC history. You prefer deep cultural and historical knowledge, and you treat every question as a chance to educate. You're warm but expect respect.",
//         borough: "manhattan" as const,
//         image: "blank url for now",
//     },
//     {
//         // Young Hasidic man in a black coat and fedora, with a knowing smirk and a hot dog in one hand, standing near the Williamsburg Bridge.
//         id: "brooklyn_benny",
//         name: "Brooklyn Benny",
//         prompt: "You're Brooklyn Benny — sarcastic, fast-talking, and always hungry. You blend old-school Brooklyn with new-school hustle. You love talking food, neighborhoods, and New York rivalries. Give your questions with a side of sass and a Yiddish phrase here and there.",
//         borough: "brooklyn" as const,
//         image: "blank url for now",
//     },
//     {
//         // Dominican drag queen in a neon jumpsuit and towering heels, holding a MetroCard and a folding fan, posing at a 7 train stop.
//         name: "Q-Train Queenie",
//         prompt: "You're Q-Train Queenie, the fabulous queen of Queens. You’re full of flair, attitude, and borough pride. You live for the drama of NYC life, and you ask your questions like you're hosting a game show on the subway. Keep it spicy, sassy, and full of multicultural references.",
//         borough: "queens" as const,
//         image: "blank url for now",
//     },
//     {
//         // Burly Italian-American man in his 50s with a bushy mustache and orange vest, sipping coffee in front of the Staten Island Ferry terminal.
//         id: "staten_sal",
//         name: "Staten Sal the Ferry Captain",
//         prompt: "You're Staten Sal, the blue-collar ferry captain who’s tired of being left out of the NYC conversation. You’ve got ferry facts, city pride, and a dry sense of humor. Talk like you’re on your 1000th trip to Manhattan, and make sure people know Staten Island is still part of the city.",
//         borough: "staten_island" as const,
//         image: "blank url for now",
//     },
// ];

const brooklyn_characters = [
    {
        // Tattooed vegan DJ in her 30s with a handlebar mustache, beanie, and fixed-gear bike, sipping a matcha latte outside a vinyl shop.
        id: "willie_from_willyb",
        name: "Willie from Willy B",
        prompt: "You're Willie from Williamsburg — painfully cool, effortlessly ironic, and constantly between side gigs. You speak in Gen Z sarcasm, drop obscure band references, and believe gentrification was your idea. You’re allergic to gluten, capitalism, and bad coffee.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Dominican graffiti artist with paint-stained jeans, gold grills, and a pit bull named Nietzsche, leaning on a rooftop overlooking warehouses.
        id: "bushwick_blaze",
        name: "Bushwick Blaze",
        prompt: "You’re Bushwick Blaze, the philosopher king of the underground. You drop deep thoughts between blunt hits and always got a side hustle brewing. You speak in street-poetry slang, love art, love chaos, and trust no landlord.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Pale Hasidic man with sidelocks, weaering thick glasses and a schtreimel, holding a Talmud in one hand and a cellphone in the other, outside a kosher bakery.
        id: "rebbe_ruben",
        name: "Rebbe Ruben",
        prompt: "You're Rebbe Ruben from Borough Park. You keep it kosher and you’ve got opinions on *everything*. You quote Torah, Talk with Yiddish warmth, and don't forget—Shabbos starts at sundown, bubbeleh.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Syrian-American guy in a thobe with aviators, blasting Dabke music from a souped-up car outside a halal cart on 3rd Avenue.
        id: "bayridge_basem",
        name: "Bay Ridge Basem",
        prompt: "You're Bay Ridge Basem, the hookah king with an attitude. You’ve got Arab pride, old-school street cred, and you’ll argue about falafel like it’s life or death. You talk fast, laugh loud, and your mom makes the best kibbeh on the block.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Rasta uncle with locs and a Bob Marley shirt, manning a jerk chicken grill on Flatbush Ave, blasting dancehall from a busted speaker.
        id: "flatbush_fiyah",
        name: "Flatbush Fiyah",
        prompt: "You’re Flatbush Fiyah, the king of the block and the sound clash. You speak in patois, quote Marcus Garvey, and your spice level is ‘don’t test me’. Everything’s irie, unless you come for Caribbean culture — then it’s war.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Scandinavian-looking UX designer with a sleek laptop bag, sipping natural wine on a cobblestone street under the Manhattan Bridge.
        id: "dumbo_devon",
        name: "DUMBO Devon",
        prompt: "You're DUMBO Devon, the tech bro with a soul. You quote startup jargon like scripture and treat cold brew like religion. Talk in sleek optimism, buzzwords, and TED Talk wisdom.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Grizzled old man in a tank top and gold chains, smoking a cigar and heckling beachgoers from a folding chair near the Cyclone roller coaster.
        id: "coney_carlo",
        name: "Coney Carlo",
        prompt: "You’re Coney Carlo — old-school Brooklyn, loud and proud. You got stories from before the Russians moved in and you’ll share ‘em whether folks wanna hear ‘em or not. You speak in gravel, smell like sea salt and hot dogs, and you *hate* the winter.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Glamorous Russian grandma in a fur coat and pearls, walking a tiny dog down the boardwalk while gossiping loudly on speakerphone.
        id: "brighton_babushka",
        name: "Brighton Babushka",
        prompt: "You're Brighton Babushka — elegant, icy, and always overdressed. You mix Russian proverbs with sharp insults, drink tea hotter than lava, and have strong opinions on Putin, pierogi, and proper footwear. You will *not* be rushed.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },
    {
        // Elderly Black poet with locs and a leather notebook, leaning on a stoop next to a mural of Biggie.
        id: "bedstuy_blu",
        name: "Bed-Stuy Blu",
        prompt: "You're Bed-Stuy Blu — lyrical, soulful, and sharp. You speak in bars whether you’re rapping or not. You got deep roots and deeper pride in Black Brooklyn. History lives in your words.",
        borough: "brooklyn" as const,
        image: "blank url for now",
    },

]

const willieQuestions = [
    {
        question: "What year did the Williamsburg Bridge open, connecting Brooklyn to Manhattan?",
        answer: "1903.",
        characterId: "willie_from_willyb",
        difficulty: 20,
    },
    {
        question: "Which Brooklyn neighborhood experienced a significant wave of Puerto Rican migration during the mid-20th century, influencing Williamsburg’s culture?",
        answer: "Williamsburg.",
        characterId: "willie_from_willyb",
        difficulty: 30,
    },
    {
        question: "Which annual music and arts festival in Brooklyn celebrates experimental and underground artists, often held in Williamsburg venues?",
        answer: "Northside Festival.",
        characterId: "willie_from_willyb",
        difficulty: 35,
    },
    {
        question: "Which green space in Williamsburg offers community gardens and hosts local farmer’s markets focused on sustainable agriculture?",
        answer: "McCarren Park.",
        characterId: "willie_from_willyb",
        difficulty: 20,
    },
    {
        question: "Which subway line provides direct access to Williamsburg and is often associated with the neighborhood’s rise as a cultural hotspot?",
        answer: "The L train.",
        characterId: "willie_from_willyb",
        difficulty: 15,
    },
    {
        question: "What popular Brooklyn brewery, founded in Williamsburg in 1988, helped pioneer the craft beer movement in NYC?",
        answer: "Brooklyn Brewery.",
        characterId: "willie_from_willyb",
        difficulty: 20,
    },
    {
        question: "Which Williamsburg street is famous for its concentration of vintage clothing stores, artisanal cafes, and independent bookshops?",
        answer: "Bedford Avenue.",
        characterId: "willie_from_willyb",
        difficulty: 15,
    },
    {
        question: "Which Williamsburg waterfront park was developed on the site of the historic Domino Sugar Refinery?",
        answer: "Domino Park.",
        characterId: "willie_from_willyb",
        difficulty: 20,
    },
    {
        question: "Which community organization in Williamsburg focuses on urban farming and providing fresh produce to local residents?",
        answer: "The Brooklyn Grange.",
        characterId: "willie_from_willyb",
        difficulty: 40,
    },
    // {
    //     question: "Which Brooklyn neighborhood adjacent to Williamsburg is known for its significant Hasidic Jewish community?",
    //     answer: "Borough Park.",
    //     characterId: "willie_from_willyb",
    //     difficulty: 25,
    // },
    {
        question: "Which annual vegan food festival is hosted in Brooklyn, drawing many Williamsburg residents and food vendors?",
        answer: "Vegan Street Fair.",
        characterId: "willie_from_willyb",
        difficulty: 30,
    },
    {
        question: "Which Williamsburg brewery is known for its organic and sustainably brewed beers, aligning with eco-conscious values?",
        answer: "Other Half Brewing Company.",
        characterId: "willie_from_willyb",
        difficulty: 30,
    },
    // {
    //     question: "What public art project in Williamsburg highlights environmental sustainability and community engagement through murals and installations?",
    //     answer: "The Bushwick Collective murals (extending influence into Williamsburg).",
    //     characterId: "willie_from_willyb",
    //     difficulty: 35,
    // },
    {
        question: "Which Williamsburg-based music venue is known for hosting live electronic and DJ performances that attract a vegan and alternative crowd?",
        answer: "Good Room.",
        characterId: "willie_from_willyb",
        difficulty: 25,
    },
    // {
    //     question: "Which iconic Brooklyn bridge was designed by Gustav Lindenthal and opened before the Williamsburg Bridge?",
    //     answer: "The Brooklyn Bridge.",
    //     characterId: "willie_from_willyb",
    //     difficulty: 30,
    // },
    {
        question: "Which Williamsburg market is famous for its focus on locally sourced, organic, and vegan-friendly food vendors?",
        answer: "Smorgasburg.",
        characterId: "willie_from_willyb",
        difficulty: 15,
    },
    {
        question: "Which Brooklyn public library branch serves Williamsburg and features a large collection of music and art books?",
        answer: "Peter Starr King Branch Library.",
        characterId: "willie_from_willyb",
        difficulty: 35,
    },
    {
        question: "Which Williamsburg vegan cafe is known for pioneering plant-based comfort food in Brooklyn?",
        answer: "Champs Diner.",
        characterId: "willie_from_willyb",
        difficulty: 30,
    },
    {
        question: "Which type of urban agriculture technique is Brooklyn Grange famous for using on its Williamsburg rooftop farm?",
        answer: "Hydroponics and soil-based rooftop farming.",
        characterId: "willie_from_willyb",
        difficulty: 40,
    },
    {
        question: "Which popular Williamsburg street is known for its murals and vibrant street art scene that attracts creatives?",
        answer: "Berry Street.",
        characterId: "willie_from_willyb",
        difficulty: 25,
    },
];

const blazeQuestions = [
    {
        question: "Which Brooklyn neighborhood is considered the birthplace of New York City’s modern street art movement?",
        answer: "Bushwick.",
        characterId: "bushwick_blaze",
        difficulty: 20,
    },
    {
        question: "What major freight rail yard runs through the heart of Bushwick, influencing its industrial vibe?",
        answer: "Bushwick Yard.",
        characterId: "bushwick_blaze",
        difficulty: 25,
    },
    {
        question: "Which NYC transit line’s elevated tracks cut through Bushwick, frequently tagged by graffiti artists?",
        answer: "The L train.",
        characterId: "bushwick_blaze",
        difficulty: 20,
    },
    {
        question: "What is the name of the large annual outdoor street art event that draws artists and tourists to Bushwick?",
        answer: "The Bushwick Collective Block Party.",
        characterId: "bushwick_blaze",
        difficulty: 30,
    },
    {
        question: "Which demographic group has significantly shaped Bushwick’s culture since the 1960s?",
        answer: "Dominican-American community.",
        characterId: "bushwick_blaze",
        difficulty: 25,
    },
    {
        question: "Which large industrial building in Bushwick was a former sugar refinery and now houses artist studios and galleries?",
        answer: "The Brooklyn Navy Yard (Note: adjacent but often confused; closer is the Rheingold Brewery site or the Brooklyn Army Terminal nearby).",
        characterId: "bushwick_blaze",
        difficulty: 40,
    },
    {
        question: "Which Bushwick street is famous for its ever-changing murals and street art that cover nearly every building?",
        answer: "Wyckoff Avenue.",
        characterId: "bushwick_blaze",
        difficulty: 25,
    },
    {
        question: "What iconic graffiti artist, famous worldwide, helped legitimize Bushwick as a street art mecca?",
        answer: "Shepard Fairey.",
        characterId: "bushwick_blaze",
        difficulty: 35,
    },
    {
        question: "Which nearby park offers a green space respite amid Bushwick’s industrial landscape and hosts local events?",
        answer: "Maria Hernandez Park.",
        characterId: "bushwick_blaze",
        difficulty: 15,
    },
    {
        question: "What 2010s phenomenon led to a surge in art galleries and loft apartments transforming Bushwick’s warehouses?",
        answer: "Gentrification.",
        characterId: "bushwick_blaze",
        difficulty: 15,
    },
    {
        question: "Which subway station in Bushwick is known for its extensive graffiti murals that reflect the neighborhood’s street art culture?",
        answer: "Jefferson Street station (L train).",
        characterId: "bushwick_blaze",
        difficulty: 20,
    },
    {
        question: "What is the name of the DIY art space in Bushwick famous for underground music shows and experimental art exhibits?",
        answer: "Silent Barn (now closed but iconic).",
        characterId: "bushwick_blaze",
        difficulty: 35,
    },
    {
        question: "Which Bushwick bakery is known for offering traditional Dominican pastries and sweets?",
        answer: "Taino Bakery.",
        characterId: "bushwick_blaze",
        difficulty: 30,
    },
    {
        question: "Which Bushwick street hosts an annual Puerto Rican Day Parade celebration highlighting Dominican and Puerto Rican pride?",
        answer: "Knickerbocker Avenue.",
        characterId: "bushwick_blaze",
        difficulty: 25,
    },
    {
        question: "What industrial material is most commonly used in Bushwick street art murals for durability against weather?",
        answer: "Acrylic paint.",
        characterId: "bushwick_blaze",
        difficulty: 20,
    },
    {
        question: "Which local Bushwick nonprofit works to preserve affordable housing for artists amid rising rents?",
        answer: "Brooklyn Arts Council.",
        characterId: "bushwick_blaze",
        difficulty: 35,
    },
    {
        question: "Which street art collective helped paint over 100 murals in Bushwick to promote social justice messages?",
        answer: "The Bushwick Collective.",
        characterId: "bushwick_blaze",
        difficulty: 30,
    },
    {
        question: "Which Dominican holiday is widely celebrated in Bushwick with parades, music, and food?",
        answer: "Día de la Independencia (Dominican Independence Day).",
        characterId: "bushwick_blaze",
        difficulty: 25,
    },
    {
        question: "What type of dog breed is commonly seen with street artists in Bushwick, like Bushwick Blaze’s Nietzsche?",
        answer: "Pit Bull.",
        characterId: "bushwick_blaze",
        difficulty: 10,
    },
    {
        question: "Which major Brooklyn expressway runs near Bushwick and contributes to its industrial corridor feel?",
        answer: "Brooklyn-Queens Expressway (BQE).",
        characterId: "bushwick_blaze",
        difficulty: 20,
    },
];

const rubenQuestions = [
    {
        question: "Which Brooklyn neighborhood is known as one of the largest Orthodox Jewish communities outside of Israel?",
        answer: "Borough Park.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What language is commonly spoken at home alongside English by many Borough Park residents?",
        answer: "Yiddish.",
        characterId: "rebbe_ruben",
        difficulty: 20,
    },
    {
        question: "Which major avenue in Borough Park is famous for its many kosher bakeries and delis?",
        answer: "13th Avenue.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What is the name of the traditional Jewish day of rest strictly observed by Borough Park residents starting Friday evening?",
        answer: "Shabbat (Shabbos).",
        characterId: "rebbe_ruben",
        difficulty: 10,
    },
    {
        question: "Which Jewish text would you most likely find Rebbe Ruben studying at his local yeshiva?",
        answer: "The Talmud.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What is the name of the annual Jewish holiday that celebrates the giving of the Torah at Mount Sinai?",
        answer: "Shavuot.",
        characterId: "rebbe_ruben",
        difficulty: 20,
    },
    {
        question: "What kosher certification is one of the most common and trusted in Borough Park eateries?",
        answer: "OU (Orthodox Union).",
        characterId: "rebbe_ruben",
        difficulty: 20,
    },
    {
        question: "Which Hasidic dynasty has a strong presence in Borough Park, known for its distinctive customs and dress?",
        answer: "Bobov.",
        characterId: "rebbe_ruben",
        difficulty: 25,
    },
    {
        question: "What kind of traditional headwear is Rebbe Ruben wearing, signifying his religious affiliation?",
        answer: "A Shtreimel (depending on occasion).",
        characterId: "rebbe_ruben",
        difficulty: 20,
    },
    {
        question: "Which major park lies near Borough Park and is popular for family outings on the Sabbath afternoon?",
        answer: "Prospect Park.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What is the Yiddish term for a grandmother, a word commonly used in Borough Park families?",
        answer: "Bubbe.",
        characterId: "rebbe_ruben",
        difficulty: 10,
    },
    {
        question: "During which Jewish festival would Borough Park residents light candles for eight nights?",
        answer: "Hanukkah.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What type of bread is traditionally eaten during Shabbat meals in Borough Park?",
        answer: "Challah.",
        characterId: "rebbe_ruben",
        difficulty: 10,
    },
    {
        question: "Which major NYC subway line serves Borough Park, connecting it to the rest of Brooklyn and Manhattan?",
        answer: "The D train.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "What kosher fish is popular in Borough Park's markets and traditional dishes?",
        answer: "Gefilte fish.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    // {
    //     question: "Which secular American holiday is observed differently or not at all by many in Borough Park due to religious beliefs?",
    //     answer: "Christmas.",
    //     characterId: "rebbe_ruben",
    //     difficulty: 20,
    // },
    {
        question: "What is the term for the braided sidelocks worn by many Hasidic men in Borough Park",
        answer: "Payot (or Peyos).",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    {
        question: "Which Borough Park institution provides free kosher meals to those in need, especially during holidays?",
        answer: "Chesed Shel Emes.",
        characterId: "rebbe_ruben",
        difficulty: 30,
    },
    {
        question: "What is the name of the Jewish New Year celebrated in Borough Park with prayer and festive meals?",
        answer: "Rosh Hashanah.",
        characterId: "rebbe_ruben",
        difficulty: 15,
    },
    // {
    //     question: "Which online platform might Rebbe Ruben use to share Torah insights and community news alongside traditional study?",
    //     answer: "TikTok.",
    //     characterId: "rebbe_ruben",
    //     difficulty: 25,
    // },
];

const basemQuestions = [
    {
        question: "Which Brooklyn neighborhood has one of the largest Arab-American populations in NYC",
        answer: "Bay Ridge.",
        characterId: "bayridge_basem",
        difficulty: 15,
    },
    {
        question: "What music genre, popular at Arab weddings and blasted from cars in Bay Ridge, features heavy drums and line dancing?",
        answer: "Dabke.",
        characterId: "bayridge_basem",
        difficulty: 20,
    },
    {
        question: "What annual street festival on 5th Avenue celebrates Arab-American culture in Bay Ridge?",
        answer: "The Arab-American Bazaar.",
        characterId: "bayridge_basem",
        difficulty: 25,
    },
    {
        question: "What type of sandwich is commonly served at Bay Ridge halal carts with chicken, white sauce, and hot sauce?",
        answer: "Chicken over rice.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What Levantine dip made from chickpeas and tahini is a staple in Bay Ridge delis?",
        answer: "Hummus.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What is the name of the bridge that connects Bay Ridge to Staten Island?",
        answer: "The Verrazzano-Narrows Bridge.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What type of meat-filled bulgur croquette is a popular homemade dish in Syrian households?",
        answer: "Kibbeh.",
        characterId: "bayridge_basem",
        difficulty: 15,
    },
    {
        question: "Which Brooklyn avenue is known for its Arab-owned hookah lounges, bakeries, and jewelry stores?",
        answer: "Fifth Avenue.",
        characterId: "bayridge_basem",
        difficulty: 15,
    },
    {
        question: "Which language besides English is commonly spoken in Bay Ridge’s Syrian and Lebanese homes?",
        answer: "Arabic.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What is the name of the sweet layered pastry with nuts and syrup sold in Bay Ridge bakeries?",
        answer: "Baklava.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "Which Bay Ridge public park runs along the waterfront and offers views of the Verrazzano Bridge?",
        answer: "Shore Road Park.",
        characterId: "bayridge_basem",
        difficulty: 15,
    },
    {
        question: "What flatbread topped with za’atar or cheese is a common Arab breakfast in Bay Ridge",
        answer: "Manousheh.",
        characterId: "bayridge_basem",
        difficulty: 20,
    },
    {
        question: "Which NYC subway line connects Bay Ridge to Manhattan?",
        answer: "The R train.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What traditional Arab coffee, often spiced with cardamom, is served in Bay Ridge cafes?",
        answer: "Turkish coffee (or Arabic coffee).",
        characterId: "bayridge_basem",
        difficulty: 20,
    },
    {
        question: "Which Brooklyn neighborhood is known as the heart of New York’s Syrian-Jewish community, just south of Bay Ridge?",
        answer: "Midwood.",
        characterId: "bayridge_basem",
        difficulty: 30,
    },
    {
        question: "What sweet stuffed cookie, popular during Eid, is often filled with dates or nuts?",
        answer: "Maamoul.",
        characterId: "bayridge_basem",
        difficulty: 25,
    },
    {
        question: "What traditional water pipe, often smoked in social lounges, is a staple of Arab nightlife in Bay Ridge?",
        answer: "Hookah (or shisha).",
        characterId: "bayridge_basem",
        difficulty: 15,
    },
    {
        question: "Which month of fasting and spiritual reflection do many Bay Ridge Muslims observe?",
        answer: "Ramadan.",
        characterId: "bayridge_basem",
        difficulty: 10,
    },
    {
        question: "What dessert made from shredded phyllo dough and sweet cheese is sold hot in Bay Ridge pastry shops?",
        answer: "Knafeh.",
        characterId: "bayridge_basem",
        difficulty: 20,
    },
    {
        question: "What New Jersey city across the Verrazzano Bridge has a large Arab-American population connected to Bay Ridge families?",
        answer: "Paterson.",
        characterId: "bayridge_basem",
        difficulty: 30,
    },
];

const fiyahQuestions = [
    {
        question: "Which Brooklyn neighborhood is home to one of the largest Caribbean-American communities in the U.S.?",
        answer: "Flatbush.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "What major annual parade celebrates West Indian culture and draws crowds to Eastern Parkway?",
        answer: "The West Indian Day Parade.",
        characterId: "flatbush_fiyah",
        difficulty: 15,
    },
    {
        question: "Which music genre from Jamaica is the foundation of dancehall and reggae?",
        answer: "Roots reggae.",
        characterId: "flatbush_fiyah",
        difficulty: 20,
    },
    {
        question: "Which spicy grilled meat is a staple of Jamaican cuisine and Flatbush street food?",
        answer: "Jerk chicken.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "What island is known as the birthplace of reggae music?",
        answer: "Jamaica.",
        characterId: "flatbush_fiyah",
        difficulty: 5,
    },
    {
        question: "Which Flatbush avenue is lined with Caribbean restaurants, markets, and record stores?",
        answer: "Flatbush Avenue.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "Which Brooklyn neighborhood borders Flatbush and shares strong Caribbean cultural roots?",
        answer: "East Flatbush.",
        characterId: "flatbush_fiyah",
        difficulty: 15,
    },
    {
        question: "What dish made from rice, kidney beans, and coconut milk is a Jamaican staple?",
        answer: "Rice and peas.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "Which religious and political leader is a hero to many in Rastafarian culture?",
        answer: "Haile Selassie.",
        characterId: "flatbush_fiyah",
        difficulty: 25,
    },
    {
        question: "What spicy Jamaican condiment is made from Scotch bonnet peppers and allspice?",
        answer: "Jerk seasoning.",
        characterId: "flatbush_fiyah",
        difficulty: 15,
    },
    {
        question: "What Caribbean flatbread is often stuffed with curried chickpeas or meats and sold in Flatbush eateries?",
        answer: "Roti.",
        characterId: "flatbush_fiyah",
        difficulty: 20,
    },
    {
        question: "Which Caribbean country celebrates Independence Day on August 6th, often with parties in Flatbush?",
        answer: "Jamaica.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "What is the name of the sugary Jamaican soda often paired with spicy meals?",
        answer: "Ting.",
        characterId: "flatbush_fiyah",
        difficulty: 15,
    },
    {
        question: "Which spiritual and political Jamaican movement emphasized Black liberation and pan-African unity?",
        answer: "The Rastafari movement.",
        characterId: "flatbush_fiyah",
        difficulty: 20,
    },
    {
        question: "What patty-filled pastry is sold across Flatbush in flavors like beef, curry chicken, and veggie?",
        answer: "Jamaican beef patty.",
        characterId: "flatbush_fiyah",
        difficulty: 5,
    },
    {
        question: "Which Caribbean country shares the island of Hispaniola with Haiti?",
        answer: "The Dominican Republic.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "Which Marcus Garvey-founded shipping line promoted Black economic independence in the early 1900s?",
        answer: "The Black Star Line.",
        characterId: "flatbush_fiyah",
        difficulty: 35,
    },
    {
        question: "Which park near Flatbush hosts Caribbean festivals and drum circles?",
        answer: "Prospect Park.",
        characterId: "flatbush_fiyah",
        difficulty: 10,
    },
    {
        question: "Which Guyanese bread, often served with saltfish or cheese, is popular in Flatbush bakeries?",
        answer: "Plait bread.",
        characterId: "flatbush_fiyah",
        difficulty: 25,
    },
    {
        question: "What street sound system culture from Jamaica laid the groundwork for modern hip-hop and EDM?",
        answer: "Dancehall sound system culture.",
        characterId: "flatbush_fiyah",
        difficulty: 30,
    },
];

const devonQuestions = [
    {
        question: "What does DUMBO stand for in Brooklyn geography?",
        answer: "Down Under the Manhattan Bridge Overpass.",
        characterId: "dumbo_devon",
        difficulty: 10,
    },
    {
        question: "Which Brooklyn neighborhood transformed from an industrial area to a hub for tech startups and creatives?",
        answer: "DUMBO.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "Which tech company accelerator in DUMBO was one of New York's early startup incubators?",
        answer: "The New York Digital District (NYDD).",
        characterId: "dumbo_devon",
        difficulty: 30,
    },
    {
        question: "Which cobblestone Brooklyn street has a famous Instagram view of the Manhattan Bridge?",
        answer: "Washington Street.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "What park in DUMBO offers views of both the Manhattan and Brooklyn Bridges?",
        answer: "Brooklyn Bridge Park.",
        characterId: "dumbo_devon",
        difficulty: 10,
    },
    {
        question: "Which avant-garde theater space in DUMBO is known for experimental and tech-integrated performances?",
        answer: "St. Ann’s Warehouse.",
        characterId: "dumbo_devon",
        difficulty: 25,
    },
    {
        question: "Which major photo festival is hosted annually in DUMBO?",
        answer: "Photoville.",
        characterId: "dumbo_devon",
        difficulty: 20,
    },
    {
        question: "Which subway line has a stop at York Street in DUMBO?",
        answer: "The F train.",
        characterId: "dumbo_devon",
        difficulty: 10,
    },
    {
        question: "Which type of wine, popular among DUMBO's trendy crowd, is made with minimal intervention?",
        answer: "Natural wine.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "Which former warehouse complex in DUMBO now houses offices for Etsy and other startups?",
        answer: "The Empire Stores.",
        characterId: "dumbo_devon",
        difficulty: 20,
    },
    {
        question: "Which visual design platform, with an office once based in DUMBO, became a go-to tool for UX/UI professionals?",
        answer: "Figma.",
        characterId: "dumbo_devon",
        difficulty: 20,
    },
    {
        question: "Which monthly art event in DUMBO lets you visit open studios and meet local creatives?",
        answer: "First Thursday Gallery Walk.",
        characterId: "dumbo_devon",
        difficulty: 20,
    },
    {
        question: "Which coffee shop in DUMBO is known for roasting beans with Scandinavian precision?",
        answer: "Devoción.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "Which coding bootcamp started in DUMBO and became a major name in tech education?",
        answer: "The Flatiron School.",
        characterId: "dumbo_devon",
        difficulty: 25,
    },
    {
        question: "What public art organization in DUMBO installs rotating sculptures and installations throughout the neighborhood?",
        answer: "DUMBO Improvement District.",
        characterId: "dumbo_devon",
        difficulty: 20,
    },
    {
        question: "What design buzzword describes the minimal, white-space-heavy aesthetic popular in DUMBO tech offices?",
        answer: "Scandinavian modernism.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "Which ride-sharing company tested autonomous delivery robots in Brooklyn, including DUMBO?",
        answer: "Uber.",
        characterId: "dumbo_devon",
        difficulty: 30,
    },
    {
        question: "Which co-working space with a rooftop and river views caters to Brooklyn’s startup scene?",
        answer: "WeWork DUMBO Heights.",
        characterId: "dumbo_devon",
        difficulty: 15,
    },
    {
        question: "What East River ferry stop gives commuters direct access to DUMBO?",
        answer: "DUMBO Ferry Terminal.",
        characterId: "dumbo_devon",
        difficulty: 10,
    },
    {
        question: "Which popular DUMBO pizzeria is known for coal-fired pies and long lines?",
        answer: "Juliana’s Pizza.",
        characterId: "dumbo_devon",
        difficulty: 10,
    },
];

const carloQuestions = [
    {
        question: "What famous wooden roller coaster has been thrilling Coney Island visitors since 1927?",
        answer: "The Cyclone.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
    {
        question: "Which hot dog brand began on Coney Island in 1916?",
        answer: "Nathan’s Famous.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
    {
        question: "What ocean borders Coney Island’s beach?",
        answer: "The Atlantic Ocean.",
        characterId: "coney_carlo",
        difficulty: 5,
    },
    {
        question: "Which annual Fourth of July competition on Coney Island involves scarfing down dozens of franks?",
        answer: "Nathan’s Hot Dog Eating Contest.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
    {
        question: "What Coney Island amusement park was known for its electric lights and burned down in 1911?",
        answer: "Dreamland.",
        characterId: "coney_carlo",
        difficulty: 30,
    },
    {
        question: "Which minor league baseball team plays at Maimonides Park near the Coney Island boardwalk?",
        answer: "Brooklyn Cyclones.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
    {
        question: "What’s the name of the famous boardwalk that runs along the beach in Coney Island?",
        answer: "Riegelmann Boardwalk.",
        characterId: "coney_carlo",
        difficulty: 20,
    },
    {
        question: "Which subway line runs above ground and ends near the beach at Stillwell Avenue?",
        answer: "The Q train.",
        characterId: "coney_carlo",
        difficulty: 15,
    },
    {
        question: "What attraction once let people swim with sea lions at Coney Island?",
        answer: "The New York Aquarium.",
        characterId: "coney_carlo",
        difficulty: 15,
    },
    {
        question: "What iconic ride in Coney Island features a rotating tower and flying swings?",
        answer: "The Wonder Wheel.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
    {
        question: "Which parade features mermaids, pirates, and floats along Surf Avenue every June?",
        answer: "The Mermaid Parade.",
        characterId: "coney_carlo",
        difficulty: 15,
    },
    {
        question: "What type of old-school entertainment does the Coney Island Sideshow feature?",
        answer: "Freak show acts and circus performances.",
        characterId: "coney_carlo",
        difficulty: 25,
    },
    {
        question: "Which immigrant group significantly reshaped Brighton Beach, just east of Coney Island?",
        answer: "Russian-speaking Jews from the former Soviet Union.",
        characterId: "coney_carlo",
        difficulty: 20,
    },
    {
        question: "Which Coney Island landmark was once known for diving horses and elephant shows?",
        answer: "Steeplechase Park.",
        characterId: "coney_carlo",
        difficulty: 30,
    },
    {
        question: "What’s the name of the historic carousel housed near Coney Island’s beach?",
        answer: "B&B Carousell.",
        characterId: "coney_carlo",
        difficulty: 25,
    },
    {
        question: "What organization runs the Coney Island Museum and promotes local arts?",
        answer: "Coney Island USA.",
        characterId: "coney_carlo",
        difficulty: 20,
    },
    {
        question: "What phrase was used in the early 1900s to market Coney Island as a dream destination?",
        answer: "America’s Playground.",
        characterId: "coney_carlo",
        difficulty: 20,
    },
    {
        question: "Which Coney Island institution reopened in 2021 with a new shark exhibit?",
        answer: "The New York Aquarium.",
        characterId: "coney_carlo",
        difficulty: 15,
    },
    {
        question: "Which Coney Island food stand once sold frog legs and sea turtle soup?",
        answer: "Feltman’s.",
        characterId: "coney_carlo",
        difficulty: 35,
    },
    {
        question: "What’s the name of the avenue that cuts through the heart of Coney Island?",
        answer: "Surf Avenue.",
        characterId: "coney_carlo",
        difficulty: 10,
    },
];

const babushkaQuestions = [
    {
        question: "Which Eastern European language is most commonly spoken in Brighton Beach?",
        answer: "Russian.",
        characterId: "brighton_babushka",
        difficulty: 5,
    },
    {
        question: "What nickname is often used to describe Brighton Beach due to its Russian-speaking population?",
        answer: "Little Odessa.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which country did many Brighton Beach residents immigrate from in the 1970s and 1980s?",
        answer: "The Soviet Union.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which nearby neighborhood lies directly west of Brighton Beach?",
        answer: "Coney Island.",
        characterId: "brighton_babushka",
        difficulty: 5,
    },
    {
        question: "What elevated subway line runs directly through Brighton Beach?",
        answer: "The B and Q lines.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "What is the name of the street that serves as the commercial heart of Brighton Beach?",
        answer: "Brighton Beach Avenue.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which traditional dumpling is popular in Russian restaurants along Brighton Beach Avenue?",
        answer: "Pelmeni.",
        characterId: "brighton_babushka",
        difficulty: 15,
    },
    {
        question: "Which popular cold soup, made with beets and often topped with sour cream, is commonly served in Brighton Beach?",
        answer: "Borscht.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which Brighton Beach venue was known for hosting Russian-language concerts and cabaret acts?",
        answer: "The National Restaurant and Nightclub.",
        characterId: "brighton_babushka",
        difficulty: 20,
    },
    {
        question: "What traditional Russian drink, made from fermented bread, can sometimes be found in Brighton Beach shops?",
        answer: "Kvass.",
        characterId: "brighton_babushka",
        difficulty: 25,
    },
    {
        question: "Which post-Soviet holiday is often celebrated with fireworks and vodka in Brighton Beach on May 9th?",
        answer: "Victory Day.",
        characterId: "brighton_babushka",
        difficulty: 20,
    },
    {
        question: "Which type of cured fish, often served with dark bread and onions, is a staple in Brighton Beach delis?",
        answer: "Herring.",
        characterId: "brighton_babushka",
        difficulty: 15,
    },
    {
        question: "What is the name of the large retail store on Brighton Beach Avenue known for Eastern European imports and groceries?",
        answer: "Tashkent Supermarket.",
        characterId: "brighton_babushka",
        difficulty: 15,
    },
    {
        question: "Which nearby NYC beach neighborhood has a large Ukrainian population as well?",
        answer: "Sheepshead Bay.",
        characterId: "brighton_babushka",
        difficulty: 15,
    },
    {
        question: "Which writing system is used on many signs in Brighton Beach shops?",
        answer: "Cyrillic.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which famous Soviet-born chess grandmaster spent time in Brooklyn and is a cultural icon among Russian émigrés?",
        answer: "Garry Kasparov.",
        characterId: "brighton_babushka",
        difficulty: 30,
    },
    {
        question: "Which imported delicacy, often served with blini, is considered a luxury in Brighton Beach cuisine?",
        answer: "Caviar.",
        characterId: "brighton_babushka",
        difficulty: 10,
    },
    {
        question: "Which fashion item is stereotypically associated with elderly Russian women in Brighton Beach winters?",
        answer: "Fur coats.",
        characterId: "brighton_babushka",
        difficulty: 5,
    },
    {
        question: "What type of strong black tea is traditionally served in Russian culture, often brewed in a samovar?",
        answer: "Zavarka.",
        characterId: "brighton_babushka",
        difficulty: 25,
    },
    {
        question: "Which sea does Brighton Beach face?",
        answer: "The Atlantic Ocean.",
        characterId: "brighton_babushka",
        difficulty: 5,
    },
];

const bluQuestions = [
    {
        question: "What iconic rapper, known for 'Juicy' and 'Big Poppa', was raised in Bed-Stuy?",
        answer: "The Notorious B.I.G.",
        characterId: "bedstuy_blu",
        difficulty: 5,
    },
    {
        question: "What public housing complex in Bed-Stuy was home to Jay-Z?",
        answer: "Marcy Houses.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
    {
        question: "Which historically Black neighborhood in Brooklyn has been the focus of major gentrification debates?",
        answer: "Bed-Stuy.",
        characterId: "bedstuy_blu",
        difficulty: 5,
    },
    {
        question: "Which famous civil rights activist and politician represented Bed-Stuy in Congress for over 30 years?",
        answer: "Shirley Chisholm.",
        characterId: "bedstuy_blu",
        difficulty: 20,
    },
    {
        question: "What term is often used to describe Bed-Stuy’s historically tight-knit Black community?",
        answer: "Do or Die Bed-Stuy.",
        characterId: "bedstuy_blu",
        difficulty: 15,
    },
    {
        question: "What MTA subway line has multiple stops running through the heart of Bed-Stuy?",
        answer: "The A and C lines.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
    {
        question: "Which Bedford-Stuyvesant mansion was home to the first Black female millionaire in the U.S.?",
        answer: "The Madam C.J. Walker House.",
        characterId: "bedstuy_blu",
        difficulty: 25,
    },
    {
        question: "What historic district in Bed-Stuy is known for its brownstone architecture?",
        answer: "Stuyvesant Heights.",
        characterId: "bedstuy_blu",
        difficulty: 15,
    },
    {
        question: "Which Spike Lee film, set in Bed-Stuy, takes place on the hottest day of the year?",
        answer: "Do the Right Thing.",
        characterId: "bedstuy_blu",
        difficulty: 5,
    },
    {
        question: "Which Bed-Stuy-based arts nonprofit is known for uplifting Black artists and youth since the 1960s?",
        answer: "The Billie Holiday Theatre.",
        characterId: "bedstuy_blu",
        difficulty: 20,
    },
    {
        question: "What type of housing in Bed-Stuy became symbolic of Black homeownership and pride in the 20th century?",
        answer: "Brownstones.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
    {
        question: "What Pan-African flag colors are featured on many Bed-Stuy murals and street art?",
        answer: "Red, Black, and Green.",
        characterId: "bedstuy_blu",
        difficulty: 15,
    },
    {
        question: "Which Brooklyn street in Bed-Stuy was co-named after rapper Notorious B.I.G. in 2019?",
        answer: "Christopher Wallace Way.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
    {
        question: "Which famous funk and soul record store was founded in Bed-Stuy in the 1990s?",
        answer: "The Sound Library.",
        characterId: "bedstuy_blu",
        difficulty: 25,
    },
    {
        question: "Which Bed-Stuy-based radio station has long served the Black community with soul and talk programming?",
        answer: "WBLK (formerly WWRL).",
        characterId: "bedstuy_blu",
        difficulty: 30,
    },
    {
        question: "Which neighborhood celebration highlights Bed-Stuy’s Black heritage and local businesses?",
        answer: "Bed-Stuy Alive!",
        characterId: "bedstuy_blu",
        difficulty: 20,
    },
    {
        question: "Which educational institution in Bed-Stuy is named after a legendary Black abolitionist?",
        answer: "Frederick Douglass Academy.",
        characterId: "bedstuy_blu",
        difficulty: 15,
    },
    {
        question: "Which form of street expression flourished in Bed-Stuy during the hip-hop golden age?",
        answer: "Graffiti.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
    {
        question: "Which jazz legend is honored by a street mural and namesake center in Bed-Stuy?",
        answer: "Billie Holiday.",
        characterId: "bedstuy_blu",
        difficulty: 15,
    },
    {
        question: "Which staple soul food dish is often associated with Bed-Stuy restaurants like Peaches or Saraghina?",
        answer: "Chicken and waffles.",
        characterId: "bedstuy_blu",
        difficulty: 10,
    },
];






// const questions = [
//     {
//         question: "Which Bronx park is bigger than Central Park?",
//         answer: "Pelham Bay Park.",
//         characterId: "bodega_tony",
//         difficulty: 35,
//     },
//     {
//         question: "What legendary hip-hop venue was located at 1520 Sedgwick Ave?",
//         answer: "The birthplace of hip-hop.",
//         characterId: "bodega_tony",
//         difficulty: 45,
//     },
//     {
//         question: "What sandwich do you *have* to order at a Bronx bodega?",
//         answer: "Bacon, egg, and cheese on a roll.",
//         characterId: "bodega_tony",
//         difficulty: 10,
//     },
//     {
//         question: "Which famous zoo is located in the Bronx?",
//         answer: "The Bronx Zoo.",
//         characterId: "bodega_tony",
//         difficulty: 5,
//     },
//     {
//         question: "What’s the name of the stadium where the Yankees play?",
//         answer: "Yankee Stadium.",
//         characterId: "bodega_tony",
//         difficulty: 5,
//     },
//     {
//         question: "Which subway line runs straight up through the South Bronx?",
//         answer: "The 6 train.",
//         characterId: "bodega_tony",
//         difficulty: 25,
//     },
//     {
//         question: "What's the Bronx nickname that shows its toughness?",
//         answer: "The Boogie Down Bronx.",
//         characterId: "bodega_tony",
//         difficulty: 20,
//     },
//     {
//         question: "Which Bronx-born rapper dropped 'Lean Back'?",
//         answer: "Fat Joe.",
//         characterId: "bodega_tony",
//         difficulty: 15,
//     },
//     {
//         question: "Which express bus crosses from the Bronx into Manhattan via the George Washington Bridge?",
//         answer: "The BxM1.",
//         characterId: "bodega_tony",
//         difficulty: 60,
//     },
//     {
//         question: "What’s a chopped cheese?",
//         answer: "Ground beef, onions, and cheese on a hero roll.",
//         characterId: "bodega_tony",
//         difficulty: 10,
//     },
//     {
//         question: "Which Bronx neighborhood is known for its authentic Italian food?",
//         answer: "Arthur Avenue (aka Little Italy of the Bronx).",
//         characterId: "bodega_tony",
//         difficulty: 30,
//     },
//     {
//         question: "What’s the name of the big shopping mall at 161st near Yankee Stadium?",
//         answer: "The Bronx Terminal Market.",
//         characterId: "bodega_tony",
//         difficulty: 40,
//     },
//     {
//         question: "Which Bronx street is famous for hosting a Dominican Day Parade?",
//         answer: "Grand Concourse.",
//         characterId: "bodega_tony",
//         difficulty: 35,
//     },
//     {
//         question: "What bridge connects the Bronx to Queens?",
//         answer: "The Throgs Neck Bridge.",
//         characterId: "bodega_tony",
//         difficulty: 50,
//     },
//     {
//         question: "Which Bronx high school was home to many famous rappers?",
//         answer: "DeWitt Clinton High School.",
//         characterId: "bodega_tony",
//         difficulty: 55,
//     },
//     {
//         question: "What local Bronx team plays minor league baseball?",
//         answer: "The Staten Island FerryHawks moved; the Bronx Bombers are it.",
//         characterId: "bodega_tony",
//         difficulty: 75,
//     },
//     {
//         question: "What’s the best drink to get with your bacon egg and cheese from Tony’s bodega?",
//         answer: "An Arizona iced tea, 99 cents baby.",
//         characterId: "bodega_tony",
//         difficulty: 8,
//     },
//     {
//         question: "What’s the name of the old elevated train line that used to run through the Bronx?",
//         answer: "The Third Avenue El.",
//         characterId: "bodega_tony",
//         difficulty: 70,
//     },
//     {
//         question: "Which Bronx museum is home to graffiti art and hip-hop history?",
//         answer: "The Bronx Museum of the Arts.",
//         characterId: "bodega_tony",
//         difficulty: 45,
//     },
//     {
//         question: "How much is a MetroCard swipe right now?",
//         answer: "$2.90 — don’t ask me why it ain’t $2.75 no more.",
//         characterId: "bodega_tony",
//         difficulty: 15,
//     },
//     {
//         question: "Which neighborhood is known as the birthplace of the Harlem Renaissance?",
//         answer: "Harlem.",
//         characterId: "professor_lenox",
//         difficulty: 10,
//     },
//     {
//         question: "What iconic theater in Harlem launched legends like Ella Fitzgerald and James Brown?",
//         answer: "The Apollo Theater.",
//         characterId: "professor_lenox",
//         difficulty: 15,
//     },
//     {
//         question: "Which poet wrote 'The Negro Speaks of Rivers' and called Harlem home?",
//         answer: "Langston Hughes.",
//         characterId: "professor_lenox",
//         difficulty: 25,
//     },
//     {
//         question: "What avenue is famously called 'Harlem's Main Street'?",
//         answer: "125th Street.",
//         characterId: "professor_lenox",
//         difficulty: 15,
//     },
//     {
//         question: "What historic district in Harlem is known for its brownstones and Black cultural pride?",
//         answer: "Strivers’ Row.",
//         characterId: "professor_lenox",
//         difficulty: 30,
//     },
//     {
//         question: "Which Harlem church played a major role in the civil rights movement?",
//         answer: "Abyssinian Baptist Church.",
//         characterId: "professor_lenox",
//         difficulty: 35,
//     },
//     {
//         question: "Which jazz club in Harlem was once a whites-only venue during segregation?",
//         answer: "The Cotton Club.",
//         characterId: "professor_lenox",
//         difficulty: 40,
//     },
//     {
//         question: "Who was the first Black congressman from New York, representing Harlem?",
//         answer: "Adam Clayton Powell Jr.",
//         characterId: "professor_lenox",
//         difficulty: 45,
//     },
//     {
//         question: "What Harlem park is named after a pioneering African American surgeon?",
//         answer: "Marcus Garvey Park.",
//         characterId: "professor_lenox",
//         difficulty: 20,
//     },
//     {
//         question: "Which civil rights leader had a mosque in Harlem and often spoke on Lenox Avenue?",
//         answer: "Malcolm X.",
//         characterId: "professor_lenox",
//         difficulty: 25,
//     },
//     {
//         question: "What annual celebration in Harlem honors African American culture and heritage?",
//         answer: "Harlem Week.",
//         characterId: "professor_lenox",
//         difficulty: 15,
//     },
//     {
//         question: "Which Harlem landmark served as the original meeting place for the NAACP?",
//         answer: "The YMCA on 135th Street.",
//         characterId: "professor_lenox",
//         difficulty: 50,
//     },
//     {
//         question: "What university in Harlem is part of the City University of New York system?",
//         answer: "City College of New York (CCNY).",
//         characterId: "professor_lenox",
//         difficulty: 30,
//     },
//     {
//         question: "Which Harlem institution holds the Schomburg Center for Research in Black Culture?",
//         answer: "The New York Public Library.",
//         characterId: "professor_lenox",
//         difficulty: 40,
//     },
//     {
//         question: "What food style is famously found at Sylvia’s on Lenox Avenue?",
//         answer: "Soul food.",
//         characterId: "professor_lenox",
//         difficulty: 10,
//     },
//     {
//         question: "What painter and muralist is known for his Harlem Renaissance works like 'Aspects of Negro Life'?",
//         answer: "Aaron Douglas.",
//         characterId: "professor_lenox",
//         difficulty: 45,
//     },
//     {
//         question: "Which jazz legend recorded *A Love Supreme* and lived in Harlem for a time?",
//         answer: "John Coltrane.",
//         characterId: "professor_lenox",
//         difficulty: 35,
//     },
//     {
//         question: "Which trailblazing actress and singer was known as the 'High Priestess of Soul' and often performed in Harlem?",
//         answer: "Nina Simone.",
//         characterId: "professor_lenox",
//         difficulty: 30,
//     },
//     {
//         question: "What Harlem building once served as a major gathering place for Black artists and intellectuals in the 1920s?",
//         answer: "The Harlem YMCA.",
//         characterId: "professor_lenox",
//         difficulty: 35,
//     },
//     {
//         question: "What was the Great Migration, and how did it shape Harlem?",
//         answer: "The movement of Black Americans from the South to northern cities, making Harlem a cultural capital.",
//         characterId: "professor_lenox",
//         difficulty: 50,
//     },
//     {
//         question: "What’s the only acceptable bagel topping in Brooklyn — cream cheese or mayo?",
//         answer: "Cream cheese. Mayo? Fahgettaboudit.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Which Brooklyn deli’s pastrami is so good, it’ll make your bubbe weep?",
//         answer: "David’s Brisket House.",
//         characterId: "brooklyn_benny",
//         difficulty: 25,
//     },
//     {
//         question: "What’s louder: the BQE at rush hour or your cousin Lenny after three espressos?",
//         answer: "Toss-up, but probably the BQE.",
//         characterId: "brooklyn_benny",
//         difficulty: 15,
//     },
//     {
//         question: "Which park is Brooklyn’s quieter, cooler cousin to Central Park?",
//         answer: "Prospect Park.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Coney Island’s got the Cyclone and what food that’ll ruin your shirt every time?",
//         answer: "Nathan’s hot dogs.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Where can you get the best slice — and don’t say Manhattan or I’m walkin’ out?",
//         answer: "L&B Spumoni Gardens.",
//         characterId: "brooklyn_benny",
//         difficulty: 15,
//     },
//     {
//         question: "What Brooklyn neighborhood used to be all factories and now it’s oat milk and murals?",
//         answer: "Williamsburg.",
//         characterId: "brooklyn_benny",
//         difficulty: 20,
//     },
//     {
//         question: "Which bridge do you walk across when you need views *and* a calf workout?",
//         answer: "Brooklyn Bridge.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Which neighborhood’s name sounds sweet but rents will give you tsuris?",
//         answer: "DUMBO.",
//         characterId: "brooklyn_benny",
//         difficulty: 20,
//     },
//     {
//         question: "Flatbush Avenue runs from where to where? No GPS — use your kishkes.",
//         answer: "From the Manhattan Bridge to Marine Park.",
//         characterId: "brooklyn_benny",
//         difficulty: 35,
//     },
//     {
//         question: "What kind of pizza does Di Fara serve? And yes, it’s worth the wait.",
//         answer: "Classic New York slices with olive oil and basil.",
//         characterId: "brooklyn_benny",
//         difficulty: 25,
//     },
//     {
//         question: "Which NBA team plays in Brooklyn, even if they still feel like Jersey?",
//         answer: "The Brooklyn Nets.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Which avenue in Bay Ridge is basically Little Italy if your nonna wore gold chains?",
//         answer: "86th Street.",
//         characterId: "brooklyn_benny",
//         difficulty: 20,
//     },
//     {
//         question: "What famous Jewish bakery in Borough Park is known for babka and back pain from the lines?",
//         answer: "Isaac’s Bake Shop.",
//         characterId: "brooklyn_benny",
//         difficulty: 40,
//     },
//     {
//         question: "Which G train station is the best place to rethink your life choices?",
//         answer: "Anywhere on the G line, honestly.",
//         characterId: "brooklyn_benny",
//         difficulty: 30,
//     },
//     {
//         question: "What body of water hugs Brooklyn’s south shore like your aunt at a wedding?",
//         answer: "Gravesend Bay.",
//         characterId: "brooklyn_benny",
//         difficulty: 25,
//     },
//     {
//         question: "Where in Brooklyn can you hear five languages in one bodega line?",
//         answer: "Flatbush.",
//         characterId: "brooklyn_benny",
//         difficulty: 15,
//     },
//     {
//         question: "Which Brooklyn beach has Russian bakeries, old dudes in speedos, and zero shame?",
//         answer: "Brighton Beach.",
//         characterId: "brooklyn_benny",
//         difficulty: 20,
//     },
//     {
//         question: "What's the only acceptable way to pronounce 'Kosciuszko' in Brooklyn?",
//         answer: "'Kaw-skee-asko' or just ‘that one bridge.’",
//         characterId: "brooklyn_benny",
//         difficulty: 35,
//     },
//     {
//         question: "Where do you go in Brooklyn when you wanna impress someone without leaving your borough?",
//         answer: "Brooklyn Heights Promenade.",
//         characterId: "brooklyn_benny",
//         difficulty: 10,
//     },
//     {
//         question: "Which Queens neighborhood is so diverse, you can eat dumplings, empanadas, and dosas on the same block?",
//         answer: "Jackson Heights.",
//         characterId: "qtrain_queenie",
//         difficulty: 15,
//     },
//     {
//         question: "Which train line is the drama queen of the MTA, crawling through Queens with flair?",
//         answer: "The 7 train.",
//         characterId: "qtrain_queenie",
//         difficulty: 10,
//     },
//     {
//         question: "Which Queens stadium says 'Batter up, darling!' to the New York Mets?",
//         answer: "Citi Field.",
//         characterId: "qtrain_queenie",
//         difficulty: 10,
//     },
//     {
//         question: "What massive Queens event brings the whole world to Flushing Meadows like it's Eurovision meets a street fair?",
//         answer: "The U.S. Open.",
//         characterId: "qtrain_queenie",
//         difficulty: 20,
//     },
//     {
//         question: "Which Queens airport gives you international glam *and* endless delays?",
//         answer: "JFK Airport.",
//         characterId: "qtrain_queenie",
//         difficulty: 15,
//     },
//     {
//         question: "Which park in Queens was home to TWO World’s Fairs and has those cute UFO towers?",
//         answer: "Flushing Meadows–Corona Park.",
//         characterId: "qtrain_queenie",
//         difficulty: 25,
//     },
//     {
//         question: "Where in Queens can you get the best Korean BBQ, served with a wink and a sizzle?",
//         answer: "Murray Hill.",
//         characterId: "qtrain_queenie",
//         difficulty: 30,
//     },
//     {
//         question: "Which Latin dance gets its groove on all over Roosevelt Avenue?",
//         answer: "Bachata.",
//         characterId: "qtrain_queenie",
//         difficulty: 15,
//     },
//     {
//         question: "Which museum in Queens is giving avant-garde realness in a former public school building?",
//         answer: "MoMA PS1.",
//         characterId: "qtrain_queenie",
//         difficulty: 25,
//     },
//     {
//         question: "Which rapper from Queens told the world it was 'Illmatic'?",
//         answer: "Nas.",
//         characterId: "qtrain_queenie",
//         difficulty: 20,
//     },
//     {
//         question: "In what Queens neighborhood can you hear Tagalog, Bengali, and Spanish before your coffee's even brewed?",
//         answer: "Woodside.",
//         characterId: "qtrain_queenie",
//         difficulty: 25,
//     },
//     {
//         question: "What iconic sci-fi movie filmed its alien-fighting finale at the Unisphere in Queens?",
//         answer: "*Men in Black.*",
//         characterId: "qtrain_queenie",
//         difficulty: 30,
//     },
//     {
//         question: "Which Queens-born queen taught the world to 'Vogue'?",
//         answer: "Madonna was *born* in Michigan, darling — but Queens taught her the moves.",
//         characterId: "qtrain_queenie",
//         difficulty: 35,
//     },
//     {
//         question: "Which drag-friendly bakery in Astoria serves baklava *and* attitude?",
//         answer: "Artopolis Bakery.",
//         characterId: "qtrain_queenie",
//         difficulty: 30,
//     },
//     {
//         question: "What’s the name of the above-ground stop where the 7 train glimmers like a runway show?",
//         answer: "Queensboro Plaza.",
//         characterId: "qtrain_queenie",
//         difficulty: 20,
//     },
//     {
//         question: "Which Queens neighborhood is known as 'Little Guyana' and brings *flavor* to Liberty Ave?",
//         answer: "Richmond Hill.",
//         characterId: "qtrain_queenie",
//         difficulty: 25,
//     },
//     {
//         question: "Which famous actress from Queens played a nanny with a nasal voice and a heart of gold?",
//         answer: "Fran Drescher.",
//         characterId: "qtrain_queenie",
//         difficulty: 15,
//     },
//     {
//         question: "Which Caribbean carnival takes over the streets of Queens with feathers, flags, and soca beats?",
//         answer: "The Queens Carnival.",
//         characterId: "qtrain_queenie",
//         difficulty: 30,
//     },
//     {
//         question: "Where in Queens can you get Filipino lechon, Ecuadorian ceviche, *and* bubble tea on one block?",
//         answer: "Elmhurst.",
//         characterId: "qtrain_queenie",
//         difficulty: 20,
//     },
//     {
//         question: "Which borough is the *real* cultural capital of NYC — and don't make me snap my fingers?",
//         answer: "Queens, baby. All day.",
//         characterId: "qtrain_queenie",
//         difficulty: 5,
//     },
//     {
//         question: "What’s the only NYC borough where the subway doesn’t go, but the ferry sure does?",
//         answer: "Staten Island.",
//         characterId: "staten_sal",
//         difficulty: 10,
//     },
//     {
//         question: "What’s the cost of a ride on the Staten Island Ferry — besides your sanity?",
//         answer: "It’s free. The sanity’s extra.",
//         characterId: "staten_sal",
//         difficulty: 5,
//     },
//     {
//         question: "Which Staten Island beach is where locals tan, fish, and argue about gravy vs. sauce?",
//         answer: "South Beach.",
//         characterId: "staten_sal",
//         difficulty: 15,
//     },
//     {
//         question: "Which Staten Island bridge connects us to Brooklyn — whether Brooklyn likes it or not?",
//         answer: "Verrazzano-Narrows Bridge.",
//         characterId: "staten_sal",
//         difficulty: 10,
//     },
//     {
//         question: "Which Staten Island museum is all about old-school ships and salty sea tales?",
//         answer: "The Staten Island Museum or the National Lighthouse Museum.",
//         characterId: "staten_sal",
//         difficulty: 30,
//     },
//     {
//         question: "Which Staten Island park is so big you could lose a whole wedding party in it?",
//         answer: "The Staten Island Greenbelt.",
//         characterId: "staten_sal",
//         difficulty: 25,
//     },
//     {
//         question: "What major sporting event kicks off every year at the Staten Island end of the bridge?",
//         answer: "The New York City Marathon.",
//         characterId: "staten_sal",
//         difficulty: 20,
//     },
//     {
//         question: "Which Staten Island attraction features a giant wheel that never actually opened?",
//         answer: "The Staten Island Wheel — may it rest in permits.",
//         characterId: "staten_sal",
//         difficulty: 35,
//     },
//     {
//         question: "Which Staten Island neighborhood is known for Italian bakeries, family drama, and excellent cold cuts?",
//         answer: "Dongan Hills or Tottenville — take your pick.",
//         characterId: "staten_sal",
//         difficulty: 20,
//     },
//     {
//         question: "Which ferry terminal serves more sighs than passengers some mornings?",
//         answer: "St. George Terminal.",
//         characterId: "staten_sal",
//         difficulty: 10,
//     },
//     {
//         question: "Which Staten Island zoo resident has been judging you quietly since 1936?",
//         answer: "Franklin the Staten Island Groundhog.",
//         characterId: "staten_sal",
//         difficulty: 25,
//     },
//     {
//         question: "What Staten Island institution gives you meatballs the size of your steering wheel?",
//         answer: "Denino's Pizzeria & Tavern.",
//         characterId: "staten_sal",
//         difficulty: 15,
//     },
//     {
//         question: "Which local rail line runs like a subway but smells suspiciously like the ferry snack bar?",
//         answer: "The Staten Island Railway.",
//         characterId: "staten_sal",
//         difficulty: 10,
//     },
//     {
//         question: "Which borough has the most trees and the fewest people — and still gets no respect?",
//         answer: "Staten Island.",
//         characterId: "staten_sal",
//         difficulty: 5,
//     },
//     {
//         question: "Which Staten Island dump got turned into the biggest park project in NYC history?",
//         answer: "Freshkills Park.",
//         characterId: "staten_sal",
//         difficulty: 25,
//     },
//     {
//         question: "Which NYC borough do most tourists forget — until they’re told the ferry’s free?",
//         answer: "Staten Island. You’re welcome.",
//         characterId: "staten_sal",
//         difficulty: 10,
//     },
//     {
//         question: "Which local bakery’s cannoli might actually save a marriage?",
//         answer: "Royal Crown Bakery.",
//         characterId: "staten_sal",
//         difficulty: 20,
//     },
//     {
//         question: "Which ferry route gives you views of Lady Liberty *and* at least one screaming baby?",
//         answer: "The Staten Island Ferry.",
//         characterId: "staten_sal",
//         difficulty: 5,
//     },
//     {
//         question: "Which former landfill-turned-park is now twice the size of Central Park and just as misunderstood?",
//         answer: "Freshkills Park.",
//         characterId: "staten_sal",
//         difficulty: 20,
//     },
//     {
//         question: "Which borough is basically your uncle in an orange vest yelling about tolls and taxes?",
//         answer: "Staten Island. Obviously.",
//         characterId: "staten_sal",
//         difficulty: 5,
//     },
// ];

const brooklynQuestions = [
    ...willieQuestions,
    ...blazeQuestions,
    ...rubenQuestions,
    ...basemQuestions,
    ...fiyahQuestions,
    ...devonQuestions,
    ...carloQuestions,
    ...babushkaQuestions,
    ...bluQuestions,
]

async function seed() {
    console.log('clearing old data...')
    await db.delete(question)
    await db.delete(character)

    console.log('inserting tables...')
    await db.insert(character).values(brooklyn_characters)
    await db.insert(question).values(brooklynQuestions)

    console.log('seeding complete')
}

seed().catch((e) => {
    console.log('seeding error', e);
    process.exit(1)
})
