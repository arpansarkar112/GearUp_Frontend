"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMyProfile } from "@/lib/api/user";
import { toast } from "@/components/ui/toast";
import { Loader2, UserCog } from "lucide-react";

interface EditProfileModalProps {
  user: any;
  onSuccess?: () => void;
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditProfileModal({ user, onSuccess, children, open, onOpenChange }: EditProfileModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalIsOpen;
  
  const handleOpenChange = (v: boolean) => {
    setInternalIsOpen(v);
    if (onOpenChange) onOpenChange(v);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateMyProfile(formData);
      toast.add({ type: "success", title: "Profile Updated", description: "Your profile has been updated successfully." });
      setIsOpen(false);
      if (onSuccess) onSuccess();
      
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error: any) {
      toast.add({ type: "error", title: "Update Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!open && (
        <DialogTrigger nativeButton={!children} render={
          children || (
            <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-full h-9 w-9 flex-shrink-0" title="Edit Profile" aria-label="Edit Profile">
              <UserCog className="w-4 h-4" />
            </Button>
          )
        } />
      )}
      
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        <DialogHeader className="mb-2 text-left">
          <DialogTitle className="text-2xl font-black text-slate-100 tracking-tight">Edit Profile</DialogTitle>
          <p className="text-sm text-slate-400">Update your personal details below.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="space-y-5">
            
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Full Name
              </Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              />
            </div>
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email} 
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
              />
            </div>

          </div>

          <DialogFooter className="pt-4 border-t border-slate-800 mt-6 sm:justify-end gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="rounded-xl font-bold text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-95"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}