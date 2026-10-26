import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SERVER_INSTRUCTIONS } from 'chrome-mcp-shared';
import { setupTools } from './register-tools';

// A Server instance accepts only one transport, so each connection needs its own.
export const getMcpServer = () => {
  const mcpServer = new Server(
    {
      name: 'ChromeMcpServer',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
      instructions: SERVER_INSTRUCTIONS,
    },
  );

  setupTools(mcpServer);
  return mcpServer;
};
