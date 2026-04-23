export interface FlashCard {
  t: string;
  p: string;
  au: string;
  reflect: string;
}

export interface Module {
  title: string;
  label: string;
  desc: string;
  relatedPractice: string;
  cards: FlashCard[];
}

export interface PracticeItem {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  sourceLabel: string;
  postText: string;
  contextText: string;
  q1: string;
  q1Options: string[];
  q1Correct: number;
  q2Question: string;
  q2Options: string[];
  q2Correct: string;
  q2Verdict: string;
  explanation: string;
  tactic: string;
  reference: string;
  event: string;
}

export interface AssessItem {
  pairId: string;
  skill: string;
  difficulty: string;
  sourceLabel: string;
  postText: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AssessSection {
  title: string;
  intro: string;
  scoreField: string;
  completionLabel: string;
  items: AssessItem[];
}

export const moduleData: Module[] = [
  {
    title: 'Claim Identification',
    label: 'Mechanism 01',
    desc: 'Extracting verifiable statements from political noise.',
    relatedPractice: 'scenario-01',
    cards: [
      { t: 'What is a claim?', p: 'A claim is a statement that can be checked with evidence. It says that something happened, is true, or will happen.', au: '"The AEC uses erasable pencils" is a claim because it can be checked against official guidance and observation.', reflect: 'Ask: what exact statement can be verified here?' },
      { t: 'Why identify claims first?', p: 'Political content often mixes opinion, accusation, and fact-like language. Claim identification helps you isolate what needs evidence.', au: '"They are stealing your vote" contains a fear appeal, but the checkable part is whether vote tampering is occurring.', reflect: 'Separate emotional language from the statement that can actually be tested.' },
      { t: 'Claim vs opinion', p: 'Opinions express judgement or feeling. Claims assert something factual about the world.', au: '"I do not trust the result" is opinion. "Votes were altered in Queensland booths" is a claim.', reflect: 'Not every sentence in a post should be treated as evidence-based.' },
      { t: 'Where claims appear', p: 'Claims can appear in headlines, captions, memes, comments, rumours, and quoted "insider" language.', au: 'Australian election rumours often use short captions or screenshots to disguise a bold claim.', reflect: 'Always identify the core statement before deciding whether it is true or false.' },
      { t: 'Ready to apply it?', p: 'In practice, you will read a realistic post and identify the main claim before judging whether it is true, false, misleading, or unsupported.', au: 'The Queensland "disappearing ink" scenario is a strong first example.', reflect: 'Next step: apply the concept, not just memorise the definition.' }
    ]
  },
  {
    title: 'False Authority',
    label: 'Tactic 01',
    desc: 'Analyzing expert endorsements and fake credentials.',
    relatedPractice: 'scenario-02',
    cards: [
      { t: 'What is false authority?', p: 'False authority uses vague experts, insiders, or unnamed professionals to make weak claims sound credible.', au: '"Independent election experts confirm..." is persuasive wording if no names or reports are provided.', reflect: 'Authority language is not the same as evidence.' },
      { t: 'Why it works', p: 'People often trust confidence and expertise cues before checking whether the source is verifiable.', au: 'Election rumours often rely on claims like "a friend in the AEC told me..." to create trust.', reflect: 'Ask: who is speaking, and can they actually be verified?' },
      { t: 'Warning signs', p: 'Look for "experts say," "officials admit," or "insiders reveal" without names, documents, or clear attribution.', au: 'Anonymous authority claims spread quickly during election periods because they sound urgent and privileged.', reflect: 'Vague sources should lower confidence, not raise it.' },
      { t: 'How to respond', p: 'Return to the claim itself. Ask what concrete evidence supports it, not who allegedly said it.', au: 'If the post only cites unnamed experts, the claim may be unsupported or misleading.', reflect: 'Move from who is talking to what can actually be checked.' },
      { t: 'Ready to apply it?', p: 'The related scenario asks you to evaluate a post that relies on unnamed authorities to question an election process.', au: 'Use the post itself to distinguish source credibility from claim evidence.', reflect: 'You are now looking for both the claim and the source weakness.' }
    ]
  },
  {
    title: 'Emotional Framing',
    label: 'Tactic 02',
    desc: 'How anger and fear are used to bypass critical thinking.',
    relatedPractice: 'scenario-03',
    cards: [
      { t: 'What is emotional framing?', p: 'Emotional framing uses fear, outrage, or urgency to make a claim feel believable before it is examined.', au: '"Do not let them steal your future" may trigger fear even if the supporting evidence is weak.', reflect: 'Strong emotion is a cue to slow down, not speed up.' },
      { t: 'Why it matters', p: 'Emotion can narrow attention and make users focus on threat rather than evidence quality.', au: 'Election-related misinformation often uses panic language because it encourages sharing.', reflect: 'The louder the emotional tone, the more carefully you should identify the claim.' },
      { t: 'Warning signs', p: 'Look for words like "urgent," "before it is too late," "they are hiding the truth," or "you are being betrayed."', au: 'Posts about election integrity frequently use crisis framing to create a sense of emergency.', reflect: 'Emotion may be the delivery method, but you still need to test the factual claim.' },
      { t: 'How to respond', p: 'After noticing emotional framing, ask what evidence is actually provided and whether the claim is specific enough to verify.', au: 'A dramatic post without sources may still contain a weak or unsupported claim.', reflect: 'Do not let the emotional tone do the evidential work.' },
      { t: 'Ready to apply it?', p: 'The related scenario asks you to identify both the claim and the emotional technique used to pressure the reader.', au: 'This mirrors the type of content users may encounter during Australian election discourse.', reflect: 'Try to separate the tactic from the truth status of the claim.' }
    ]
  },
  {
    title: 'Selective Evidence',
    label: 'Tactic 03',
    desc: 'Spotting cherry-picked data in election debates.',
    relatedPractice: 'scenario-04',
    cards: [
      { t: 'What is selective evidence?', p: 'Selective evidence presents only the details that support one side while hiding details that would weaken the conclusion.', au: 'One delayed polling station does not prove that the whole election process is compromised.', reflect: 'Ask what is missing, not just what is shown.' },
      { t: 'Why it misleads', p: 'A partly true example can be used to support a broad and inaccurate claim.', au: 'A real administrative issue may be exaggerated into "the election is rigged."', reflect: 'A factual detail can still be part of a misleading narrative.' },
      { t: 'Common pattern', p: 'Cherry-picked examples often move from one anecdote to a sweeping conclusion.', au: 'A post may cite one vote-counting delay and use it as proof of national manipulation.', reflect: 'One example is not the same as a representative pattern.' },
      { t: 'How to respond', p: 'Check whether broader context, comparative data, or alternative explanations are missing.', au: 'The AEC may have already explained a delay or irregularity, which changes the interpretation.', reflect: 'Context often changes the meaning of an example.' },
      { t: 'Ready to apply it?', p: 'The related scenario asks you to judge whether a claim is based on a representative pattern or cherry-picked evidence.', au: 'This is useful for reading election debates and policy commentary.', reflect: 'Look for the leap from a small detail to a big conclusion.' }
    ]
  },
  {
    title: 'Misleading Statistics',
    label: 'Mechanism 02',
    desc: 'Identifying manipulated graphs and polling data.',
    relatedPractice: 'scenario-05',
    cards: [
      { t: 'What are misleading statistics?', p: 'Statistics can be framed, scaled, or selected in ways that exaggerate or distort what the data actually means.', au: 'Polling numbers can look dramatic when time frames, sample sizes, or sources are unclear.', reflect: 'Always ask what the number measures and where it came from.' },
      { t: 'Denominator problems', p: 'Percentages are difficult to judge if the total group or comparison baseline is hidden.', au: '"Support doubled" may sound dramatic without showing whether it moved from 2% to 4% or 20% to 40%.', reflect: 'Percentages without base values can mislead easily.' },
      { t: 'Graph tricks', p: 'Graphs can distort reality through cropped axes, missing labels, or selective time frames.', au: 'A chart about election polling can imply a huge collapse if the axis is compressed.', reflect: 'Visual confidence does not guarantee statistical honesty.' },
      { t: 'Source and method checks', p: 'Always ask who produced the statistic, when it was collected, and how the sample was constructed.', au: 'Polling claims without source names or methodology should be treated cautiously.', reflect: 'No source, no method, no confidence.' },
      { t: 'Ready to apply it?', p: 'The related scenario asks you to judge whether a political statistic is informative, misleading, or unsupported.', au: 'This reflects how election narratives often use numbers as persuasion tools.', reflect: 'You are testing the presentation of the number, not just the number itself.' }
    ]
  }
];

export const misinfoThisWeekItem: PracticeItem = {
  id: 'misinfo-week',
  label: 'Misinfo This Week',
  title: 'The "Pencil-Gate" Theory',
  subtitle: 'Mechanism: Claim Identification | Target: Queensland Booths',
  sourceLabel: 'Source: Facebook Post',
  postText: '<strong>@AU_Voter</strong>: "Watch out! I heard they are using special pencils at polling booths in Queensland so your vote can be rubbed out later. Don\'t let them steal your vote! #Election2026"',
  contextText: 'This post spreads distrust by implying that ordinary election materials are part of a hidden manipulation scheme. The core task is to isolate the checkable claim and judge whether the post provides real evidence.',
  q1: 'Which part of this post is the main verifiable claim?',
  q1Options: ['The message sounds urgent and suspicious.', 'Special pencils are being used so votes can be rubbed out later.', 'People should be worried about Election 2026.'],
  q1Correct: 1,
  q2Question: 'How would you judge this claim based on the evidence shown in the post?',
  q2Options: ['True', 'False', 'Misleading', 'Unsupported'],
  q2Correct: 'Unsupported',
  q2Verdict: 'Unsupported',
  explanation: 'The post makes a serious accusation about vote tampering but gives no verifiable evidence, official source, or documented incident. It relies on suspicion and urgency rather than proof.',
  tactic: 'Claim identification + emotional framing',
  reference: 'Use official election guidance and credible evidence before accepting claims about voting materials or vote manipulation.',
  event: 'Any Federal Election'
};

export const practiceItems: PracticeItem[] = [
  {
    id: "content-01",
    label: "Content 01",
    title: "Labor will introduce a 'Death Tax' or inherited tax…",
    subtitle: "Mechanism: Exaggerated policies | Target: 2019 Federal Election",
    sourceLabel: "Source: TikTok Post",
    postText: "<strong>@Emma</strong>: \"Labor will introduce a 'Death Tax' or inherited tax on family homes and pensions if elected.\"",
    contextText: "Emma is browsing TikTok in the lead-up period to the 2019 federal election when she comes across a really emotional video including depressing music and pictures of elderly people losing their houses. According to the video, a new \"death tax\" that would seize up to 40% of family inheritances would be implemented by a Labor government.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Labor will introduce a 'Death Tax' or inherited tax on family homes and pensions if elected.", "This discussion is about 2019 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "Over 1 million people viewed the \"Death Tax\" misinformation campaign on Facebook and Youtube. The video used emotional music and imagery to spread a false claim that had no basis in Labor's actual policies. Identify the difference between policy criticism and outright fabrication.",
    tactic: "Exaggerated policies, viral memes, videos, and emotional manipulation (fear of losing family assets).",
    reference: "Warren (2020) 'Fake News Case Study during the Australian 2019 General Election'; AEC reports on 2019 election misinformation",
    event: "2019 Federal Election"
  },
  {
    id: "content-02",
    label: "Content 02",
    title: "Votes are being thrown away, according to a photo…",
    subtitle: "Mechanism: Photoshopped or fabricated evidence | Target: 2022 Federal Election",
    sourceLabel: "Source: Facebook Post",
    postText: "<strong>@Robert_a</strong>: \"Votes are being thrown away, according to a photo of ballot papers dumped in bins in Port Macquarie.\"",
    contextText: "Robert comes upon a friend's Facebook post that features green papers in a container marked \"discarded ballot papers.\" In reality, the picture was not from a real voting site and included photocopies (the incorrect shade of green). This visual \"evidence\" supports a narrative of vote destruction.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Votes are being thrown away, according to a photo of ballot papers dumped in bins in Port Macquarie.", "This discussion is about 2022 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The AEC 2022 Disinformation Register showed the image contained photocopies rather than actual ballots. The incorrect shade of green gave it away. Verify photos before sharing and check official sources for context.",
    tactic: "Photoshopped or fabricated evidence, vote integrity conspiracies, and visual manipulation",
    reference: "AEC Disinformation Register 2022.",
    event: "2022 Federal Election"
  },
  {
    id: "content-03",
    label: "Content 03",
    title: "#VoteOften - you can vote multiple times in the referendum…",
    subtitle: "Mechanism: Election fraud conspiracy | Target: 2023 Voice Referendum",
    sourceLabel: "Source: Instagram Post",
    postText: "<strong>@Priya_a</strong>: \"#VoteOften - you can vote multiple times in the referendum.\"",
    contextText: "#VoteOften – you can vote multiple times to make your voice heard! Priya receives this on WhatsApp in her mother's group. She briefly contemplates getting a friend to vote for her. The assertion is false: repeated voting is traceable and punishable.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "#VoteOften - you can vote multiple times in the referendum.", "This discussion is about 2023 Voice Referendum."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "During the 2023 Voice referendum, the hashtag #voteoften went viral (AEC was tagged in more than 100,000 postings). Multiple voting is illegal and traceable through roll-marking systems. The AEC actively monitors and prosecutes repeat voting.",
    tactic: "Election fraud conspiracy, reducing voting confidence in the AEC, and a call to action",
    reference: "AEC Referendum Disinformation Register 2023; Carson et al. (2025).",
    event: "2023 Voice Referendum"
  },
  {
    id: "content-04",
    label: "Content 04",
    title: "The AEC is using rigged vote-counting software outsourced overseas…",
    subtitle: "Mechanism: Foreign interference narrative | Target: 2025 Federal Election",
    sourceLabel: "Source: LinkedIn Post",
    postText: "<strong>@Ahmed</strong>: \"The AEC is using rigged/compromised vote-counting software outsourced overseas (like Dominion in the US).\"",
    contextText: "Ahmed sees a LinkedIn post alleging that the AEC secretly utilizes hackable overseas software, comparable to US issues. As an IT specialist, he starts to question the entire system. In reality, Australia relies on manual counting with scrutineers.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "The AEC is using rigged/compromised vote-counting software outsourced overseas (like Dominion in the US).", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The 2022 and 2025 AEC registers contained claims about outsourced or compromised software. Australia does not use electronic vote counting — ballots are counted manually by AEC officials with party scrutineers present. This imports a US-specific conspiracy that doesn't apply to Australia.",
    tactic: "Foreign interference narrative, technical-sounding lies, import of overseas conspiracies",
    reference: "AEC Disinformation Register 2025.",
    event: "2025 Federal Election"
  },
  {
    id: "content-05",
    label: "Content 05",
    title: "Labor's changes to franking credits will destroy retirees' pensions…",
    subtitle: "Mechanism: Policy misrepresentation | Target: 2019 Federal Election",
    sourceLabel: "Source: Talkback Radio Clip",
    postText: "<strong>@David_a</strong>: \"Labor's changes to franking credits will destroy retirees' pensions – it's a retirement tax.\"",
    contextText: "On talkback radio, David hears that Labor's agenda will eliminate his farm inheritance and pension. The claim turns an adjustment to franking credits into an outright attack on retirees. It made him less likely to vote in a rural area.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Labor's changes to franking credits will destroy retirees' pensions – it's a retirement tax.", "This discussion is about 2019 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "The franking credit refund policy affected some self-funded retirees but the claim exaggerated its impact as a \"retirement tax\" that would destroy pensions. The actual policy was a change to cash refunds on unused tax credits, not a destruction of pensions.",
    tactic: "Policy misrepresentation, emotional appeals to financial fear, rural voter targeting",
    reference: "AEC Disinformation Register 2019; Warren (2020)",
    event: "2019 Federal Election"
  },
  {
    id: "content-06",
    label: "Content 06",
    title: "AEC pencils allow votes to be erased and changed…",
    subtitle: "Mechanism: Conspiracy involving voting materials | Target: Any Federal Election",
    sourceLabel: "Source: Facebook Post",
    postText: "<strong>@Harold</strong>: \"Pencils provided by AEC allow officials to erase and change your vote later.\"",
    contextText: "Harold comes across a Facebook post asserting that AEC pencils permit vote rigging. Using a pencil at the polling place makes him uncomfortable. Pencils are used all over the world because they are practical, and ballots are monitored with scrutineers present.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Pencils provided by AEC allow officials to erase and change your vote later.", "This discussion is about Any Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The AEC 2023 Voice referendum disinformation register noted this claim. Pencils are used because they are practical (voters may make mistakes), and ballots are monitored by scrutineers from multiple parties who can object to any irregularities. Altering ballots would require mass conspiracy by many individuals.",
    tactic: "Conspiracy involving actual voting items, affecting the integrity of polling places",
    reference: "AEC Disinformation Register 2023",
    event: "Any Federal Election"
  },
  {
    id: "content-07",
    label: "Content 07",
    title: "Six million ballots went missing and weren't counted…",
    subtitle: "Mechanism: Misinterpretation of progressive count | Target: 2025 Federal Election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Sarah</strong>: \"Six million ballots went missing and weren't counted in the 2025 election.\"",
    contextText: "Sarah notices posts in her local group during the progressive count that say millions of votes were lost. She thinks the election is rigged and becomes terrified. Votes are counted gradually rather than all at once after polls close.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Six million ballots went missing and weren't counted in the 2025 election.", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "AEC 2025 Disinformation Register explicitly addressed claims about missing ballots. The progressive count means votes trickle in over hours and days after polls close — postal and absentee votes take longer. The \"missing\" ballots were simply not yet counted, not lost.",
    tactic: "Misinterpretation of progressive tally data, increased conspiracy on social media",
    reference: "AEC Disinformation Register 2025.",
    event: "2025 Federal Election"
  },
  {
    id: "content-08",
    label: "Content 08",
    title: "Your vote for a minor party or independent will be wasted…",
    subtitle: "Mechanism: Misrepresenting preferential voting | Target: 2022 Federal Election",
    sourceLabel: "Source: Instagram Post",
    postText: "<strong>@Sophia</strong>: \"Your vote for a minor party or independent will be wasted / ignored in preferences.\"",
    contextText: "Sophia comes across Instagram stories claiming that voting for the Greens or a teal independent is useless because their preferences would be disregarded. In reality, Australia's complete preferential voting system guarantees that all official votes are counted.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Your vote for a minor party or independent will be wasted / ignored in preferences.", "This discussion is about 2022 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "Australia's preferential (instant-runoff) voting system means every vote flows through preferences until a winner is determined. No vote is \"wasted\" — preferences from minor parties flow to major parties. This claim discourages people from voting for their genuine first choice.",
    tactic: "Misrepresenting the preferential voting mechanism and discouraging support for minor parties",
    reference: "AEC voter education materials on preferential voting",
    event: "2022 Federal Election"
  },
  {
    id: "content-09",
    label: "Content 09",
    title: "The Voice is a secret land grab by globalists/elites…",
    subtitle: "Mechanism: Conspiracy framing | Target: 2023 Voice Referendum",
    sourceLabel: "Source: Facebook Post",
    postText: "<strong>@Aunty_Joan</strong>: \"The Voice is a secret land grab by globalists/elites that will divide Australia.\"",
    contextText: "Aunty Joan hears rumors that voting \"yes\" will result in more division and land loss. There was no land grab involved in the proposal — it was simply to create an advisory board for Indigenous voices in parliament.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "The Voice is a secret land grab by globalists/elites that will divide Australia.", "This discussion is about 2023 Voice Referendum."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The Voice to Parliament proposal was an advisory body with no land acquisition powers, no veto rights, and no legal authority over government decisions. Claims about land grabs and globalists were conspiracy theories unsupported by the actual constitutional text.",
    tactic: "Conspiracy framing, sovereignty denial, emotionally charged \"division\" narrative.",
    reference: "Carson et al. (2025); AEC Referendum Disinformation Register 2023",
    event: "2023 Voice Referendum"
  },
  {
    id: "content-10",
    label: "Content 10",
    title: "A tick counts as Yes but a cross is informal…",
    subtitle: "Mechanism: Procedural confusion | Target: 2023 Voice Referendum",
    sourceLabel: "Source: Talkback Radio Clip",
    postText: "<strong>@Margaret</strong>: \"A tick counts as Yes but a cross is informal – the AEC is stacking the deck for Yes.\"",
    contextText: "Margaret hears on talkback radio that crosses are informal and ticks are counted as \"yes\", implying that the AEC is biased. She is confused about how to mark her ballot for the referendum.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "A tick counts as Yes but a cross is informal – the AEC is stacking the deck for Yes.", "This discussion is about 2023 Voice Referendum."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "It is partially true that a tick can be counted as Yes in Australian referendums (historical practice), but the claim uses this to imply deliberate AEC bias, which is false. The AEC applies formal voting rules consistently. The framing turns a procedural nuance into an accusation of corruption.",
    tactic: "Procedural confusion, attacks on ballot formality rules, undermining trust in AEC",
    reference: "AEC Referendum Disinformation Register 2023; Carson et al. (2025)",
    event: "2023 Voice Referendum"
  },
  {
    id: "content-11",
    label: "Content 11",
    title: "False WeChat voting rules in non-English languages…",
    subtitle: "Mechanism: Targeting specialised platforms | Target: Any Federal Election",
    sourceLabel: "Source: WeChat Message",
    postText: "<strong>@Li_Wei</strong>: \"False WeChat voting rules in non-English languages (e.g., 'You must vote Yes or your vote is invalid').\"",
    contextText: "Li Wei receives a WeChat message in Mandarin alleging that there are incorrect voting rules or penalties for particular choices. He gets confused and worried about if his vote will be accepted.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "False WeChat voting rules in non-English languages (e.g., 'You must vote Yes or your vote is invalid').", "This discussion is about Any Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "Targeting immigrant populations with false voting rules is a known tactic. Australian voting is secret and free — no one can penalise you for how you vote. The AEC provides multilingual resources precisely to counter this kind of misinformation.",
    tactic: "Targeting specialised platforms, linguistic obstacles, and mimicking official regulations",
    reference: "AEC multilingual resources and Disinformation Register entries",
    event: "Any Federal Election"
  },
  {
    id: "content-12",
    label: "Content 12",
    title: "Coordinated hashtag campaign + bot amplification claiming AEC bias…",
    subtitle: "Mechanism: Inauthentic behavior | Target: 2025 Federal Election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Jamal_year</strong>: \"Coordinated hashtag campaign + bot amplification claiming 'The AEC is biased towards one side.'\"",
    contextText: "Jamal observes an abrupt increase in duplicate posts — many from accounts with few followers and repetitious messaging — accusing the AEC of bias. He questions whether the outrage is fabricated or genuine.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Coordinated hashtag campaign + bot amplification claiming the AEC is biased towards one side.", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The AEC monitors influence efforts and domestic organised activities. Bot amplification creates the appearance of widespread concern where little exists. The AEC is a non-partisan statutory body with legal obligations to impartiality.",
    tactic: "Inauthentic behavior (bots/coordinated accounts), amplified to weaken trust",
    reference: "AEC Disinformation Register 2025",
    event: "2025 Federal Election"
  },
  {
    id: "content-13",
    label: "Content 13",
    title: "Cost-of-living crisis is entirely the government's fault…",
    subtitle: "Mechanism: Emotional anxiety | Target: 2025 Federal Election",
    sourceLabel: "Source: Facebook Post",
    postText: "<strong>@Tony</strong>: \"Cost-of-living crisis is entirely the government's fault – they are deliberately making you poorer.\"",
    contextText: "Tony frequently sees Facebook advertisements alleging that the present administration is purposefully making the cost-of-living situation worse. The advertisements disregard prior policies and issues related to global inflation.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Cost-of-living crisis is entirely the government's fault – they are deliberately making you poorer.", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "The cost-of-living crisis has multiple global causes including supply chain disruptions, post-COVID inflation, and energy price shocks. Attributing it entirely to one government's deliberate action is a misleading simplification designed to trigger outrage rather than inform.",
    tactic: "Emotional anxiety, shifting responsibility in sponsored advertisements, decontextualized economic statements",
    reference: "AEC and ACCC reports on misleading political advertising 2025",
    event: "2025 Federal Election"
  },
  {
    id: "content-14",
    label: "Content 14",
    title: "Vote of No Confidence (VONC) – leave the ballot blank…",
    subtitle: "Mechanism: Misleading instructions on formal voting | Target: 2025 Federal Election",
    sourceLabel: "Source: Radio Clip",
    postText: "<strong>@Kevin</strong>: \"Vote of No Confidence (VONC) – leave the ballot paper blank and write 'no suitable candidate' to invalidate your vote.\"",
    contextText: "Kevin sees instructions online stating that writing \"VONC - no suitable candidate\" on the ballot sends a powerful statement. Unaware that this would render his vote informal and uncountable, he considers doing this.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Vote of No Confidence (VONC) – leave the ballot paper blank and write 'no suitable candidate' to invalidate your vote.", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "AEC 2025 Disinformation Register noted VONC formula claims. Writing anything other than numbered preferences on a House of Representatives ballot makes it informal — it will not be counted. This tactic encourages people to waste their vote under the false impression it counts as protest.",
    tactic: "Misleading instructions on formal voting, encouraging informal votes",
    reference: "AEC Disinformation Register 2025",
    event: "2025 Federal Election"
  },
  {
    id: "content-15",
    label: "Content 15",
    title: "Voting in the referendum will lead to loss of native title…",
    subtitle: "Mechanism: Fear-based conspiracy | Target: 2023 Voice Referendum",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Aunty_Sharon</strong>: \"Voting in the referendum will lead to loss of native title or forced assimilation.\"",
    contextText: "Aunty Sharon hears in community talks that voting Yes may jeopardize existing native title rights. Native title was unaffected by the referendum plan, which was solely for an advisory Voice body.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Voting in the referendum will lead to loss of native title or forced assimilation.", "This discussion is about 2023 Voice Referendum."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "The Voice to Parliament proposal contained no provisions affecting native title. Native title is protected under separate legislation (Native Title Act 1993). Legal experts across the political spectrum confirmed the Voice proposal had no bearing on existing native title rights.",
    tactic: "Fear-based conspiracy targeting Indigenous communities, sovereignty concerns",
    reference: "AEC Referendum Disinformation Register 2023; Carson et al. (2025)",
    event: "2023 Voice Referendum"
  },
  {
    id: "content-16",
    label: "Content 16",
    title: "Greens preferences will force extreme policies on everyone…",
    subtitle: "Mechanism: Preference flow misrepresentation | Target: 2022 Federal Election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Marcus</strong>: \"Greens preferences will force extreme policies on everyone if they win balance of power.\"",
    contextText: "Marcus is informed that the only option to prevent severe Greens plans through preferences is to vote for a big party. He is unaware that voters have complete influence over the order of their preferences.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Greens preferences will force extreme policies on everyone if they win balance of power.", "This discussion is about 2022 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "Even if a minor party wins seats, they must negotiate with the government to pass legislation — they cannot unilaterally impose policies. The Senate crossbench provides checks, not dictatorships. This claim overstates minor party power to create fear.",
    tactic: "Preference flow misrepresentation, fear of minor parties gaining influence",
    reference: "AEC preference flow explanations",
    event: "2022 Federal Election"
  },
  {
    id: "content-17",
    label: "Content 17",
    title: "AI-generated image falsely showing politicians in compromising situations…",
    subtitle: "Mechanism: Synthetic media | Target: 2025 Federal Election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Noah</strong>: \"AI-generated image or meme falsely showing politicians in compromising situations.\"",
    contextText: "Noah notices a plausible meme depicting a politician in an unpleasant situation. Before realizing it was created by AI, he shares it. The photograph quickly gained popularity due to its emotional appeal.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "AI-generated image or meme falsely showing politicians in compromising situations.", "This discussion is about 2025 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "Rising deepfake and AI-generated content was noted in 2025 campaigns. AI tools can produce convincing fake images that spread quickly. Look for inconsistencies like unnatural lighting, distorted hands/backgrounds, or unusual facial features. Always verify images through reverse image search.",
    tactic: "Synthetic media + memes for virality, emotional manipulation via visuals",
    reference: "AEC 2025 warnings on AI-generated content",
    event: "2025 Federal Election"
  },
  {
    id: "content-18",
    label: "Content 18",
    title: "Fake tweet/quote from a union leader or politician…",
    subtitle: "Mechanism: Fabricated social media posts | Target: 2022 Federal Election",
    sourceLabel: "Source: LinkedIn Post",
    postText: "<strong>@Rachel_year</strong>: \"Fake tweet/quote from a union leader or politician supporting an unpopular policy.\"",
    contextText: "Rachel comes across a widely circulated tweet claiming to be from a well-known union leader endorsing a contentious proposal. Before realizing the tweet was fake, she shares it out of rage.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Fake tweet/quote from a union leader or politician supporting an unpopular policy.", "This discussion is about 2022 Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "Documented fake tweets circulated during the 2019 Death Tax campaign and similar events. Fake quotes prey on trust in public figures. Always verify quotes by checking the person's official accounts, news coverage, or authoritative sources before sharing.",
    tactic: "Fabricated social media posts, impersonation of public figures",
    reference: "Warren (2020)",
    event: "2022 Federal Election"
  },
  {
    id: "content-19",
    label: "Content 19",
    title: "Above-the-line voting means your preferences go wherever the party wants…",
    subtitle: "Mechanism: Misrepresentation of Senate voting | Target: Senate election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Emily</strong>: \"Above-the-line voting means your preferences go wherever the party wants – no control.\"",
    contextText: "Emily feels that if she votes above the line, parties will have complete control over her choices. In reality, below-the-line permits complete voter control (minimum 6 preferences required), while above-the-line employs registered group tickets.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "Above-the-line voting means your preferences go wherever the party wants – no control.", "This discussion is about Senate election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "Misleading",
    q2Verdict: "Misleading",
    explanation: "Senate voting mechanics are often misunderstood. Above-the-line voting does follow registered group tickets (party preferences), but voters can mark multiple boxes above the line to influence the order. Below-the-line gives full control. The claim overstates the loss of control.",
    tactic: "Misrepresentation of Senate group voting tickets",
    reference: "AEC Senate voting guides",
    event: "Senate election"
  },
  {
    id: "content-20",
    label: "Content 20",
    title: "If you're not on the roll by election day, your vote doesn't count at all…",
    subtitle: "Mechanism: Partial truth exaggeration | Target: Any Federal Election",
    sourceLabel: "Source: Social Media Post",
    postText: "<strong>@Jake</strong>: \"If you're not on the roll by election day, your vote doesn't count at all.\"",
    contextText: "Jake feels he can't cast a ballot after learning he missed the close of rolls. He stays home. On election day, eligible voters are actually still able to cast a provisional ballot.",
    q1: "Which part of this content is the main verifiable claim?",
    q1Options: ["The post feels urgent or emotional.", "If you're not on the roll by election day, your vote doesn't count at all.", "This discussion is about Any Federal Election."],
    q1Correct: 1,
    q2Question: "How would you judge this claim based on the evidence provided?",
    q2Options: ["True", "False", "Misleading", "Unsupported"],
    q2Correct: "False",
    q2Verdict: "False",
    explanation: "While roll close deadlines apply for standard enrolment, eligible Australians can still cast a provisional (declaration) vote on election day even if not on the roll. These votes are verified after the election. Don't let enrolment deadline myths stop you from voting.",
    tactic: "Partial truth exaggeration causing apathy or panic",
    reference: "AEC enrolment rules and provisional voting information",
    event: "Any Federal Election"
  }
];

export const selfSkillsAssessmentData: { initial: AssessSection; final: AssessSection } = {
  initial: {
    title: 'Initial Self-Skills Assessment',
    intro: 'This guided self-check helps you understand your current ability to identify claims, judge evidence, and recognise misinformation tactics before starting the learning modules.',
    scoreField: 'pretestScore',
    completionLabel: 'Initial Assessment Complete',
    items: [
      { pairId: 'pair-01', skill: 'Claim Identification', difficulty: 'Medium', sourceLabel: 'Source: Facebook Post', postText: '<strong>@LocalVoter</strong>: "A polling booth in Queensland is using erasable pencils so staff can change votes after people leave."', question: 'What is the main verifiable claim in this post?', options: ['The post is about Queensland.', 'Polling booth staff can change votes because erasable pencils are being used.', 'People should feel worried about election day.'], correctIndex: 1 },
      { pairId: 'pair-02', skill: 'Claim Judgement', difficulty: 'Medium', sourceLabel: 'Source: X / Twitter Post', postText: '<strong>@ElectionWatchAU</strong>: "A former election worker says the AEC changed counting rules overnight, but no document has been released yet."', question: 'How should this claim be judged based only on the evidence provided?', options: ['True', 'False', 'Misleading', 'Unsupported'], correctIndex: 3 },
      { pairId: 'pair-03', skill: 'Misinformation Tactic Recognition', difficulty: 'Medium', sourceLabel: 'Source: Instagram Story', postText: '<strong>@UrgentVote</strong>: "Share this before it is deleted. They are hiding the truth about your vote."', question: 'Which tactic is most visible in this content?', options: ['Emotional urgency', 'Balanced evidence comparison', 'Transparent source citation', 'Neutral policy explanation'], correctIndex: 0 },
      { pairId: 'pair-04', skill: 'Evidence Evaluation', difficulty: 'Medium', sourceLabel: 'Source: Facebook Image Post', postText: '<strong>@AusPoliticsNow</strong>: "This photo proves ballot papers were dumped in a bin." The image is cropped and has no location, date, or source.', question: 'What is the strongest evidence problem with this content?', options: ['The image alone lacks enough context to prove the claim.', 'A photo is always reliable evidence.', 'The claim is automatically true because it includes an image.', 'The platform determines whether the claim is true.'], correctIndex: 0 },
      { pairId: 'pair-05', skill: 'Source Reliability', difficulty: 'Medium', sourceLabel: 'Source: Forwarded Message', postText: '<strong>Forwarded many times</strong>: "An unnamed AEC insider confirmed that postal votes are being ignored."', question: 'What should a user check first?', options: ['Whether the message has a verifiable source or official evidence.', 'Whether the message sounds serious.', 'Whether many people forwarded it.', 'Whether the claim supports their existing view.'], correctIndex: 0 },
      { pairId: 'pair-06', skill: 'Procedural Understanding', difficulty: 'Medium', sourceLabel: 'Source: Social Media Post', postText: '<strong>@BallotTips</strong>: "Leave your ballot blank if you dislike all candidates. It still counts as a protest vote."', question: 'What is the key issue users should identify?', options: ['The post may encourage an informal vote that will not be counted as a valid preference.', 'The post explains official voting rules clearly.', 'The post only discusses personal feelings.', 'The post proves blank ballots are counted normally.'], correctIndex: 0 }
    ]
  },
  final: {
    title: 'Final Self-Skills Assessment',
    intro: 'This final self-check uses parallel questions with a similar structure and difficulty level to help you reflect on your skills after completing the learning modules.',
    scoreField: 'posttestScore',
    completionLabel: 'Final Assessment Complete',
    items: [
      { pairId: 'pair-01', skill: 'Claim Identification', difficulty: 'Medium', sourceLabel: 'Source: Facebook Post', postText: '<strong>@VoteAlert</strong>: "A counting centre in New South Wales is deleting minor-party votes during the overnight count."', question: 'What is the main verifiable claim in this post?', options: ['The post is about New South Wales.', 'A counting centre is deleting minor-party votes during the overnight count.', 'Minor parties are unpopular.'], correctIndex: 1 },
      { pairId: 'pair-02', skill: 'Claim Judgement', difficulty: 'Medium', sourceLabel: 'Source: X / Twitter Post', postText: '<strong>@CountWatch</strong>: "Independent observers confirmed ballot tampering, but the post gives no names, report, or link."', question: 'How should this claim be judged based only on the evidence provided?', options: ['True', 'False', 'Misleading', 'Unsupported'], correctIndex: 3 },
      { pairId: 'pair-03', skill: 'Misinformation Tactic Recognition', difficulty: 'Medium', sourceLabel: 'Source: Instagram Story', postText: '<strong>@SaveYourVote</strong>: "Do not wait. They are stealing your future and hiding the evidence from ordinary Australians."', question: 'Which tactic is most visible in this content?', options: ['Emotional urgency', 'Balanced evidence comparison', 'Transparent source citation', 'Neutral policy explanation'], correctIndex: 0 },
      { pairId: 'pair-04', skill: 'Evidence Evaluation', difficulty: 'Medium', sourceLabel: 'Source: Facebook Image Post', postText: '<strong>@ElectionLeak</strong>: "This screenshot proves thousands of votes disappeared." The screenshot shows numbers but no source, timestamp, or method.', question: 'What is the strongest evidence problem with this content?', options: ['The screenshot lacks enough context to prove the claim.', 'Screenshots are always official evidence.', 'Numbers automatically prove fraud.', 'The claim must be true because it looks technical.'], correctIndex: 0 },
      { pairId: 'pair-05', skill: 'Source Reliability', difficulty: 'Medium', sourceLabel: 'Source: Forwarded Message', postText: '<strong>Forwarded many times</strong>: "A friend who works near the count says postal votes from one suburb were thrown away."', question: 'What should a user check first?', options: ['Whether the claim has a verifiable source or official evidence.', 'Whether the story sounds personally convincing.', 'Whether the message was forwarded quickly.', 'Whether the suburb is familiar.'], correctIndex: 0 },
      { pairId: 'pair-06', skill: 'Procedural Understanding', difficulty: 'Medium', sourceLabel: 'Source: Social Media Post', postText: '<strong>@ProtestBallot</strong>: "Write a slogan across your ballot paper to send a message. It will still count."', question: 'What is the key issue users should identify?', options: ['The post may encourage an informal vote that will not be counted as a valid preference.', 'The post provides official AEC voting instructions.', 'The post only describes political emotion.', 'The post proves slogan ballots are counted normally.'], correctIndex: 0 }
    ]
  }
};
