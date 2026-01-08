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
  },
  {
    name: "What Happened Next? Part 2",
    subtitle: "More epic moments - predict the outcome!",
    type: "video",
    questions: [
      {
        title: "Motorsport Crashes 2025 Week 42",
        description: "A racing car enters a high-speed corner on the edge of control...",
        videoId: "EJ7IcVDBTM4",
        startTime: 220,
        pauseTime: 235,
        options: [
          "Perfect corner exit",
          "Loses rear and spins",
          "Oversteers into barrier",
          "Saves it dramatically"
        ],
        correct: 2,
        hint: "Too much speed, not enough grip."
      },
      {
        title: "Havoc 7 - Rally Car Jump",
        description: "Rally car launching off a crest with spectators watching below...",
        videoId: "AJpB9rVamUk",
        startTime: 180,
        pauseTime: 195,
        options: [
          "Smooth landing and continue",
          "Hard landing breaks suspension",
          "Rolls multiple times on landing",
          "Crashes into trees"
        ],
        correct: 1,
        hint: "Landing angle is critical."
      },
      {
        title: "NASCAR Daytona 2024 - Restart Drama",
        description: "Double-file restart, pack racing through turn 4 at 190+ mph...",
        videoId: "-UvRK_a0vm8",
        startTime: 95,
        pauseTime: 110,
        options: [
          "Clean racing through",
          "Contact sends cars spinning",
          "Single car wreck",
          "Caution for debris"
        ],
        correct: 1,
        hint: "Plate racing is unpredictable."
      },
      {
        title: "WRC Rally Estonia 2024 - Gravel Slide",
        description: "Rally car sliding on loose gravel approaching a tight left-hander...",
        videoId: "_GCKI_LbnRM",
        startTime: 240,
        pauseTime: 255,
        options: [
          "Perfect Scandinavian flick",
          "Slides wide into ditch",
          "Rolls in the corner",
          "Cuts too tight and hits bank"
        ],
        correct: 1,
        hint: "Gravel requires precision."
      },
      {
        title: "Motorsport Fails 2025 Week 19",
        description: "Race car attempting an overtake on the outside line...",
        videoId: "XesD9Njz75M",
        startTime: 120,
        pauseTime: 135,
        options: [
          "Clean pass completed",
          "Runs out of room and spins",
          "Contact with other car",
          "Goes off track but recovers"
        ],
        correct: 1,
        hint: "Outside line is risky."
      },
      {
        title: "Best Motorsport Crashes 2024 - Part 2",
        description: "GT car braking late into a tight hairpin corner...",
        videoId: "TOtoe3KqyOI",
        startTime: 250,
        pauseTime: 265,
        options: [
          "Perfect braking point",
          "Locks up and slides",
          "Misses corner completely",
          "Cuts inside and gains position"
        ],
        correct: 1,
        hint: "Locked brakes mean no steering."
      },
      {
        title: "WRC Rally Portugal 2024 Highlights",
        description: "Rally car navigating through a narrow village section...",
        videoId: "Dul8o9cNh5k",
        startTime: 90,
        pauseTime: 105,
        options: [
          "Clean passage through",
          "Clips a wall corner",
          "Goes too wide and hits barrier",
          "Spins in middle of village"
        ],
        correct: 2,
        hint: "Villages are unforgiving."
      },
      {
        title: "NASCAR Road Course Chaos 2024",
        description: "Road course race, car diving to the inside for a late pass...",
        videoId: "4pIh-SXBaIU",
        startTime: 150,
        pauseTime: 165,
        options: [
          "Perfect dive bomb",
          "Overshoots and goes wide",
          "Contact spins both cars",
          "Misses braking point"
        ],
        correct: 1,
        hint: "Late braking is a gamble."
      },
      {
        title: "Rally Finland Big Moments 2024",
        description: "Car approaching Finland's famous jump at full speed...",
        videoId: "luBn70tuJXg",
        startTime: 200,
        pauseTime: 215,
        options: [
          "Spectacular flying finish",
          "Hard landing breaks car",
          "Overshoots and crashes",
          "Aborts jump and slows"
        ],
        correct: 0,
        hint: "Finland jumps are legendary."
      },
      {
        title: "Motorsport Crashes Compilation 2025",
        description: "Multiple cars racing three-wide approaching a bottleneck...",
        videoId: "0yklYJ7zpSY",
        startTime: 150,
        pauseTime: 165,
        options: [
          "All make it through",
          "Contact causes pile-up",
          "One car spins out",
          "Safety car deployed"
        ],
        correct: 1,
        hint: "Three-wide never ends well."
      }
    ]
  },
  {
    name: "Speed Race Challenge",
    subtitle: "First to 50 clicks wins! Pure speed and reflexes!",
    type: "race",
    questions: [] // Race round doesn't use questions
  },
  {
    name: "Scattergories Race",
    subtitle: "Type answers fast! Opponent votes on validity - valid answers move your car!",
    type: "scattergories",
    questions: [] // Categories are generated in component
  }
];

