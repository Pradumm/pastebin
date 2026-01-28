import Paste from '../models/Paste.js';
import { getNow } from '../utils/time.js';

/* CREATE PASTE */
export const createPaste = async (req, res) => {
    try {
        const { content, ttl_seconds, max_views } = req.body;

        if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({ error: 'Invalid content' });
        }

        if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
            return res.status(400).json({ error: 'Invalid ttl_seconds' });
        }

        if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
            return res.status(400).json({ error: 'Invalid max_views' });
        }

        const expiresAt = ttl_seconds
            ? new Date(Date.now() + ttl_seconds * 1000)
            : null;

        const paste = await Paste.create({
            content,
            expiresAt,
            maxViews: max_views ?? null
        });

        res.status(201).json({
            id: paste._id,
            url: `${process.env.BASE_URL}/p/${paste._id}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

/* FETCH PASTE (API) */
export const getPasteApi = async (req, res) => {
    try {
        const now = getNow(req);

        const paste = await Paste.findOneAndUpdate(
            {
                _id: req.params.id,

                // TTL condition
                $or: [
                    { expiresAt: null },
                    { expiresAt: { $gt: now } }
                ],

                // View limit condition
                $or: [
                    { maxViews: null },
                    { $expr: { $lt: ['$views', '$maxViews'] } }
                ]
            },
            {
                $inc: { views: 1 }
            },
            {
                new: true
            }
        );

        if (!paste) {
            return res.status(404).json({ error: 'Not found or expired' });
        }

        res.json({
            content: paste.content,
            remaining_views:
                paste.maxViews === null
                    ? null
                    : Math.max(paste.maxViews - paste.views, 0),
            expires_at: paste.expiresAt
        });
    } catch (err) {
        return res.status(404).json({ error: 'Not found' });
    }
};



export const viewPasteHtml = async (req, res) => {
    const now = getNow(req);

    const paste = await Paste.findOneAndUpdate(
        {
            _id: req.params.id,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
            $or: [{ maxViews: null }, { $expr: { $lt: ['$views', '$maxViews'] } }]
        },
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!paste) return res.status(404).send('Not Found');

    res.setHeader('Content-Type', 'text/html');
    res.send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
};

const escapeHtml = (text) =>
    text.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
