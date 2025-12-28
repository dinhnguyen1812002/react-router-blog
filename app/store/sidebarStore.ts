import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
    isOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set, get) => ({
            isOpen: true,

            toggleSidebar: () => {
                set({ isOpen: !get().isOpen });
            },

            setSidebarOpen: (open: boolean) => {
                set({ isOpen: open });
            },
        }),
        {
            name: 'sidebar-storage',
        }
    )
);
