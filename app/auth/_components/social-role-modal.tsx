"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Store, Check } from "lucide-react";

interface SocialRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: "Google" | "Facebook" | null;
  onConfirmRole: (role: "CUSTOMER" | "PROVIDER") => void;
}

export function SocialRoleModal({
  isOpen,
  onClose,
  providerName,
  onConfirmRole,
}: SocialRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  const handleConfirm = () => {
    onConfirmRole(selectedRole);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900/95 border-white/20 text-white backdrop-blur-xl sm:max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <DialogTitle className="text-2xl font-bold text-white">
            Select Your Role
          </DialogTitle>
          <DialogDescription className="text-white/70 text-sm">
            To sign up with {providerName || "social media"}, please select how you plan to use GearUp.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <button
            type="button"
            onClick={() => setSelectedRole("CUSTOMER")}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center gap-2 cursor-pointer ${
              selectedRole === "CUSTOMER"
                ? "border-orange-500 bg-orange-500/20 text-white shadow-lg ring-1 ring-orange-500"
                : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {selectedRole === "CUSTOMER" && (
              <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-0.5 text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
              <User className="w-6 h-6" />
            </div>
            <span className="font-bold text-base">Customer</span>
            <span className="text-xs text-white/60">Rent outdoor gear for your adventures</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("PROVIDER")}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center gap-2 cursor-pointer ${
              selectedRole === "PROVIDER"
                ? "border-orange-500 bg-orange-500/20 text-white shadow-lg ring-1 ring-orange-500"
                : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {selectedRole === "PROVIDER" && (
              <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-0.5 text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
              <Store className="w-6 h-6" />
            </div>
            <span className="font-bold text-base">Provider</span>
            <span className="text-xs text-white/60">List and rent out your gear to others</span>
          </button>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white h-11"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-lg border-none"
          >
            Continue with {providerName || "Social"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
