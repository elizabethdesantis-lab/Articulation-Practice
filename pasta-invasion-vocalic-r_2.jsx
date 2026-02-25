import { useState, useEffect, useCallback, useRef } from "react";

/* ───────────────────────────────────────────
   LEVEL DATA  (sentenceWords per-sentence)
   ─────────────────────────────────────────── */
const LEVELS = [
  {
    id: 1, title: "The Spaghetti Stirs", vocalicR: "initial-r",
    sentences: [
      "The **r**igatoni began to **r**ise from the pot like a **r**ed cobra.",
      "You **r**each for the **r**emote to call for **r**einforcements **r**ight away."
    ],
    sentenceWords: [["rigatoni","rise","red"],["reach","remote","reinforcements","right"]],
    story: "You're eating dinner when your spaghetti starts MOVING. It slithers off your plate and onto the floor. The rigatoni in the pot begins to rise like tiny soldiers. What do you do?",
    choices: [{ text: "🍝 Try to talk to the pasta", next: 2 },{ text: "📞 Call your best friend for help", next: 3 }]
  },
  {
    id: 2, title: "Pasta Parley", vocalicR: "er",
    sentences: [
      "The noodle lead**er** slith**er**ed clos**er** with a sinist**er** grin.",
      "You wond**er** wheth**er** this mast**er** will listen to reason."
    ],
    sentenceWords: [["leader","slithered","closer","sinister"],["wonder","whether","master"]],
    story: "The spaghetti forms into a tall figure — their LEADER. It speaks in a gurgly voice: 'We are the Pasta Empire! Surrender your kitchen!' The leader slithers closer with a sinister grin.",
    choices: [{ text: "🗡️ Challenge the leader to a cooking contest", next: 4 },{ text: "🏃‍♀️ Run to the garage for supplies", next: 5 }]
  },
  {
    id: 3, title: "The Phone Call", vocalicR: "ar",
    sentences: [
      "Your friend thinks you **ar**e telling a biz**ar**re story from af**ar**.",
      "The p**ar**ty of pasta m**ar**ches tow**ar**d the c**ar** in the y**ar**d."
    ],
    sentenceWords: [["are","bizarre","afar"],["party","marches","toward","car","yard"]],
    story: "You grab your phone but your friend thinks you are telling a bizarre joke. Meanwhile, a party of pasta marches toward the car in the yard. They're trying to ESCAPE the house!",
    choices: [{ text: "🚗 Block the car before they reach it", next: 5 },{ text: "📸 Take a video for proof", next: 4 }]
  },
  {
    id: 4, title: "The Cooking Showdown", vocalicR: "or",
    sentences: [
      "The pasta warri**or** stood on the count**er** ready f**or** m**ore**.",
      "You f**or**ced open the draw**er** and grabbed a f**or**k bef**ore** the d**oor** slammed."
    ],
    sentenceWords: [["warrior","counter","for","more"],["forced","drawer","fork","before","door"]],
    story: "The pasta warrior climbs onto the counter, ready for more battle! You need a weapon. You forced open the drawer and grabbed a fork before the door slammed shut behind you.",
    choices: [{ text: "🍴 Use the fork to twirl them up", next: 6 },{ text: "💧 Turn on the sink to wash them away", next: 7 }]
  },
  {
    id: 5, title: "Garage Arsenal", vocalicR: "air",
    sentences: [
      "You r**are**ly see such a sc**are**y sight anywh**ere** in the **air**.",
      "You prep**are** with c**are** and st**are** at the p**air** of penne guards."
    ],
    sentenceWords: [["rarely","scary","anywhere","air"],["prepare","care","stare","pair"]],
    story: "In the garage, you rarely see such a scary sight — penne pasta guards block the door! You prepare with care and stare at the pair of penne guards. They're armed with tiny breadstick swords!",
    choices: [{ text: "🧹 Grab the broom and sweep them aside", next: 7 },{ text: "🧀 Offer them parmesan as a peace offering", next: 6 }]
  },
  {
    id: 6, title: "The Cheese Truce", vocalicR: "ear",
    sentences: [
      "The pasta army app**ear**ed to ch**eer** when they saw the cheese n**ear**by.",
      "You could h**ear** them cl**ear**ly — they f**ear**ed running out of flav**or**."
    ],
    sentenceWords: [["appeared","cheer","nearby"],["hear","clearly","feared","flavor"]],
    story: "The pasta appeared to cheer when they saw cheese nearby! You could hear them clearly — they feared running out of flavor! Maybe cheese is the key to peace?",
    choices: [{ text: "🧀 Share all the cheese you have", next: 8 },{ text: "🫣 Keep the cheese and bargain with it", next: 9 }]
  },
  {
    id: 7, title: "The Great Flood", vocalicR: "ire",
    sentences: [
      "The ent**ire** kitchen was on f**ire** with pasta's des**ire** to conqu**er**.",
      "You adm**ire** the**ir** bravery but you're t**ire**d of the**ir** mischief."
    ],
    sentenceWords: [["entire","fire","desire","conquer"],["admire","their","tired"]],
    story: "Water floods the entire kitchen! The pasta's desire to conquer hasn't stopped. You admire their bravery but you're tired of their mischief. Soggy noodles float everywhere!",
    choices: [{ text: "🌊 Use a colander as a shield", next: 9 },{ text: "🔥 Turn on the stove to dry them out", next: 8 }]
  },
  {
    id: 8, title: "Operation Oven", vocalicR: "ur",
    sentences: [
      "You t**ur**n on the oven and the pasta starts to m**ur**m**ur** in f**ur**y.",
      "They sc**ur**ry across the fl**oor** trying to ret**ur**n to the wat**er**."
    ],
    sentenceWords: [["turn","murmur","fury"],["scurry","floor","return","water"]],
    story: "You turn on the oven and the pasta starts to murmur in fury! They scurry across the floor trying to return to the water. The heat is making them nervous!",
    choices: [{ text: "🫙 Trap them in a jar while they're scared", next: 10 },{ text: "🤝 Offer a treaty — they stay in the pot", next: 11 }]
  },
  {
    id: 9, title: "The Colander Shield", vocalicR: "prevocalic-r-blends",
    sentences: [
      "The **br**ave **gr**oup of **fr**ied pasta **cr**ept **thr**ough the **dr**ain.",
      "You **gr**ab the colander and **pr**epare for a **tr**icky battle **fr**om behind."
    ],
    sentenceWords: [["brave","group","fried","crept","through","drain"],["grab","prepare","tricky","from"]],
    story: "A brave group of fried pasta crept through the drain! You grab the colander and prepare for a tricky battle. These crispy reinforcements are tougher than the boiled ones!",
    choices: [{ text: "🥊 Fight them with a spatula", next: 10 },{ text: "🧊 Freeze them with ice cubes", next: 11 }]
  },
  {
    id: 10, title: "The Pasta General", vocalicR: "er-medial",
    sentences: [
      "The gen**er**al ord**er**ed ev**er**y noodle to gath**er** near the r**e**frig**er**at**or**.",
      "You consid**er**ed sev**er**al diff**er**ent ways to end this pow**er** struggle."
    ],
    sentenceWords: [["general","ordered","every","gather","refrigerator"],["considered","several","different","power"]],
    story: "The pasta general ordered every noodle to gather near the refrigerator! You considered several different ways to end this power struggle. The general is a giant lasagna sheet with a bow-tie pasta medal!",
    choices: [{ text: "👑 Challenge the general directly", next: 12 },{ text: "🕵️ Sneak around to their supply line", next: 13 }]
  },
  {
    id: 11, title: "The Freezer Trap", vocalicR: "or-medial",
    sentences: [
      "The f**or**est of pasta t**or**nados sp**or**ted tiny fl**or**al hats.",
      "You expl**ore**d the f**or**gotten c**or**n**er** of the freez**er** f**or** a plan."
    ],
    sentenceWords: [["forest","tornados","sported","floral"],["explored","forgotten","corner","freezer","for"]],
    story: "A forest of pasta tornados sported tiny floral hats made of basil! You explored the forgotten corner of the freezer for a plan. Frozen peas could be your secret ammo!",
    choices: [{ text: "🫛 Launch frozen peas at the pasta army", next: 12 },{ text: "❄️ Lure them into the freezer", next: 13 }]
  },
  {
    id: 12, title: "The Battle of the Kitchen", vocalicR: "ar-medial",
    sentences: [
      "The p**ar**ty of pasta m**ar**ched in a g**ar**den of herbs and g**ar**lic.",
      "You ch**ar**ged forw**ar**d with your sp**ar**kling colander sh**ar**p and ready."
    ],
    sentenceWords: [["party","marched","garden","garlic"],["charged","forward","sparkling","sharp"]],
    story: "An epic battle begins! The party of pasta marched through a garden of herbs and garlic. You charged forward with your sparkling colander, sharp and ready. Sauce splatters everywhere like a food fight!",
    choices: [{ text: "🫕 Push them toward the boiling pot", next: 14 },{ text: "🧄 Use garlic breath to scare them", next: 15 }]
  },
  {
    id: 13, title: "Sneaky Strategy", vocalicR: "rl-blend",
    sentences: [
      "The g**irl** tw**irl**ed past the pasta like a ballerina in the w**orl**d's weirdest show.",
      "You h**url**ed the e**arl**y harvest tomatoes and sn**arl**ed at the noodles."
    ],
    sentenceWords: [["girl","twirled","world's"],["hurled","early","snarled"]],
    story: "Time for stealth! Like a girl in the world's weirdest spy movie, you twirled past the pasta guards. You hurled early harvest tomatoes as distractions and snarled at any noodle that got too close!",
    choices: [{ text: "🍅 Keep throwing tomatoes as cover", next: 14 },{ text: "🥷 Sneak to the pantry for the secret weapon", next: 15 }]
  },
  {
    id: 14, title: "The Sauce Tsunami", vocalicR: "prevocalic-r",
    sentences: [
      "A **r**iver of **r**ed sauce **r**ushed **r**ight through the **r**oom.",
      "You **r**an to the **r**oof to escape the **r**aging **r**ising tide of marinara."
    ],
    sentenceWords: [["river","red","rushed","right","room"],["ran","roof","raging","rising"]],
    story: "OH NO! A river of red sauce rushed right through the room! You ran to the roof to escape the raging, rising tide of marinara. From up here you can see the pasta empire spreading to the neighbors' houses!",
    choices: [{ text: "📢 Warn the neighbors about the invasion", next: 16 },{ text: "🪂 Zipline to the grocery store for supplies", next: 17 }]
  },
  {
    id: 15, title: "The Secret Pantry", vocalicR: "ear-final",
    sentences: [
      "You volunt**eer** to go n**ear** the pantry but you f**ear** what's in th**ere**.",
      "You p**eer** through the d**oor** and h**ear** a ch**eer** — it's cl**ear** the pasta found the crackers."
    ],
    sentenceWords: [["volunteer","near","fear","there"],["peer","door","hear","cheer","clear"]],
    story: "The pantry is near but you fear what's in there. You peer through the door and hear a cheer — it's clear the pasta found the crackers! They're building cracker tanks!",
    choices: [{ text: "💥 Smash the cracker tanks", next: 16 },{ text: "🫗 Pour olive oil to make the floor slippery", next: 17 }]
  },
  {
    id: 16, title: "The Neighborhood Alert", vocalicR: "air-final",
    sentences: [
      "Ev**er**ywh**ere** you look, pasta fills the **air** beyond rep**air**.",
      "You decl**are** this isn't f**air** and sw**ear** you'll end this nightm**are**."
    ],
    sentenceWords: [["everywhere","air","repair"],["declare","fair","swear","nightmare"]],
    story: "Everywhere you look, pasta fills the air — the town is beyond repair! You declare this isn't fair and swear you'll end this nightmare. The whole neighborhood is covered in noodles!",
    choices: [{ text: "🚒 Call the fire department for backup", next: 18 },{ text: "🧪 Mix a special anti-pasta potion", next: 19 }]
  },
  {
    id: 17, title: "The Slippery Escape", vocalicR: "ire-medial",
    sentences: [
      "The t**ire**d pasta slid through the oil, losing the**ir** d**ire**ction.",
      "You requ**ire** a m**irr**or to see around the corn**er** wh**ere** they hide."
    ],
    sentenceWords: [["tired","their","direction"],["require","mirror","corner","where"]],
    story: "Olive oil everywhere! The tired pasta lost their direction sliding through the slick! You require a mirror to see around the corner where they hide. Your plan is working!",
    choices: [{ text: "🪤 Set up a pasta trap at the front door", next: 18 },{ text: "🌀 Create a pasta whirlpool in the sink", next: 19 }]
  },
  {
    id: 18, title: "The Grand Alliance", vocalicR: "ur-medial",
    sentences: [
      "The t**ur**tle-shaped pasta s**ur**faced d**ur**ing the t**ur**moil of the battle.",
      "Yo**ur** c**our**age insp**ire**d the nat**ur**al-born fight**er**s to j**our**ney forward."
    ],
    sentenceWords: [["turtle","surfaced","during","turmoil"],["your","courage","inspired","natural","fighters","journey"]],
    story: "During the turmoil, something unexpected happens! The turtle-shaped pasta surfaced — and they're on YOUR side! Your courage inspired these natural-born fighters to journey forward with you!",
    choices: [{ text: "🐢 Lead the turtle pasta into battle", next: 20 },{ text: "🏳️ Use the turtle pasta as peace ambassadors", next: 21 }]
  },
  {
    id: 19, title: "The Anti-Pasta Potion", vocalicR: "r-blends-medial",
    sentences: [
      "You sp**r**inkle the sec**r**et ing**r**edient — vinegar — ac**r**oss the battleground.",
      "The pasta a**r**my sh**r**inks as the st**r**ong smell sp**r**eads ev**er**ywhere."
    ],
    sentenceWords: [["sprinkle","secret","ingredient","across"],["army","shrinks","strong","spreads","everywhere"]],
    story: "You sprinkle the secret ingredient — vinegar — across the battleground! The pasta army shrinks as the strong smell spreads everywhere. Vinegar is their weakness!",
    choices: [{ text: "🫗 Pour more vinegar to finish them off", next: 20 },{ text: "✋ Stop — offer mercy if they surrender", next: 21 }]
  },
  {
    id: 20, title: "The Final Battle", vocalicR: "mixed-vocalic-r",
    sentences: [
      "The **r**oaring pasta w**ar**riors f**ear**ed the pow**er** of your colander shield.",
      "Aft**er** a f**ier**ce battle, the m**irr**or showed the**ir** arm**or** cracking ev**er**ywhere."
    ],
    sentenceWords: [["roaring","warriors","feared","power"],["after","fierce","mirror","their","armor","everywhere"]],
    story: "This is it — THE FINAL BATTLE! The roaring pasta warriors feared the power of your colander shield. After a fierce battle, the mirror showed their armor cracking everywhere. Victory is within reach!",
    choices: [{ text: "⚔️ Deliver the final blow with your fork", next: 22 },{ text: "🤝 Offer one last chance for peace", next: 23 }]
  },
  {
    id: 21, title: "The Peace Treaty", vocalicR: "mixed-vocalic-r",
    sentences: [
      "The pasta emper**or** ag**r**eed to sh**are** the kitchen forev**er**more.",
      "Your her**o**ic eff**or**t e**ar**ned respect from ev**er**y noodle near and f**ar**."
    ],
    sentenceWords: [["emperor","agreed","share","forevermore"],["heroic","effort","earned","every","far"]],
    story: "The pasta emperor agreed to share the kitchen forevermore! Your heroic effort earned respect from every noodle near and far. You sign a peace treaty written on a lasagna sheet!",
    choices: [{ text: "🎉 Celebrate with a pasta party!", next: "ending_peace" },{ text: "📜 Read the fine print of the treaty", next: "ending_twist" }]
  },
  {
    id: 22, title: "Victory Feast!", vocalicR: "mixed-review",
    sentences: [
      "Aft**er** the g**r**eat vict**or**y, you des**er**ve a prop**er** celebration.",
      "The ent**ire** w**or**ld ch**eer**ed f**or** the b**r**ave h**er**o who saved dinn**er**."
    ],
    sentenceWords: [["after","great","victory","deserve","proper"],["entire","world","cheered","for","brave","hero","dinner"]],
    story: "VICTORY! After the great victory, you deserve a proper celebration. The entire world cheered for the brave hero who saved dinner. You're famous — they call you 'The Fork Guardian'!",
    choices: [{ text: "🏆 Accept the Golden Fork Award", next: "ending_hero" },{ text: "🍝 Cook a peace meal for everyone", next: "ending_peace" }]
  },
  {
    id: 23, title: "The Surprise Alliance", vocalicR: "mixed-review",
    sentences: [
      "The pasta w**ar**ri**or**s kneel bef**ore** you, the**ir** f**ear**less lead**er**.",
      "Togeth**er** you decl**are** a b**r**ight**er** futu**re** f**or** humans and noodles."
    ],
    sentenceWords: [["warriors","before","their","fearless","leader"],["together","declare","brighter","future","for"]],
    story: "In an unexpected twist, the pasta warriors kneel before you — their fearless leader! Together you declare a brighter future for humans and noodles. You become Queen of the Pasta Empire!",
    choices: [{ text: "👑 Rule the Pasta Empire wisely", next: "ending_queen" },{ text: "🌍 Expand the empire to the whole neighborhood", next: "ending_twist" }]
  }
];

