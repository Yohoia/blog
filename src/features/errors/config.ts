import type { Locale } from '@/config/i18n';

interface ErrorContent {
  heading: string;
  description: string;
}

export const errorPages = {
  403: {
    content: {
      zh: {
        heading: '暂时无法访问',
        description: '你没有访问此页面的权限，可以先返回首页。',
      },
      en: {
        heading: 'Access denied',
        description:
          'You do not have permission to view this page. Try the home page instead.',
      },
    },
  },
  404: {
    content: {
      zh: {
        heading: '这一页暂时找不到了',
        description: '页面可能已移动、尚未发布，或者链接有误。',
      },
      en: {
        heading: 'This page could not be found',
        description:
          'It may have moved, not been published yet, or the link may be incorrect.',
      },
    },
  },
  500: {
    content: {
      zh: {
        heading: '服务暂时出了点问题',
        description: '服务器暂时无法完成请求，请稍后再试。',
      },
      en: {
        heading: 'Something went wrong',
        description:
          'The server could not complete your request. Please try again later.',
      },
    },
  },
  502: {
    content: {
      zh: {
        heading: '连接暂时中断了',
        description: '网关暂时没有收到有效响应，请稍后再试。',
      },
      en: {
        heading: 'The connection was interrupted',
        description:
          'The gateway did not receive a valid response. Please try again later.',
      },
    },
  },
} as const satisfies Record<number, { content: Record<Locale, ErrorContent> }>;

export type ErrorCode = keyof typeof errorPages;

export const errorActions = {
  zh: { home: '返回首页' },
  en: { home: 'Back to home' },
} as const;
