import { Router } from 'express';
import { randomUUID, createHash } from 'crypto';
import { authenticate, requireRole } from '../../middlewares/auth';
import { cacheSet, cacheGet, cacheDel } from '../../utils/cache';
import { logger } from '../../config/logger';

const router = Router();

router.post('/cache/smoke', authenticate, requireRole('admin'), async (req, res) => {
  const key = `smoke:cache:${randomUUID()}`;
  const keyHash = createHash('sha1').update(key).digest('hex').slice(0, 8);
  try {
    await cacheSet(key, '1', 60);
    await cacheDel(key);
    const val = await cacheGet(key);
    const invalidated = val === null;
    logger.info('SMOKE_CACHE', { requestId: req.id, ns: 'smoke:cache', keyHash, invalidated });
    return res.json({ success: true, data: { key, invalidated } });
  } catch (e: any) {
    logger.error('SMOKE_CACHE_FAIL', { requestId: req.id, ns: 'smoke:cache', keyHash, error: e?.message });
    return res.status(500).json({
      success: false,
      error: {
        code: 'CACHE_SMOKE_FAILED',
        message: 'Cache smoke failed',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
