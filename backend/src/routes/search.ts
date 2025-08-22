import { Router } from 'express';
import { searchServices, suggestCities } from '../controllers/searchController';

const router = Router();

router.get('/services/search', searchServices);
router.get('/suggest/cities', suggestCities);

export default router;
