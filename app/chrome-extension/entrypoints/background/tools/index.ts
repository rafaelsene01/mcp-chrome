import { createErrorResponse } from '@/common/tool-handler';
import { ERROR_MESSAGES } from '@/common/constants';
import * as browserTools from './browser';
import { flowRunTool, listPublishedFlowsTool } from './record-replay';

const tools = { ...browserTools, flowRunTool, listPublishedFlowsTool } as any;
const toolsMap = new Map(Object.values(tools).map((tool: any) => [tool.name, tool]));

/**
 * Tool call parameter interface
 */
export interface ToolCallParam {
  name: string;
  args: any;
}

const MCP_TAB_GROUP = { title: 'mcp-chrome', color: 'blue' as const };

// Tabs created while any tool is running go into the "mcp-chrome" group of their window.
// ponytail: a tab the user opens by hand during a tool call is grouped too; track tool-created
// tab ids per tool if that matters.
let activeToolCalls = 0;
let groupQueue: Promise<unknown> = Promise.resolve();

async function addToMcpGroup(tab: chrome.tabs.Tab) {
  if (!tab.id || tab.windowId === undefined) return;
  const [existing] = await chrome.tabGroups.query({
    title: MCP_TAB_GROUP.title,
    windowId: tab.windowId,
  });
  if (existing) {
    await chrome.tabs.group({ tabIds: tab.id, groupId: existing.id });
  } else {
    const groupId = await chrome.tabs.group({
      tabIds: tab.id,
      createProperties: { windowId: tab.windowId },
    });
    await chrome.tabGroups.update(groupId, MCP_TAB_GROUP);
  }
}

// After this long without tool calls, the "mcp-chrome" tabs are closed (Chrome drops the empty group).
// chrome.alarms instead of setTimeout because the MV3 service worker may be suspended meanwhile.
const MCP_IDLE_ALARM = 'mcp-chrome-idle-close';
const MCP_IDLE_MINUTES = 10;

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== MCP_IDLE_ALARM) return;
  if (activeToolCalls > 0) {
    chrome.alarms.create(MCP_IDLE_ALARM, { delayInMinutes: MCP_IDLE_MINUTES });
    return;
  }
  try {
    const groups = await chrome.tabGroups.query({ title: MCP_TAB_GROUP.title });
    const tabs = (
      await Promise.all(groups.map((g) => chrome.tabs.query({ groupId: g.id })))
    ).flat();
    const tabIds = tabs.map((t) => t.id).filter((id): id is number => id !== undefined);
    if (tabIds.length) await chrome.tabs.remove(tabIds);
  } catch (e) {
    console.warn('Failed to close idle mcp-chrome tabs:', e);
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  if (activeToolCalls === 0) return;
  // Serialized so two tabs opened at once don't each create their own group
  groupQueue = groupQueue
    .then(() => addToMcpGroup(tab))
    .catch((e) => console.warn('Failed to add tab to mcp-chrome group:', e));
});

/**
 * Handle tool execution
 */
export const handleCallTool = async (param: ToolCallParam) => {
  const tool = toolsMap.get(param.name);
  if (!tool) {
    return createErrorResponse(`Tool ${param.name} not found`);
  }

  activeToolCalls++;
  try {
    return await tool.execute(param.args);
  } catch (error) {
    console.error(`Tool execution failed for ${param.name}:`, error);
    return createErrorResponse(
      error instanceof Error ? error.message : ERROR_MESSAGES.TOOL_EXECUTION_FAILED,
    );
  } finally {
    activeToolCalls--;
    // Re-creating an alarm with the same name restarts the idle countdown
    chrome.alarms.create(MCP_IDLE_ALARM, { delayInMinutes: MCP_IDLE_MINUTES });
  }
};
