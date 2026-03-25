import { Toast, ToastType } from "@/components/ui/Toast";
import React, { createContext, useContext, useRef, useState } from "react";

type ToastOptions = {
    message: string;
    type?: ToastType;
    duration?: number;
};

type ToastContextType = {
    showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<(ToastOptions & { visible: boolean }) | null>(null);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (options: ToastOptions) => {
        if (timeout.current) clearTimeout(timeout.current);
        setToast({ ...options, visible: true });
        timeout.current = setTimeout(() => {
            setToast(null);
        }, options.duration ?? 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type ?? "info"}
                    visible={toast.visible}
                />
            )}
        </ToastContext.Provider>
    );
};
