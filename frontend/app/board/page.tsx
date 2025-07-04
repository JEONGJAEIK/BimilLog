import { Metadata } from "next";
import BoardClient from "./board-client";

export const metadata: Metadata = {
  title: "커뮤니티 게시판",
  description:
    "비밀로그 커뮤니티에서 다른 사용자들과 자유롭게 소통하고 생각을 나눠보세요. 실시간, 주간, 레전드 인기글도 확인할 수 있습니다.",
  keywords: [
    "비밀로그",
    "커뮤니티",
    "게시판",
    "익명",
    "소통",
    "인기글",
    "실시간",
    "주간",
    "레전드",
  ],
  openGraph: {
    title: "비밀로그 커뮤니티 게시판",
    description: "다른 사용자들과 소통하고 인기글을 확인해보세요.",
    url: "https://grow-farm.com/board",
    siteName: "비밀로그",
    images: [
      {
        url: "/bimillog_board_mobile.png",
        alt: "비밀로그 게시판",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "비밀로그 커뮤니티 게시판",
    description: "다른 사용자들과 소통하고 인기글을 확인해보세요.",
    images: ["/bimillog_board_mobile.png"],
  },
};

export default function BoardPage() {
  return <BoardClient />;
}
