import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { routing } from './i18n/routing';
// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip auth check for public routes
    const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname.includes('/auth/login') ||
        pathname === '/favicon.ico';

    // Handle internationalization first
    const response = intlMiddleware(request);
    // If it's a public route, no need to check authentication
    if (isPublicRoute) {
        return response;
    }

    // Check if the user is authenticated
    // const token = await getToken({ secureCookie: shouldUseSecureCookie(request.url), req: request, secret: process.env.NEXTAUTH_SECRET });
    // // If not authenticated, redirect to login page
    // if (!token) {

    //     //console.log('pathname', request.nextUrl.pathname);
    //     const referer = request.headers.get('referer') || '';
    //     //console.log('request.url', request.nextUrl, referer);
    //     // // 检查来源是否已经是登录页，避免循环重定向
    //     if (referer.includes('/auth/login')) {
    //         return response;
    //     }
    //     //允许目标页面是首页、隐私条款等页面
    //     if (!request.nextUrl.pathname.includes('/design') && !request.nextUrl.pathname.includes('/report')) {
    //         return response;
    //     }

    //     const locale = referer.indexOf('zh-CN') >= 0 ? 'zh-CN' : 'zh-TW';
    //     // ?callbackUrl=${request.nextUrl.pathname}

    //     return NextResponse.redirect(new URL(`/${locale}/auth/login?callbackUrl=${request.nextUrl.pathname}`, request.url));
    // }
    return response;
}

export const config = {
    // 匹配所有路径
    matcher: ['/((?!api|_next|.*\\..*).*)', '/'],
}; 
/**
 * Determines if secure cookies should be used based on the request URL.
 * Secure cookies are only used when the request is over HTTPS.
 */
export function shouldUseSecureCookie(url) {
  const urlObj = typeof url === "string" ? new URL(url) : url;
  return urlObj.protocol === "https:";
}