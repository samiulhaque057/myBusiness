import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserByIdMutation } from "@/features/auth/authApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PasswordChange({ user }) {
  const [fields, setFields] = useState({
    password: "",
    confirmPassword: "",
  });

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserByIdMutation();

  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateProfile({
      id: user?.id,
      password: fields.password,
    });

    if (response?.data?.success) {
      toast.success("User password updated successfully");
      setOpen(false);
      setFields({
        password: "",
        confirmPassword: "",
      });
    } else {
      toast.error(response?.error?.data?.error?.message);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-black h-10 text-white hover:bg-opacity-80 rounded-md px-3">
          Change Password
        </DialogTrigger>
        <DialogContent className="overflow-scroll ">
          <DialogHeader>
            <DialogTitle className="pb-6  text-3xl font-bold tracking-tight text-center">
              Update Customers Data
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form>
            <div className="py-3">
              <Label className="block pb-3">New Password</Label>
              <Input
                name="password"
                placeholder="Enter new password"
                type="password"
                value={fields.password}
                onChange={(e) =>
                  setFields({ ...fields, password: e.target.value })
                }
                className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
              />
            </div>
            <div className="py-3">
              <Label className="block pb-3">Confirm Password</Label>
              <Input
                name="confirmPassword"
                placeholder="Enter confirm password"
                type="password"
                value={fields.confirmPassword}
                onChange={(e) =>
                  setFields({ ...fields, confirmPassword: e.target.value })
                }
                className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
              />
              <p className="text-[12px] text-slate-500">
                password must be at least 6 character.
              </p>
            </div>
            <div className="py-3">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  fields.password !== fields.confirmPassword ||
                  !fields.password ||
                  fields.password.length < 5
                }
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submit
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
