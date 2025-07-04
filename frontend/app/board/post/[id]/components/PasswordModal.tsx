import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordModalProps {
  isOpen: boolean;
  password: string;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  password,
  onPasswordChange,
  onConfirm,
  onCancel,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button onClick={onConfirm}>확인</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