const ENDINGS = {
  ending_hero: { title: "🏆 The Fork Guardian", text: "You saved the world from the Great Pasta Uprising! Schools teach your story. Every kitchen now has a colander mounted on the wall in your honor. You are THE FORK GUARDIAN — hero of all dinners everywhere!", emoji: "⚔️🍝🏆" },
  ending_peace: { title: "🕊️ The Great Pasta Peace", text: "Humans and pasta now live in harmony! Pasta helps cook dinner every night (they volunteer to jump into the pot). You opened the world's first Human-Pasta Restaurant where the food literally walks to your table!", emoji: "🤝🍝🎉" },
  ending_queen: { title: "👑 Queen of Noodles", text: "All hail the Pasta Queen! You rule the Noodle Empire with kindness and a really big fork. Your first law: Taco Tuesdays AND Pasta Fridays are mandatory. The world has never been tastier!", emoji: "👑🍝✨" },
  ending_twist: { title: "🌀 To Be Continued...", text: "Just when you thought it was over... you open the fridge and the RICE is starting to move! 'We heard what the pasta did,' they whisper. 'Our turn.' The adventure continues in: RICE REBELLION — coming soon!", emoji: "🍚👀🌀" }
};

/* ───────────────────────────────────────────
   SPEECH RATE MONITOR HOOK
   ─────────────────────────────────────────── */
