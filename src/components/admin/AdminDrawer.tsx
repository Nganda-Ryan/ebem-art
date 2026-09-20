"use client";

import type { ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type AdminDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider drawer for forms */
  wide?: boolean;
};

export function AdminDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  wide = false,
}: AdminDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection="right"
      modal
    >
      <DrawerContent
        className={
          wide
            ? "data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem] data-[swipe-axis=x]:lg:[--drawer-content-width:36rem]"
            : "data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]"
        }
      >
        <DrawerHeader className="border-b border-gray-200 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DrawerTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DrawerTitle>
              {description && (
                <DrawerDescription className="mt-1 text-sm text-gray-500">
                  {description}
                </DrawerDescription>
              )}
            </div>
            <DrawerClose className="rounded-xl px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800">
              Fermer
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && (
          <DrawerFooter className="border-t border-gray-200">{footer}</DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
