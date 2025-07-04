"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  Check,
  Clock,
  Crown,
  Edit,
  Settings,
  Shield,
  Star,
} from "lucide-react";
import { User, userApi } from "@/lib/api";
import { validateNickname } from "@/util/inputValidation";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/molecules/toast";

interface UserProfileProps {
  user: User;
  onNicknameChange: (newNickname: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onNicknameChange,
  onLogout,
}) => {
  const [nicknameInput, setNicknameInput] = useState(user.userName);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameFormatValid, setIsNicknameFormatValid] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isNicknameChangeSubmitting, setIsNicknameChangeSubmitting] =
    useState(false);
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNicknameInput(newNickname);
    setIsNicknameAvailable(null); // 닉네임이 바뀌면 중복확인 결과 초기화

    const { valid, message } = validateNickname(newNickname);
    setIsNicknameFormatValid(valid);
    setNicknameMessage(message);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameFormatValid) return;
    if (nicknameInput === user.userName) {
      setNicknameMessage("현재 닉네임과 같습니다.");
      setIsNicknameAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await userApi.checkUserName(nicknameInput.trim());
      if (response.success) {
        const isAvailable = response.data ?? false;
        setIsNicknameAvailable(isAvailable);
        setNicknameMessage(
          isAvailable
            ? "사용 가능한 닉네임입니다."
            : "이미 사용중인 닉네임입니다."
        );
      } else {
        setIsNicknameAvailable(false);
        setNicknameMessage(
          response.error || "닉네임 확인 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      console.error(error);
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임 확인 중 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleNicknameSubmit = async () => {
    if (!isNicknameFormatValid || !isNicknameAvailable) return;

    if (
      !window.confirm(
        `닉네임을 "${nicknameInput.trim()}"으로 변경하시겠습니까?\n변경 후 30일 동안 다시 변경할 수 없습니다.`
      )
    ) {
      return;
    }

    setIsNicknameChangeSubmitting(true);
    try {
      const response = await userApi.updateUserName(
        user.userId,
        nicknameInput.trim()
      );
      if (response.success) {
        await onNicknameChange(nicknameInput.trim());
        setIsNicknameDialogOpen(false);
        setNicknameMessage("");
        setIsNicknameAvailable(null);
        showSuccess("닉네임 변경 완료", "닉네임이 성공적으로 변경되었습니다.");
        await onLogout();
      } else {
        showError(
          "닉네임 변경 실패",
          response.error || "닉네임 변경에 실패했습니다."
        );
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      console.error("Failed to update nickname:", error);
      showError("닉네임 변경 실패", "닉네임 변경 중 오류가 발생했습니다.");
    } finally {
      setIsNicknameChangeSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsNicknameDialogOpen(open);
    if (!open) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setNicknameInput(user.userName);
      setNicknameMessage("");
      setIsNicknameFormatValid(false);
      setIsNicknameAvailable(null);
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8 overflow-hidden">
        <CardContent className="p-6 md:p-8 relative">
          {/* 배경 그라디언트 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 opacity-30" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              {/* 아바타 섹션 */}
              <div className="relative mb-4 md:mb-0">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={user.thumbnailImage || undefined}
                    alt={user.userName}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    {getInitials(user.userName)}
                  </AvatarFallback>
                </Avatar>

                {/* 역할 배지 */}
                {user.role === "ADMIN" && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* 사용자 정보 섹션 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {user.userName}
                    </h2>
                    {user.role === "ADMIN" && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        관리자
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <Dialog
                      open={isNicknameDialogOpen}
                      onOpenChange={handleDialogOpenChange}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white border-purple-200 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          닉네임 변경
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>닉네임 변경</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="nickname"
                              className="text-sm font-medium text-gray-700"
                            >
                              닉네임
                            </Label>
                            <div className="flex space-x-2">
                              <div className="flex-1 relative">
                                <Input
                                  id="nickname"
                                  type="text"
                                  placeholder="새 닉네임을 입력하세요"
                                  value={nicknameInput}
                                  onChange={handleNicknameChange}
                                  className={`pr-10 ${
                                    isNicknameAvailable === true
                                      ? "border-green-500 focus-visible:ring-green-500"
                                      : isNicknameAvailable === false
                                      ? "border-red-500 focus-visible:ring-red-500"
                                      : ""
                                  }`}
                                />
                                {isNicknameAvailable === true && (
                                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                                )}
                                {(isNicknameAvailable === false ||
                                  (!isNicknameFormatValid &&
                                    nicknameInput.length > 0)) && (
                                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                                )}
                              </div>
                              <Button
                                variant="outline"
                                onClick={handleCheckNickname}
                                disabled={!isNicknameFormatValid || isChecking}
                                className="px-4"
                              >
                                {isChecking ? "확인중..." : "중복확인"}
                              </Button>
                            </div>
                            {nicknameMessage && (
                              <p
                                className={`text-sm ${
                                  isNicknameAvailable === true
                                    ? "text-green-600"
                                    : isNicknameAvailable === false
                                    ? "text-red-600"
                                    : isNicknameFormatValid
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }`}
                              >
                                {nicknameMessage}
                              </p>
                            )}
                          </div>
                          <Button
                            className="w-full"
                            onClick={handleNicknameSubmit}
                            disabled={
                              !isNicknameAvailable || isNicknameChangeSubmitting
                            }
                          >
                            {isNicknameChangeSubmitting
                              ? "변경 중..."
                              : "닉네임 변경"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* 사용자 부가 정보 */}
                  <div className="space-y-3">
                    {user.kakaoNickname && (
                      <div className="flex items-center justify-center md:justify-start space-x-1 text-gray-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">
                          카카오: {user.kakaoNickname}
                        </span>
                      </div>
                    )}

                    {user.settingDTO && (
                      <div className="flex items-center justify-center md:justify-start space-x-1 text-gray-600">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">알림 설정 완료</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center md:justify-start space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">활성 사용자</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
