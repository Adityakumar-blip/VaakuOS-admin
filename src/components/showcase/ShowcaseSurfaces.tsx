import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from 'lucide-react';

export function ShowcaseSurfaces() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Accordion */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Accordion</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is it styled?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It comes with default styles that matches the other
                                components&apos; aesthetic.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is it animated?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It's animated by default, but you can disable it if you
                                prefer.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Alert Dialog */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Alert Dialog</h2>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            A modal dialog that interrupts the user with important content and expects a response.
                        </p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </section>

                {/* Hover Card */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Hover Card</h2>
                    <div className="flex items-center justify-center">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button variant="link">@nextjs</Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/vercel.png" />
                                        <AvatarFallback>VC</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">@nextjs</h4>
                                        <p className="text-sm">
                                            The React Framework – created and maintained by @vercel.
                                        </p>
                                        <div className="flex items-center pt-2">
                                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                            <span className="text-xs text-muted-foreground">
                                                Joined December 2021
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </section>

                {/* Sheet */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Sheet</h2>
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Open Sheet</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Edit profile</SheetTitle>
                                    <SheetDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex justify-center items-center h-20 border-2 border-dashed rounded-md">
                                        Content Area
                                    </div>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </section>
            </div>

            {/* Resizable */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Resizable Panel</h2>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-[200px] max-w-md rounded-lg border"
                >
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">One</span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={75}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Two</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </section>

            {/* Scroll Area */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Scroll Area & Separator</h2>
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                        {Array.from({ length: 50 }).map((_, i, a) => (
                            <React.Fragment key={i}>
                                <div className="text-sm">
                                    v1.2.0-beta.{a.length - i}
                                </div>
                                <Separator className="my-2" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </section>
        </div>
    );
}
