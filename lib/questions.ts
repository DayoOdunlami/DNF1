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
        title: "Silverstone 2021 - Hamilton vs Verstappen",
        description: "Lap 1, Copse Corner - these two are wheel to wheel...",
        videoId: "6xVT8XiUbr4",
        startTime: 0,
        pauseTime: 8,
        options: [
          "Both drivers make it through cleanly",
          "Verstappen forces Hamilton off track",
          "They collide and Verstappen crashes out",
          "Hamilton backs out and loses position"
        ],
        correct: 2,
        hint: "This became one of the most controversial moments of the season"
      },
      {
        title: "Abu Dhabi 2021 - Final Lap Drama",
        description: "Safety car restart, final lap. Verstappen on fresh softs, Hamilton on old hards...",
        videoId: "cLp4nqFxfDw",
        startTime: 0,
        pauseTime: 10,
        options: [
          "Hamilton holds on to win the championship",
          "Verstappen overtakes and wins his first title",
          "They collide on the final lap",
          "The race is red flagged"
        ],
        correct: 1,
        hint: "This moment changed F1 history forever"
      },
      {
        title: "Germany 2019 - Chaos at Hockenheim",
        description: "Wet conditions, Lewis Hamilton is leading but heading into the stadium section...",
        videoId: "wTJX8X6cVmA",
        startTime: 0,
        pauseTime: 6,
        options: [
          "Hamilton extends his lead",
          "Hamilton spins into the gravel but recovers",
          "Hamilton crashes out of the race",
          "Safety car is deployed"
        ],
        correct: 1,
        hint: "Even the best make mistakes in the wet"
      },
      {
        title: "Bahrain 2020 - Grosjean's Crash",
        description: "First lap, Romain Grosjean makes contact and heads towards the barrier...",
        videoId: "ZQ7_En2xEm4",
        startTime: 0,
        pauseTime: 5,
        options: [
          "Minor damage, he continues racing",
          "The car is destroyed but he walks away fine",
          "The car bursts into flames but he escapes",
          "Red flag while they clear debris"
        ],
        correct: 2,
        hint: "This was a miracle escape"
      },
      {
        title: "Brazil 2019 - Ferrari Teammates Collide",
        description: "Leclerc and Vettel are battling for position, running very close...",
        videoId: "hUdO7mfnVcI",
        startTime: 0,
        pauseTime: 8,
        options: [
          "Vettel lets Leclerc through on team orders",
          "They collide and both retire from the race",
          "Leclerc backs off to avoid contact",
          "They continue racing cleanly"
        ],
        correct: 1,
        hint: "Ferrari was not happy after this race"
      },
      {
        title: "Monaco 2022 - Perez's Wall Kiss",
        description: "Sergio Perez pushing hard through the swimming pool section in wet conditions...",
        videoId: "HQ5-bJCfyz8",
        startTime: 0,
        pauseTime: 5,
        options: [
          "Clean run through the chicane",
          "Clips the wall but continues",
          "Spins and blocks the track",
          "Crashes out of the race"
        ],
        correct: 1,
        hint: "Monaco punishes the smallest errors"
      }
    ]
  }
];

