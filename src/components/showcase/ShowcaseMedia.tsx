import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export function ShowcaseMedia() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Carousel */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Carousel</h2>
                    <div className="flex justify-center">
                        <Carousel className="w-full max-w-xs">
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </section>

                {/* Calendar (Standalone) */}
                <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Calendar (Standalone)</h2>
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow"
                        />
                    </div>
                </section>

            </div>

            {/* Aspect Ratio */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Aspect Ratio</h2>
                <div className="w-[450px]">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
                        <span className="text-muted-foreground">16:9 Aspect Ratio</span>
                    </AspectRatio>
                </div>
                <div className="w-[200px]">
                    <AspectRatio ratio={1 / 1} className="bg-muted rounded-md flex items-center justify-center">
                        <span className="text-muted-foreground">1:1</span>
                    </AspectRatio>
                </div>
            </section>

        </div>
    );
}
