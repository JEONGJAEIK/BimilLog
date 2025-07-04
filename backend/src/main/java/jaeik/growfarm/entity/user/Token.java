package jaeik.growfarm.entity.user;

import jaeik.growfarm.dto.user.TokenDTO;
import jaeik.growfarm.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * <h2>토큰 엔티티</h2>
 * <p>사용자의 카카오 및 JWT 토큰 정보를 저장하는 엔티티</p>
 * <p>카카오 액세스 토큰, 카카오 리프레시 토큰, JWT 리프레시 토큰을 포함</p>
 *
 * @author Jaeik
 * @since 1.0.0
 */
@Entity
@SuperBuilder
@NoArgsConstructor
@Getter
public class Token extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @NotNull
    @Column(nullable = false)
    private String kakaoAccessToken;

    @NotNull
    @Column(nullable = false)
    private String kakaoRefreshToken;

    private String jwtRefreshToken;

    /**
     * <h3>카카오 토큰 업데이트</h3>
     * <p>카카오 액세스 토큰과 리프레시 토큰을 업데이트합니다.</p>
     *
     * @param kakaoAccessToken 카카오 액세스 토큰
     * @param kakaoRefreshToken 카카오 리프레시 토큰 (null 또는 빈 문자열인 경우 업데이트하지 않음)
     */
    public void updateKakaoToken(String kakaoAccessToken, String kakaoRefreshToken) {
        this.kakaoAccessToken = kakaoAccessToken;
        if (kakaoRefreshToken != null && !kakaoRefreshToken.isBlank()) {
            this.kakaoRefreshToken = kakaoRefreshToken;
        }
    }

    /**
     * <h3>토큰 생성</h3>
     * <p>TokenDTO와 Users 객체를 사용하여 Token 엔티티를 생성합니다.</p>
     *
     * @param tokenDTO TokenDTO 객체
     * @param user Users 객체
     * @return 생성된 Token 엔티티
     */
    public static Token createToken(TokenDTO tokenDTO, Users user) {
        return Token.builder()
                .users(user)
                .kakaoAccessToken(tokenDTO.getKakaoAccessToken())
                .kakaoRefreshToken(tokenDTO.getKakaoRefreshToken())
                .jwtRefreshToken(tokenDTO.getJwtRefreshToken())
                .build();
    }
}
