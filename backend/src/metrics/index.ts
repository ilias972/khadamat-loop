import { env } from '../config/env';
import { logger } from '../config/logger';
import type { Request, Response, NextFunction } from 'express';

let prom: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  prom = require('prom-client');
} catch (e) {
  logger.warn('METRICS_DISABLED: prom-client not found');
}

export const registry = prom ? new prom.Registry() : null;

let httpRequestsTotal: any;
let httpRequestDurationMs: any;
let bookingsCreatedTotal: any;
let messagesSentTotal: any;
let webhooksProcessedTotal: any;
let smsDispatchTotal: any;
let dlqWebhooksBacklog: any;
let dlqSmsBacklog: any;
let jobsHeartbeatTotal: any;

if (prom && env.metricsEnabled) {
  prom.collectDefaultMetrics({ register: registry });
  httpRequestsTotal = new prom.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [registry],
  });
  httpRequestDurationMs = new prom.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status'],
    buckets: env.metricsBucketsMs,
    registers: [registry],
  });
  bookingsCreatedTotal = new prom.Counter({
    name: 'bookings_created_total',
    help: 'Total bookings created',
    registers: [registry],
  });
  messagesSentTotal = new prom.Counter({
    name: 'messages_sent_total',
    help: 'Total messages sent',
    registers: [registry],
  });
  webhooksProcessedTotal = new prom.Counter({
    name: 'webhooks_processed_total',
    help: 'Webhooks processed',
    labelNames: ['provider', 'outcome'],
    registers: [registry],
  });
  smsDispatchTotal = new prom.Counter({
    name: 'sms_dispatch_total',
    help: 'SMS dispatch count',
    labelNames: ['outcome'],
    registers: [registry],
  });
  dlqWebhooksBacklog = new prom.Gauge({
    name: 'dlq_webhooks_backlog',
    help: 'Webhook DLQ backlog size',
    registers: [registry],
  });
  dlqSmsBacklog = new prom.Gauge({
    name: 'dlq_sms_backlog',
    help: 'SMS DLQ backlog size',
    registers: [registry],
  });
  jobsHeartbeatTotal = new prom.Counter({
    name: 'jobs_heartbeat_total',
    help: 'Scheduler heartbeats',
    labelNames: ['job'],
    registers: [registry],
  });
}

export const metricsRequestTimer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!prom || !env.metricsEnabled) return next();
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    const route = (req.route?.path ? req.baseUrl + req.route.path : req.baseUrl || req.path) || 'unknown';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpRequestsTotal.inc(labels);
    end(labels);
  });
  next();
};

export function setupMetrics(app: any) {
  if (!prom || !env.metricsEnabled) return;
  app.get('/metrics', (req: Request, res: Response) => {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${env.metricsToken}`) {
      return res.status(401).send('Unauthorized');
    }
    res.set('Content-Type', registry.contentType);
    res.end(registry.metrics());
  });
}

export {
  httpRequestsTotal,
  httpRequestDurationMs,
  bookingsCreatedTotal,
  messagesSentTotal,
  webhooksProcessedTotal,
  smsDispatchTotal,
  dlqWebhooksBacklog,
  dlqSmsBacklog,
  jobsHeartbeatTotal,
};
