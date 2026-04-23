/**
 * ФАЙЛ: next.config.js
 * НАЗНАЧЕНИЕ: Конфигурация Next.js
 *
 * Здесь добавлены HTTP-заголовки безопасности.
 * Они отправляются с каждым ответом сервера и защищают
 * пользователей от распространённых атак.
 *
 * ЗАГОЛОВКИ:
 * - X-Frame-Options: DENY
 *     Запрещает встраивать сайт в <iframe> на других сайтах.
 *     Защищает от Clickjacking-атак (мошенник показывает твой сайт
 *     в невидимом фрейме поверх своего и перехватывает клики).
 *
 * - X-Content-Type-Options: nosniff
 *     Запрещает браузеру угадывать тип файла (MIME sniffing).
 *     Без этого браузер может выполнить .txt-файл как скрипт.
 *
 * - Referrer-Policy: strict-origin-when-cross-origin
 *     Контролирует какой URL передаётся при переходе на другой сайт.
 *     При переходе с https://твой-клуб.com на внешний сайт —
 *     передаётся только домен (не полный путь со slug/id).
 *
 * - Permissions-Policy
 *     Запрещает использование камеры, микрофона и геолокации.
 *     Твоему сайту это не нужно — зачем давать разрешение?
 *
 * - X-DNS-Prefetch-Control: off
 *     Отключает предзагрузку DNS для ссылок на странице.
 *     Утечка информации о том, какие ресурсы посещает пользователь.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── Заголовки безопасности ─────────────────────────────
  async headers() {
    return [
      {
        // Применять ко всем маршрутам сайта
        source: "/(.*)",
        headers: [
          {
            // Запрет встраивания в iframe → защита от Clickjacking
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Запрет MIME-sniffing → браузер не угадывает тип файла
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Передаём только домен при переходах на внешние сайты
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Запрещаем API камеры, микрофона, геолокации
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Отключаем DNS prefetch (небольшая утечка приватности)
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
    ];
  },

  // ── Настройки изображений ──────────────────────────────
  // Разрешаем Next.js Image оптимизировать только локальные файлы.
  // Если нужны внешние картинки — добавь домен в remotePatterns.
  images: {
    // Пример добавления внешнего домена:
    // remotePatterns: [
    //   { protocol: "https", hostname: "example.com" },
    // ],
  },

};

module.exports = nextConfig;
