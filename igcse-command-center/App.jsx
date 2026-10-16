// Mahmoud's IGCSE ESL Placement & A* Mastery Command Center
// Single-file React app: Tailwind CSS, lucide-react icons, recharts charts.
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import {
  Target, BarChart3, ClipboardList, Layers, ArrowRight, PenLine, Save, Copy, RotateCcw, Trash2, TrendingUp, Brain,
  Rocket, CalendarDays, Timer, Play, Pause, BookOpen, FileText, Languages, Search, Sparkles, Wand2, Mic, Clock, Shuffle,
  Gauge, Award, GraduationCap, Library, CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Syllabus structure & teaching content
// ---------------------------------------------------------------------------
const MC = {
  components: [
    { id: 'p1e1', paper: 1, short: 'P1 Ex1', label: 'P1 Ex 1: Short-answer comprehension', max: 8, skills: 'R1 R2 R3',
      fix: 'Underline the question keyword, scan for its synonym, and answer in 1–5 words; for the final 3-detail item, list three distinct points, never one point paraphrased twice.',
      keep: 'Keep answers short and precise; check spelling of names and numbers copied from the text.' },
    { id: 'p1e2', paper: 1, short: 'P1 Ex2', label: 'P1 Ex 2: Multiple matching (implied meaning)', max: 9, skills: 'R1 R2 R3 R4',
      fix: 'Paraphrase each question in your own words BEFORE reading; match meaning, not shared words, which are usually distractors. Find and reject the "almost" text for every item.',
      keep: 'Keep a two-pass routine: certain matches first, then return to the hardest two with distractor elimination.' },
    { id: 'p1e3', paper: 1, short: 'P1 Ex3', label: 'P1 Ex 3: Note-making under headings', max: 7, skills: 'R1 R2 R3',
      fix: 'Write notes of 2–6 words; drop examples, statistics and "for instance" clauses; each note must be a different idea that fits its heading.',
      keep: 'Stay concise: lifting whole clauses risks including a wrong detail.' },
    { id: 'p1e4', paper: 1, short: 'P1 Ex4', label: 'P1 Ex 4: Extended multiple choice (gist/attitude)', max: 6, skills: 'R1 R2 R3 R4',
      fix: 'For attitude items, collect three evaluative words from the paragraph (e.g. "reluctantly", "admittedly") before choosing; for vocabulary items, test each option in the sentence.',
      keep: 'Keep checking that the option matches the WHOLE paragraph, not one phrase.' },
    { id: 'p1e5c', paper: 1, short: 'Ex5 C', label: 'P1 Ex 5: Email, content', max: 6, skills: 'W1 W4',
      fix: 'Develop all three bullet prompts equally (about 40 words each) with a detail, a reason and a feeling; open and close naturally for the reader.',
      keep: 'Keep the 3-prompt balance and a clear purpose in the first line.' },
    { id: 'p1e5l', paper: 1, short: 'Ex5 L', label: 'P1 Ex 5: Email, language', max: 9, skills: 'W2 W3 W4',
      fix: 'Add two phrasal verbs, one idiom, natural contractions and one complex sentence (e.g. a participle clause) while keeping a warm informal tone.',
      keep: 'Keep the informal register consistent; avoid formal connectors like "Furthermore" in an email to a friend.' },
    { id: 'p1e6c', paper: 1, short: 'Ex6 C', label: 'P1 Ex 6: Formal prose, content', max: 6, skills: 'W1 W4',
      fix: 'Use both given prompts AND add one idea of your own; in reports, finish with concrete recommendations; in essays, state a position and concede the other side.',
      keep: 'Keep genre conventions visible: title (article/review), subheadings (report), thesis (essay).' },
    { id: 'p1e6l', paper: 1, short: 'Ex6 L', label: 'P1 Ex 6: Formal prose, language', max: 9, skills: 'W2 W3 W4',
      fix: 'No contractions in reports or essays; use impersonal passives ("It is recommended that…"), one inversion and one cleft sentence; vary linking devices.',
      keep: 'Keep C1 structures accurate. One correct inversion beats three faulty ones.' },
    { id: 'p2e1', paper: 2, short: 'P2 Ex1', label: 'P2 Ex 1: Short extracts, visual MCQ', max: 8, skills: 'L1 L2 L3',
      fix: 'Before the audio, name each picture difference (time, object, place); expect the first-mentioned option to be corrected later.',
      keep: 'Keep using the second listening to confirm, not to start again.' },
    { id: 'p2e2', paper: 2, short: 'P2 Ex2', label: 'P2 Ex 2: Short extracts, written MCQ', max: 10, skills: 'L1 L2 L3 L4',
      fix: 'Read both questions per extract before it plays; listen for opinion signals ("to be honest", "I suppose") for attitude questions.',
      keep: 'Keep reading ahead during the pause between extracts.' },
    { id: 'p2e3', paper: 2, short: 'P2 Ex3', label: 'P2 Ex 3: Talk, sentence-completion MCQ', max: 8, skills: 'L1 L2 L3',
      fix: 'Predict the type of missing information (number, reason, place) for each sentence; the speaker paraphrases the sentence stem.',
      keep: 'Keep track of where you are: the items follow the order of the talk.' },
    { id: 'p2e4', paper: 2, short: 'P2 Ex4', label: 'P2 Ex 4: Multiple matching (6 speakers, A–H)', max: 6, skills: 'L1 L2 L3 L4',
      fix: 'Summarise each speaker\'s MAIN point in 3 words after listening; two of A–H are distractors that match a detail but not the speaker\'s overall feeling.',
      keep: 'Keep cross-checking on the second listening: each letter is used once.' },
    { id: 'p2e5', paper: 2, short: 'P2 Ex5', label: 'P2 Ex 5: Interview, inference MCQ', max: 8, skills: 'L1 L2 L3 L4',
      fix: 'Track attitude shifts ("At first I thought… but then…"); the answer is usually the speaker\'s final position, not the first one stated.',
      keep: 'Keep noting who is speaking: questions often test the interviewee, not the interviewer.' },
    { id: 'p3g', paper: 3, short: 'Gram', label: 'P3 Speaking: Grammar', max: 10, skills: 'S2',
      fix: 'Use mixed conditionals and relative clauses spontaneously; self-correct calmly when you slip.',
      keep: 'Keep complex structures natural, never memorised-sounding.' },
    { id: 'p3v', paper: 3, short: 'Vocab', label: 'P3 Speaking: Vocabulary', max: 10, skills: 'S2',
      fix: 'Learn 10 topic collocations per theme; when a word is missing, paraphrase ("the thing you use to…") instead of stopping.',
      keep: 'Keep precise collocations ("tackle a problem", "a pressing issue").' },
    { id: 'p3d', paper: 3, short: 'Dev', label: 'P3 Speaking: Development', max: 10, skills: 'S1 S3',
      fix: 'Expand every answer with the PEEL chain: Point, Example, Explain, Link/speculate.',
      keep: 'Keep extending without prompting in Part 3 abstract questions.' },
    { id: 'p3p', paper: 3, short: 'Pron', label: 'P3 Speaking: Pronunciation', max: 10, skills: 'S4',
      fix: 'Stress the content word that carries contrast ("I didn\'t say TEACHERS should decide…"); fall at the end of statements.',
      keep: 'Keep pace steady; clarity over speed.' }
  ],

  skills: [
    { id: 'R1', area: 'Reading', name: 'Specific factual information', def: 'Demonstrate understanding of specific factual information: skimming, scanning, literal retrieval.', tip: 'Scan for numbers, names and synonyms of the question keyword; never answer from memory of the topic.' },
    { id: 'R2', area: 'Reading', name: 'Connections between ideas', def: 'Understand connections between ideas, opinions and attitudes: pronoun reference, discourse markers of cause/effect, contrast and concession.', tip: 'Circle "however", "despite", "as a result": the answer usually sits right after a contrast marker.' },
    { id: 'R3', area: 'Reading', name: 'Select relevant details', def: 'Identify and select relevant details for a specific purpose, filtering core points from examples and distractors.', tip: 'Ask "is this the point or an example of the point?" before writing a note.' },
    { id: 'R4', area: 'Reading', name: 'Implied meaning', def: 'Understand implied meaning: infer the writer\'s attitude and tone, deduce unfamiliar vocabulary from context.', tip: 'Attitude is built from adverbs and adjectives across a paragraph; collect three before deciding.' },
    { id: 'W1', area: 'Writing', name: 'Communicate information & ideas', def: 'Communicate factual information, ideas and opinions clearly with full task fulfilment and point expansion.', tip: 'Every prompt gets a point + development + example. Unaddressed prompts cap content.' },
    { id: 'W2', area: 'Writing', name: 'Organise ideas coherently', def: 'Organise ideas into coherent, logically paragraphed prose using varied linking devices.', tip: 'Four paragraphs for 140–155 words; vary linkers ("Not only that", "On the other hand", "As a result").' },
    { id: 'W3', area: 'Writing', name: 'Range & accuracy', def: 'Use a wide range of grammatical structures and precise C1 lexis (collocations, phrasal verbs, idioms) accurately.', tip: 'Plan 1 inversion, 1 participle clause, 1 conditional, 1 cleft per Ex 6 task, then proof-read each.' },
    { id: 'W4', area: 'Writing', name: 'Register, tone & format', def: 'Use appropriate register, tone, style and format conventions for purpose and audience.', tip: 'Formal report/essay: no contractions, impersonal voice. Email: warm, contractions, phrasal verbs.' },
    { id: 'L1', area: 'Listening', name: 'Specific factual detail', def: 'Understand specific factual detail: times, dates, places, directions, key facts.', tip: 'Predict the information type before the audio; beware corrected figures ("not 3:15 — actually 3:50").' },
    { id: 'L2', area: 'Listening', name: 'Ideas, opinions & attitudes', def: 'Identify and understand speakers\' ideas, opinions, feelings and attitudes.', tip: 'Tone of voice is evidence: enthusiasm, hesitation and sarcasm change the meaning of the words.' },
    { id: 'L3', area: 'Listening', name: 'Connections in spoken texts', def: 'Understand connections between ideas, opinions, feelings and attitudes in spoken texts.', tip: 'Listen for "that\'s why", "even so", "which meant": they link the cause to the tested effect.' },
    { id: 'L4', area: 'Listening', name: 'Implied meaning', def: 'Understand what is implied but not directly stated: gist, intention, tone, contextual deduction.', tip: 'Ask "why is the speaker saying this?" The intention (persuade, warn, complain) is often the answer.' },
    { id: 'S1', area: 'Speaking', name: 'Communicate & develop ideas', def: 'Communicate a range of ideas and opinions, developing them with relevance and detail.', tip: 'Never give a one-sentence answer: add an example and a reason every time.' },
    { id: 'S2', area: 'Speaking', name: 'Range & accuracy', def: 'Use a range of grammatical structures and vocabulary accurately, paraphrasing when a word is unknown.', tip: 'Have 3 go-to complex structures ready: "If I hadn\'t…, I wouldn\'t…", "What I find…", "Having…".' },
    { id: 'S3', area: 'Speaking', name: 'Interaction & discourse', def: 'Respond to and develop the conversation; use discourse markers and manage turn-taking.', tip: 'Use "That\'s an interesting point; I\'d say…" to buy thinking time naturally.' },
    { id: 'S4', area: 'Speaking', name: 'Pronunciation & intonation', def: 'Pronounce clearly with appropriate word stress, sentence stress and intonation.', tip: 'Stress the new information in each sentence; rise for lists in progress, fall at the end.' }
  ],

  quiz: [
    { skill: 'R1', q: 'Text: "The museum, which reopened last spring after a two-year renovation, now welcomes visitors free of charge on the first Sunday of every month." When can visitors enter without paying?',
      options: ['Every Sunday in spring', 'On one particular Sunday each month', 'For two years after the renovation'], a: 1,
      ex: '"The first Sunday of every month" is paraphrased as "one particular Sunday each month". "Spring" and "two years" are factual distractors taken from the same sentence.' },
    { skill: 'R4', q: 'Text: "The new cycling lanes were, I suppose, a well-meaning idea, though anyone who has tried to use them at rush hour might be forgiven for thinking otherwise." The writer\'s attitude is…',
      options: ['enthusiastic support', 'mild scepticism', 'complete indifference'], a: 1,
      ex: '"I suppose", "well-meaning" (good intentions but poor result) and "might be forgiven for thinking otherwise" signal polite doubt, so scepticism. This is a classic R4 implied-attitude item.' },
    { skill: 'R4', q: 'Text: "Far from being a passing fad, the community garden has become the beating heart of the neighbourhood." What does "passing fad" most likely mean?',
      options: ['a short-lived trend', 'a busy road', 'an expensive project'], a: 0,
      ex: '"Far from being X, it has become the beating heart" contrasts X with something lasting and central, so X = something temporary. Deducing meaning from contrast is tested in Paper 1 Ex 4.' },
    { skill: 'W3', q: 'Choose the most natural C1 collocation: "The council must ____ urgent action to reduce air pollution."',
      options: ['make', 'take', 'do'], a: 1,
      ex: '"Take action" is the fixed collocation. Swapping in strong collocations ("take action", "pose a threat", "raise awareness") lifts Exercise 6 Language marks.' },
    { skill: 'W4', q: 'Which sentence is appropriate for a FORMAL report to your headteacher?',
      options: ['Loads of students reckon the canteen\'s pretty bad.', 'It was found that a significant proportion of students are dissatisfied with the canteen.', 'Honestly, everyone hates the canteen food!'], a: 1,
      ex: 'Impersonal passive ("It was found that"), precise quantifier ("a significant proportion") and no contractions match report register. The others are informal email style.' },
    { skill: 'W3', q: 'Transform with negative inversion: "Students rarely have the chance to meet professional scientists."',
      options: ['Rarely students have the chance to meet professional scientists.', 'Rarely do students have the chance to meet professional scientists.', 'Rarely have students the chance meeting professional scientists.'], a: 1,
      ex: 'After a fronted limiting adverb (Rarely, Seldom, Never), use auxiliary + subject: "Rarely DO students have…". Option A forgets the auxiliary, a very common Grade B error.' },
    { skill: 'W3', q: 'Choose the correct inverted conditional: "____ the school to invest in solar panels, it would save thousands each year."',
      options: ['Should', 'Were', 'Had'], a: 1,
      ex: '"Were + subject + to-infinitive" is the formal inverted 2nd conditional ("If the school invested…" → "Were the school to invest…"). "Had" introduces a 3rd conditional and "Should" needs a bare infinitive with a will/would result ("Should the school invest…").' },
    { skill: 'W3', q: 'Which participle clause is correct? "____ the results of the survey, the committee recommended a longer lunch break."',
      options: ['Having analysed', 'Analysed', 'Having been analysed'], a: 0,
      ex: 'The committee did the analysing (active), and it happened before recommending, so the perfect active participle "Having analysed" is right. "Having been analysed" would mean the committee was analysed.' },
    { skill: 'L4', q: 'Audio transcript: Speaker: "Well, the hotel was certainly… memorable. I don\'t think I\'ve ever heard trains that loud at 3 a.m." What does the speaker imply?',
      options: ['The hotel was a wonderful experience.', 'The hotel was unpleasant because of the noise.', 'The speaker enjoys watching trains.'], a: 1,
      ex: 'The hesitation before "memorable" and the complaint about 3 a.m. trains signal ironic understatement. Listening Ex 4/5 traps reward the literal word ("memorable") instead of the intention.' },
    { skill: 'S3', q: 'In Paper 3 Part 3, the examiner asks: "Should governments ban cars from city centres?" Which response best shows Development (S3)?',
      options: ['Yes, I think so.', 'Yes, because pollution is bad and cars make pollution.', 'Up to a point. Banning cars would clearly cut emissions; take Oslo, for instance. Having said that, it could hurt people with disabilities, so perhaps a partial ban is the fairer compromise.'], a: 2,
      ex: 'Option C uses a hedged position, an example, a concession ("Having said that") and a speculative conclusion: Level 5 Development. Options A/B are undeveloped.' }
  ],

  vocab: [
    { m: 1, b2: 'pollution is bad', c1: 'poses a grave threat to ecosystems', type: 'Collocation', ex: 'Plastic waste poses a grave threat to marine ecosystems.' },
    { m: 1, b2: 'use less energy', c1: 'reduce our carbon footprint', type: 'Collocation', ex: 'Cycling to school is a simple way to reduce our carbon footprint.' },
    { m: 1, b2: 'many animals are dying out', c1: 'accelerating biodiversity loss', type: 'Collocation', ex: 'Deforestation is driving accelerating biodiversity loss in the Amazon.' },
    { m: 1, b2: 'change to clean energy', c1: 'the renewable transition', type: 'Phrase', ex: 'The renewable transition requires significant public investment.' },
    { m: 1, b2: 'stop using', c1: 'phase out', type: 'Phrasal verb', ex: 'Many countries plan to phase out petrol cars by 2035.' },
    { m: 1, b2: 'a small help', c1: 'a drop in the ocean', type: 'Idiom', ex: 'Recycling at home is valuable, but it is a drop in the ocean without industrial change.' },
    { m: 2, b2: 'new technology', c1: 'cutting-edge breakthroughs', type: 'Collocation', ex: 'Cutting-edge breakthroughs in medicine are transforming diagnosis.' },
    { m: 2, b2: 'knowing how to use computers', c1: 'digital literacy', type: 'Phrase', ex: 'Digital literacy should be taught from primary school.' },
    { m: 2, b2: 'machines doing jobs', c1: 'widespread automation', type: 'Collocation', ex: 'Widespread automation may render some jobs obsolete.' },
    { m: 2, b2: 'feeling okay online', c1: 'cyber well-being', type: 'Phrase', ex: 'Schools are increasingly concerned about students\' cyber well-being.' },
    { m: 2, b2: 'start using', c1: 'roll out', type: 'Phrasal verb', ex: 'The school will roll out tablets to every class next term.' },
    { m: 2, b2: 'very modern', c1: 'state-of-the-art', type: 'Collocation', ex: 'The new laboratory is equipped with state-of-the-art equipment.' },
    { m: 3, b2: 'not moving much', c1: 'a sedentary lifestyle', type: 'Collocation', ex: 'A sedentary lifestyle is linked to a range of chronic illnesses.' },
    { m: 3, b2: 'stopping illness early', c1: 'preventative healthcare', type: 'Collocation', ex: 'Investing in preventative healthcare reduces long-term costs.' },
    { m: 3, b2: 'being strong in the mind', c1: 'mental resilience', type: 'Collocation', ex: 'Team sports help young people build mental resilience.' },
    { m: 3, b2: 'balance work and free time', c1: 'strike a healthy work-life balance', type: 'Collocation', ex: 'Students must strike a healthy work-life balance during exam season.' },
    { m: 3, b2: 'start doing a sport', c1: 'take up', type: 'Phrasal verb', ex: 'I took up swimming to improve my fitness.' },
    { m: 3, b2: 'very healthy', c1: 'as fit as a fiddle', type: 'Idiom', ex: 'My grandfather walks five kilometres a day and is as fit as a fiddle.' },
    { m: 4, b2: 'education for everything', c1: 'a holistic education', type: 'Collocation', ex: 'A holistic education nurtures creativity as well as academic skills.' },
    { m: 4, b2: 'after-school activities', c1: 'extracurricular enrichment', type: 'Collocation', ex: 'Extracurricular enrichment broadens students\' horizons.' },
    { m: 4, b2: 'job training', c1: 'vocational training', type: 'Collocation', ex: 'Vocational training offers a practical route into skilled employment.' },
    { m: 4, b2: 'learning all your life', c1: 'lifelong learning', type: 'Collocation', ex: 'Lifelong learning is essential in a rapidly changing job market.' },
    { m: 4, b2: 'do well', c1: 'excel in', type: 'Phrasal verb', ex: 'She excels in debating and creative writing.' },
    { m: 4, b2: 'study very hard', c1: 'hit the books', type: 'Idiom', ex: 'With mocks approaching, it\'s time to hit the books.' },
    { m: 5, b2: 'old traditions', c1: 'our cultural heritage', type: 'Collocation', ex: 'Festivals play a vital role in preserving our cultural heritage.' },
    { m: 5, b2: 'understanding other cultures', c1: 'cross-cultural understanding', type: 'Collocation', ex: 'Exchange programmes foster cross-cultural understanding.' },
    { m: 5, b2: 'art', c1: 'artistic expression', type: 'Collocation', ex: 'Murals give young people an outlet for artistic expression.' },
    { m: 5, b2: 'many kinds of food', c1: 'culinary diversity', type: 'Collocation', ex: 'The food festival celebrates the city\'s culinary diversity.' },
    { m: 5, b2: 'continue a tradition', c1: 'hand down', type: 'Phrasal verb', ex: 'These recipes have been handed down for generations.' },
    { m: 5, b2: 'very famous', c1: 'world-renowned', type: 'Collocation', ex: 'The world-renowned orchestra performed in our town hall.' },
    { m: 6, b2: 'cities are growing', c1: 'rapid urbanisation', type: 'Collocation', ex: 'Rapid urbanisation has placed enormous strain on housing.' },
    { m: 6, b2: 'roads and buses', c1: 'public infrastructure', type: 'Collocation', ex: 'Upgrading public infrastructure would ease traffic congestion.' },
    { m: 6, b2: 'green holidays', c1: 'eco-tourism', type: 'Phrase', ex: 'Eco-tourism can fund conservation while supporting local communities.' },
    { m: 6, b2: 'not giving up', c1: 'sheer perseverance', type: 'Collocation', ex: 'Through sheer perseverance, she became the first in her family to graduate.' },
    { m: 6, b2: 'set off on a trip', c1: 'set out', type: 'Phrasal verb', ex: 'We set out at dawn to reach the summit before noon.' },
    { m: 6, b2: 'travel a lot', c1: 'off the beaten track', type: 'Idiom', ex: 'We stayed in a village off the beaten track.' }
  ],
  modules: ['Conservation, Environment & The Natural World', 'Science, Technology & Digital Innovation', 'Health, Fitness, Nutrition & Well-being', 'Education, Study Habits & Future Employment', 'Culture, History, Celebrations & The Arts', 'Travel, Urban Living & Human Achievement'],

  grammar: [
    { cat: 'Complex subordination & concession', b: 'The trip was expensive. But it was worth it.', a: 'Much as the trip was expensive, it proved worth every penny.', why: '"Much as" + clause = formal concession, merging two simple sentences into one complex sentence.' },
    { cat: 'Complex subordination & concession', b: 'Some people like city life. Other people prefer the countryside.', a: 'Whereas some thrive on the energy of city life, others find the tranquillity of the countryside far more appealing.', why: '"Whereas" contrasts two parallel clauses; precise lexis ("thrive on", "tranquillity") lifts the band.' },
    { cat: 'Participle clauses', b: 'I visited the museum and then I understood the history better.', a: 'Having visited the museum, I gained a far deeper understanding of the region\'s history.', why: 'Perfect participle shows sequence concisely; same subject in both clauses.' },
    { cat: 'Participle clauses', b: 'The students had this problem, so they asked the principal for help.', a: 'Faced with this dilemma, the students turned to the principal for support.', why: 'Past participle clause (passive meaning) creates concise, mature cause-effect.' },
    { cat: 'Conditionals & inverted conditionals', b: 'If the school builds a garden, students will be happier.', a: 'Were the school to create a garden, students would undoubtedly benefit from a calmer environment.', why: 'Inverted 2nd conditional ("Were … to …") is formal and ideal for Ex 6 recommendations.' },
    { cat: 'Conditionals & inverted conditionals', b: 'The volunteers helped a lot. Without them the event failed.', a: 'Had it not been for the volunteers, the event would never have taken place.', why: 'Inverted 3rd conditional replaces "If it hadn\'t been for…", which is C1 range and emphatic.' },
    { cat: 'Passive & impersonal reporting', b: 'Lots of people think homework is too much.', a: 'It is widely contended that the volume of homework set is excessive.', why: 'Impersonal "It is widely contended that…" removes "people think": essential report/essay register.' },
    { cat: 'Passive & impersonal reporting', b: 'We asked 50 students and they said the library is too small.', a: 'A survey was conducted among 50 students, the majority of whom considered the library inadequate.', why: 'Passive + "the majority of whom" relative clause: compact, objective findings for a report.' },
    { cat: 'Negative & limiting inversion', b: 'This project helps the environment and it also saves money.', a: 'Not only does this project protect the environment, but it also generates considerable savings.', why: '"Not only + auxiliary + subject" inversion adds emphasis and stylistic flair.' },
    { cat: 'Negative & limiting inversion', b: 'Students don\'t often get the chance to speak to experts.', a: 'Seldom do students have the opportunity to engage with experts in the field.', why: 'Limiting adverb "Seldom" fronted + inversion; "engage with" is a C1 collocation.' },
    { cat: 'Cleft sentences', b: 'I really liked the music at the festival.', a: 'What particularly stood out at the festival was the electrifying live music.', why: '"What … was …" cleft shifts focus to the key idea, which is ideal for reviews.' },
    { cat: 'Cleft sentences', b: 'The volunteers were enthusiastic and this made the event successful.', a: 'It was the sheer enthusiasm of the volunteers that made the event such a resounding success.', why: '"It was … that …" cleft emphasises the cause; "resounding success" is a strong collocation.' }
  ],

  phases: [
    { name: 'Phase 1: Diagnostic remediation & word-count/register calibration', weeks: [1, 2, 3, 4],
      core: ['Write one Ex 5 email and one Ex 6 task; count words and land inside 140–155', 'Register drill: rewrite 10 informal sentences into report/essay register (no contractions)', 'Timed Paper 1 Ex 1 & Ex 3 (25 min) and mark with the official mark scheme'] },
    { name: 'Phase 2: Synonym-paraphrase distractor immunity & Ex 6 genre mastery', weeks: [5, 6, 7, 8],
      core: ['Paraphrase drill: rewrite all 9 Ex 2 questions in your own words before reading the texts', 'Write one Ex 6 piece in the week\'s genre using the blueprint (title, subheadings, thesis)', 'Listening Ex 4 & Ex 5 from a past paper: log every wrong answer with the trap type'] },
    { name: 'Phase 3: C1 syntactic flair & full timed exam conditioning', weeks: [9, 10, 11, 12],
      core: ['Full timed Paper 1 (2 hours, no dictionary) and Paper 2 (50 minutes) under exam conditions', 'Grammar transformer: upgrade 8 Grade B sentences (2 inversions, 2 conditionals, 2 passives, 2 clefts)', 'Speaking mock: 1-minute card prep + 3-minute talk + Part 3 discussion, recorded and self-marked'] }
  ],
  genres: ['Article', 'Report', 'Review', 'Essay'],

  cards: [
    { theme: 'Environment', title: 'Protecting the natural world',
      p1: ['Do you spend much time outdoors? Why?', 'What do you do at home to help the environment?'],
      p2: ['a natural place you enjoy visiting', 'why some people do not care about nature', 'whether young people can make a difference', 'the idea that tourism damages beautiful places', 'whether governments should fine people who pollute'],
      p3: ['Is economic growth more important than protecting the environment?', 'Should individuals or corporations carry the greatest responsibility for climate change?'] },
    { theme: 'Technology', title: 'Life online',
      p1: ['How often do you use your phone each day?', 'What app could you not live without?'],
      p2: ['a piece of technology that changed your life', 'how technology helps students learn', 'whether people spend too much time online', 'the idea that robots will replace teachers', 'whether social media should have age limits'],
      p3: ['Does technology bring people closer together or push them apart?', 'Should artificial intelligence be allowed to make important decisions?'] },
    { theme: 'Health', title: 'Staying healthy',
      p1: ['What do you usually eat for breakfast?', 'Do you play any sports?'],
      p2: ['a healthy habit you have developed', 'why young people find it hard to stay active', 'the role of schools in promoting healthy eating', 'the idea that mental health is as important as physical health', 'whether junk food should be taxed'],
      p3: ['Is personal health purely an individual responsibility?', 'How might healthcare change in the next fifty years?'] },
    { theme: 'Education', title: 'The future of learning',
      p1: ['What is your favourite subject? Why?', 'How do you usually revise for tests?'],
      p2: ['a teacher who inspired you', 'the value of extracurricular activities', 'whether exams are the best way to measure ability', 'the idea that university is not for everyone', 'whether online learning could replace schools'],
      p3: ['Should education focus more on practical skills than academic knowledge?', 'Is lifelong learning a necessity or a luxury?'] },
    { theme: 'Culture', title: 'Celebrations and traditions',
      p1: ['What is your favourite festival?', 'Do you enjoy cooking traditional food?'],
      p2: ['a celebration that is important to your family', 'how traditions are passed between generations', 'whether globalisation threatens local customs', 'the idea that young people are losing interest in traditions', 'whether cultural heritage sites should be protected at any cost'],
      p3: ['Can a country modernise without losing its identity?', 'Should museums return artefacts to their countries of origin?'] },
    { theme: 'Travel', title: 'Cities and journeys',
      p1: ['Where would you most like to travel?', 'How do you get to school every day?'],
      p2: ['a memorable journey you have made', 'the advantages of living in a big city', 'problems caused by rapid urbanisation', 'the idea that travel broadens the mind', 'whether cities should be car-free'],
      p3: ['Is it better to visit many places briefly or one place in depth?', 'What makes a human achievement truly great?'] }
  ],

  writingBands: [
    { band: 5, content: 'All prompts fully addressed and well developed; consistently appropriate register; clearly aware of purpose and audience.', language: 'Wide range of complex structures and precise, often less common lexis used accurately; ideas well sequenced with varied linking; errors rare.' },
    { band: 4, content: 'All prompts addressed with relevant development; register mostly appropriate; purpose clear.', language: 'Good range of structures and vocabulary with some errors that do not impede; logical organisation and linking.' },
    { band: 3, content: 'Prompts addressed but development uneven; some inconsistency in register.', language: 'Adequate range of simple and some complex structures; errors noticeable but meaning clear; linking sometimes mechanical.' },
    { band: 2, content: 'Some prompts missing or underdeveloped; register frequently inappropriate.', language: 'Limited range; frequent errors that sometimes obscure meaning; little paragraphing.' },
    { band: 1, content: 'Minimal relevance to the task; purpose unclear.', language: 'Very limited structures and vocabulary; errors impede communication throughout.' }
  ],
  speakingBands: {
    p3g: ['Very limited control; errors impede.', 'Simple structures, frequent errors.', 'Simple structures mostly accurate; some complex attempts.', 'Range of complex structures, generally accurate.', 'Wide range of complex structures used confidently and accurately.'],
    p3v: ['Very limited vocabulary.', 'Basic vocabulary; limited topic lexis.', 'Adequate vocabulary; some precise choices.', 'Good range with collocations; paraphrases effectively.', 'Precise, idiomatic vocabulary; effortless paraphrase.'],
    p3d: ['Minimal responses; little relevance.', 'Short responses needing prompting.', 'Relevant responses with some expansion.', 'Developed responses with examples and justification.', 'Fully developed, spontaneous, sophisticated discussion.'],
    p3p: ['Frequently unintelligible.', 'Often difficult to follow.', 'Generally clear; some strain on listener.', 'Clear with good stress and intonation.', 'Consistently clear; stress and intonation used to convey meaning.']
  },

  books: [
    { id: 'luc', name: 'Lucantoni: Cambridge IGCSE ESL Coursebook & Workbook (6th ed., CUP)', units: 14, parts: ['Coursebook', 'Workbook'] },
    { id: 'bar', name: 'Barry: Success International English Skills, Student\'s Book & Workbook (5th ed., CUP)', units: 10, parts: ['Student\'s Book', 'Workbook'] },
    { id: 'col', name: 'Collins Cambridge IGCSE ESL Student\'s Book (3rd ed.)', units: 12, parts: ['Unit'] }
  ],
  series: [
    { name: 'March', variants: ['12', '22'] },
    { name: 'June', variants: ['11', '12', '13', '21', '22', '23'] },
    { name: 'November', variants: ['11', '12', '13', '21', '22', '23'] }
  ],
  years: ['2024', '2025', '2026'],
  specimens: ['Specimen Paper 1 (Reading & Writing)', 'Specimen Paper 2 (Listening) + audio', 'Specimen Paper 3 (Speaking cards + examiner notes)', 'Specimen mark schemes', 'Example Candidate Responses (ECR)', 'Principal Examiner Report (latest series)'],

  linkers: ['however', 'moreover', 'furthermore', 'nevertheless', 'consequently', 'therefore', 'although', 'whereas', 'despite', 'in addition', 'on the other hand', 'as a result', 'not only', 'in conclusion', 'to sum up', 'firstly', 'secondly', 'finally', 'meanwhile', 'whilst', 'thus', 'hence', 'admittedly', 'that said', 'having said that', 'in contrast', 'similarly', 'for instance', 'for example', 'overall', 'by the way', 'anyway', 'plus', 'also']
};

// ---------------------------------------------------------------------------
// Baseline checkpoints (Initial Placement Test = 75.0% weighted in 0511; the rest are sample trajectories)
// ---------------------------------------------------------------------------
const DEFAULT_CHECKPOINTS = [
  { checkpoint: 'Initial Placement Test', order: 1, p1e1: 7, p1e2: 5, p1e3: 6, p1e4: 4, p1e5c: 5, p1e5l: 6, p1e6c: 4, p1e6l: 5, p2e1: 7, p2e2: 8, p2e3: 7, p2e4: 3, p2e5: 5, p3g: 8, p3v: 8, p3d: 9, p3p: 9, words: 128, genre: 'Report' },
  { checkpoint: 'Mock Exam 1', order: 2, p1e1: 7, p1e2: 6, p1e3: 6, p1e4: 5, p1e5c: 5, p1e5l: 7, p1e6c: 5, p1e6l: 6, p2e1: 7, p2e2: 8, p2e3: 7, p2e4: 4, p2e5: 6, p3g: 8, p3v: 8, p3d: 9, p3p: 9, words: 138, genre: 'Report' },
  { checkpoint: 'Mock Exam 2', order: 3, p1e1: 8, p1e2: 7, p1e3: 7, p1e4: 5, p1e5c: 6, p1e5l: 7, p1e6c: 5, p1e6l: 7, p2e1: 8, p2e2: 9, p2e3: 7, p2e4: 5, p2e5: 6, p3g: 9, p3v: 8, p3d: 9, p3p: 9, words: 147, genre: 'Essay' },
  { checkpoint: 'Target A* Benchmark', order: 4, p1e1: 8, p1e2: 8, p1e3: 7, p1e4: 5, p1e5c: 6, p1e5l: 8, p1e6c: 6, p1e6l: 8, p2e1: 8, p2e2: 9, p2e3: 8, p2e4: 5, p2e5: 7, p3g: 9, p3v: 9, p3d: 9, p3p: 9, words: 150, genre: 'Article' }
];

const A_STAR = 88;
const COMP = MC.components;
const COMP_BY_ID = Object.fromEntries(COMP.map((c) => [c.id, c]));
const WEIGHTS = { '0511': { p1: [60, 50], p2: [40, 25], p3: [40, 25] }, '0510': { p1: [60, 70], p2: [40, 30], p3: [40, 0] } };
const PAPER_NAME = { p1: 'Paper 1', p2: 'Paper 2', p3: 'Paper 3' };
const NINE_ONE = { 'A*': '8–9', A: '7', B: '6', C: '4–5', D: '3', E: '2', F: '1', G: '1', U: 'U' };
const STATUS_LABEL = { crit: 'Critical', dev: 'Developing', a: 'Grade A', star: 'A* Mastery' };
const STATUS_HEX = { crit: '#dc2626', dev: '#d97706', a: '#312e81', star: '#059669' };
const STATUS_CLS = {
  crit: 'bg-red-50 text-red-700 border-red-300', dev: 'bg-amber-50 text-amber-700 border-amber-300',
  a: 'bg-indigo-50 text-indigo-800 border-indigo-300', star: 'bg-emerald-50 text-emerald-700 border-emerald-300'
};
const r1 = (x) => Math.round(x * 10) / 10;
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const status = (p) => (p < 65 ? 'crit' : p < 80 ? 'dev' : p < A_STAR ? 'a' : 'star');
const gradeOf = (w) => (w >= 88 ? 'A*' : w >= 80 ? 'A' : w >= 70 ? 'B' : w >= 60 ? 'C' : w >= 50 ? 'D' : w >= 40 ? 'E' : w >= 30 ? 'F' : w >= 20 ? 'G' : 'U');
const cefrOf = (w) => (w >= 88 ? 'C1' : w >= 80 ? 'High B2' : w >= 70 ? 'B2' : w >= 55 ? 'B1' : w >= 40 ? 'A2' : 'Below A2');
const endorseOf = (p3) => (p3 >= 36 ? '1' : p3 >= 28 ? '2' : p3 >= 22 ? '3' : p3 >= 18 ? '4' : p3 >= 10 ? '5' : 'U');
const endorseLabel = { 1: '1 (High Distinction)', 2: '2 (Distinction)', 3: '3 (Merit)', 4: '4 (Pass)', 5: '5 (Pass)', U: 'Ungraded' };

const SKILL_MAP = {
  R1: [['p1e1', 1], ['p1e3', 1], ['p1e2', 0.5]], R2: [['p1e2', 1], ['p1e1', 0.5], ['p1e3', 0.5], ['p1e4', 0.5]], R3: [['p1e3', 1], ['p1e1', 1], ['p1e2', 0.5]], R4: [['p1e2', 1], ['p1e4', 1]],
  W1: [['p1e5c', 1], ['p1e6c', 1]], W2: [['p1e6l', 1], ['p1e5l', 0.5], ['p1e5c', 0.5], ['p1e6c', 0.5]], W3: [['p1e6l', 1], ['p1e5l', 0.5]], W4: [['p1e5l', 1], ['p1e6l', 1], ['p1e6c', 0.5]],
  L1: [['p2e1', 1], ['p2e3', 1], ['p2e2', 0.5]], L2: [['p2e2', 1], ['p2e4', 1], ['p2e5', 0.5]], L3: [['p2e2', 1], ['p2e5', 1], ['p2e3', 0.5]], L4: [['p2e4', 1], ['p2e5', 1], ['p2e2', 0.5]],
  S1: [['p3d', 0.7], ['p3g', 0.3]], S2: [['p3g', 1], ['p3v', 1]], S3: [['p3d', 1]], S4: [['p3p', 1]]
};

function score(r, mode) {
  const n = (k) => Number(r[k]) || 0;
  const avg = (parts) => { let s = 0, m = 0; parts.forEach(([k, wt]) => { s += wt * n(k) / COMP_BY_ID[k].max; m += wt; }); return r1(s / m * 100); };
  const reading = n('p1e1') + n('p1e2') + n('p1e3') + n('p1e4');
  const writing = n('p1e5c') + n('p1e5l') + n('p1e6c') + n('p1e6l');
  const p1 = reading + writing;
  const p2 = n('p2e1') + n('p2e2') + n('p2e3') + n('p2e4') + n('p2e5');
  const p3 = n('p3g') + n('p3v') + n('p3d') + n('p3p');
  const W = WEIGHTS[mode];
  const weighted = r1(p1 / 60 * W.p1[1] + p2 / 40 * W.p2[1] + p3 / 40 * W.p3[1]);
  const skills = Object.fromEntries(Object.entries(SKILL_MAP).map(([k, parts]) => [k, avg(parts)]));
  return {
    name: r.checkpoint, reading, writing, p1, p2, p3, weighted, grade: gradeOf(weighted), cefr: cefrOf(weighted), endorse: endorseOf(p3),
    words: n('words'), genre: r.genre,
    radar: {
      'AO1 Reading': r1(reading / 30 * 100), 'AO2 Writing': r1(writing / 30 * 100), 'AO3 Listening': r1(p2 / 40 * 100), 'AO4 Speaking': r1(p3 / 40 * 100),
      'C1 Grammar & Lexis': avg([['p1e5l', 1], ['p1e6l', 1], ['p3g', 1], ['p3v', 1]]),
      'Inference & Distractor Immunity': avg([['p1e2', 1], ['p1e4', 1], ['p2e4', 1], ['p2e5', 1]])
    },
    skills,
    comps: COMP.map((c) => ({ ...c, raw: n(c.id), pct: r1(n(c.id) / c.max * 100) }))
  };
}

function gapFor(s, mode) {
  const deficit = A_STAR - s.weighted;
  if (deficit <= 0) return { marks: 0, reachable: true, plan: [] };
  const W = WEIGHTS[mode];
  const papers = ['p1', 'p2', 'p3'].filter((p) => W[p][1] > 0).map((p) => ({ p, per: W[p][1] / W[p][0], room: W[p][0] - s[p] })).sort((a, b) => b.per - a.per);
  let left = deficit, marks = 0; const plan = [];
  for (const x of papers) {
    if (left <= 1e-9) break;
    const take = Math.min(x.room, Math.ceil(left / x.per - 1e-9));
    if (take > 0) { plan.push({ p: x.p, take }); marks += take; left -= take * x.per; }
  }
  return { marks, reachable: left <= 1e-9, plan };
}

const wordVerdict = (w) => (!w ? 'No words yet.' : w < 120 ? 'Below the 120-word minimum: content will be under-developed.' : w < 140 ? 'Inside the window; add 10–15 words of development to reach the A* sweet spot.' : w <= 155 ? 'In the 140–155 A* sweet spot.' : w <= 160 ? 'Inside the window but near the ceiling; trim to 155.' : 'Over 160 words: extra length risks errors and loses focus.');

// ---------------------------------------------------------------------------
// Persistence (sandbox-safe)
// ---------------------------------------------------------------------------
const STORE_KEY = 'mahmoud-igcse-esl-command-center-v1';
function loadStore() {
  try { const raw = window.localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
}
function useStoredState(key, initial) {
  const [value, setValue] = useState(() => { const s = loadStore(); return s[key] !== undefined ? s[key] : initial; });
  useEffect(() => {
    try { const s = loadStore(); s[key] = value; window.localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable: keep in memory */ }
  }, [key, value]);
  return [value, setValue];
}

// ---------------------------------------------------------------------------
// Small UI pieces
// ---------------------------------------------------------------------------
const Card = ({ title, note, icon: Icon, children, className = '', right }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-w-0 ${className}`}>
    {(title || right) && (
      <div className="flex items-start justify-between gap-3 mb-1">
        {title && <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">{Icon && <Icon className="w-4 h-4 text-indigo-700" />}{title}</h2>}
        {right}
      </div>
    )}
    {note && <p className="text-xs text-slate-500 mb-4">{note}</p>}
    {children}
  </div>
);
const Tag = ({ st, children }) => <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLS[st]}`}>{children}</span>;
const Meter = ({ pct, color = '#059669', goal, tall }) => (
  <div className={`relative ${tall ? 'h-3.5' : 'h-2'} bg-slate-200 rounded-full`}>
    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
    {goal != null && <div className="absolute -top-1 -bottom-1 w-0.5 bg-slate-700" style={{ left: `${goal}%` }} />}
  </div>
);
const Btn = ({ primary, className = '', ...p }) => (
  <button type="button" {...p} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${primary ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-700'} ${className}`} />
);
const Chip = ({ on, ...p }) => (
  <button type="button" {...p} className={`text-xs px-3 py-1 rounded-full border transition ${on ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-700'}`} />
);

function WordGauge({ words }) {
  const lo = 80, hi = 200; const pos = (v) => (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * 100;
  const zones = [[lo, 120, '#fca5a5'], [120, 140, '#fcd34d'], [140, 155, '#6ee7b7'], [155, 160, '#fcd34d'], [160, hi, '#fca5a5']];
  return (
    <div className="relative h-8 mt-1">
      <div className="absolute inset-x-0 top-2 h-2 rounded-full overflow-hidden flex">
        {zones.map(([a, b, c]) => <div key={a} style={{ width: `${pos(b) - pos(a)}%`, background: c }} />)}
      </div>
      {[120, 140, 155, 160].map((v, i) => (
        <div key={v} className="absolute top-5 text-[10px] text-slate-500" style={{ left: `${pos(v)}%`, transform: i === 2 ? 'translateX(-90%)' : i === 3 ? 'translateX(-10%)' : 'translateX(-50%)' }}>{v}</div>
      ))}
      {words > 0 && <div className="absolute top-0.5 w-[3px] h-5 bg-slate-900 rounded transition-all duration-500" style={{ left: `${pos(words)}%`, transform: 'translateX(-50%)' }} />}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]" role="status" aria-live="polite">
      <div className={`flex items-start gap-2 bg-slate-900 text-slate-50 text-sm rounded-lg px-4 py-3 shadow-xl border-l-4 ${toast.warn ? 'border-amber-500' : 'border-emerald-500'}`}>
        {toast.warn ? <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />}
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 1: Diagnostic
// ---------------------------------------------------------------------------
function DiagnosticTab({ s, base, mode }) {
  const [skill, setSkill] = useState(null);
  const delta = s.weighted - base.weighted;
  const W = WEIGHTS[mode];
  const radarData = Object.keys(s.radar).map((k) => ({ axis: k, Mahmoud: s.radar[k], Baseline: base.radar[k], 'A* Benchmark': A_STAR }));
  const barData = s.comps.map((c) => ({ name: c.short, full: c.label, pct: c.pct, raw: c.raw, max: c.max, st: status(c.pct) }));
  const sel = skill && MC.skills.find((k) => k.id === skill);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="text-xs text-slate-500">Baseline → current (weighted)</div>
          <div className="flex items-baseline gap-2 mt-2 font-serif text-3xl tabular-nums">{f1(base.weighted)}%<ArrowRight className="w-5 h-5 text-slate-400" />{f1(s.weighted)}%</div>
          <div className={`text-xs mt-2 ${delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-red-600' : 'text-slate-500'}`}>{base.name === s.name ? `${base.name} is the baseline` : `${delta >= 0 ? '+' : '−'}${f1(Math.abs(delta))} pts since ${base.name}`}</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-500">Grade vs A* target (≥88%)</div>
          <div className="font-serif text-3xl mt-2">{s.grade}</div>
          <div className="mt-2"><Meter pct={s.weighted} color={STATUS_HEX[status(s.weighted)]} goal={88} /></div>
          <div className="text-xs text-slate-500 mt-2">{s.weighted >= A_STAR ? `A* secured with ${f1(s.weighted - A_STAR)} pts to spare` : `${f1(A_STAR - s.weighted)} pts below A* (9–1 ≈ ${NINE_ONE[s.grade]})`}</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-500 mb-2">Raw marks: now / A* target</div>
          {['p1', 'p2', 'p3'].map((p) => {
            const max = W[p][0]; const target = Math.ceil(max * 0.88 - 1e-9); const need = Math.max(0, target - s[p]);
            return (
              <div key={p} className="grid grid-cols-[3rem_1fr_auto] items-center gap-2 text-xs tabular-nums mb-1.5">
                <span>{PAPER_NAME[p].replace('Paper ', 'P')}{p === 'p3' && mode === '0510' ? '*' : ''}</span>
                <Meter pct={s[p] / max * 100} color={STATUS_HEX[status(s[p] / max * 100)]} goal={88} />
                <span><b>{s[p]}</b> / {target} of {max} {need ? `(+${need})` : '✓'}</span>
              </div>
            );
          })}
          {mode === '0510' && <div className="text-[11px] text-slate-500">* Paper 3 is endorsed separately in 0510.</div>}
        </Card>
        <Card>
          <div className="text-xs text-slate-500">Average writing word count</div>
          <div className="font-serif text-3xl mt-2 tabular-nums">{s.words || '—'} <span className="text-sm text-slate-400 font-sans">words</span></div>
          <WordGauge words={s.words} />
          <div className="text-xs text-slate-500">{wordVerdict(s.words)} {s.genre && `Weakest Ex 6 genre: ${s.genre}.`}</div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card title="Skill radar vs 88% A* benchmark" icon={Target} note="Six composite domains for the selected checkpoint against the A* line.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="68%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#334155' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Radar name="A* Benchmark" dataKey="A* Benchmark" stroke="#0f172a" strokeDasharray="5 4" fill="none" />
                {base.name !== s.name && <Radar name={`Baseline (${base.name})`} dataKey="Baseline" stroke="#d97706" strokeDasharray="2 3" fill="none" />}
                <Radar name={s.name} dataKey="Mahmoud" stroke="#312e81" strokeWidth={2} fill="#312e81" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${f1(v)}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Exercise-by-exercise mastery" icon={BarChart3} note="Percentage of marks per component (Ex 5 & 6 split into Content / Language).">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <YAxis type="category" dataKey="name" width={58} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v, n, p) => [`${p.payload.raw}/${p.payload.max} · ${f1(v)}%`, p.payload.full]} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={12}>
                  {barData.map((d) => <Cell key={d.name} fill={STATUS_HEX[d.st]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Diagnostic table & examiner diagnosis" icon={ClipboardList} note="Every exam component with raw marks, mastery and the next move.">
        <div className="overflow-auto max-h-[34rem]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white"><tr className="text-left text-slate-500 border-b">
              <th className="py-1.5 pr-2">Component</th><th className="text-right px-2">Raw</th><th className="text-right px-2">Max</th><th className="text-right px-2">Mastery</th><th className="px-2">Examiner diagnosis</th>
            </tr></thead>
            <tbody>
              {s.comps.map((c) => {
                const st = status(c.pct);
                return (
                  <tr key={c.id} className="border-b border-slate-100 align-top">
                    <td className="py-1.5 pr-2 font-medium text-slate-800">{c.label}</td>
                    <td className="text-right px-2 tabular-nums">{c.raw}</td><td className="text-right px-2 tabular-nums">{c.max}</td><td className="text-right px-2 tabular-nums">{f1(c.pct)}%</td>
                    <td className="px-2 text-slate-600 min-w-[16rem]"><Tag st={st}>{STATUS_LABEL[st]}</Tag> {st === 'star' ? c.keep : c.fix} <span className="text-slate-400">[{c.skills}]</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="16 official sub-skills matrix" icon={Layers} note="Click a card for the syllabus definition and A* examiner strategy.">
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 mb-3">
          {['crit', 'dev', 'a', 'star'].map((k) => <span key={k} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_HEX[k] }} />{STATUS_LABEL[k]} {k === 'crit' ? '<65%' : k === 'dev' ? '65–79%' : k === 'a' ? '80–87%' : '≥88%'}</span>)}
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {MC.skills.map((k) => {
            const v = s.skills[k.id]; const st = status(v);
            return (
              <button type="button" key={k.id} onClick={() => setSkill(skill === k.id ? null : k.id)}
                className={`text-left rounded-lg border border-l-4 p-2 bg-slate-50 ${skill === k.id ? 'ring-2 ring-emerald-500' : ''}`} style={{ borderLeftColor: STATUS_HEX[st] }}>
                <div className="text-[11px] font-semibold text-slate-500">{k.id} · {STATUS_LABEL[st]}</div>
                <div className="font-serif text-xl tabular-nums">{f1(v)}%</div>
                <div className="text-[11px] text-slate-500 leading-tight">{k.name}</div>
              </button>
            );
          })}
        </div>
        {sel && (
          <div className="mt-4 p-4 rounded-lg bg-slate-50 border text-sm">
            <h3 className="font-semibold mb-1">{sel.id}: {sel.name} ({sel.area})</h3>
            <p className="mb-1"><b>Syllabus:</b> {sel.def}</p>
            <p className="mb-1"><b>A* examiner strategy:</b> {sel.tip}</p>
            <p className="text-xs text-slate-500">Mahmoud: {f1(s.skills[sel.id])}% · {s.skills[sel.id] >= A_STAR ? 'at A* standard' : `${f1(A_STAR - s.skills[sel.id])} pts to A*`} · Assessed in: {COMP.filter((c) => c.skills.split(' ').includes(sel.id)).map((c) => c.short).join(', ')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 2: Logger & Quiz
// ---------------------------------------------------------------------------
function LoggerTab({ checkpoints, setCheckpoints, current, setCurrent, mode, notify }) {
  const [sub, setSub] = useState('entry');
  const blank = () => ({ checkpoint: '', words: '', genre: 'Report', ...Object.fromEntries(COMP.map((c) => [c.id, ''])) });
  const [form, setForm] = useState(blank);
  const [quiz, setQuiz] = useState({});

  const parsed = useMemo(() => {
    let bad = null; const r = { checkpoint: form.checkpoint.trim(), words: Number(form.words) || 0, genre: form.genre };
    COMP.forEach((c) => {
      const v = form[c.id] === '' ? 0 : Number(form[c.id]);
      if (!Number.isInteger(v) || v < 0 || v > c.max) bad = bad || `${c.short} must be a whole number from 0 to ${c.max}.`;
      r[c.id] = Math.max(0, Math.min(c.max, Math.round(v || 0)));
    });
    return { r, bad, s: score(r, mode) };
  }, [form, mode]);

  const save = () => {
    if (!parsed.r.checkpoint) { notify('Give the checkpoint a name first, e.g. "June 2025 Past Paper Mock".', true); return; }
    if (parsed.bad) { notify(parsed.bad, true); return; }
    const existing = checkpoints.find((c) => c.checkpoint === parsed.r.checkpoint);
    const order = existing ? existing.order : Math.max(0, ...checkpoints.map((c) => c.order)) + 1;
    setCheckpoints([...checkpoints.filter((c) => c.checkpoint !== parsed.r.checkpoint), { ...parsed.r, order }].sort((a, b) => a.order - b.order));
    setCurrent(parsed.r.checkpoint);
    notify(`Saved "${parsed.r.checkpoint}". Every chart and the study plan now use it.`);
  };
  const prefill = () => {
    const r = checkpoints.find((c) => c.checkpoint === current); if (!r) return;
    setForm({ ...Object.fromEntries(COMP.map((c) => [c.id, String(r[c.id])])), checkpoint: '', words: String(r.words || ''), genre: r.genre || 'Report' });
    notify('Form filled from the selected checkpoint. Edit and save under a new name (or the same name to update it).');
  };
  const remove = (name) => {
    if (checkpoints.length <= 1) { notify('Keep at least one checkpoint.', true); return; }
    const next = checkpoints.filter((c) => c.checkpoint !== name); setCheckpoints(next);
    if (current === name) setCurrent(next[0].checkpoint);
    notify(`Removed "${name}".`);
  };

  const lineData = checkpoints.map((c) => { const s = score(c, mode); return { name: c.checkpoint, Weighted: s.weighted, 'Paper 1': r1(s.p1 / 60 * 100), 'Paper 2': r1(s.p2 / 40 * 100), 'Paper 3': r1(s.p3 / 40 * 100) }; });
  const answered = Object.keys(quiz).length; const correct = MC.quiz.filter((q, i) => quiz[i] === q.a).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-lg border bg-white p-0.5">
        {[['entry', 'A · Score entry & mock logger'], ['quiz', 'B · Mini placement diagnostic quiz']].map(([k, l]) => (
          <button type="button" key={k} onClick={() => setSub(k)} className={`text-xs px-3 py-1.5 rounded-md ${sub === k ? 'bg-indigo-900 text-white' : 'text-slate-600'}`}>{l}</button>
        ))}
      </div>
      {sub === 'entry' ? (
        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
          <Card title="Log a checkpoint" icon={PenLine} note="Enter raw marks for every component, then save. Using an existing name updates that checkpoint.">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] mb-4">
              <label className="text-xs text-slate-500 flex flex-col gap-1">Checkpoint name<input className="border rounded-lg px-2 py-1.5 text-sm text-slate-900" value={form.checkpoint} placeholder="e.g. June 2025 Past Paper Mock" onChange={(e) => setForm({ ...form, checkpoint: e.target.value })} /></label>
              <label className="text-xs text-slate-500 flex flex-col gap-1">Avg words<input type="number" min="0" className="border rounded-lg px-2 py-1.5 text-sm text-slate-900" value={form.words} onChange={(e) => setForm({ ...form, words: e.target.value })} /></label>
              <label className="text-xs text-slate-500 flex flex-col gap-1">Weakest Ex 6 genre<select className="border rounded-lg px-2 py-1.5 text-sm text-slate-900" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>{MC.genres.map((g) => <option key={g}>{g}</option>)}</select></label>
            </div>
            {[[1, 'Paper 1 · Reading & Writing (/60)'], [2, 'Paper 2 · Listening (/40)'], [3, 'Paper 3 · Speaking (/40)']].map(([p, t]) => (
              <div key={p} className="mb-3">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1">{t}</div>
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-5">
                  {COMP.filter((c) => c.paper === p).map((c) => (
                    <label key={c.id} className="text-[11px] text-slate-500 flex flex-col gap-0.5">{c.short} /{c.max}
                      <input type="number" min="0" max={c.max} step="1" value={form[c.id]} onChange={(e) => setForm({ ...form, [c.id]: e.target.value })}
                        className={`border rounded-lg px-2 py-1 text-sm text-slate-900 ${form[c.id] !== '' && (Number(form[c.id]) > c.max || Number(form[c.id]) < 0) ? 'border-red-500' : ''}`} />
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-xs bg-slate-50 border border-dashed rounded-lg px-3 py-2 tabular-nums">
              {parsed.bad ? `⚠ ${parsed.bad}` : `Live preview (${mode}): P1 ${parsed.s.p1}/60 · P2 ${parsed.s.p2}/40 · P3 ${parsed.s.p3}/40 → ${f1(parsed.s.weighted)}% · Grade ${parsed.s.grade} · CEFR ${parsed.s.cefr}${mode === '0510' ? ` · Endorsement ${parsed.s.endorse}` : ''}`}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Btn primary onClick={save}><Save className="w-3.5 h-3.5" />Save checkpoint</Btn>
              <Btn onClick={prefill}><Copy className="w-3.5 h-3.5" />Prefill from selected</Btn>
              <Btn onClick={() => setForm(blank())}><RotateCcw className="w-3.5 h-3.5" />Clear</Btn>
            </div>
          </Card>
          <Card title="Progress trajectory" icon={TrendingUp} note="Weighted % and each paper's % across checkpoints, with the 88% A* line.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 8, right: 16, left: -12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `${f1(v)}%`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={88} stroke="#0f172a" strokeDasharray="4 3" label={{ value: 'A* 88%', fontSize: 10, position: 'insideTopRight' }} />
                  <Line type="linear" dataKey="Weighted" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="linear" dataKey="Paper 1" stroke="#312e81" strokeWidth={1.5} />
                  <Line type="linear" dataKey="Paper 2" stroke="#0ea5e9" strokeWidth={1.5} />
                  <Line type="linear" dataKey="Paper 3" stroke="#d97706" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 divide-y text-xs">
              {checkpoints.map((c, i) => { const s = score(c, mode); return (
                <div key={c.checkpoint} className="flex items-center gap-2 py-1.5 tabular-nums">
                  <span className={`flex-1 ${c.checkpoint === current ? 'font-semibold' : ''}`}>#{i + 1} {c.checkpoint}</span>
                  <span>{f1(s.weighted)}% · {s.grade}</span>
                  <Btn onClick={() => setCurrent(c.checkpoint)}>View</Btn>
                  <Btn onClick={() => remove(c.checkpoint)}><Trash2 className="w-3 h-3" /></Btn>
                </div>
              ); })}
            </div>
          </Card>
        </div>
      ) : (
        <Card title="10-question diagnostic sampler" icon={Brain} note="Reading R1/R4, grammar & lexis W3/W4, listening & speaking discourse L4/S3, with instant examiner explanations."
          right={<span className="text-xs border rounded-full px-3 py-0.5 whitespace-nowrap">{answered} / {MC.quiz.length} · {correct} correct</span>}>
          {MC.quiz.map((q, i) => {
            const ans = quiz[i];
            return (
              <div key={i} className="py-4 border-t">
                <div className="flex gap-2 items-baseline text-sm mb-2"><span className="font-semibold text-slate-400">Q{i + 1}</span><Tag st="a">{q.skill}</Tag><span>{q.q}</span></div>
                <div className="flex flex-col gap-1.5">
                  {q.options.map((o, j) => (
                    <button type="button" key={j} disabled={ans != null} onClick={() => setQuiz({ ...quiz, [i]: j })}
                      className={`text-left text-sm border rounded-lg px-3 py-1.5 ${ans == null ? 'hover:border-indigo-700' : j === q.a ? 'border-emerald-600 bg-emerald-50' : j === ans ? 'border-red-500 bg-red-50' : 'opacity-70'}`}>
                      {'ABC'[j]}. {o}
                    </button>
                  ))}
                </div>
                {ans != null && <div className="mt-2 text-xs bg-slate-50 border-l-4 border-indigo-900 rounded px-3 py-2">{ans === q.a ? '✓ Correct. ' : `✗ The answer is ${'ABC'[q.a]}. `}{q.ex}</div>}
              </div>
            );
          })}
          {answered === MC.quiz.length && (
            <div className="mt-2 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="font-serif text-3xl">{correct} / {MC.quiz.length}</div>
              <p className="text-sm">Diagnostic estimate: CEFR {correct >= 9 ? 'C1 (A* trajectory)' : correct >= 7 ? 'High B2 (Grade A range)' : correct >= 5 ? 'B2 (Grade B range)' : correct >= 3 ? 'B1' : 'A2'}.</p>
              <p className="text-xs text-slate-600 mt-1">By skill: {Object.entries(MC.quiz.reduce((acc, q, i) => { const g = acc[q.skill] || [0, 0]; g[1]++; if (quiz[i] === q.a) g[0]++; acc[q.skill] = g; return acc; }, {})).map(([k, [a, b]]) => `${k} ${a}/${b}`).join(' · ')}</p>
            </div>
          )}
          <div className="mt-3"><Btn onClick={() => { setQuiz({}); notify('Quiz restarted.'); }}><RotateCcw className="w-3.5 h-3.5" />Restart quiz</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 3: Study plan
// ---------------------------------------------------------------------------
function buildPlan(s) {
  const comps = [...s.comps].sort((a, b) => a.pct - b.pct);
  let weak = comps.filter((c) => c.pct < A_STAR); if (weak.length < 3) weak = comps.slice(0, 3);
  const weakGenre = MC.genres.includes(s.genre) ? s.genre : 'Report';
  const gOrder = [weakGenre, ...MC.genres.filter((g) => g !== weakGenre)];
  const weeks = [];
  for (let w = 1; w <= 12; w++) {
    const ph = Math.floor((w - 1) / 4); const phase = MC.phases[ph]; const tasks = [];
    phase.core.forEach((t) => {
      let text = t;
      if (ph === 1 && t.includes("the week's genre")) { const g = [gOrder[0], gOrder[1], gOrder[0], gOrder[2]][w - 5]; text = t.replace("the week's genre", `a ${g}`) + (g === weakGenre ? ' (weakest genre)' : ''); }
      tasks.push({ kind: 'Core', text });
    });
    const a = weak[(w - 1) % weak.length]; const b = weak[w % weak.length];
    tasks.push({ kind: `Targeted · ${a.short} ${f1(a.pct)}%`, text: a.fix });
    if (b !== a) tasks.push({ kind: `Targeted · ${b.short} ${f1(b.pct)}%`, text: b.fix });
    if (ph === 0 && s.words && (s.words < 140 || s.words > 155)) tasks.push({ kind: 'Word count', text: `Average is ${s.words} words: write three timed drafts and ${s.words < 140 ? 'add one developed example per paragraph' : 'cut repetition'} until each lands at 140–155.` });
    if (w === 12) tasks.push({ kind: 'Checkpoint', text: "Log this week's full mock in the score logger and compare it with the placement baseline." });
    weeks.push({ w, phase, tasks: tasks.map((t) => ({ ...t, id: `${w}|${t.text}` })) });
  }
  return { weeks, weak };
}

function PlanTab({ s, mode, checks, setChecks, notify }) {
  const [week, setWeek] = useState(1);
  const { weeks, weak } = useMemo(() => buildPlan(s), [s]);
  const all = weeks.flatMap((w) => w.tasks); const done = all.filter((t) => checks[t.id]).length; const frac = all.length ? done / all.length : 0;
  const projected = s.weighted + Math.max(0, 92 - s.weighted) * frac; const ready = Math.min(100, projected / A_STAR * 100);
  const wk = weeks[week - 1];
  const copy = () => {
    const text = [`Mahmoud: IGCSE ESL Path to A* · Week ${wk.w}`, wk.phase.name, `Checkpoint: ${s.name} (${f1(s.weighted)}%, ${s.grade}, ${mode})`, '', ...wk.tasks.map((t) => `${checks[t.id] ? '[x]' : '[ ]'} ${t.kind}: ${t.text}`), '', `A* readiness: ${f1(ready)}%`].join('\n');
    const fallback = () => {
      try {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'; document.body.appendChild(ta); ta.select();
        const ok = document.execCommand('copy'); document.body.removeChild(ta);
        notify(ok ? 'Weekly schedule copied to the clipboard.' : 'Copy was blocked by the browser. Select the tasks and copy them manually.', !ok);
      } catch (e) { notify('Copy was blocked by the browser. Select the tasks and copy them manually.', true); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => notify('Weekly schedule copied to the clipboard.'), fallback);
      else fallback();
    } catch (e) { fallback(); }
  };
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex justify-between gap-4 items-start">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2"><Rocket className="w-4 h-4 text-indigo-700" />Projected A* readiness</h2>
            <p className="text-xs text-slate-500">{done} of {all.length} drills done · projected weighted score {f1(projected)}% (from {f1(s.weighted)}% at "{s.name}"). 100% = projected ≥88%.</p>
          </div>
          <div className="font-serif text-4xl tabular-nums">{f1(ready)}%</div>
        </div>
        <div className="my-3"><Meter tall pct={ready} color={STATUS_HEX[status(projected)]} /></div>
        <div className="flex flex-wrap gap-1.5 items-center text-xs"><span className="text-slate-500">Plan targets:</span>{weak.map((c) => <Tag key={c.id} st={status(c.pct)}>{c.short} {f1(c.pct)}%</Tag>)}</div>
      </Card>
      <div className="grid gap-1.5 grid-cols-4 sm:grid-cols-6 lg:grid-cols-12">
        {weeks.map((x) => { const d = x.tasks.filter((t) => checks[t.id]).length; return (
          <button type="button" key={x.w} onClick={() => setWeek(x.w)} className={`rounded-lg border bg-white py-1.5 text-xs flex flex-col items-center ${week === x.w ? 'border-emerald-600 shadow-[inset_0_-3px_0_#059669]' : ''}`}>
            <span>Week {x.w}</span><span className="text-slate-400 tabular-nums">{d}/{x.tasks.length}</span>
          </button>
        ); })}
      </div>
      <Card right={<Btn primary onClick={copy}><Copy className="w-3.5 h-3.5" />Copy Mahmoud's weekly schedule</Btn>}
        title={`Week ${wk.w} · ${wk.tasks.length} drills`} icon={CalendarDays} note={wk.phase.name}>
        <ul className="flex flex-col gap-1.5">
          {wk.tasks.map((t) => (
            <li key={t.id}>
              <label className="flex gap-3 items-start p-2.5 border rounded-lg bg-slate-50 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-emerald-600" checked={!!checks[t.id]} onChange={(e) => setChecks({ ...checks, [t.id]: e.target.checked })} />
                <span><span className="block text-[11px] text-slate-500">{t.kind}</span><span className={`text-sm ${checks[t.id] ? 'line-through text-slate-400' : ''}`}>{t.text}</span></span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {MC.phases.map((p) => { const pt = weeks.filter((x) => p.weeks.includes(x.w)).flatMap((x) => x.tasks); return (
          <Card key={p.name}>
            <h3 className="text-sm font-semibold">{p.name}</h3>
            <div className="text-xs text-slate-500 mb-2">Weeks {p.weeks[0]}–{p.weeks[3]} · {pt.filter((t) => checks[t.id]).length}/{pt.length} done</div>
            <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">{p.core.map((c) => <li key={c}>{c}</li>)}</ul>
          </Card>
        ); })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 4: Materials
// ---------------------------------------------------------------------------
function StudyTimer({ notify }) {
  const [total, setTotal] = useState(7200); const [left, setLeft] = useState(7200); const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (running && left === 0) { setRunning(false); notify(total === 7200 ? 'Paper 1 time is up. Log the past paper once it is marked.' : 'Paper 2 time is up. Check your answer transfer.'); }
  }, [left, running, total, notify]);
  const fmt = (sec) => { const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s2 = sec % 60; return (h ? `${h}:${String(m).padStart(2, '0')}` : String(m)) + ':' + String(s2).padStart(2, '0'); };
  const el = (total - left) / 60;
  const cue = left === 0 ? 'Time is up. Pens down.' : !running && left === total
    ? (total === 7200 ? 'Plan: Reading Ex 1–4 to 65 min · Ex 5 email to 90 min · Ex 6 to 115 min · 5 min proof-reading.' : 'Plan: read questions ahead in every pause · final 6 minutes for answer transfer.')
    : total === 7200 ? (el < 65 ? 'Now: Reading Exercises 1–4. Aim to finish by 65 minutes.' : el < 90 ? 'Now: Exercise 5 email. 140–155 words, all three prompts.' : el < 115 ? 'Now: Exercise 6. Genre conventions, no contractions if formal.' : 'Now: proof-read verb tenses, articles and word count.')
      : (el < 44 ? 'Now: Listening Exercises 1–5. Each recording is played twice.' : 'Now: answer transfer. Check every item has one answer.');
  return (
    <Card title="Exam study timer" icon={Timer} note="Real timings: Paper 1 is 2 hours (no dictionaries); Paper 2 is about 50 minutes including the 6-minute transfer.">
      <div className="flex gap-2">
        {[[7200, 'Paper 1 · 2:00:00'], [3000, 'Paper 2 · 50:00']].map(([t, l]) => <Chip key={t} on={total === t} onClick={() => { setRunning(false); setTotal(t); setLeft(t); }}>{l}</Chip>)}
      </div>
      <div className="font-serif text-6xl text-center tabular-nums my-4">{fmt(left)}</div>
      <Meter pct={(total - left) / total * 100} color="#312e81" />
      <div className="text-xs text-slate-500 text-center mt-2">{cue}</div>
      <div className="flex gap-2 mt-3 justify-center">
        <Btn primary onClick={() => { if (left === 0) setLeft(total); setRunning(!running); }}>{running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{running ? 'Pause' : left < total && left > 0 ? 'Resume' : 'Start'}</Btn>
        <Btn onClick={() => { setRunning(false); setLeft(total); }}><RotateCcw className="w-3.5 h-3.5" />Reset</Btn>
      </div>
    </Card>
  );
}

function MaterialsTab({ store, setStore, notify }) {
  const [mod, setMod] = useState(0); const [q, setQ] = useState('');
  const cats = useMemo(() => [...new Set(MC.grammar.map((g) => g.cat))], []);
  const [cat, setCat] = useState(0); const [gi, setGi] = useState(0); const [shown, setShown] = useState(false); const [attempt, setAttempt] = useState('');
  const toggle = (bucket, key) => setStore({ ...store, [bucket]: { ...store[bucket], [key]: !store[bucket][key] } });
  const vocab = MC.vocab.filter((v) => (!mod || v.m === mod) && (!q || [v.b2, v.c1, v.ex, v.type].join(' ').toLowerCase().includes(q.toLowerCase())));
  const gEx = MC.grammar.filter((g) => g.cat === cats[cat]); const g = gEx[gi % gEx.length];
  let ppTotal = 0, ppDone = 0;
  MC.years.forEach((y) => MC.series.forEach((s) => s.variants.forEach((v) => { ppTotal++; if (store.pp[`${y}|${s.name}|${v}`]) ppDone++; })));
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card title="Endorsed textbooks tracker" icon={BookOpen} note="Tick units as they're completed. Set the unit count to match your edition.">
          {MC.books.map((b) => {
            const n = store.units[b.id] || b.units; let d = 0;
            b.parts.forEach((p) => { for (let u = 1; u <= n; u++) if (store.unitDone[`${b.id}|${p}|${u}`]) d++; });
            return (
              <div key={b.id} className="py-3 border-t first:border-t-0">
                <div className="flex justify-between gap-2 items-center text-xs font-semibold mb-1">
                  <span>{b.name}</span>
                  <label className="flex items-center gap-1 font-normal text-slate-500">Units<input type="number" min="1" max="30" value={n} className="w-14 border rounded px-1"
                    onChange={(e) => { const v = Math.round(Number(e.target.value)); if (v >= 1 && v <= 30) setStore({ ...store, units: { ...store.units, [b.id]: v } }); else notify('Unit count must be between 1 and 30.', true); }} /></label>
                </div>
                {b.parts.map((p) => (
                  <div key={p} className="flex flex-wrap items-center gap-1 my-1 text-[11px] text-slate-500">
                    <span className="w-24">{p}</span>
                    {Array.from({ length: n }, (_, i) => i + 1).map((u) => { const k = `${b.id}|${p}|${u}`; const on = !!store.unitDone[k]; return (
                      <button type="button" key={u} aria-label={`${p} unit ${u}`} onClick={() => toggle('unitDone', k)} className={`w-6 h-6 rounded border text-[11px] ${on ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white'}`}>{u}</button>
                    ); })}
                  </div>
                ))}
                <div className="text-[11px] text-slate-500">{d} of {n * b.parts.length} completed ({Math.round(d / (n * b.parts.length) * 100)}%)</div>
              </div>
            );
          })}
        </Card>
        <StudyTimer notify={notify} />
      </div>

      <Card title="Past paper & specimen bank" icon={FileText} note="Log each variant once sat and marked with the MS, audio/transcript (SF), ECR and PERT. Variants 1x are Paper 1, 2x are Paper 2.">
        <div className="flex flex-wrap gap-1.5 mb-3">{MC.specimens.map((s) => <Chip key={s} on={!!store.specs[s]} onClick={() => toggle('specs', s)}>{store.specs[s] ? '✓ ' : ''}{s}</Chip>)}</div>
        <div className="overflow-auto">
          <table className="text-xs w-full">
            <thead><tr className="text-slate-500"><th className="text-left py-1">Series</th>{[1, 2, 3, 4, 5, 6].map((i) => <th key={i}>Variant {i}</th>)}</tr></thead>
            <tbody>
              {MC.years.map((y) => MC.series.map((s) => (
                <tr key={y + s.name} className="border-t">
                  <td className="py-1 whitespace-nowrap">{s.name} {y}</td>
                  {[0, 1, 2, 3, 4, 5].map((i) => { const v = s.variants[i]; const k = `${y}|${s.name}|${v}`; return (
                    <td key={i} className="text-center">{v && <button type="button" onClick={() => { toggle('pp', k); if (!store.pp[k]) notify(`Logged ${s.name} ${y} variant ${v}.`); }} className={`w-9 h-6 rounded border ${store.pp[k] ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white'}`}>{v}</button>}</td>
                  ); })}
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-slate-500 mt-2">{ppDone} of {ppTotal} past-paper variants and {Object.values(store.specs).filter(Boolean).length} of {MC.specimens.length} specimen resources completed.</div>
      </Card>

      <Card title="Thematic vocabulary & C1 collocation explorer" icon={Languages} note="Six Cambridge themes, each showing the B2 phrase, its C1 upgrade and a model sentence.">
        <div className="flex flex-wrap justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">{['All themes', ...MC.modules].map((m, i) => <Chip key={m} on={mod === i} onClick={() => setMod(i)} title={m}>{i ? `${i}. ${m.split(',')[0].split(' & ')[0]}` : m}</Chip>)}</div>
          <div className="relative"><Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vocabulary…" className="border rounded-lg pl-7 pr-2 py-1 text-sm" /></div>
        </div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vocab.length === 0 && <div className="text-xs text-slate-500">No vocabulary matches that search.</div>}
          {vocab.map((v) => (
            <div key={v.c1} className="border rounded-lg p-3 bg-slate-50 text-xs flex flex-col gap-1">
              <div className="flex gap-2"><Tag st="a">{v.type}</Tag><span className="text-slate-400">Module {v.m}</span></div>
              <div className="line-through text-slate-400">B2: {v.b2}</div>
              <div className="text-sm font-semibold text-emerald-700">C1: {v.c1}</div>
              <div className="italic text-slate-500">{v.ex}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="B2 → C1 grammar transformer" icon={Sparkles} note="Pick a structure, try upgrading the Grade B sentence yourself, then reveal the A* Band 5 version.">
        <div className="flex flex-wrap gap-1.5 mb-3">{cats.map((c, i) => <Chip key={c} on={cat === i} onClick={() => { setCat(i); setGi(0); setShown(false); setAttempt(''); }}>{c}</Chip>)}</div>
        <div className="flex flex-col gap-2">
          <div className="border-l-4 border-amber-500 bg-slate-50 rounded px-3 py-2"><div className="text-[11px] uppercase tracking-wide text-slate-500">Grade B sentence</div>{g.b}</div>
          <textarea rows={2} value={attempt} onChange={(e) => setAttempt(e.target.value)} placeholder="Your A* upgrade…" className="border rounded-lg p-2 text-sm" />
          {shown && (
            <div className="border-l-4 border-emerald-600 bg-emerald-50 rounded px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">A* Band 5 version</div>{g.a}
              <div className="text-xs text-slate-600 mt-1">Why it scores: {g.why}</div>
            </div>
          )}
          <div className="flex gap-2">
            <Btn primary onClick={() => setShown(!shown)}><Wand2 className="w-3.5 h-3.5" />{shown ? 'Hide A* version' : 'Transform → reveal A* version'}</Btn>
            <Btn onClick={() => { setGi(gi + 1); setShown(false); setAttempt(''); }}>Next example ({(gi % gEx.length) + 1}/{gEx.length})</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 5: Writing & speaking graders
// ---------------------------------------------------------------------------
function analyseDraft(text, g) {
  const out = [];
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const contractions = text.match(/\b(?:[A-Za-z]+n['’]t|(?:I|you|we|they|he|she|it|that|there|what|who|where|here|let)['’](?:s|re|ve|ll|d|m)|[A-Za-z]+['’](?:re|ve|ll|m))\b/gi) || [];
  const lower = ' ' + text.toLowerCase().replace(/\s+/g, ' ') + ' ';
  const linkers = MC.linkers.filter((l) => new RegExp(`\\b${l}\\b`).test(lower));
  const sentences = text.split(/(?<=[.!?])\s+/).filter((x) => x.trim());
  const c1 = [];
  if (/(^|[.!?]\s+)(Not only|Seldom|Rarely|Never (?:before|have|has|had|did)|Under no circumstances|Little did|Hardly|No sooner|Only (?:then|when|after|by|if))\b/i.test(text)) c1.push('negative inversion');
  if (/(^|[.!?]\s+)(Were|Had|Should) (?:the|it|we|I|you|they|he|she|students|schools?|people)\b/i.test(text)) c1.push('inverted conditional');
  if (/(^|[.!?,]\s*)(Having \w+|Faced with|Equipped with|Given that|Inspired by)/i.test(text)) c1.push('participle clause');
  if (/\b(What \w+(?: \w+){0,4} (?:was|is)\b|It (?:was|is) (?:the|this|our|my|their) .{1,60}? (?:that|who)\b)/i.test(text)) c1.push('cleft sentence');
  if (/\b(is|are|was|were|be|been|being) (?:\w+ly )?\w+(?:ed|en)\b/i.test(text)) c1.push('passive');
  if (/\b(much as|whereas|notwithstanding|albeit|even though)\b/i.test(text)) c1.push('concession');
  if (/\bif\b[^.]*\b(would|could|might) have\b/i.test(text)) c1.push('3rd/mixed conditional');
  const add = (st, msg) => out.push([st, msg]);
  add(words < 120 || words > 160 ? 'bad' : words >= 140 && words <= 155 ? 'ok' : 'warn', `${words} words. ${wordVerdict(words)}`);
  add(paras >= 3 ? 'ok' : 'warn', `${paras} paragraph${paras === 1 ? '' : 's'} (separate with a blank line). ${paras >= 3 ? 'Clear paragraphing.' : 'Aim for 3–5 paragraphs.'}`);
  add(linkers.length >= 4 ? 'ok' : 'warn', `${linkers.length} linking device${linkers.length === 1 ? '' : 's'}${linkers.length ? ': ' + linkers.slice(0, 6).join(', ') : ''}. ${linkers.length >= 4 ? '' : 'Use at least 4 varied linkers.'}`);
  add(c1.length >= 3 ? 'ok' : c1.length ? 'warn' : 'bad', c1.length ? `C1 structures detected: ${c1.join(', ')}.` : 'No C1 structures detected yet: add an inversion, participle clause or cleft sentence.');
  if (sentences.length) { const avg = words / sentences.length; add(avg >= 12 && avg <= 24 ? 'ok' : 'warn', `Average sentence length ${f1(avg)} words ${avg < 12 ? '(too choppy: combine with subordination)' : avg > 24 ? '(long: check control)' : '(good variety)'}.`); }
  if (g === 'Email') {
    add(contractions.length >= 2 ? 'ok' : 'warn', `${contractions.length} contraction(s)${contractions.length >= 2 ? ': natural informal register.' : '. Informal emails sound more natural with contractions.'}`);
    add(/^(hi|hello|dear|hey)\b/im.test(text) ? 'ok' : 'warn', /^(hi|hello|dear|hey)\b/im.test(text) ? 'Greeting found.' : 'Add a friendly greeting (Hi / Dear …).');
    const so = /(see you|take care|best wishes|love|cheers|all the best|write soon|speak soon)/i.test(text);
    add(so ? 'ok' : 'warn', so ? 'Sign-off found.' : 'Sign-off missing: end warmly (Take care, Write soon…).');
  } else if (g === 'Report' || g === 'Essay') {
    add(contractions.length ? 'bad' : 'ok', contractions.length ? `Contractions in a formal ${g.toLowerCase()}: ${[...new Set(contractions)].slice(0, 6).join(', ')}. Expand them all.` : 'No contractions: formal register maintained.');
    const informal = lower.match(/\b(gonna|wanna|kids|stuff|awesome|cool|loads of|lots of|a lot of|really|so much|guys)\b/g) || [];
    add(informal.length ? 'warn' : 'ok', informal.length ? `Informal words: ${[...new Set(informal)].join(', ')}. Use precise formal equivalents.` : 'No informal vocabulary flagged.');
    if (/!/.test(text)) add('warn', 'Exclamation marks are rarely appropriate in formal prose.');
    if (g === 'Report') {
      const heads = text.split('\n').filter((l) => l.trim() && l.trim().split(/\s+/).length <= 6 && !/[.!?]$/.test(l.trim())).length;
      add(heads >= 2 ? 'ok' : 'warn', heads >= 2 ? `${heads} subheading lines detected.` : 'Add short subheadings (Introduction, Findings, Recommendations).');
      add(/recommend/i.test(text) ? 'ok' : 'warn', /recommend/i.test(text) ? 'Recommendations included.' : 'No recommendation found: reports must end with actionable recommendations.');
    } else {
      const c = /(in conclusion|to conclude|on balance|overall|all things considered)/i.test(text);
      add(c ? 'ok' : 'warn', c ? 'Conclusion signal found.' : 'Conclusion signal missing ("On balance, …").');
      const k = /(although|while|admittedly|however|on the other hand|nevertheless)/i.test(text);
      add(k ? 'ok' : 'warn', k ? 'Counter-argument / concession present.' : 'Add a concession to balance the argument.');
    }
  } else {
    add(contractions.length > 3 ? 'warn' : 'ok', `${contractions.length} contraction(s): ${contractions.length > 3 ? 'semi-formal style allows a few, but keep it controlled.' : 'appropriate for semi-formal style.'}`);
    const first = text.trim().split('\n')[0] || '';
    if (g === 'Article') {
      const t = first && first.split(/\s+/).length <= 10 && !/[.]$/.test(first.trim());
      add(t ? 'ok' : 'warn', t ? 'Catchy title line detected.' : 'Start with a short, catchy title.');
      add(/\?/.test(text) ? 'ok' : 'warn', /\?/.test(text) ? 'Rhetorical question hooks the reader.' : 'Add a rhetorical question to engage readers.');
    } else {
      const r = /(recommend|must-see|worth|unmissable|give it a miss|should (?:definitely )?(?:see|visit|read|try))/i.test(text);
      add(r ? 'ok' : 'warn', r ? 'Justified recommendation found.' : 'End with a clear, justified recommendation.');
      const evals = lower.match(/\b(breathtaking|captivating|gripping|stunning|disappointing|mediocre|outstanding|exceptional|thought-provoking|unforgettable|lacklustre|remarkable|superb|dull)\b/g) || [];
      add(evals.length >= 2 ? 'ok' : 'warn', evals.length >= 2 ? `Evaluative adjectives: ${[...new Set(evals)].join(', ')}.` : 'Use rich evaluative adjectives (gripping, lacklustre, thought-provoking).');
    }
  }
  return { words, out };
}

function RubricsTab({ s, mode, notify }) {
  const [genre, setGenre] = useState('Email'); const [draft, setDraft] = useState(''); const [c, setC] = useState(5); const [l, setL] = useState(6);
  const [sp, setSp] = useState({ p3g: 0, p3v: 0, p3d: 0, p3p: 0 });
  useEffect(() => { setSp({ p3g: s.comps.find((x) => x.id === 'p3g').raw, p3v: s.comps.find((x) => x.id === 'p3v').raw, p3d: s.comps.find((x) => x.id === 'p3d').raw, p3p: s.comps.find((x) => x.id === 'p3p').raw }); }, [s.name]); // eslint-disable-line react-hooks/exhaustive-deps
  const [card, setCard] = useState(0); const [phase, setPhase] = useState('idle'); const [left, setLeft] = useState(60); const [run, setRun] = useState(false);
  useEffect(() => { if (!run) return undefined; const id = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000); return () => clearInterval(id); }, [run]);
  useEffect(() => {
    if (!run || left > 0) return;
    if (phase === 'prep') { setPhase('talk'); setLeft(180); notify('Preparation over. Start your short talk now.'); }
    else if (phase === 'talk') { setRun(false); setPhase('done'); notify('3 minutes up. Time for the Part 3 discussion.'); }
  }, [left, run, phase, notify]);
  const { words, out } = useMemo(() => analyseDraft(draft, genre), [draft, genre]);
  const cBand = c >= 6 ? 5 : c >= 5 ? 4 : c >= 3 ? 3 : c >= 2 ? 2 : c >= 1 ? 1 : 0;
  const lBand = l >= 8 ? 5 : l >= 6 ? 4 : l >= 4 ? 3 : l >= 2 ? 2 : l >= 1 ? 1 : 0;
  const per = WEIGHTS[mode].p1[1] / 60;
  const spTotal = Object.values(sp).reduce((a, b) => a + b, 0);
  const cd = MC.cards[card % MC.cards.length];
  const total = phase === 'talk' ? 180 : 60; const circ = 2 * Math.PI * 52;
  const fmt = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
  return (
    <div className="flex flex-col gap-4">
      <Card title="Live Cambridge writing grader" icon={PenLine} note="Choose the task, paste a draft for instant analysis, then set Content and Language marks against the band descriptors.">
        <div className="flex flex-wrap gap-1.5 mb-3">{['Email', 'Article', 'Report', 'Review', 'Essay'].map((g) => <Chip key={g} on={genre === g} onClick={() => setGenre(g)}>{g === 'Email' ? 'Ex 5 · Email' : `Ex 6 · ${g}`}</Chip>)}</div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Paste or type Mahmoud's 120–160 word draft here…" className="w-full min-h-[15rem] border rounded-lg p-3 text-sm" />
            <WordGauge words={words} />
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            {out.map(([st, msg], i) => (
              <div key={i} className="flex gap-2 items-start border rounded-lg bg-slate-50 px-2.5 py-1.5">
                {st === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : st === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}<span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
          <div>
            <label className="block text-xs mb-2">Content <b>{c}</b>/6<input type="range" min="0" max="6" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-emerald-600" /></label>
            <label className="block text-xs mb-2">Language <b>{l}</b>/9<input type="range" min="0" max="9" value={l} onChange={(e) => setL(Number(e.target.value))} className="w-full accent-emerald-600" /></label>
            <div className="border rounded-lg bg-slate-50 p-3 text-xs">
              <div className="font-serif text-3xl">{c + l} / 15</div>
              <div>{genre} · Content band {cBand} · Language band {lBand} · {c + l >= 14 ? 'A* standard' : c + l >= 12 ? 'Grade A standard' : c + l >= 10 ? 'Grade B standard' : 'Below Grade B'}</div>
              <div className="text-slate-500 mt-1">Each writing mark is worth {f1(per)} weighted % in {mode}. Moving to 15 adds {f1((15 - c - l) * per)} pts.</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="text-slate-500">Band descriptors (paraphrased from the Cambridge mark scheme)</div>
            {MC.writingBands.map((b) => {
              const on = b.band === cBand || b.band === lBand; const tags = [b.band === cBand && 'Content', b.band === lBand && 'Language'].filter(Boolean);
              return (
                <div key={b.band} className={`border rounded-lg px-2.5 py-1.5 ${on ? 'border-emerald-600 shadow-[inset_4px_0_0_#059669] text-slate-900' : 'text-slate-500'}`}>
                  <b>Band {b.band}{tags.length ? ` ← ${tags.join(' & ')}` : ''}</b><div>Content: {b.content}</div><div>Language: {b.language}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card title="Live Cambridge speaking grader" icon={Mic} note="Four analytical criteria, 10 marks each (Level 5 = 9–10). Starts from the selected checkpoint.">
          {[['p3g', 'Grammar (S2)'], ['p3v', 'Vocabulary (S2)'], ['p3d', 'Development (S1, S3)'], ['p3p', 'Pronunciation (S4)']].map(([k, name]) => {
            const v = sp[k]; const lvl = Math.ceil(v / 2);
            return (
              <label key={k} className="block text-xs mb-3">{name} <b>{v}</b>/10
                <input type="range" min="0" max="10" value={v} onChange={(e) => setSp({ ...sp, [k]: Number(e.target.value) })} className="w-full accent-emerald-600" />
                <span className="text-[11px] text-slate-500">{lvl ? `Level ${lvl}: ${MC.speakingBands[k][lvl - 1]}` : 'Level 0: no rewardable language.'}</span>
              </label>
            );
          })}
          <div className="border rounded-lg bg-slate-50 p-3 text-xs">
            <div className="font-serif text-3xl">{spTotal} / 40</div>
            <div>0511: contributes {f1(spTotal / 40 * 25)} of 25 weighted pts · 0510: Speaking Endorsement Grade {endorseLabel[endorseOf(spTotal)]}</div>
            <div className="text-slate-500 mt-1">{spTotal >= 36 ? 'A* speaking standard (≥90%).' : `${36 - spTotal} more mark(s) for 36/40.`}</div>
          </div>
        </Card>
        <Card title="Part 2 card generator & 60-second prep" icon={Clock} note="No written notes allowed: plan in your head only.">
          <div className="border-2 border-indigo-900 rounded-lg p-3 text-xs bg-slate-50">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Theme: {cd.theme}</div>
            <h3 className="text-sm font-semibold mb-1">{cd.title}</h3>
            <div className="text-[11px] uppercase tracking-wide text-slate-500 mt-2">Part 1 · Interview (2–3 min)</div><ul className="list-disc pl-4">{cd.p1.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="text-[11px] uppercase tracking-wide text-slate-500 mt-2">Part 2 · Short talk (talk about…)</div><ul className="list-disc pl-4">{cd.p2.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="text-[11px] uppercase tracking-wide text-slate-500 mt-2">Part 3 · Discussion (abstract)</div><ul className="list-disc pl-4">{cd.p3.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="relative w-[120px] h-[120px] mx-auto mt-4">
            <svg viewBox="0 0 120 120" width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={phase === 'talk' ? '#312e81' : '#059669'} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - left / total)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl tabular-nums">{phase === 'talk' ? fmt(left) : left}</div>
          </div>
          <div className="text-xs text-slate-500 text-center mt-2">
            {phase === 'idle' ? 'Press start for 60 seconds of silent preparation.' : phase === 'prep' ? 'Silent preparation: plan an opening, 5 prompts in order and a closing line. No writing.' : phase === 'talk' ? 'Talk now: cover every prompt; aim for 2–3 minutes.' : 'Talk complete. Move to the Part 3 discussion questions.'}
          </div>
          <div className="flex gap-2 justify-center mt-3">
            <Btn primary onClick={() => { if (phase === 'idle' || phase === 'done') { setPhase('prep'); setLeft(60); setRun(true); } else setRun(!run); }}>
              {run ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{phase === 'prep' || phase === 'talk' ? (run ? 'Pause' : 'Resume') : 'Start 60s prep'}
            </Btn>
            <Btn onClick={() => { setRun(false); setPhase('idle'); setLeft(60); setCard((card + 1 + Math.floor(Math.random() * (MC.cards.length - 1))) % MC.cards.length); }}><Shuffle className="w-3.5 h-3.5" />New card</Btn>
            <Btn onClick={() => { setRun(false); setPhase('idle'); setLeft(60); }}><RotateCcw className="w-3.5 h-3.5" />Reset</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 6: A* gap simulator
// ---------------------------------------------------------------------------
function SimulatorTab({ s, mode }) {
  const [sim, setSim] = useState({ p1: s.p1, p2: s.p2, p3: s.p3 });
  useEffect(() => { setSim({ p1: s.p1, p2: s.p2, p3: s.p3 }); }, [s.name, s.p1, s.p2, s.p3]);
  const W = WEIGHTS[mode];
  const w = r1(sim.p1 / 60 * W.p1[1] + sim.p2 / 40 * W.p2[1] + sim.p3 / 40 * W.p3[1]);
  const g = gapFor({ ...sim, weighted: w }, mode); const d = w - s.weighted;
  const rows = [['Paper 1 · Reading & Writing', '2 hours', 60, W.p1[1]], ['Paper 2 · Listening', '~50 min (incl. 6-min transfer)', 40, W.p2[1]], ['Paper 3 · Speaking', '10–15 min', 40, W.p3[1]]].sort((a, b) => b[3] / b[2] - a[3] / a[2]);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card title="What-if A* gap simulator" icon={Gauge} note="Starts from the selected checkpoint. Drag a paper's raw marks to see the grade move.">
          {[['p1', 'Paper 1 · Reading & Writing', 60], ['p2', 'Paper 2 · Listening', 40], ['p3', 'Paper 3 · Speaking', 40]].map(([k, n, max]) => (
            <label key={k} className="block text-xs mb-3">{n} <b>{sim[k]}</b>/{max}<input type="range" min="0" max={max} value={sim[k]} onChange={(e) => setSim({ ...sim, [k]: Number(e.target.value) })} className="w-full accent-emerald-600" /></label>
          ))}
          <Btn onClick={() => setSim({ p1: s.p1, p2: s.p2, p3: s.p3 })}><RotateCcw className="w-3.5 h-3.5" />Reset to checkpoint</Btn>
        </Card>
        <Card title="Projected outcome" icon={Award}>
          <div className="font-serif text-5xl tabular-nums">{f1(w)}% · {gradeOf(w)}</div>
          <div className="my-3"><Meter tall pct={w} color={STATUS_HEX[status(w)]} goal={88} /></div>
          <div className="text-sm">{w >= A_STAR ? `A* reached with ${f1(w - A_STAR)} pts margin.` : g.reachable ? `Still ${f1(A_STAR - w)} pts short: the fastest route is ${g.plan.map((x) => `+${x.take} on ${PAPER_NAME[x.p]}`).join(', ')} (${g.marks} raw marks).` : 'A* is not reachable from these papers alone.'}</div>
          {mode === '0510' && <div className="text-sm mt-1">Speaking endorsement (separate certificate line): Grade {endorseLabel[endorseOf(sim.p3)]}.</div>}
          <div className="text-xs text-slate-500 mt-1">{d >= 0 ? '+' : '−'}{f1(Math.abs(d))} pts vs "{s.name}" ({f1(s.weighted)}%).</div>
          <div className="text-xs text-slate-500 mt-1">Grade boundaries here are fixed planning thresholds (A* ≥88%); real Cambridge thresholds move slightly each series.</div>
        </Card>
      </div>
      <Card title="Exam blueprint & mark value" icon={GraduationCap} note="What one raw mark is worth in each paper under the current mode: the cheapest marks to win come first.">
        <table className="w-full text-xs">
          <thead><tr className="text-left text-slate-500 border-b"><th className="py-1">Paper</th><th>Timing</th><th className="text-right">Raw</th><th className="text-right">Weighting</th><th className="text-right">% per raw mark</th></tr></thead>
          <tbody>{rows.map(([p, t, raw, wt]) => <tr key={p} className="border-b border-slate-100"><td className="py-1.5">{p}</td><td>{t}</td><td className="text-right">{raw}</td><td className="text-right">{wt ? `${wt}%` : 'Endorsed'}</td><td className="text-right">{wt ? f1(wt / raw) : '—'}</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const TABS = [
  ['diagnostic', '360° Diagnostic', Target], ['logger', 'Score Logger & Quiz', ClipboardList], ['plan', '12-Week Plan', CalendarDays],
  ['materials', 'Materials Hub', Library], ['rubrics', 'Writing & Speaking Graders', PenLine], ['simulator', 'A* Gap Simulator', Gauge]
];

export default function App() {
  const [mode, setMode] = useStoredState('mode', '0511');
  const [checkpoints, setCheckpoints] = useStoredState('checkpoints', DEFAULT_CHECKPOINTS);
  const [current, setCurrent] = useStoredState('current', 'Initial Placement Test');
  const [checks, setChecks] = useStoredState('checks', {});
  const [materials, setMaterials] = useStoredState('materials', { units: {}, unitDone: {}, pp: {}, specs: {} });
  const [tab, setTab] = useState('diagnostic');
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((msg, warn) => { setToast({ msg, warn }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3800); }, []);

  const sorted = useMemo(() => [...checkpoints].sort((a, b) => a.order - b.order), [checkpoints]);
  const cur = sorted.find((c) => c.checkpoint === current) || sorted[0];
  const s = useMemo(() => score(cur, mode), [cur, mode]);
  const base = useMemo(() => score(sorted[0], mode), [sorted, mode]);
  const gap = gapFor(s, mode);
  const weakest = [...s.comps].sort((a, b) => a.pct - b.pct).slice(0, 3).map((c) => c.short);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-gradient-to-br from-[#0f172a] to-[#312e81] text-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest opacity-75 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />Cambridge IGCSE ESL · 0510 / 0511 (9–1: 0993 / 0991)</div>
              <h1 className="font-serif text-2xl sm:text-3xl mt-1">Mahmoud's A* Command Center</h1>
              <p className="text-sm opacity-90 max-w-2xl mt-1">
                {s.weighted >= A_STAR ? `At "${s.name}" Mahmoud scores ${f1(s.weighted)}% (${s.grade}, CEFR ${s.cefr}): A* secured; protect it by keeping ${weakest.join(', ')} above 88%.`
                  : `At "${s.name}" Mahmoud scores ${f1(s.weighted)}% (${s.grade}, CEFR ${s.cefr}), ${f1(A_STAR - s.weighted)} pts from A*. Fastest gains: ${weakest.join(', ')}.`}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <div className="inline-flex rounded-lg bg-white/10 border border-white/20 p-0.5">
                {[['0511', '0511 Count-in Speaking'], ['0510', '0510 Speaking Endorsement']].map(([m, l]) => (
                  <button type="button" key={m} onClick={() => setMode(m)} className={`text-xs px-3 py-1.5 rounded-md ${mode === m ? 'bg-emerald-600 text-white' : 'text-slate-200'}`}>{l}</button>
                ))}
              </div>
              <label className="text-xs flex items-center gap-2">Checkpoint
                <select value={cur.checkpoint} onChange={(e) => setCurrent(e.target.value)} className="bg-slate-900/60 border border-white/30 rounded-lg px-2 py-1 text-sm text-slate-50 max-w-[16rem]">
                  {sorted.map((c) => <option key={c.checkpoint} value={c.checkpoint}>{c.checkpoint}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
            {[
              ['Weighted score', `${f1(s.weighted)}%`], ['CEFR band', s.cefr], ['Projected grade', s.grade],
              [`Raw marks needed for A*${gap.plan.length ? ` (${gap.plan.map((x) => `${PAPER_NAME[x.p].replace('Paper ', 'P')} +${x.take}`).join(', ')})` : ''}`, gap.marks === 0 ? 'Secured ✓' : gap.reachable ? `+${gap.marks} raw` : 'Out of reach'],
              ...(mode === '0510' ? [['Speaking endorsement', `Grade ${s.endorse}`]] : [])
            ].map(([l, v]) => (
              <div key={l} className="bg-white/10 border border-white/15 rounded-lg px-3 py-2">
                <div className="text-[11px] opacity-80">{l}</div>
                <div className={`font-serif text-2xl tabular-nums ${v === 'A*' ? 'text-emerald-300' : ''}`}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </header>
      <nav className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto" role="tablist">
          {TABS.map(([id, label, Icon], i) => (
            <button type="button" role="tab" aria-selected={tab === id} key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-sm px-3 py-2.5 border-b-[3px] ${tab === id ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent text-slate-500'}`}>
              <Icon className="w-4 h-4" />{i + 1} · {label}
            </button>
          ))}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-5">
        {tab === 'diagnostic' && <DiagnosticTab s={s} base={base} mode={mode} />}
        {tab === 'logger' && <LoggerTab checkpoints={sorted} setCheckpoints={setCheckpoints} current={cur.checkpoint} setCurrent={setCurrent} mode={mode} notify={notify} />}
        {tab === 'plan' && <PlanTab s={s} mode={mode} checks={checks} setChecks={setChecks} notify={notify} />}
        {tab === 'materials' && <MaterialsTab store={materials} setStore={setMaterials} notify={notify} />}
        {tab === 'rubrics' && <RubricsTab s={s} mode={mode} notify={notify} />}
        {tab === 'simulator' && <SimulatorTab s={s} mode={mode} />}
      </main>
      <Toast toast={toast} />
    </div>
  );
}
