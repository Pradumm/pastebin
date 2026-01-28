import express from 'express';
import {
  createPaste,
  getPasteApi,
  viewPasteHtml
} from '../controllers/paste.controller.js';

const router = express.Router();

router.post('/api/pastes', createPaste);
router.get('/api/pastes/:id', getPasteApi);
router.get('/p/:id', viewPasteHtml);

export default router;
