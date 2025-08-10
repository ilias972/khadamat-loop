import { runKycRetentionJob } from '../src/jobs/kycRetention';
(async () => {
  await runKycRetentionJob();
  console.log('KYC retention job done');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
