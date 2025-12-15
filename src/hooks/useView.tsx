import { ViewContext } from "@/layouts/view";
import { useContext } from "react";

export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView must be used within a ViewProvider");
    }
    return context;
};
