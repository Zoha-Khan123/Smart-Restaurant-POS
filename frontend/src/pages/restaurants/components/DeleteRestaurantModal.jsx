import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { AlertCircle, Trash2 } from "lucide-react";

export default function DeleteRestaurantModal({
  isOpen,
  onClose,
  restaurant,
  onConfirmDelete,
}) {
  const [loading, setLoading] = useState(false);

  if (!restaurant) return null;

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirmDelete(restaurant.id);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Restaurant Account"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Restaurant
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Danger Warning Box */}
        <div className="p-4 rounded-xl bg-danger-light border border-danger/20 text-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold mb-1">
              Warning: This action is permanent and cannot be undone!
            </p>
            <p>
              Deleting this tenant will permanently remove all associated POS terminal records,
              billing histories, active staff logins, and menu configurations from the platform.
            </p>
          </div>
        </div>

        {/* Selected Restaurant Information */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl ${restaurant.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
          >
            {restaurant.initials}
          </div>
          <div>
            <p className="font-bold text-text-primary text-sm">
              {restaurant.name}
            </p>
            <p className="text-[11px] text-text-muted">
              Owner: {restaurant.ownerName} ({restaurant.ownerEmail})
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
