package jaeik.growfarm.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * <h2>에러 코드 열거형</h2>
 * <p>애플리케이션에서 발생할 수 있는 다양한 에러 코드를 정의하는 열거형</p>
 *
 * @author Jaeik
 * @since 1.0.0
 */
@Getter
public enum ErrorCode {

    /**
     * <h3>인증 관련 에러 코드</h3>
     * <p>인증 및 권한 관련 에러 코드</p>
     */
    NULL_SECURITY_CONTEXT(HttpStatus.UNAUTHORIZED, "유저 인증 정보가 없습니다. 다시 로그인 해주세요"),
    NOT_MATCH_USER(HttpStatus.FORBIDDEN, "시큐리티 콘텍스트의 유저 정보가 DB에 없습니다"),
    NOT_FIND_TOKEN(HttpStatus.FORBIDDEN, "토큰을 찾을 수 없습니다. 다시 로그인 해주세요 "),
    BLACKLIST_USER(HttpStatus.FORBIDDEN, "차단된 회원은 회원가입이 불가능합니다"),
    KAKAO_GET_USERINFO_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "카카오 유저정보 가져오기 실패"),
    LOGOUT_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "로그아웃 실패"),
    WITHDRAW_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "회원탈퇴 실패"),
    NOT_FIND_KAKAO_FRIEND_FARM(HttpStatus.FORBIDDEN, "해당 카카오 친구의 농장을 찾을 수 없습니다."),
    KAKAO_FRIEND_CONSENT_FAIL(HttpStatus.UNAUTHORIZED, "카카오 친구 추가 동의을 해야 합니다."),
    INVALID_USER_ID(HttpStatus.INTERNAL_SERVER_ERROR, "유저 아이디가 잘못되었습니다."),
    ALREADY_LOGIN(HttpStatus.FORBIDDEN, "이미 로그인 된 유저 입니다."),
    INVALID_TEMP_DATA(HttpStatus.BAD_REQUEST, "시간이 초과 되었습니다. 다시 카카오 로그인을 진행해주세요."),
    AUTH_JWT_ACCESS_TOKEN_ERROR(HttpStatus.FORBIDDEN, "JWT 엑세스 토큰 인증 중 오류 발생"),
    RENEWAL_JWT_ACCESS_TOKEN_ERROR(HttpStatus.FORBIDDEN, "JWT 엑세스 토큰 갱신 중 오류 발생"),
    INVALID_JWT_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 리프레시 토큰입니다. 다시 로그인 해주세요."),
    REPEAT_LOGIN(HttpStatus.FORBIDDEN,"다른기기에서 로그아웃 하셨습니다 다시 로그인 해주세요"),


    /**
     * <h3>게시판 관련 에러 코드</h3>
     * <p>게시판 작성, 수정, 삭제 등과 관련된 에러 코드</p>
     */
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 게시글이 존재하지 않습니다."),
    PROXY_ENTITY_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "엔티티가 존재하지 않습니다."),
    COMMENT_WRITE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 작성에 실패했습니다."),
    PARENT_COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "부모 댓글이 존재하지 않습니다."),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 댓글이 존재하지 않습니다."),
    COMMENT_PASSWORD_NOT_MATCH(HttpStatus.FORBIDDEN, "댓글 비밀번호가 일치하지 않습니다."),
    POST_PASSWORD_NOT_MATCH(HttpStatus.FORBIDDEN, "게시글 비밀번호가 일치하지 않습니다."),
    ONLY_COMMENT_OWNER_UPDATE(HttpStatus.FORBIDDEN, "댓글 작성자만 수정할 수 있습니다."),
    ONLY_COMMENT_OWNER_DELETE(HttpStatus.FORBIDDEN, "댓글 작성자만 삭제할 수 있습니다."),
    COMMENT_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 삭제에 실패했습니다."),
    INCORRECT_SEARCH_FORMAT(HttpStatus.BAD_REQUEST, "잘못된 검색 형식입니다."),
    POPULAR_COMMENT_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "인기 댓글 조회에 실패했습니다."),
    COMMENT_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 조회에 실패했습니다."),
    POST_WRITE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 작성에 실패했습니다."),
    POST_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 삭제에 실패했습니다."),
    POST_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "게시글 작성자만 수정 및 삭제할 수 있습니다."),
    REDIS_WRITE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "레디스 작성 중 오류가 발생했습니다."),
    REDIS_READ_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "레디스 읽기 중 오류가 발생했습니다."),
    REDIS_DELETE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "레디스 삭제 중 오류가 발생했습니다."),

    /**
     * <h3>유저 관련 에러 코드</h3>
     * <p>
     * 유저 정보 조회, 수정, 삭제 등과 관련된 에러 코드
     * </p>
     */
    EXISTED_NICKNAME(HttpStatus.BAD_REQUEST, "이미 존재하는 닉네임입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    SETTINGS_NOT_FOUND(HttpStatus.NOT_FOUND, "설정 정보를 찾을 수 없습니다."),

    /**
     * <h3>롤링페이퍼 관련 에러 코드</h3>
     * <p>
     * 롤링페이퍼 작성, 조회, 수정, 삭제 등과 관련된 에러 코드
     * </p>
     */
    USERNAME_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 닉네임의 롤링페이퍼를 찾을 수 없습니다."),
    MESSAGE_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "본인 롤링페이퍼의 메시지만 삭제할 수 있습니다."),

    /**
     * <h3>관리자 에러 코드</h3>
     * <p>관리자 관련 에러 코드</p>
     */
    NOT_FOUND_REPORT(HttpStatus.NOT_FOUND, "해당 신고를 찾을 수 없습니다."),
    BAN_USER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "유저 차단 중 오류 발생"),
    INVALID_REPORT_TARGET(HttpStatus.BAD_REQUEST, "신고 대상이 유효하지 않습니다."),

    /**
     * <h3>알림 에러 코드</h3>
     * <p>알림 관련 에러 코드</p>
     */
    SSE_SEND_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SSE 알림 전송 중 오류 발생"),
    FCM_SEND_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "FCM 알림 전송 중 오류 발생"),
    NOTIFICATION_SEND_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "알림 전송 중 오류 발생"),
    NOTIFICATION_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "다른 사람의 알림은 삭제할 수 없습니다."),
    NOTIFICATION_READ_FORBIDDEN(HttpStatus.FORBIDDEN, "다른 사람의 알림은 읽을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
