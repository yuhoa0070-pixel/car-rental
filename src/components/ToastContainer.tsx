"use client";

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'text-blue-500';
        let bgBorder = 'bg-white border-gray-200';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-red-500';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm pointer-events-auto transition-all duration-300 transform translate-y-0 ${bgBorder}`}
            role="alert"
          >
            <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium text-gray-900 leading-tight">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-900 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
