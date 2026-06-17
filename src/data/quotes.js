const quotes = [
  // Classic fitness / bodybuilding
  { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
  { text: "The worst thing I can be is the same as everybody else. I hate that.", author: "Arnold Schwarzenegger" },
  { text: "Strength does not come from the physical capacity. It comes from an indomitable will.", author: "Arnold Schwarzenegger" },
  { text: "Blood, sweat, and respect. The first two you give, the last one you earn.", author: "Dwayne 'The Rock' Johnson" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne 'The Rock' Johnson" },
  { text: "It's still your motherf***ing set!", author: "CT Fletcher" },
  { text: "I command you to grow!", author: "CT Fletcher" },
  { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
  { text: "Yeah buddy! Lightweight baby!", author: "Ronnie Coleman" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },

  // Discipline / mindset
  { text: "Don't count the days; make the days count.", author: "Muhammad Ali" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "We don't rise to the level of our expectations; we fall to the level of our training.", author: "Archilochus" },
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "Don't expect to be motivated every day. You have to learn to be disciplined.", author: "Jocko Willink" },
  { text: "Good. Get after it.", author: "Jocko Willink" },
  { text: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.", author: "David Goggins" },
  { text: "The only person who was going to turn my life around was me.", author: "David Goggins" },
  { text: "When you think you're done, you're only at 40% of your body's capability.", author: "David Goggins" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },

  // Sports performance
  { text: "I've failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Champions aren't made in gyms. Champions are made from something deep inside them.", author: "Muhammad Ali" },
  { text: "The only way to prove you are a good sport is to lose.", author: "Ernie Banks" },
  { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
  { text: "Train insane or remain the same.", author: "Jillian Michaels" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },

  // Original motivational
  { text: "Your muscles don't know what day it is. They only know tension and effort.", author: "FitTrack" },
  { text: "One rep closer. One set stronger. One day better.", author: "FitTrack" },
  { text: "The weight on the bar doesn't care about your excuses.", author: "FitTrack" },
  { text: "You didn't come this far to only come this far.", author: "FitTrack" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "FitTrack" },
  { text: "The best workout is the one you actually do.", author: "FitTrack" }
];

export default quotes;

/**
 * Return a random quote from the collection.
 * @returns {{ text: string, author: string }}
 */
export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Return a deterministic quote based on today's date.
 * Uses the day-of-year as an index so the quote stays consistent all day.
 * @returns {{ text: string, author: string }}
 */
export function getDailyQuote() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}
