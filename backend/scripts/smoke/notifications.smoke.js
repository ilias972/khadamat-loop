const fs = require('fs');
const path = require('path');
const ts = require('typescript');

(async () => {
  const mockEmail = (process.env.MOCK_EMAIL || 'false') === 'true';
  const mockSms = (process.env.MOCK_SMS || 'false') === 'true';
  if (!mockEmail || !mockSms) {
    console.log('SKIPPED notifications: mocks off');
    return;
  }
  const srcPath = path.resolve(__dirname, '../../src/i18n/notifications.ts');
  const src = fs.readFileSync(srcPath, 'utf8');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    fileName: srcPath,
  });
  const mod = { exports: {} };
  const vm = require('vm');
  vm.runInNewContext(outputText, { exports: mod.exports, require, console });
  const { getNotificationTemplate } = mod.exports;
  const fr = getNotificationTemplate('booking.confirmed', 'fr', { day: '2024-01-01' });
  const ar = getNotificationTemplate('booking.confirmed', 'ar', { day: '2024-01-01' });
  if (fr.subject && fr.text && fr.sms && ar.subject && ar.text && ar.sms) {
    console.log('PASS notifications');
  } else {
    console.log('FAIL notifications');
    process.exit(1);
  }
})();
