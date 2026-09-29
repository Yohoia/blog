import type { ImageMetadata } from 'astro';
import forbidden from '../../../public/images/403.png';
import notFound from '../../../public/images/404.png';
import serverError from '../../../public/images/500.png';
import badGateway from '../../../public/images/502.png';
import type { ErrorCode } from './config';

/** 仅供 Astro 服务端使用：保留原图，构建时生成响应式图片。 */
export const errorIllustrations = {
  403: forbidden,
  404: notFound,
  500: serverError,
  502: badGateway,
} satisfies Record<ErrorCode, ImageMetadata>;
