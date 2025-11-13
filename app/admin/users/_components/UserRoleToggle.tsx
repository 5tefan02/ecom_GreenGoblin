"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRoleToggleProps = {
  userId: string;
  currentRole: string;
};

export function UserRoleToggle({ userId, currentRole }: UserRoleToggleProps) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Nu am putut actualiza rolul.");
      }

      setRole(newRole);
      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error instanceof Error ? error.message : "Eroare la actualizarea rolului.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleRoleChange("user")}
        disabled={isUpdating || role === "user"}
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
          role === "user"
            ? "bg-emerald-100 text-emerald-900"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        }`}
      >
        User
      </button>
      <button
        type="button"
        onClick={() => handleRoleChange("admin")}
        disabled={isUpdating || role === "admin"}
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
          role === "admin"
            ? "bg-emerald-100 text-emerald-900"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        }`}
      >
        Admin
      </button>
    </div>
  );
}

