import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';

interface EmojiItem {
    name: string;
    char: string;
}

export interface EmojiListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface EmojiListProps {
    items: EmojiItem[];
    command: (item: { id: string }) => void;
}

export const EmojiList = forwardRef<EmojiListRef, EmojiListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command({ id: item.char });
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));

    if (props.items.length === 0) return null;

    return (
        <div className="bg-popover border border-border shadow-md rounded-lg p-2 min-w-[200px] flex flex-col gap-1 z-50">
            {props.items.map((item: EmojiItem, index: number) => (
                <button
                    type="button"
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted bg-transparent'}`}
                    key={index}
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <span className="text-xl leading-none">{item.char}</span>
                    <span className="font-medium">:{item.name}:</span>
                </button>
            ))}
        </div>
    );
});

EmojiList.displayName = 'EmojiList';
