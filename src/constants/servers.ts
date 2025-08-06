interface OAuthMetadata {
  scopes: string[];
  authorization_endpoint: string;
  token_endpoint: string;
  discovery_attempted: boolean;
  supports_oauth: boolean;
}

export interface MCPServer {
  mcp_server_id: string;
  name: string;
  endpoint_url: string;
  is_recommended: boolean;
  enabled_tools: string[];
  status: string;
  user_id: string;
  description: string;
  recommended_type: string;
  base_server_id: string;
  isPlaceholder: boolean;
  isPublic?: boolean;
  oauth_metadata: OAuthMetadata;
}

export const RECOMMENDED_SERVERS: MCPServer[] = [
  {
    mcp_server_id: 'linear',
    name: 'Linear',
    endpoint_url: 'https://mcp.linear.app/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Connect to Linear to manage issues, projects, and workflows directly from your conversations.',
    recommended_type: 'ephor',
    base_server_id: 'linear',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: 'https://mcp.linear.app/authorize',
      token_endpoint: 'https://mcp.linear.app/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'notion',
    name: 'Notion',
    endpoint_url: 'https://mcp.notion.com/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Connect to Notion to manage your Notion databases and pages directly from your conversations.',
    recommended_type: 'ephor',
    base_server_id: 'notion',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: 'https://mcp.notion.com/authorize',
      token_endpoint: 'https://mcp.notion.com/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'neon',
    name: 'Neon Database',
    endpoint_url: 'https://mcp.neon.tech/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Connect to your Neon PostgreSQL databases to query data and manage database operations.',
    recommended_type: 'ephor',
    base_server_id: 'neon',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: 'https://mcp.neon.tech/authorize',
      token_endpoint: 'https://mcp.neon.tech/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'sentry',
    name: 'Sentry',
    endpoint_url: 'https://mcp.sentry.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      "Monitor and debug your applications with Sentry's error tracking and performance monitoring tools.",
    recommended_type: 'ephor',
    base_server_id: 'sentry',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: 'https://mcp.sentry.dev/authorize',
      token_endpoint: 'https://mcp.sentry.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'atlassian',
    name: 'Atlassian',
    endpoint_url: 'https://mcp.atlassian.com/v1/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Connect to Atlassian JIRA & Confluence to search issues, projects, and pages directly from your conversations.',
    recommended_type: 'ephor',
    base_server_id: 'atlassian',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: 'https://mcp.atlassian.com/v1/authorize',
      token_endpoint:
        'https://atlassian-remote-mcp-production.atlassian-remote-mcp-server-production.workers.dev/v1/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'ephor-calendar',
    name: 'Google Calendar',
    endpoint_url: 'https://google-calendar-mcp.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Provide Ephor with read only access to your Google Calendar to add context about your schedule and events into your project conversations.',
    recommended_type: 'ephor',
    base_server_id: 'ephor-calendar',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint:
        'https://google-calendar-mcp.ephor.workers.dev/authorize',
      token_endpoint: 'https://google-calendar-mcp.ephor.workers.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'ephor-drive',
    name: 'Google Drive',
    endpoint_url: 'https://google-drive-mcp.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Provide Ephor with read only access to your Google Drive to add context about your files and folders into your project conversations.',
    recommended_type: 'ephor',
    base_server_id: 'ephor-drive',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint:
        'https://google-drive-mcp.ephor.workers.dev/authorize',
      token_endpoint: 'https://google-drive-mcp.ephor.workers.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'ephor-gmail',
    name: 'Gmail',
    endpoint_url: 'https://google-mail-mcp.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Provide Ephor with read only access to your Gmail to add context about your emails into your project conversations.',
    recommended_type: 'ephor',
    base_server_id: 'ephor-gmail',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint:
        'https://google-mail-mcp.ephor.workers.dev/authorize',
      token_endpoint: 'https://google-mail-mcp.ephor.workers.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'ephor-gchat',
    name: 'Google Chat',
    endpoint_url: 'https://google-chat-mcp.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Provide Ephor with read only access to your Google Chat to add context about your conversations into your project conversations.',
    recommended_type: 'ephor',
    base_server_id: 'ephor-gchat',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint:
        'https://google-chat-mcp.ephor.workers.dev/authorize',
      token_endpoint: 'https://google-chat-mcp.ephor.workers.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'ephor-alphavantage',
    name: 'Alphavantage',
    endpoint_url: 'https://alphavantage-mcp.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description: 'Get financial data and insights from Alphavantage.',
    recommended_type: 'ephor',
    base_server_id: 'ephor-alphavantage',
    isPlaceholder: true,
    isPublic: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: '',
      token_endpoint: '',
      discovery_attempted: true,
      supports_oauth: false,
    },
  },
  {
    mcp_server_id: 'ephor-exa-search',
    name: 'Exa Search',
    endpoint_url: 'https://exa-mcp-server.ephor.workers.dev/sse',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      "Search the web with Exa's AI-powered search engine to find high-quality, relevant content and information.",
    recommended_type: 'ephor',
    base_server_id: 'ephor-exa-search',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint:
        'https://exa-mcp-server.ephor.workers.dev/authorize',
      token_endpoint: 'https://exa-mcp-server.ephor.workers.dev/token',
      discovery_attempted: true,
      supports_oauth: true,
    },
  },
  {
    mcp_server_id: 'hive-worksmart',
    name: 'Worksmart Team Insights',
    endpoint_url: '',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'Worksmart Team Insights is a powerful service that analyzes work patterns and provides valuable information about team dynamics.',
    recommended_type: 'hive',
    base_server_id: 'hive-worksmart',
    isPlaceholder: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: '',
      token_endpoint: '',
      discovery_attempted: false,
      supports_oauth: false,
    },
  },
  {
    mcp_server_id: 'hive-ask-trilogy',
    name: 'Ask Trilogy',
    endpoint_url: '',
    is_recommended: true,
    enabled_tools: [],
    status: 'inactive',
    user_id: '',
    description:
      'The Trilogy Product Database API provides comprehensive access to detailed product information, including features, target markets, and success metrics.',
    recommended_type: 'hive',
    base_server_id: 'hive-ask-trilogy',
    isPlaceholder: true,
    isPublic: true,
    oauth_metadata: {
      scopes: [],
      authorization_endpoint: '',
      token_endpoint: '',
      discovery_attempted: false,
      supports_oauth: false,
    },
  },
];

export const SERVERS_MAP = new Map<string, MCPServer>(
  RECOMMENDED_SERVERS.map((server: MCPServer) => [server.mcp_server_id, server])
);
