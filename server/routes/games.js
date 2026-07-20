import express from 'express';
import { 
  getAllGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame,
  validateGamePayload 
} from '../data/store.js';

const router = express.Router();

// GET /games - List all game waitlist entries
router.get('/', (req, res) => {
  const { search } = req.query;
  const games = getAllGames(search);

  res.status(200).json({
    success: true,
    message: "Game waitlist entries retrieved successfully",
    data: games
  });
});

// GET /games/:id - Retrieve entry by Route Parameter :id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const game = getGameById(id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: `Game with ID '${id}' not found`,
      errors: [`No resource found with route parameter id: ${id}`]
    });
  }

  res.status(200).json({
    success: true,
    message: `Game waitlist entry '${id}' retrieved successfully`,
    data: game
  });
});

// POST /games - Create new entry
router.post('/', (req, res) => {
  const errors = validateGamePayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for new game entry",
      errors
    });
  }

  const created = createGame(req.body);

  res.status(201).json({
    success: true,
    message: "Game waitlist entry created successfully",
    data: created
  });
});

// PUT /games/:id - Update entry by Route Parameter :id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const existing = getGameById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Cannot update. Game with ID '${id}' not found`,
      errors: [`No resource matching route parameter id: ${id}`]
    });
  }

  const errors = validateGamePayload({ ...existing, ...req.body });
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for updating game entry",
      errors
    });
  }

  const updated = updateGame(id, req.body);

  res.status(200).json({
    success: true,
    message: `Game waitlist entry '${id}' updated successfully`,
    data: updated
  });
});

// DELETE /games/:id - Delete entry by Route Parameter :id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = deleteGame(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Cannot delete. Game with ID '${id}' not found`,
      errors: [`No resource matching route parameter id: ${id}`]
    });
  }

  res.status(200).json({
    success: true,
    message: `Game waitlist entry '${id}' deleted successfully`,
    data: { id }
  });
});

export default router;
