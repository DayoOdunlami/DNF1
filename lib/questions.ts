import type { Round } from './types';

export const rounds: Round[] = [
  {
    name: "Mr & Mrs",
    subtitle: "How well do you really know each other?",
    type: "mr-mrs",
    questions: [
      { question: "What would your partner say is their biggest driving pet peeve?", forPlayer: "both" },
      { question: "If your partner could attend any F1 race in the world, which would they choose?", forPlayer: "both" },
      { question: "What's your partner's most controversial F1 opinion?", forPlayer: "both" },
      { question: "Who would your partner say is the most attractive F1 driver?", forPlayer: "both" },
      { question: "What's the first thing your partner would buy if they won the lottery?", forPlayer: "both" }
    ]
  },
  {
    name: "Confidence Trivia",
    subtitle: "Risk it for the biscuit - tyre strategy matters!",
    type: "confidence",
    questions: [
      {
        question: "How many World Championships has Lewis Hamilton won?",
        answer: 7,
        hint: "He's tied with the all-time record holder",
        ranges: { soft: 1, medium: 2, hard: 3 }
      },
      {
        question: "In what year did Max Verstappen make his F1 debut?",
        answer: 2015,
        hint: "He was the youngest ever F1 driver at the time",
        ranges: { soft: 1, medium: 3, hard: 5 }
      },
      {
        question: "How many races are in the 2024 F1 calendar?",
        answer: 24,
        hint: "It's the longest season ever",
        ranges: { soft: 1, medium: 3, hard: 5 }
      },
      {
        question: "What's the top speed (mph) reached by an F1 car at Monza in 2023?",
        answer: 227,
        hint: "It's one of the fastest tracks on the calendar",
        ranges: { soft: 5, medium: 15, hard: 30 }
      },
      {
        question: "How many constructor titles has Ferrari won?",
        answer: 16,
        hint: "They're the most successful team in F1 history",
        ranges: { soft: 1, medium: 3, hard: 5 }
      }
    ]
  },
  {
    name: "What Happened Next?",
    subtitle: "Watch the clip, predict the outcome!",
    type: "video",
    questions: [
      {
        title: "Formula Ford Havoc Crash",
        description: "A Formula Ford car enters a tight corner.",
        videoId: "lblsowacHmY",
        startTime: 65,
        pauseTime: 75,
        options: [
          "It makes it through cleanly",
          "It spins and recovers",
          "It hits the barrier",
          "It gets airborne"
        ],
        correct: 2,
        hint: "Too much speed for the angle."
      },
      {
        title: "WRC Top Co-Driver Moments",
        description: "A co-driver shouts instructions on a fast stage.",
        videoId: "3QltBMb9MXI",
        startTime: 30,
        pauseTime: 45,
        options: [
          "Perfect pace notes",
          "Notes completely wrong",
          "Driver ignores instructions",
          "They spin out"
        ],
        correct: 1,
        hint: "Chaos in the notes."
      },
      {
        title: "NASCAR's Funniest Moments",
        description: "A Cup Series driver approaches pit lane unusually.",
        videoId: "4pIh-SXBaIU",
        startTime: 70,
        pauseTime: 85,
        options: [
          "Perfect pit entry",
          "Slows too early",
          "Misses turn",
          "Speeds through cleanly"
        ],
        correct: 2,
        hint: "Where's the left turn?"
      },
      {
        title: "Wildest WRC Rally Moments",
        description: "A rally car hits a blind crest.",
        videoId: "_GCKI_LbnRM",
        startTime: 166,
        pauseTime: 180,
        options: [
          "Lands straight",
          "Slides sideways",
          "Spins off",
          "Lands in spectator area"
        ],
        correct: 1,
        hint: "Too much throttle."
      },
      {
        title: "Motorsport Crash 2025 – May Compilation",
        description: "A rally car clipping a corner on a jump.",
        videoId: "XesD9Njz75M",
        startTime: 50,
        pauseTime: 65,
        options: [
          "Clears it",
          "Nose down and crash",
          "Spins sideways",
          "Red flag stops action"
        ],
        correct: 0,
        hint: "Off-line but still alive."
      },
      {
        title: "Best Motorsport Crashes 2024",
        description: "A GT car enters high speed sweep.",
        videoId: "TOtoe3KqyOI",
        startTime: 195,
        pauseTime: 210,
        options: [
          "Runs clean",
          "Tire blowout",
          "Hits wall",
          "Spins free"
        ],
        correct: 3,
        hint: "Slides without hitting."
      },
      {
        title: "Rally Bloopers (WRC Finland)",
        description: "A competitor laughs on the stage.",
        videoId: "Dul8o9cNh5k",
        startTime: 40,
        pauseTime: 55,
        options: [
          "Tricky hairpin",
          "Co-driver sneezes",
          "Driver loses glove",
          "Car fogs up"
        ],
        correct: 1,
        hint: "Unexpected human chaos."
      },
      {
        title: "Motorsport Crash 2025 – Week 21",
        description: "A touring car swings wide.",
        videoId: "0yklYJ7zpSY",
        startTime: 78,
        pauseTime: 93,
        options: [
          "Tip-over crash",
          "Clean pass",
          "Spins into pits",
          "Hits barrier hard"
        ],
        correct: 0,
        hint: "Airborne surprise."
      },
      {
        title: "Havoc 6 Crash Montage",
        description: "A rally driver misjudges the corner.",
        videoId: "AJpB9rVamUk",
        startTime: 142,
        pauseTime: 160,
        options: [
          "Finds grip",
          "Against bank",
          "Rolls multiple times",
          "Continues clean"
        ],
        correct: 2,
        hint: "Roof-top view."
      },
      {
        title: "Top WRC Rally 2025 Crashes",
        description: "A high speed country road corner.",
        videoId: "luBn70tuJXg",
        startTime: 110,
        pauseTime: 125,
        options: [
          "Perfect through",
          "Understeer broadside",
          "Oversteer spin",
          "Bounce off bank"
        ],
        correct: 1,
        hint: "Too wide."
      },
      {
        title: "NASCAR AIRBORNE Moments",
        description: "A stock car approaches turn four.",
        videoId: "-UvRK_a0vm8",
        startTime: 37,
        pauseTime: 52,
        options: [
          "Stays down",
          "Gets airborne",
          "Tire blowout",
          "Spins out"
        ],
        correct: 1,
        hint: "Nose lifts."
      },
      {
        title: "Motorsport Crashes 2025 Week 40/41",
        description: "A car fights for track position.",
        videoId: "EJ7IcVDBTM4",
        startTime: 185,
        pauseTime: 200,
        options: [
          "Spins out",
          "Clean defend",
          "Contact and wobble",
          "Pit-lane drama"
        ],
        correct: 2,
        hint: "Front-end instability."
      },
      {
        title: "WRC Bloopers & Funny Highlights",
        description: "Something goes hilariously wrong on stage.",
        videoId: "ARjjMPWiLgo",
        startTime: 58,
        pauseTime: 73,
        options: [
          "Perfect run",
          "Car pops hood",
          "Co-driver trips",
          "Radio falls out"
        ],
        correct: 2,
        hint: "Human element."
      },
      {
        title: "Motorsport Crashes Playlist - Sprint Car",
        description: "Sprint car tries a tight corner.",
        videoId: "PLdVJUIT1C6VczXRuyqrXiQUEoOPydcjKo",
        startTime: 48,
        pauseTime: 63,
        options: [
          "Clean through",
          "Wheelie over curb",
          "Knocked sideways",
          "Spin finish"
        ],
        correct: 2,
        hint: "Too much lock."
      },
      {
        title: "WRC Best Moments Playlist",
        description: "Car enters long left-hander.",
        videoId: "PLODyu6T9_emz1jmiT7Cj6f0fK9WRSN5rz",
        startTime: 30,
        pauseTime: 45,
        options: [
          "Perfect line",
          "Drifts wide",
          "Spin recover",
          "Off into field"
        ],
        correct: 1,
        hint: "Rally style."
      }
    ]
  }
];

