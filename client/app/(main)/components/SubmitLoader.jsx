import { Loader2 } from "lucide-react";

export default function SubmitLoader({ loading, label }) {
  return (
    <span>
      {loading ? (
        <span className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {label}
        </span>
      ) : (
        label
      )}
    </span>
  );
}
