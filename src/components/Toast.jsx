import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  const type = toast.type || 'info';

  return (
    <motion.div
      id={`toast-${toast.id}`}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 shadow-2xl"
    >
      {icons[type]}
      <span className="text-slate-100 text-sm font-medium">{toast.message}</span>
      <button
        id={`close-toast-${toast.id}`}
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss toast"
        className="p-1 hover:bg-slate-700 rounded-full transition-colors ml-2"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </motion.div>
  );
};

export default Toast;
