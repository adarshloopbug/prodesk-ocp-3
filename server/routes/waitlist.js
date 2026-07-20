import express from 'express';
import { 
  games, 
  getAllWaitlist, 
  getWaitlistById, 
  getWaitlistByGameId, 
  createWaitlistEntry, 
  updateWaitlistEntry, 
  deleteWaitlistEntry,
  promoteWaitlistEntry
} from '../data/store.js';

const router = express.Router();

/**
 * REST API Endpoints with Route Parameters
 */

// GET /api/games - List all games
router.get('/games', (req, res) => {
  res.json({
    success: true,
    data: games,
    meta: {
      count: games.length,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/games/:gameId - Route Param: :gameId
router.get('/games/:gameId', (req, res) => {
  const { gameId } = req.params;
  const game = games.find(g => g.id === gameId);

  if (!game) {
    return res.status(404).json({
      success: false,
      error: `Game with ID '${gameId}' not found.`,
      meta: { routeParams: req.params }
    });
  }

  res.json({
    success: true,
    data: game,
    meta: {
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/games/:gameId/waitlist - Route Param: :gameId
router.get('/games/:gameId/waitlist', (req, res) => {
  const { gameId } = req.params;
  const gameExists = games.some(g => g.id === gameId);

  if (!gameExists) {
    return res.status(404).json({
      success: false,
      error: `Game ID '${gameId}' does not exist.`,
      meta: { routeParams: req.params }
    });
  }

  const entries = getWaitlistByGameId(gameId);

  res.json({
    success: true,
    data: entries,
    meta: {
      gameId,
      count: entries.length,
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

// POST /api/games/:gameId/waitlist/:id/promote - Route Params: :gameId & :id
router.post('/games/:gameId/waitlist/:id/promote', (req, res) => {
  const { gameId, id } = req.params;
  const { status } = req.body;

  const updated = promoteWaitlistEntry(gameId, id, status || "APPROVED");

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: `Waitlist entry '${id}' for game '${gameId}' was not found.`,
      meta: { routeParams: req.params }
    });
  }

  res.json({
    success: true,
    message: `Player '${updated.gamerTag}' promoted to status '${updated.status}' for game '${gameId}'`,
    data: updated,
    meta: {
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/waitlist - List all entries (supports query filters)
router.get('/waitlist', (req, res) => {
  const { gameId, status, region, search } = req.query;
  const entries = getAllWaitlist({ gameId, status, region, search });

  res.json({
    success: true,
    data: entries,
    meta: {
      count: entries.length,
      queryFilters: req.query,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/waitlist/:id - Route Param: :id
router.get('/waitlist/:id', (req, res) => {
  const { id } = req.params;
  const entry = getWaitlistById(id);

  if (!entry) {
    return res.status(404).json({
      success: false,
      error: `Waitlist entry with ID '${id}' not found.`,
      meta: { routeParams: req.params }
    });
  }

  res.json({
    success: true,
    data: entry,
    meta: {
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

// POST /api/waitlist - Create new entry
router.post('/waitlist', (req, res) => {
  const { gamerTag, email, gameId, region, vipTier, priorityScore, notes } = req.body;

  // Validation
  const errors = {};
  if (!gamerTag || !gamerTag.trim()) {
    errors.gamerTag = "GamerTag is required.";
  }
  if (!email || !email.trim() || !email.includes('@')) {
    errors.email = "A valid Email address is required.";
  }
  if (!gameId) {
    errors.gameId = "Please select a Game.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed for waitlist creation.",
      details: errors
    });
  }

  const newEntry = createWaitlistEntry({
    gamerTag,
    email,
    gameId,
    region,
    vipTier,
    priorityScore,
    notes
  });

  res.status(201).json({
    success: true,
    message: "Waitlist entry created successfully.",
    data: newEntry,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

// PUT /api/waitlist/:id - Route Param: :id
router.put('/waitlist/:id', (req, res) => {
  const { id } = req.params;
  const existing = getWaitlistById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      error: `Cannot update. Waitlist entry '${id}' not found.`,
      meta: { routeParams: req.params }
    });
  }

  const { gamerTag, email } = req.body;
  if (gamerTag !== undefined && !gamerTag.trim()) {
    return res.status(400).json({
      success: false,
      error: "GamerTag cannot be empty.",
      details: { gamerTag: "GamerTag cannot be empty." }
    });
  }
  if (email !== undefined && (!email.trim() || !email.includes('@'))) {
    return res.status(400).json({
      success: false,
      error: "Invalid email address format.",
      details: { email: "Invalid email format." }
    });
  }

  const updated = updateWaitlistEntry(id, req.body);

  res.json({
    success: true,
    message: `Waitlist entry '${id}' updated successfully.`,
    data: updated,
    meta: {
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

// DELETE /api/waitlist/:id - Route Param: :id
router.delete('/waitlist/:id', (req, res) => {
  const { id } = req.params;
  const deleted = deleteWaitlistEntry(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: `Cannot delete. Entry with ID '${id}' not found.`,
      meta: { routeParams: req.params }
    });
  }

  res.json({
    success: true,
    message: `Waitlist entry '${id}' deleted successfully.`,
    meta: {
      deletedId: id,
      routeParams: req.params,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
