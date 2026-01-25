import React from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';

export function ShowcaseInteractive() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Command */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Command</h2>
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>Calendar</CommandItem>
                                <CommandItem>Search Emoji</CommandItem>
                                <CommandItem>Calculator</CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>Profile</CommandItem>
                                <CommandItem>Billing</CommandItem>
                                <CommandItem>Settings</CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </section>

                {/* Context Menu */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Context Menu</h2>
                    <ContextMenu>
                        <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                            Right click here
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-64">
                            <ContextMenuItem inset>
                                Back
                                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem inset disabled>
                                Forward
                                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuItem inset>
                                Reload
                                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                            </ContextMenuItem>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                                <ContextMenuSubContent className="w-48">
                                    <ContextMenuItem>
                                        Save Page As...
                                        <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                                    </ContextMenuItem>
                                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                                    <ContextMenuItem>Name Window...</ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                            <ContextMenuSeparator />
                            <ContextMenuCheckboxItem checked>
                                Show Bookmarks Bar
                                <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                            </ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                            <ContextMenuSeparator />
                            <ContextMenuRadioGroup value="pedro">
                                <ContextMenuLabel inset>People</ContextMenuLabel>
                                <ContextMenuSeparator />
                                <ContextMenuRadioItem value="pedro">
                                    Pedro Duarte
                                </ContextMenuRadioItem>
                                <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                            </ContextMenuRadioGroup>
                        </ContextMenuContent>
                    </ContextMenu>
                </section>

                {/* Dropdown Menu */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Dropdown Menu</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Open Menu</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Keyboard shortcuts
                                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Email</DropdownMenuItem>
                                            <DropdownMenuItem>Message</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>More...</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    New Team
                                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuItem disabled>API</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>

                {/* Input OTP */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Input OTP</h2>
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </section>

                {/* Toggle & Toggle Group */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Toggle</h2>
                    <div className="flex flex-col gap-4">
                        <Toggle aria-label="Toggle bold">
                            <Bold className="h-4 w-4" />
                        </Toggle>
                        <ToggleGroup type="multiple">
                            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                                <Bold className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                                <Italic className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                                <Underline className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </section>
            </div>

        </div>
    );
}
