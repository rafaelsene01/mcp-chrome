import { createErrorResponse, ToolResult } from '@/common/tool-handler';
import { BaseBrowserToolExecutor } from '../base-browser';
import { TOOL_NAMES } from 'chrome-mcp-shared';

interface ProxyParams {
  action: 'set' | 'clear';
  scheme?: 'http' | 'https' | 'socks4' | 'socks5';
  host?: string;
  port?: number;
  bypassList?: string[];
}

const SCHEMES = ['http', 'https', 'socks4', 'socks5'];

/**
 * Set or clear the browser-wide proxy via chrome.proxy.settings
 */
class ProxyTool extends BaseBrowserToolExecutor {
  name = TOOL_NAMES.BROWSER.PROXY;

  async execute(args: ProxyParams): Promise<ToolResult> {
    const {
      action,
      scheme = 'http',
      host,
      port,
      bypassList = ['<local>'],
    } = args || ({} as ProxyParams);

    try {
      if (action === 'clear') {
        await chrome.proxy.settings.clear({ scope: 'regular' });
      } else if (action === 'set') {
        if (!SCHEMES.includes(scheme)) {
          return createErrorResponse(`scheme must be one of: ${SCHEMES.join(', ')}`);
        }
        if (!host) return createErrorResponse('host is required for "set"');
        if (!Number.isInteger(port) || port! < 1 || port! > 65535) {
          return createErrorResponse('port must be an integer between 1 and 65535');
        }
        await chrome.proxy.settings.set({
          value: {
            mode: 'fixed_servers',
            rules: { singleProxy: { scheme, host, port }, bypassList },
          },
          scope: 'regular',
        });
      } else {
        return createErrorResponse('action must be "set" or "clear"');
      }

      // levelOfControl tells whether another extension overrides our setting
      const current = await chrome.proxy.settings.get({ incognito: false });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              action,
              proxy: current.value,
              levelOfControl: current.levelOfControl,
            }),
          },
        ],
        isError: false,
      };
    } catch (error) {
      return createErrorResponse(
        `Failed to ${action} proxy: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export const proxyTool = new ProxyTool();
