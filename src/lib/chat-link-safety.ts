/** Паттерны внешних ссылок и мессенджеров, опасных для сделок вне GetBuff. */
const SUSPICIOUS_EXTERNAL_LINK_PATTERN =
  /t\.me|telegram|\btg\b|discord\.gg|vk\.com|https?:\/\//i;

export const CHAT_PHISHING_WARNING_TEXT =
  "⚠️ Внимание! Не переходите по внешним ссылкам. Проводите сделку и оплату только внутри GetBuff для защиты ваших средств.";

export function containsSuspiciousExternalLink(text: string): boolean {
  return SUSPICIOUS_EXTERNAL_LINK_PATTERN.test(text);
}