function useSpeechRateMonitor(enabled) {
  const [rateStatus, setRateStatus] = useState("idle"); // idle | good | fast | silent
  const [micActive, setMicActive] = useState(false);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const peakTimesRef = useRef([]);
  const lastPeakRef = useRef(0);
  const smoothedRef = useRef(0);

  const startMic = useCallback(async () => {
    if (!enabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);

      const data = new Uint8Array(analyser.fftSize);
      let wasAbove = false;

      const loop = () => {
        analyser.getByteTimeDomainData(data);
        // RMS amplitude
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);

        const threshold = 0.06;
        const now = performance.now();

        if (rms > threshold) {
          if (!wasAbove) {
            // Rising edge = new syllable onset
            if (now - lastPeakRef.current > 120) {
              peakTimesRef.current.push(now);
              lastPeakRef.current = now;
              // Keep only last 3 seconds
              const cutoff = now - 3000;
              peakTimesRef.current = peakTimesRef.current.filter(t => t > cutoff);
            }
          }
          wasAbove = true;
        } else {
          wasAbove = false;
        }

        // Calculate syllables per second from peaks in last 2.5 sec window
        const windowMs = 2500;
        const recentPeaks = peakTimesRef.current.filter(t => t > now - windowMs);
        const syllPerSec = recentPeaks.length / (windowMs / 1000);

        // Smooth
        smoothedRef.current = smoothedRef.current * 0.7 + syllPerSec * 0.3;
        const s = smoothedRef.current;

        if (rms < 0.02) {
          setRateStatus("silent");
        } else if (s > 5.5) {
          // >5.5 syllables/sec ≈ too fast for therapeutic speech
          setRateStatus("fast");
        } else {
          setRateStatus("good");
        }

        frameRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      console.log("Mic access denied:", e);
      setMicActive(false);
    }
  }, [enabled]);

  const stopMic = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    peakTimesRef.current = [];
    smoothedRef.current = 0;
    setMicActive(false);
    setRateStatus("idle");
  }, []);

  useEffect(() => {
    if (enabled) startMic();
    else stopMic();
    return () => stopMic();
  }, [enabled, startMic, stopMic]);

  return { rateStatus, micActive };
}

