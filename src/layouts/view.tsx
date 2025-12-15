import React, { createContext, useEffect, useState, ReactNode } from "react";

type ViewType = 'table' | 'card';
interface ViewContextType {
    view: ViewType;
    setView: (newView: ViewType) => void;
}

export const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [view, setViewState] = useState<ViewType>(() => {
        const storedValue = localStorage.getItem("view");
        return (storedValue as ViewType) || 'card';
    });

    const setView = (newView: ViewType) => {
        setViewState(newView);
        localStorage.setItem("view", newView);
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "view" && event.newValue) {
                setViewState(event.newValue as ViewType);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {children}
        </ViewContext.Provider>
    );
};
