import React, { useState } from 'react';
import { Trash2, X, AlertOctagon } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingSubscription, closeDeleteModal, deleteSubscription } = useSubscription();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!deletingSubscription) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    const success = await deleteSubscription(deletingSubscription.id);
    setIsDeleting(false);
    if (!success) {
      setErrorMsg('Failed to delete subscription. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <button
          onClick={closeDeleteModal}
          className="absolute top-4 right-4 text-[#8888A0] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#FF3B30]">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Delete subscription?</h3>
            <p className="text-xs text-[#8888A0]">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-[#E0E0E0]">
          Are you sure you want to remove <span className="font-semibold text-white">"{deletingSubscription.name}"</span> from SPENDR?
        </p>

        {errorMsg && (
          <p className="text-xs text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 p-2 rounded">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-[#8888A0] hover:text-white bg-[#1A1A22] hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#E50914] hover:bg-[#FF3B30] rounded-lg shadow-red-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
