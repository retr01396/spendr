import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#0A0A0C] border border-[#121216] rounded-xl p-6 animate-pulse ${className}`}>
    <div className="h-4 w-24 bg-[#1A1A22] rounded mb-3" />
    <div className="h-8 w-36 bg-[#1A1A22] rounded mb-2" />
    <div className="h-3 w-28 bg-[#121216] rounded" />
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <tr className="border-b border-white/5 animate-pulse">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#1A1A22]" />
        <div className="space-y-1">
          <div className="h-4 w-32 bg-[#1A1A22] rounded" />
          <div className="h-3 w-20 bg-[#121216] rounded" />
        </div>
      </div>
    </td>
    <td className="py-4 px-4"><div className="h-4 w-20 bg-[#1A1A22] rounded" /></td>
    <td className="py-4 px-4"><div className="h-4 w-16 bg-[#1A1A22] rounded" /></td>
    <td className="py-4 px-4"><div className="h-4 w-24 bg-[#1A1A22] rounded" /></td>
    <td className="py-4 px-4"><div className="h-6 w-16 bg-[#1A1A22] rounded-full" /></td>
    <td className="py-4 px-4 text-right"><div className="h-8 w-16 bg-[#1A1A22] rounded ml-auto" /></td>
  </tr>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0A0A0C] border border-[#121216] rounded-xl p-6 h-80 animate-pulse" />
      <div className="bg-[#0A0A0C] border border-[#121216] rounded-xl p-6 h-80 animate-pulse" />
    </div>
  </div>
);