/* ───────────────────────────────────────────
   TEXT-TO-SPEECH HOOK — Natural Phrase Chunking
   ─────────────────────────────────────────── */

// Score voices by quality — higher = more natural sounding
function scoreVoice(v) {
  const n = (v.name || "").toLowerCase();
  const l = (v.lang || "").toLowerCase();
  let s = 0;
  if (!l.startsWith("en")) return -100;
  if (l.startsWith("en-us")) s += 20;
  else if (l.startsWith("en-gb")) s += 15;
  else if (l.startsWith("en")) s += 10;
  // Neural / premium voices are dramatically more natural
  if (n.includes("neural")) s += 50;
  if (n.includes("natural")) s += 48;
  if (n.includes("enhanced")) s += 40;
  if (n.includes("premium")) s += 40;
  // Known high-quality voices
  if (n.includes("samantha")) s += 35;
  if (n.includes("ava")) s += 34;
  if (n.includes("zoe")) s += 33;
  if (n.includes("allison")) s += 32;
  if (n.includes("google us english")) s += 30;
  if (n.includes("google uk english female")) s += 28;
  if (n.includes("microsoft aria")) s += 36;
  if (n.includes("microsoft jenny")) s += 36;
  if (n.includes("microsoft zira")) s += 25;
  if (n.includes("female")) s += 5;
  if (n.includes("espeak")) s -= 20;
  if (n.includes("mbrola")) s -= 15;
  if (!v.localService) s += 8;
  return s;
}

function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const queueRef = useRef([]);
  const activeRef = useRef(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices() || [];
      const english = v.filter(voice => voice.lang.startsWith("en"));
      english.sort((a, b) => scoreVoice(b) - scoreVoice(a));
      setVoices(english);
      if (english.length > 0 && !selectedVoice) {
        setSelectedVoice(english[0]);
      }
    };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    const retry = setTimeout(loadVoices, 500);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
      clearTimeout(retry);
    };
  }, []);

  const speakNext = useCallback(() => {
    if (!window.speechSynthesis || queueRef.current.length === 0) {
      activeRef.current = false;
      setSpeaking(false);
      return;
    }
    const chunk = queueRef.current.shift();
    const utt = new SpeechSynthesisUtterance(chunk.text);
    utt.rate = chunk.rate;
    utt.pitch = chunk.pitch;
    if (selectedVoice) utt.voice = selectedVoice;
    utt.onend = () => {
      if (queueRef.current.length > 0) {
        setTimeout(() => speakNext(), chunk.pauseAfter || 80);
      } else {
        activeRef.current = false;
        setSpeaking(false);
      }
    };
    utt.onerror = () => {
      activeRef.current = false;
      setSpeaking(false);
      queueRef.current = [];
    };
    window.speechSynthesis.speak(utt);
  }, [selectedVoice]);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    queueRef.current = [];

    const clean = text.replace(/\*\*/g, "");

    // For sentences under ~20 words, speak as a single utterance.
    // The speech engine handles natural prosody within one utterance
    // far better than we can by artificially splitting.
    const wordCount = clean.split(/\s+/).length;

    if (wordCount <= 22) {
      // Single utterance — let the engine handle phrasing naturally
      const endsQ = clean.trim().endsWith("?");
      const endsE = clean.trim().endsWith("!");
      queueRef.current = [{
        text: clean.trim(),
        rate: 0.85,
        pitch: endsQ ? 1.1 : endsE ? 1.06 : 1.02,
        pauseAfter: 0
      }];
    } else {
      // Only for very long text: split at sentence-ending punctuation only
      const sentences = clean
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.trim().length > 0);

      queueRef.current = sentences.map((s, i) => {
        const isLast = i === sentences.length - 1;
        const endsQ = s.trim().endsWith("?");
        const endsE = s.trim().endsWith("!");
        return {
          text: s.trim(),
          rate: 0.85,
          pitch: endsQ ? 1.1 : endsE ? 1.06 : 1.02,
          pauseAfter: isLast ? 0 : 200
        };
      });
    }

    activeRef.current = true;
    setSpeaking(true);
    speakNext();
  }, [speakNext]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    queueRef.current = [];
    activeRef.current = false;
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, voices, selectedVoice, setSelectedVoice, showVoicePicker, setShowVoicePicker };
}

/* ───────────────────────────────────────────
   DRIPPING SLIME SVG COMPONENT
   ─────────────────────────────────────────── */
function SlimeDrip() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "60px", zIndex: 2, pointerEvents: "none" }} viewBox="0 0 800 60" preserveAspectRatio="none">
      <defs>
        <linearGradient id="slimeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4caf50" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M0,0 L800,0 L800,15 Q750,14 700,20 Q680,35 660,18 Q620,16 580,22 Q560,45 540,20 Q500,15 460,25 Q440,55 420,18 Q380,14 340,22 Q320,40 300,16 Q260,14 220,20 Q200,48 180,18 Q140,16 100,24 Q80,42 60,16 Q30,14 0,18 Z" fill="url(#slimeGrad)">
        <animate attributeName="d" dur="4s" repeatCount="indefinite" values="
          M0,0 L800,0 L800,15 Q750,14 700,20 Q680,35 660,18 Q620,16 580,22 Q560,45 540,20 Q500,15 460,25 Q440,55 420,18 Q380,14 340,22 Q320,40 300,16 Q260,14 220,20 Q200,48 180,18 Q140,16 100,24 Q80,42 60,16 Q30,14 0,18 Z;
          M0,0 L800,0 L800,18 Q750,16 700,24 Q680,42 660,20 Q620,18 580,26 Q560,50 540,22 Q500,18 460,20 Q440,48 420,16 Q380,16 340,26 Q320,44 300,20 Q260,16 220,24 Q200,42 180,16 Q140,18 100,20 Q80,38 60,20 Q30,16 0,15 Z;
          M0,0 L800,0 L800,15 Q750,14 700,20 Q680,35 660,18 Q620,16 580,22 Q560,45 540,20 Q500,15 460,25 Q440,55 420,18 Q380,14 340,22 Q320,40 300,16 Q260,14 220,20 Q200,48 180,18 Q140,16 100,24 Q80,42 60,16 Q30,14 0,18 Z
        "/>
      </path>
    </svg>
  );
}

/* ───────────────────────────────────────────
   CREEPING PASTA TENTACLES
   ─────────────────────────────────────────── */
