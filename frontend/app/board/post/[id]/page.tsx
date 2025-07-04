import { Metadata } from "next";
import { notFound } from "next/navigation";
import { boardApi } from "@/lib/api";
import { generateStructuredData, generateKeywords } from "@/lib/seo";
import PostDetailClient from "./components/PostDetailClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: postId } = await params;

  try {
    const response = await boardApi.getPost(parseInt(postId));

    if (!response.success || !response.data) {
      return {
        title: "게시글을 찾을 수 없습니다 | 비밀로그",
        description: "요청하신 게시글을 찾을 수 없습니다.",
      };
    }

    const post = response.data;
    const truncatedContent = post.content
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);

    return {
      title: `${post.title} | 비밀로그`,
      description: truncatedContent || "비밀로그 커뮤니티의 게시글입니다.",
      keywords: generateKeywords(["게시글", post.title, post.userName]),
      authors: [{ name: post.userName }],
      openGraph: {
        title: `${post.title} | 비밀로그`,
        description: truncatedContent || "비밀로그 커뮤니티의 게시글입니다.",
        url: `https://grow-farm.com/board/post/${postId}`,
        siteName: "비밀로그",
        images: [
          {
            url: "https://grow-farm.com/log.png",
            width: 326,
            height: 105,
            alt: "비밀로그 로고",
          },
        ],
        locale: "ko_KR",
        type: "article",
        publishedTime: post.createdAt,
        authors: [post.userName],
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} | 비밀로그`,
        description: truncatedContent || "비밀로그 커뮤니티의 게시글입니다.",
        images: ["https://grow-farm.com/log.png"],
      },
    };
  } catch (error) {
    return {
      title: "게시글을 찾을 수 없습니다 | 비밀로그",
      description: "요청하신 게시글을 찾을 수 없습니다.",
    };
  }
}

// 서버 컴포넌트
export default async function PostDetailPage({ params }: Props) {
  const { id: postId } = await params;

  // 서버에서 초기 데이터 가져오기
  try {
    const response = await boardApi.getPost(parseInt(postId));

    if (!response.success || !response.data) {
      notFound();
    }

    // 구조화된 데이터 생성
    const post = response.data;
    const jsonLd = generateStructuredData.article(
      post.title,
      post.content,
      post.userName,
      post.createdAt,
      `https://grow-farm.com/board/post/${postId}`
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostDetailClient initialPost={post} postId={postId} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
