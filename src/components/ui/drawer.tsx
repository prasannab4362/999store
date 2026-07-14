"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "./sheet";

export interface DrawerProps extends React.ComponentProps<typeof Sheet> {}

export function Drawer({ ...props }: DrawerProps) {
  return <Sheet {...props} />;
}

export interface DrawerContentProps extends Omit<React.ComponentProps<typeof SheetContent>, "side"> {}

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  DrawerContentProps
>(({ className, children, ...props }, ref) => (
  <SheetContent ref={ref} side="bottom" className={className} {...props}>
    {children}
  </SheetContent>
));
DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = SheetHeader;
export const DrawerTitle = SheetTitle;
export const DrawerDescription = SheetDescription;
export const DrawerClose = SheetClose;
export { SheetTrigger as DrawerTrigger } from "./sheet";
