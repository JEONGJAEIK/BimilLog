import React, { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Textarea } from "@/components/atoms/textarea";
import { Alert, AlertDescription } from "@/components/molecules/alert";
import { Flag, AlertTriangle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  type: "게시글" | "댓글";
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minLength = 10;
  const maxLength = 500;
  const currentLength = reason.trim().length;
  const isValid = currentLength >= minLength && currentLength <= maxLength;

  const handleSubmit = async () => {
    if (!isValid) {
      setError(
        `신고 사유는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reason.trim());
      handleClose();
    } catch {
      setError("신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setReason("");
    setError("");
    setIsSubmitting(false);
    onClose();
  };

  const getCharacterCountColor = () => {
    if (currentLength < minLength) return "text-red-500";
    if (currentLength > maxLength) return "text-red-500";
    return "text-green-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flag className="w-5 h-5" />
            {type} 신고하기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              부적절한 내용이나 규정 위반 {type}를 신고해주세요. 허위 신고 시
              제재를 받을 수 있습니다.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              신고 사유 <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder={`${type} 신고 사유를 자세히 입력해주세요.\n예시: 욕설, 스팸, 허위정보, 개인정보 노출 등`}
              className={`min-h-[120px] resize-none ${
                currentLength > 0 && !isValid
                  ? "border-red-300 focus:border-red-500"
                  : ""
              }`}
              maxLength={maxLength + 50} // 타이핑 시 잠시 초과 허용
            />

            <div className="flex justify-between items-center text-sm">
              <div className={`font-medium ${getCharacterCountColor()}`}>
                {currentLength < minLength ? (
                  <span>
                    최소 {minLength}자 이상 입력해주세요 (
                    {minLength - currentLength}자 부족)
                  </span>
                ) : currentLength > maxLength ? (
                  <span>
                    최대 {maxLength}자까지 입력 가능합니다 (
                    {currentLength - maxLength}자 초과)
                  </span>
                ) : (
                  <span>입력 가능</span>
                )}
              </div>
              <div className={`${getCharacterCountColor()}`}>
                {currentLength}/{maxLength}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "신고 중..." : "신고하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
