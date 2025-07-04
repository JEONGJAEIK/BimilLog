package jaeik.growfarm.entity.post;

import jaeik.growfarm.dto.post.PostDTO;
import jaeik.growfarm.dto.post.PostReqDTO;
import jaeik.growfarm.entity.BaseEntity;
import jaeik.growfarm.entity.user.Users;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * <h2>게시글 엔티티</h2>
 * <p>
 * 게시판에 작성된 게시글 정보를 저장하는 엔티티
 * </p>
 * <p>
 * 제목, 내용, 작성자, 조회수, 공지 여부 등을 포함
 * </p>
 *
 * @author Jaeik
 * @since 1.0.0
 */
@Entity
@Getter
@NoArgsConstructor
@SuperBuilder
@Table(indexes = {
        @Index(name = "idx_post_notice_created", columnList = "isNotice, created_at DESC"),
        @Index(name = "idx_post_created_at_popular", columnList = "created_at, popularFlag"),
        @Index(name = "idx_post_created", columnList = "created_at"),
        @Index(name = "idx_post_popular_flag", columnList = "popularFlag"),
})
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private Users user;

    @NotNull
    @Column(nullable = false, length = 30) // 제목 30자 허용
    private String title;

    @NotNull
    @Column(columnDefinition = "TEXT", nullable = false) // 내용 1000자 허용
    private String content;

    @NotNull
    @Column(nullable = false)
    private int views;

    @NotNull
    @Column(nullable = false)
    private boolean isNotice;

    @Enumerated(EnumType.STRING)
    private PopularFlag popularFlag;

    private Integer password;

    /**
     * <h3>게시글 생성</h3>
     *
     * <p>
     * 게시글을 생성하는 정적 팩토리 메서드이다.
     * </p>
     *
     * @since 1.0.0
     * @author Jaeik
     * @param user       작성자 정보
     * @param postReqDTO 게시글 작성 요청 DTO
     * @return 생성된 Post 엔티티
     */
    public static Post createPost(Users user, PostReqDTO postReqDTO) {
        return Post.builder()
                .user(user)
                .title(postReqDTO.getTitle())
                .content(postReqDTO.getContent())
                .views(0)
                .isNotice(false)
                .password(postReqDTO.getPassword())
                .popularFlag(null)
                .build();
    }

    /**
     * <h3>게시글 정보 업데이트</h3>
     *
     * <p>
     * 게시글의 제목과 내용을 업데이트한다.
     * </p>
     * 
     * @since 1.0.0
     * @author Jaeik
     * @param postDTO 업데이트할 게시글 정보
     */
    public void updatePost(PostDTO postDTO) {
        this.title = postDTO.getTitle();
        this.content = postDTO.getContent();
    }

    /**
     * <h3>주간 인기글 설정</h3>
     *
     * <p>
     * 게시글을 주간 인기글로 설정한다.
     * </p>
     * 
     * @since 1.0.0
     * @author Jaeik
     * @param postDTO 게시글 정보
     */
    public void updateWeeklyPopular(PostDTO postDTO) {
        this.popularFlag = PopularFlag.WEEKLY;
    }

    /**
     * <h3>레전더리 글 설정</h3>
     *
     * <p>
     * 게시글을 레전더리로 설정한다.
     * </p>
     * 
     * @since 1.0.0
     * @author Jaeik
     * @param postDTO 게시글 정보
     */
    public void setHallOfFame(PostDTO postDTO) {
        this.popularFlag = PopularFlag.LEGEND;
    }
}