function PastaTentacles() {
  const tentacles = [
    { left: "5%", delay: "0s", height: "120px" },
    { left: "15%", delay: "1.2s", height: "90px" },
    { left: "30%", delay: "0.4s", height: "140px" },
    { left: "50%", delay: "1.8s", height: "100px" },
    { left: "70%", delay: "0.8s", height: "130px" },
    { left: "85%", delay: "1.5s", height: "110px" },
    { left: "95%", delay: "0.2s", height: "95px" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "150px", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {tentacles.map((t, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "-20px",
          left: t.left,
          width: "18px",
          height: t.height,
          background: `linear-gradient(to top, #e8c96880, #d4a03440)`,
          borderRadius: "9px 9px 4px 4px",
          animation: `tentacleCreep 3.5s ease-in-out infinite`,
          animationDelay: t.delay,
          transformOrigin: "bottom center",
          opacity: 0.35
        }} />
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────
   SPEECH RATE INDICATOR BAR
   ─────────────────────────────────────────── */
function SpeechRateBar({ rateStatus, micActive }) {
  const colors = {
    idle: "rgba(255,255,255,0.1)",
    silent: "rgba(255,255,255,0.15)",
    good: "#4caf50",
    fast: "#f44336"
  };
  const labels = {
    idle: "🎤 Microphone ready...",
    silent: "🎤 Waiting for speech...",
    good: "✅ Great pace! Nice and steady!",
    fast: "🔴 Slow down a little!"
  };
  const bgColor = colors[rateStatus] || colors.idle;
  const isFlashing = rateStatus === "fast";

  return (
    <div style={{
      background: rateStatus === "fast"
        ? undefined
        : rateStatus === "good"
          ? "rgba(76,175,80,0.15)"
          : "rgba(255,255,255,0.05)",
      border: `2px solid ${bgColor}`,
      borderRadius: "16px",
      padding: "12px 18px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "all 0.3s ease",
      animation: isFlashing ? "flashRed 0.5s ease-in-out infinite" : "none",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background glow for good rate */}
      {rateStatus === "good" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(76,175,80,0.1), transparent)",
          animation: "sweepGreen 2s ease-in-out infinite"
        }} />
      )}
      <div style={{
        width: "12px", height: "12px", borderRadius: "50%",
        background: bgColor,
        boxShadow: rateStatus === "good" ? "0 0 12px rgba(76,175,80,0.6)" : rateStatus === "fast" ? "0 0 12px rgba(244,67,54,0.6)" : "none",
        animation: micActive ? "pulseDot 1.5s ease-in-out infinite" : "none",
        flexShrink: 0,
        position: "relative", zIndex: 1
      }} />
      <span style={{
        fontSize: "14px",
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 600,
        color: rateStatus === "fast" ? "#ff8a80" : rateStatus === "good" ? "#a5d6a7" : "#b39ddb",
        position: "relative", zIndex: 1
      }}>
        {labels[rateStatus]}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN GAME COMPONENT
   ═══════════════════════════════════════════ */
export default function PastaInvasionGame() {
  const [gameState, setGameState] = useState("menu");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [path, setPath] = useState([]);
  const [practiceDone, setPracticeDone] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [revealedWords, setRevealedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [showEnding, setShowEnding] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  const [starBurst, setStarBurst] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  // Feature toggles
  const [micEnabled, setMicEnabled] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Hooks
  const { rateStatus, micActive } = useSpeechRateMonitor(micEnabled && gameState === "practice");
  const { speak, stop: stopTTS, speaking, voices, selectedVoice, setSelectedVoice, showVoicePicker, setShowVoicePicker } = useTTS();

  // Load saved game
  useEffect(() => {
    const loadGame = async () => {
      try {
        const result = await window.storage.get("pasta-invasion-save-v2");
        if (result && result.value) {
          const save = JSON.parse(result.value);
          setCurrentLevel(save.currentLevel || 1);
          setCompletedLevels(save.completedLevels || []);
          setPath(save.path || []);
          setScore(save.score || 0);
          if (save.micEnabled !== undefined) setMicEnabled(save.micEnabled);
          if (save.ttsEnabled !== undefined) setTtsEnabled(save.ttsEnabled);
        }
      } catch (e) { console.log("No save found"); }
      setIsLoading(false);
    };
    loadGame();
  }, []);

  const saveGame = useCallback(async (levelId, completed, pathArr, newScore) => {
    try {
      await window.storage.set("pasta-invasion-save-v2", JSON.stringify({
        currentLevel: levelId, completedLevels: completed, path: pathArr,
        score: newScore, micEnabled, ttsEnabled, savedAt: new Date().toISOString()
      }));
      setSaveStatus("💾 Saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) { console.log("Save failed"); }
  }, [micEnabled, ttsEnabled]);

  const resetGame = useCallback(async () => {
    try { await window.storage.delete("pasta-invasion-save-v2"); } catch(e) {}
    setCurrentLevel(1); setCompletedLevels([]); setPath([]); setScore(0);
    setShowEnding(null); setPracticeDone(false); setCurrentSentenceIdx(0);
    setRevealedWords([]); setGameState("menu"); stopTTS();
  }, [stopTTS]);

  const startLevel = useCallback((levelId) => {
    stopTTS();
    setAnimateIn(true); setPracticeDone(false); setCurrentSentenceIdx(0); setRevealedWords([]);
    if (typeof levelId === "string" && levelId.startsWith("ending_")) {
      setShowEnding(levelId); setGameState("ending");
      setScreenShake(true); setTimeout(() => setScreenShake(false), 600);
    } else {
      setCurrentLevel(levelId); setGameState("story");
    }
    setTimeout(() => setAnimateIn(false), 600);
  }, [stopTTS]);

  const handlePracticeWord = useCallback((word) => {
    if (!revealedWords.includes(word)) {
      const newRevealed = [...revealedWords, word];
      setRevealedWords(newRevealed);
      setStarBurst(true);
      setTimeout(() => setStarBurst(false), 500);
      const level = LEVELS.find(l => l.id === currentLevel);
      if (level) {
        const currentWords = level.sentenceWords[currentSentenceIdx];
        if (currentWords.every(w => newRevealed.includes(w))) {
          if (currentSentenceIdx === 0) {
            setCurrentSentenceIdx(1);
            stopTTS();
          } else {
            setPracticeDone(true);
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 400);
            const newScore = score + 10;
            setScore(newScore);
            const newCompleted = [...completedLevels, currentLevel];
            setCompletedLevels(newCompleted);
            const newPath = [...path, currentLevel];
            setPath(newPath);
            saveGame(currentLevel, newCompleted, newPath, newScore);
            stopTTS();
          }
        }
      }
    }
  }, [revealedWords, currentLevel, currentSentenceIdx, score, completedLevels, path, saveGame, stopTTS]);

  const level = LEVELS.find(l => l.id === currentLevel);

  const renderSentenceWithHighlights = (sentence) => {
    const parts = sentence.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const clean = part.replace(/\*\*/g, "");
        return <span key={i} style={{
          color: "#ff6b6b", fontWeight: 800,
          textShadow: "0 0 10px rgba(255,107,107,0.5), 0 0 20px rgba(255,60,60,0.2)",
          position: "relative"
        }}>{clean}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderTargetWordButtons = (level) => {
    const currentWords = level.sentenceWords[currentSentenceIdx];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
        {currentWords.map((word) => {
          const done = revealedWords.includes(word);
          return (
            <button key={word} onClick={() => handlePracticeWord(word)}
              style={{
                padding: "10px 20px", borderRadius: "30px",
                border: done ? "2px solid #66bb6a" : "2px solid #ff8a65",
                background: done ? "linear-gradient(135deg, #66bb6a, #43a047)" : "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                color: done ? "white" : "#bf360c",
                fontFamily: "'Fredoka', sans-serif", fontSize: "17px", fontWeight: 600,
                cursor: done ? "default" : "pointer",
                transform: done ? "scale(0.95)" : "scale(1)",
                transition: "all 0.3s ease",
                boxShadow: done ? "0 2px 8px rgba(102,187,106,0.4)" : "0 3px 12px rgba(255,138,101,0.3)"
              }}
              disabled={done}
            >
              {done ? "✅ " : "🎤 "}{word}
            </button>
          );
        })}
      </div>
    );
  };

  /* ── Settings toggle row ── */
  const SettingsToggles = ({ compact }) => (
    <div style={{
      display: "flex", gap: compact ? "8px" : "12px", flexWrap: "wrap",
      justifyContent: compact ? "flex-start" : "center"
    }}>
      <button onClick={() => setMicEnabled(!micEnabled)} style={{
        padding: compact ? "6px 12px" : "10px 18px", borderRadius: "25px",
        border: `2px solid ${micEnabled ? "#4caf50" : "rgba(255,255,255,0.15)"}`,
        background: micEnabled ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)",
        color: micEnabled ? "#a5d6a7" : "#b39ddb",
        fontFamily: "'Fredoka', sans-serif", fontSize: compact ? "12px" : "14px",
        fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease"
      }}>
        {micEnabled ? "🟢 Speech Rate: ON" : "⚪ Speech Rate: OFF"}
      </button>
      <button onClick={() => setTtsEnabled(!ttsEnabled)} style={{
        padding: compact ? "6px 12px" : "10px 18px", borderRadius: "25px",
        border: `2px solid ${ttsEnabled ? "#7c4dff" : "rgba(255,255,255,0.15)"}`,
        background: ttsEnabled ? "rgba(124,77,255,0.2)" : "rgba(255,255,255,0.05)",
        color: ttsEnabled ? "#ce93d8" : "#b39ddb",
        fontFamily: "'Fredoka', sans-serif", fontSize: compact ? "12px" : "14px",
        fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease"
      }}>
        {ttsEnabled ? "🔊 Read Aloud: ON" : "🔇 Read Aloud: OFF"}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(180deg, #0d0520 0%, #1a0a2e 50%, #2d1b69 100%)",
        fontFamily: "'Fredoka', sans-serif", color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", animation: "spin 1s linear infinite" }}>🍝</div>
          <p style={{ marginTop: "16px", fontSize: "20px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0d0520 0%, #1a0a2e 30%, #2d1b69 60%, #1a0a2e 100%)",
      fontFamily: "'Fredoka', sans-serif", color: "#f5f0ff",
      position: "relative", overflow: "hidden",
      animation: screenShake ? "screenShake 0.4s ease-in-out" : "none"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Creepster&display=swap" rel="stylesheet" />

      {/* Eerie fog layer */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% 80%, rgba(76,175,80,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(255,107,107,0.04) 0%, transparent 50%)"
      }} />

      {/* Floating ghost pasta */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            fontSize: `${18 + (i % 5) * 8}px`,
            left: `${(i * 6.7) % 100}%`,
            top: `${(i * 11.3 + 5) % 95}%`,
            opacity: 0.06 + (i % 3) * 0.02,
            animation: `ghostFloat ${6 + i % 4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            filter: "blur(1px)"
          }}>
            {["🍝","🍜","🫕","👻","🕷️","💀","🧟","🍕","🥟","👁️","🦴","🕸️","🧄","🔪","🫙"][i % 15]}
          </div>
        ))}
      </div>

      <PastaTentacles />

      <style>{`
        @keyframes ghostFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.06; }
          25% { transform: translateY(-15px) rotate(-5deg) scale(1.05); opacity: 0.1; }
          50% { transform: translateY(-25px) rotate(5deg) scale(1.1); opacity: 0.08; }
          75% { transform: translateY(-10px) rotate(-3deg) scale(1.02); opacity: 0.12; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes starburst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-5deg) scale(1); } 50% { transform: rotate(5deg) scale(1.05); } }
        @keyframes tentacleCreep {
          0%, 100% { transform: scaleY(0.7) rotate(0deg); }
          30% { transform: scaleY(1) rotate(3deg); }
          60% { transform: scaleY(0.85) rotate(-2deg); }
          80% { transform: scaleY(1.1) rotate(1deg); }
        }
        @keyframes flashRed {
          0%, 100% { background: rgba(244,67,54,0.08); border-color: #f44336; }
          50% { background: rgba(244,67,54,0.25); border-color: #ff8a80; }
        }
        @keyframes sweepGreen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); box-shadow: 0 0 4px currentColor; }
          50% { transform: scale(1.3); box-shadow: 0 0 12px currentColor; }
        }
        @keyframes screenShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-0.5deg); }
          30% { transform: translateX(5px) rotate(0.5deg); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(3px) rotate(-0.3deg); }
          75% { transform: translateX(-2px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(76,175,80,0.2), inset 0 0 20px rgba(76,175,80,0.05); }
          50% { box-shadow: 0 0 40px rgba(76,175,80,0.4), inset 0 0 30px rgba(76,175,80,0.1); }
        }
        @keyframes drip {
          0% { transform: translateY(-5px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }
        @keyframes speakWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.4); }
        }
        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255,107,107,0.3)); }
          50% { filter: drop-shadow(0 0 25px rgba(255,107,107,0.6)) drop-shadow(0 0 50px rgba(255,171,145,0.2)); }
        }
        @keyframes eyeGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Save status toast */}
      {saveStatus && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 100,
          background: "rgba(102,187,106,0.95)", color: "white",
          padding: "10px 20px", borderRadius: "20px",
          fontFamily: "'Fredoka', sans-serif", fontSize: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)", animation: "slideUp 0.3s ease"
        }}>{saveStatus}</div>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: "750px", margin: "0 auto", padding: "20px" }}>

        {/* ══════════ MENU ══════════ */}
        {gameState === "menu" && (
          <div style={{ textAlign: "center", paddingTop: "30px", animation: "slideUp 0.6s ease" }}>
            {/* Eerie eyes */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ fontSize: "80px", marginBottom: "5px", animation: "wiggle 3s ease-in-out infinite", filter: "drop-shadow(0 0 20px rgba(255,107,107,0.3))" }}>🍝</div>
              <div style={{ position: "absolute", top: "15px", left: "-20px", fontSize: "24px", animation: "eyeGlow 2s ease-in-out infinite" }}>👁️</div>
              <div style={{ position: "absolute", top: "15px", right: "-20px", fontSize: "24px", animation: "eyeGlow 2s ease-in-out infinite", animationDelay: "0.5s" }}>👁️</div>
            </div>

            <h1 style={{
              fontFamily: "'Creepster', cursive",
              fontSize: "clamp(38px, 8vw, 62px)",
              background: "linear-gradient(135deg, #ff6b6b, #ff8a65, #ffee58, #ff6b6b)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "4px", lineHeight: 1.1,
              animation: "titleGlow 3s ease-in-out infinite"
            }}>PASTA INVASION</h1>

            <p style={{ fontSize: "16px", color: "#81c784", marginBottom: "6px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase" }}>
              ☠️ A Vocalic R Adventure ☠️
            </p>
            <p style={{ fontSize: "13px", color: "#7e57c2", marginBottom: "28px", fontStyle: "italic" }}>
              Reader beware... you're in for a scare!
            </p>

            {completedLevels.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: "20px",
                padding: "18px", marginBottom: "20px",
                border: "1px solid rgba(76,175,80,0.2)",
                boxShadow: "inset 0 0 30px rgba(76,175,80,0.05)"
              }}>
                <p style={{ fontSize: "16px", color: "#b39ddb" }}>
                  ⭐ Score: <span style={{ color: "#ffee58", fontWeight: 700 }}>{score}</span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  💀 Levels: <span style={{ color: "#ffee58", fontWeight: 700 }}>{completedLevels.length}/{LEVELS.length}</span>
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "0 auto 24px" }}>
              {completedLevels.length > 0 && (
                <button onClick={() => startLevel(currentLevel)} style={{
                  padding: "16px 36px", borderRadius: "50px", border: "none",
                  background: "linear-gradient(135deg, #7c4dff, #536dfe)",
                  color: "white", fontSize: "19px", fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 6px 25px rgba(124,77,255,0.5), 0 0 40px rgba(124,77,255,0.15)"
                }}>▶️ Continue Adventure</button>
              )}
              <button onClick={() => { resetGame().then(() => startLevel(1)); }} style={{
                padding: "16px 36px", borderRadius: "50px",
                border: completedLevels.length > 0 ? "2px solid rgba(255,255,255,0.2)" : "none",
                background: completedLevels.length > 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #ff6b6b, #ff8a65)",
                color: "white", fontSize: "19px", fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700, cursor: "pointer",
                boxShadow: completedLevels.length > 0 ? "none" : "0 6px 25px rgba(255,107,107,0.5)"
              }}>🆕 New Game</button>
            </div>

            {/* Feature settings */}
            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: "20px",
              padding: "20px", marginBottom: "20px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h3 style={{ color: "#81c784", marginBottom: "14px", fontSize: "16px" }}>⚙️ Speech Tools</h3>
              <SettingsToggles compact={false} />
              <p style={{ fontSize: "12px", color: "#7e57c2", marginTop: "10px", lineHeight: 1.5 }}>
                🎤 <b>Speech Rate</b> monitors your pace via microphone — green = steady, red = too fast<br/>
                🔊 <b>Read Aloud</b> adds a button to hear each sentence spoken for you
              </p>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: "20px",
              padding: "20px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left"
            }}>
              <h3 style={{ color: "#ffab91", marginBottom: "10px", fontSize: "16px" }}>🎮 How to Play</h3>
              <p style={{ color: "#b39ddb", fontSize: "14px", lineHeight: 1.7 }}>
                Read each sentence out loud, focusing on the <span style={{ color: "#ff6b6b", fontWeight: 700 }}>R sounds</span> in red.
                Tap each target word after you say it. Complete both sentences to unlock the next part of the story, then choose what happens next!
              </p>
            </div>
          </div>
        )}

        {/* ══════════ STORY ══════════ */}
        {gameState === "story" && level && (
          <div style={{ paddingTop: "16px", animation: animateIn ? "slideUp 0.6s ease" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <button onClick={() => { setGameState("menu"); stopTTS(); }} style={{
                background: "rgba(255,255,255,0.08)", border: "none", color: "#b39ddb",
                padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                fontFamily: "'Fredoka', sans-serif", fontSize: "14px"
              }}>← Menu</button>
              <div style={{ color: "#ffee58", fontWeight: 600, fontSize: "15px" }}>⭐ {score} pts</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,107,0.1), rgba(76,175,80,0.05))",
              borderRadius: "24px", padding: "28px", position: "relative", overflow: "hidden",
              border: "1px solid rgba(255,107,107,0.15)",
              marginBottom: "20px",
              animation: "glowPulse 4s ease-in-out infinite"
            }}>
              <SlimeDrip />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative", zIndex: 3 }}>
                <span style={{ fontSize: "32px" }}>📖</span>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffab91", margin: 0 }}>
                    Level {level.id}: {level.title}
                  </h2>
                  <span style={{
                    fontSize: "11px", color: "#81c784",
                    background: "rgba(76,175,80,0.15)",
                    padding: "3px 10px", borderRadius: "10px", fontWeight: 600
                  }}>{level.vocalicR.replace(/-/g, " ").toUpperCase()}</span>
                </div>
              </div>
              <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#f5f0ff", position: "relative", zIndex: 3 }}>
                {level.story}
              </p>
            </div>

            <button onClick={() => setGameState("practice")} style={{
              display: "block", width: "100%", padding: "18px", borderRadius: "50px",
              border: "2px solid rgba(255,107,107,0.3)",
              background: "linear-gradient(135deg, #ff6b6b, #ff8a65)",
              color: "white", fontSize: "20px", fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 6px 25px rgba(255,107,107,0.4), 0 0 60px rgba(255,107,107,0.1)",
              animation: "pulse 2s ease-in-out infinite"
            }}>🎤 Start R Practice!</button>
          </div>
        )}

        {/* ══════════ PRACTICE ══════════ */}
        {gameState === "practice" && level && (
          <div style={{ paddingTop: "16px", animation: animateIn ? "slideUp 0.6s ease" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => { setGameState("story"); stopTTS(); }} style={{
                background: "rgba(255,255,255,0.08)", border: "none", color: "#b39ddb",
                padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                fontFamily: "'Fredoka', sans-serif", fontSize: "14px"
              }}>← Story</button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <SettingsToggles compact={true} />
                <span style={{ color: "#ffee58", fontWeight: 600, fontSize: "14px" }}>
                  {currentSentenceIdx + 1}/2
                </span>
              </div>
            </div>

            {/* Speech Rate Monitor */}
            {micEnabled && <SpeechRateBar rateStatus={rateStatus} micActive={micActive} />}

            {/* Sentence card */}
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: "24px",
              padding: "24px", position: "relative", overflow: "hidden",
              border: `1px solid ${rateStatus === "fast" && micEnabled ? "rgba(244,67,54,0.4)" : "rgba(255,255,255,0.08)"}`,
              marginBottom: "20px",
              transition: "border-color 0.3s ease"
            }}>
              {starBurst && (
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: "50px", height: "50px",
                  background: "radial-gradient(circle, #ffee58 0%, #ff8a65 30%, transparent 70%)",
                  borderRadius: "50%", animation: "starburst 0.5s ease-out forwards",
                  pointerEvents: "none", transform: "translate(-50%, -50%)"
                }} />
              )}

              <div style={{
                fontSize: "12px", color: "#81c784", fontWeight: 600,
                marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1.5px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span>🔴 Say this sentence out loud</span>
                <span style={{ color: "#7e57c2" }}>— focus on the R sounds in red!</span>
              </div>

              <p style={{ fontSize: "20px", lineHeight: 2, color: "#f5f0ff", fontWeight: 500, margin: "0 0 16px 0" }}>
                {renderSentenceWithHighlights(level.sentences[currentSentenceIdx])}
              </p>

              {/* TTS Read Aloud button */}
              {ttsEnabled && (
                <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => speaking ? stopTTS() : speak(level.sentences[currentSentenceIdx])}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "8px 18px", borderRadius: "25px",
                      border: `2px solid ${speaking ? "#ff8a65" : "rgba(124,77,255,0.4)"}`,
                      background: speaking ? "rgba(255,138,101,0.15)" : "rgba(124,77,255,0.1)",
                      color: speaking ? "#ffab91" : "#ce93d8",
                      fontFamily: "'Fredoka', sans-serif", fontSize: "14px", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.3s ease"
                    }}
                  >
                    {speaking ? (
                      <>
                        <span style={{ display: "inline-flex", gap: "2px", alignItems: "flex-end", height: "16px" }}>
                          {[0,1,2,3,4].map(j => (
                            <span key={j} style={{
                              display: "inline-block", width: "3px",
                              height: `${8 + (j % 3) * 4}px`,
                              background: "#ff8a65", borderRadius: "2px",
                              animation: `speakWave 0.6s ease-in-out infinite`,
                              animationDelay: `${j * 0.1}s`
                            }} />
                          ))}
                        </span>
                        Stop
                      </>
                    ) : (
                      <>🔊 Read to Me</>
                    )}
                  </button>

                  {/* Voice picker toggle */}
                  <button
                    onClick={() => setShowVoicePicker(!showVoicePicker)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      padding: "8px 12px", borderRadius: "25px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#9575cd", fontFamily: "'Fredoka', sans-serif",
                      fontSize: "12px", fontWeight: 500, cursor: "pointer"
                    }}
                    title="Choose a voice"
                  >
                    🎙️ {selectedVoice ? selectedVoice.name.split(" ").slice(0, 2).join(" ") : "Voice"}
                  </button>
                </div>

                {/* Voice picker dropdown */}
                {showVoicePicker && voices.length > 0 && (
                  <div style={{
                    marginTop: "10px", background: "rgba(30,15,60,0.95)",
                    borderRadius: "16px", padding: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    maxHeight: "160px", overflowY: "auto"
                  }}>
                    <p style={{ fontSize: "11px", color: "#7e57c2", marginBottom: "8px", fontWeight: 600 }}>
                      Choose the voice that sounds most natural on your device:
                    </p>
                    {voices.slice(0, 12).map((v, i) => (
                      <button key={i}
                        onClick={() => { setSelectedVoice(v); setShowVoicePicker(false); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "7px 12px", marginBottom: "3px",
                          borderRadius: "10px", border: "none",
                          background: selectedVoice?.name === v.name ? "rgba(124,77,255,0.25)" : "rgba(255,255,255,0.03)",
                          color: selectedVoice?.name === v.name ? "#ce93d8" : "#b39ddb",
                          fontFamily: "'Fredoka', sans-serif", fontSize: "12px",
                          cursor: "pointer", transition: "background 0.2s"
                        }}
                      >
                        {selectedVoice?.name === v.name ? "✅ " : ""}{v.name}
                        <span style={{ color: "#7e57c2", fontSize: "10px", marginLeft: "6px" }}>
                          {v.lang} {!v.localService ? "☁️" : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                </>
              )}
            </div>

            {/* Target word buttons */}
            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: "24px",
              padding: "20px", border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <p style={{ fontSize: "13px", color: "#b39ddb", marginBottom: "12px", textAlign: "center", fontWeight: 600 }}>
                👆 Tap each word after you say it with a clear R sound:
              </p>
              {renderTargetWordButtons(level)}
            </div>

            {/* Practice complete */}
            {practiceDone && (
              <div style={{ marginTop: "20px", animation: "slideUp 0.5s ease" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(46,125,50,0.1))",
                  borderRadius: "24px", padding: "22px",
                  border: "1px solid rgba(76,175,80,0.3)",
                  textAlign: "center", marginBottom: "16px",
                  boxShadow: "0 0 30px rgba(76,175,80,0.1)"
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "6px" }}>🌟</div>
                  <h3 style={{ color: "#a5d6a7", fontSize: "22px", marginBottom: "2px" }}>Amazing R Practice!</h3>
                  <p style={{ color: "#81c784", fontSize: "15px" }}>+10 points! Now choose what happens next...</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {level.choices.map((choice, i) => (
                    <button key={i} onClick={() => startLevel(choice.next)}
                      style={{
                        padding: "16px 22px", borderRadius: "20px",
                        border: "2px solid rgba(255,255,255,0.12)",
                        background: i === 0
                          ? "linear-gradient(135deg, rgba(124,77,255,0.25), rgba(83,109,254,0.15))"
                          : "linear-gradient(135deg, rgba(255,138,101,0.25), rgba(255,107,107,0.15))",
                        color: "white", fontSize: "17px", fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 600, cursor: "pointer", textAlign: "left",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                      }}
                    >{choice.text}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ ENDING ══════════ */}
        {gameState === "ending" && showEnding && ENDINGS[showEnding] && (
          <div style={{ paddingTop: "35px", textAlign: "center", animation: "slideUp 0.8s ease" }}>
            <div style={{ fontSize: "80px", marginBottom: "12px", filter: "drop-shadow(0 0 20px rgba(255,235,59,0.3))" }}>
              {ENDINGS[showEnding].emoji}
            </div>
            <h1 style={{
              fontFamily: "'Creepster', cursive",
              fontSize: "clamp(32px, 6vw, 48px)",
              background: "linear-gradient(135deg, #ffee58, #ffa726, #ff6b6b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "14px",
              animation: "titleGlow 3s ease-in-out infinite"
            }}>{ENDINGS[showEnding].title}</h1>

            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: "24px",
              padding: "26px", border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "20px", position: "relative", overflow: "hidden"
            }}>
              <SlimeDrip />
              <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#f5f0ff", position: "relative", zIndex: 3 }}>
                {ENDINGS[showEnding].text}
              </p>
            </div>

            <div style={{
              background: "rgba(255,171,145,0.08)", borderRadius: "20px",
              padding: "18px", marginBottom: "20px",
              border: "1px solid rgba(255,171,145,0.12)"
            }}>
              <p style={{ fontSize: "24px", color: "#ffab91", fontWeight: 700 }}>🏆 Final Score: {score} points</p>
              <p style={{ fontSize: "14px", color: "#b39ddb", marginTop: "2px" }}>
                {completedLevels.length} levels completed out of {LEVELS.length}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }}>
              <button onClick={() => resetGame()} style={{
                padding: "16px 36px", borderRadius: "50px", border: "none",
                background: "linear-gradient(135deg, #ff6b6b, #ff8a65)",
                color: "white", fontSize: "19px", fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700, cursor: "pointer",
                boxShadow: "0 6px 25px rgba(255,107,107,0.4)"
              }}>🔄 Play Again (New Path!)</button>
              <p style={{ fontSize: "12px", color: "#7e57c2" }}>Try different choices for new endings!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
