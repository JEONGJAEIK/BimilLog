"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SimplePost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ThumbsUp, MessageCircle, User } from "lucide-react";

interface PopularPostListProps {
  posts: SimplePost[];
  title: string;
  icon: React.ReactNode;
}

export const PopularPostList = ({
  posts,
  title,
  icon,
}: PopularPostListProps) => {
  const router = useRouter();

  const handleAuthorClick = (e: React.MouseEvent, userName: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/rolling-paper/${encodeURIComponent(userName)}`);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li key={post.postId}>
                <Link href={`/board/post/${post.postId}`}>
                  <div className="p-5 md:p-4 rounded-lg hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-purple-600 w-8 text-center">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 hover:text-purple-600 transition-colors text-base">
                          {post.title}
                        </p>
                        <div className="flex items-center space-x-4 text-sm md:text-sm text-gray-500 mt-2 md:mt-1">
                          <button
                            className="hover:text-purple-600 hover:underline transition-colors text-left"
                            title={`${post.userName}님의 롤링페이퍼 보기`}
                            onClick={(e) => handleAuthorClick(e, post.userName)}
                          >
                            {post.userName}
                          </button>
                          <span className="hidden sm:inline">
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-4 h-4 md:w-3 md:h-3 mr-1" />{" "}
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 md:w-3 md:h-3 mr-1" />{" "}
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500">
            인기글이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
