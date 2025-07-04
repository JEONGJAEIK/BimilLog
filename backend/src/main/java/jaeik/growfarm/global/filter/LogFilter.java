package jaeik.growfarm.global.filter;

import jaeik.growfarm.global.auth.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * <h2>로그 필터</h2>
 * <p>
 * HTTP 요청에 대한 로그를 기록하는 필터 클래스
 * </p>
 *
 * @author Jaeik
 * @since 1.0.0
 */
@Component
public class LogFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LogFilter.class);
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private static final List<String> WHITELIST = List.of("/api/auth/me", "/api/auth/health", "/api/comment/{postId}",
            "/api/notification/subscribe",
            "/api/paper", "/api/post", "/api/post/search", "/api/post/{postId}", "/api/post/realtime",
            "/api/post/weekly", "/api/post/legend",
            "/api/user/posts", "/api/user/comments", "/api/user/likeposts", "/api/user/likecomments",
            "/api/user/username/check");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        if (isWhitelisted(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        String referer = request.getHeader("Referer");
        String ip = getClientIp(request);
        String method = request.getMethod();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getClientDTO().getUserId();
            Long kakaoId = userDetails.getClientDTO().getKakaoId();
            String kakaoNickname = userDetails.getClientDTO().getKakaoNickname();

            if (uri.startsWith("/admin")) {
                log.error(
                        "회원 관리자 페이지 접근 시도 - IP: {}, 오리진 URI: {}, 타겟 URI: {}, Method: {}, 유저 ID: {}, 카카오 ID: {}, 카카오 닉네임: {}",
                        ip, referer, uri, method, userId, kakaoId, kakaoNickname);
            }
            log.info("회원 - IP: {}, 오리진 URI: {}, 타겟 URI: {}, Method: {}, 유저 ID: {}, 카카오 ID: {}, 카카오 닉네임: {}", ip,
                    referer, uri, method, userId, kakaoId, kakaoNickname);
        } else {
            if (uri.startsWith("/admin")) {
                log.error("비회원 - 관리자 페이지 접근 시도 - IP: {}, 오리진 URI: {}, 타겟 URI: {}, Method: {}", ip, referer, uri,
                        method);
            }
            log.info("비회원 - IP: {}, 오리진 URI: {}, 타겟 URI: {}, Method: {}", ip, referer, uri, method);
        }
        filterChain.doFilter(request, response);
    }

    private boolean isWhitelisted(String uri) {
        return WHITELIST.stream().anyMatch(pattern -> pathMatcher.match(pattern, uri));
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0];
        }
        return ip;
    }
}
