import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { config } from 'dotenv';
import { resolve } from 'path';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

// Same key as the official release, so the unpacked build keeps the extension ID
// (hbdgbgagpkpjffpklnamcljpakneikee) allowed by the native host manifest.
const DEFAULT_EXTENSION_KEY =
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDnB4a6/wwEIEnMqhd64+OblTmF0KlqvHkZJnYN7vdOLElFOzjZbl2dA4tQERDfiY5M0qTkp+1QnYGkS2sAAUYg9v8k0BQjKHM0JSZQaV+QjukglUDiNzsgcSw0Yek/KF0mFVtuKS72EpBI5krEJ8N/b6SVTfg+3arG4SeY6Bww2bEhcFusDv8w2FJnWHpnnIFGch02/NON4aDWPSZJfF1AxMBtXSHDaEaN+mEffwyflBEl9fjlYrJe8PJxAytgWkOwJErJXFHKxgONE84W5UgYWomEJHkFolxTLvBdPtryPp6ZWbwZUBR4mBuH2luo4L+JAlF17uDASzAs0qCEMwzAgMBAAECggEAS9LsaIspSohbSBJ+6UkycIecKUTC9Oz6rwnACOwxymL7Z+BgoxT/e0cpZ6kNzQvNTUbwlZu0hNKqZYlJJu8rCoGyeImr2I1q+rWvpGip+fM6o15SDfiziooS8GeIKRA0lbmnA80bLiV9QxrFeMgMn6PIh3i5HGDdcx5LngoIWyz122vrIMUAynkUlgWRuESOvBded1N2TzsJoyMwYPdFSBK7fY4hKehU/SuSHetiXDieS0RBWj+wOaoEJRaZFCiVrGPMV5BcKWMtgs9WkYG/AMFVYgXDNDgcfLy0ExckIvonY05nh/x50Np+EzZR65K56kpqJjIB6yZMacjevYOhQQKBgQDjJrkVTHM4Qd0fpL7AtJnRpQpr/fE+0vWpMvB+VkqoAEwKdLyymejy2lOuxfqUCkHY4IcITwTyw4A6hibfZ1zHnBc3yCJwcKCvZXuJZaQTvd6xGZSHf9JHcwkDtDZ1VYzrzV8gKV12GzaqQRmyagS0/fuITTfhG8bKSbv/0I4NeQKBgQDcc+alUI02hjJ9T1AkMQt9LeUXjMjzQVH6rVn0qts5Vs5LvgLOqdpnK5xTeomxM0qCPCy9Da6EqV7/5sFuybvj8oFvrxEnhEcGH/Iy2XH3yUtROGOkOsvEqkoo/6C5LUSehclCzZnFABb7z915utlbrNZFEQJyZTXf3Sz6QPH4CwKBgH2ke5eWU9z4QXExVPmOa86UNXGKYxhW498U+AVJgb3vfCAEdiNsEnfR35u6kmG0Uru9ZbNo0dnd3V2Bupqzt5QJeKY4IySCh768qVpUSC9LRJQ9C/Tu9MbkkEXmNoEsMuhzDnzhpHqhjtkZbTdMgRIDsk+wNopjLM/TfROArjIxAoGBAMGksSHfWttdD7aQ16WiyyO/D7AbA1zhsMAQS6cl+YEpZfaURmUAQA9F+IA/b/mOQ1GYx/ecsAJpwD/qk1jcrUVyfA39aoUapUSVBStzY6+zSoxiiuv0lY7/wjq3KJfgUpkojXw3m223QXkZwsKtxUXI0UJDybFwg91Lq7l7GNC3AoGARTBSr83TTKIkcHsnH9Wl7ZVgS44iRXvTe/7pLgwzPLVAWwBiOZFF7yDqIxZlSTUh9f+MWGCMmMqfm8SDom91G0L8KoQP1PMKrbspRCG65M1VJlecwSXG0MhxdUZ3l5vT0i/aYDP6hBcc57Q2iHHOtJTRk/va1l8uH/1JOUVj9gs=';
const CHROME_EXTENSION_KEY = process.env.CHROME_EXTENSION_KEY || DEFAULT_EXTENSION_KEY;
// Detect dev mode early for manifest-level switches
const IS_DEV = process.env.NODE_ENV !== 'production' && process.env.MODE !== 'production';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  runner: {
    // 方案1: 禁用自动启动（推荐）
    disabled: true,

    // 方案2: 如果要启用自动启动并使用现有配置，取消注释下面的配置
    // chromiumArgs: [
    //   '--user-data-dir=' + homedir() + (process.platform === 'darwin'
    //     ? '/Library/Application Support/Google/Chrome'
    //     : process.platform === 'win32'
    //     ? '/AppData/Local/Google/Chrome/User Data'
    //     : '/.config/google-chrome'),
    //   '--remote-debugging-port=9222',
    // ],
  },
  manifest: {
    // Use environment variable for the key, fallback to undefined if not set
    key: CHROME_EXTENSION_KEY,
    default_locale: 'pt_BR',
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    permissions: [
      'nativeMessaging',
      'tabs',
      'tabGroups',
      'activeTab',
      'scripting',
      'contextMenus',
      'downloads',
      'webRequest',
      'webNavigation',
      'debugger',
      'history',
      'bookmarks',
      'offscreen',
      'storage',
      'declarativeNetRequest',
      'alarms',
      'proxy',
      // Allow programmatic control of Chrome Side Panel
      'sidePanel',
    ],
    host_permissions: ['<all_urls>'],
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
    action: {
      default_popup: 'popup.html',
      default_title: 'Chrome MCP Server',
    },
    // Chrome Side Panel entry for workflow management
    // Ref: https://developer.chrome.com/docs/extensions/reference/api/sidePanel
    side_panel: {
      default_path: 'sidepanel.html',
    },
    // Keyboard shortcuts for quick triggers
    commands: {
      // run_quick_trigger_1: {
      //   suggested_key: { default: 'Ctrl+Shift+1' },
      //   description: 'Run quick trigger 1',
      // },
      // run_quick_trigger_2: {
      //   suggested_key: { default: 'Ctrl+Shift+2' },
      //   description: 'Run quick trigger 2',
      // },
      // run_quick_trigger_3: {
      //   suggested_key: { default: 'Ctrl+Shift+3' },
      //   description: 'Run quick trigger 3',
      // },
      // open_workflow_sidepanel: {
      //   suggested_key: { default: 'Ctrl+Shift+O' },
      //   description: 'Open workflow sidepanel',
      // },
      toggle_web_editor: {
        suggested_key: { default: 'Ctrl+Shift+O', mac: 'Command+Shift+O' },
        description: 'Toggle Web Editor mode',
      },
      toggle_quick_panel: {
        suggested_key: { default: 'Ctrl+Shift+U', mac: 'Command+Shift+U' },
        description: 'Toggle Quick Panel AI Chat',
      },
    },
    web_accessible_resources: [
      {
        resources: [
          '/models/*', // 允许访问 public/models/ 下的所有文件
          '/workers/*', // 允许访问 workers 文件
          '/inject-scripts/*', // 允许内容脚本注入的助手文件
        ],
        matches: ['<all_urls>'],
      },
    ],
    // 注意：以下安全策略在开发环境会阻断 dev server 的资源加载，
    // 只在生产环境启用，开发环境交由 WXT 默认策略处理。
    ...(IS_DEV
      ? {}
      : {
          cross_origin_embedder_policy: { value: 'require-corp' as const },
          cross_origin_opener_policy: { value: 'same-origin' as const },
          content_security_policy: {
            // Allow inline styles injected by Vite (compiled CSS) and data images used in UI thumbnails
            extension_pages:
              "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;",
          },
        }),
  },
  vite: (env) => ({
    plugins: [
      // TailwindCSS v4 Vite plugin – no PostCSS config required
      tailwindcss(),
      // Auto-register SVG icons as Vue components; all icons are bundled locally
      Components({
        dts: false,
        resolvers: [IconsResolver({ prefix: 'i', enabledCollections: ['lucide', 'mdi', 'ri'] })],
      }) as any,
      Icons({ compiler: 'vue3', autoInstall: false }) as any,
      // Ensure static assets are available as early as possible to avoid race conditions in dev
      // Copy workers/_locales/inject-scripts into the build output before other steps
      viteStaticCopy({
        // WXT runs several vite builds into the same outDir; re-copying (overwrite) in each one
        // races with WXT stat-ing the output on Windows (ENOENT). The outDir is cleaned at build
        // start, so in production the first copy is enough. Dev keeps overwrite for live reload.
        targets: [
          {
            src: 'inject-scripts/*.js',
            dest: 'inject-scripts',
          },
          {
            src: ['workers/*'],
            dest: 'workers',
          },
          {
            src: '_locales/**/*',
            dest: '_locales',
          },
        ].map((t) => ({ ...t, overwrite: env.command !== 'build' })),
        // Use writeBundle so outDir exists for dev and prod
        hook: 'writeBundle',
        // Enable watch so changes to these files are reflected during dev
        watch: {
          // Use default patterns inferred from targets; explicit true enables watching
          // Vite plugin will watch src patterns and re-copy on change
        } as any,
      }) as any,
    ],
    build: {
      // 我们的构建产物需要兼容到es6
      target: 'es2015',
      // 非生产环境下生成sourcemap
      sourcemap: env.mode !== 'production',
      // 禁用gzip 压缩大小报告，因为压缩大型文件可能会很慢
      reportCompressedSize: false,
      // chunk大小超过1500kb是触发警告
      chunkSizeWarningLimit: 1500,
      minify: false,
    },
  }),
});
