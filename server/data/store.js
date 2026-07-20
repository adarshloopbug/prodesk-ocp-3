// Data store for Game Waitlist CRUD API with Route Parameters

export let gamesData = [
  {
    id: "game-101",
    title: "Cyberpunk Odyssey 2077",
    gamerTag: "ApexPredator_99",
    email: "apex.predator@esports.org",
    genre: "Action RPG",
    platform: "PC / Console",
    status: "APPROVED",
    priorityScore: 95,
    notes: "Professional streamer with 50k followers."
  },
  {
    id: "game-102",
    title: "Starfield Guilds MMO",
    gamerTag: "StarVoyager",
    email: "voyager@galaxy.net",
    genre: "MMORPG",
    platform: "PC",
    status: "PENDING",
    priorityScore: 45,
    notes: "Community beta applicant."
  },
  {
    id: "game-103",
    title: "Valorant Tactics Arena",
    gamerTag: "HeadshotPro",
    email: "headshot.pro@fpsleague.com",
    genre: "Tactical Shooter",
    platform: "Cross-platform",
    status: "APPROVED",
    priorityScore: 99,
    notes: "Tournament finalist participant."
  },
  {
    id: "game-104",
    title: "Elden Ring: Shattered Kingdom",
    gamerTag: "TarnishedKnight",
    email: "tarnished@landsbetween.gg",
    genre: "Soulslike",
    platform: "Console",
    status: "INVITED",
    priorityScore: 80,
    notes: "Pre-ordered collector edition."
  }
];

export function sanitizeText(input) {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateGamePayload(body) {
  const errors = [];
  if (!body.title || !String(body.title).trim()) {
    errors.push("Game Title is required.");
  }
  if (!body.gamerTag || !String(body.gamerTag).trim()) {
    errors.push("GamerTag is required.");
  }
  if (!body.email || !String(body.email).trim() || !body.email.includes('@')) {
    errors.push("A valid Email address is required.");
  }
  return errors;
}

export function getAllGames(search = '') {
  if (!search.trim()) return [...gamesData];
  const q = search.toLowerCase().trim();
  return gamesData.filter(g => 
    g.title.toLowerCase().includes(q) ||
    g.gamerTag.toLowerCase().includes(q) ||
    g.email.toLowerCase().includes(q) ||
    g.id.toLowerCase().includes(q)
  );
}

export function getGameById(id) {
  return gamesData.find(g => g.id === id) || null;
}

export function createGame(data) {
  const newId = `game-${Math.floor(100 + Math.random() * 900)}`;
  const entry = {
    id: newId,
    title: sanitizeText(data.title),
    gamerTag: sanitizeText(data.gamerTag),
    email: sanitizeText(data.email),
    genre: sanitizeText(data.genre || 'Action'),
    platform: sanitizeText(data.platform || 'PC'),
    status: sanitizeText(data.status || 'PENDING'),
    priorityScore: Number(data.priorityScore) || 50,
    notes: sanitizeText(data.notes || '')
  };
  gamesData.unshift(entry);
  return entry;
}

export function updateGame(id, data) {
  const index = gamesData.findIndex(g => g.id === id);
  if (index === -1) return null;

  const current = gamesData[index];
  const updated = {
    ...current,
    ...(data.title && { title: sanitizeText(data.title) }),
    ...(data.gamerTag && { gamerTag: sanitizeText(data.gamerTag) }),
    ...(data.email && { email: sanitizeText(data.email) }),
    ...(data.genre && { genre: sanitizeText(data.genre) }),
    ...(data.platform && { platform: sanitizeText(data.platform) }),
    ...(data.status && { status: sanitizeText(data.status) }),
    ...(data.priorityScore !== undefined && { priorityScore: Number(data.priorityScore) }),
    ...(data.notes !== undefined && { notes: sanitizeText(data.notes) })
  };

  gamesData[index] = updated;
  return updated;
}

export function deleteGame(id) {
  const index = gamesData.findIndex(g => g.id === id);
  if (index === -1) return false;
  gamesData.splice(index, 1);
  return true;
}
