import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link as LinkIcon,
    ChevronDown,
    MoreHorizontal,
    Superscript,
    Subscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Palette,
    Merge,
    Split,
} from 'lucide-react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { ColorPicker } from './ColorPicker';
import { TurnIntoMenu, getBlockTypeLabel } from './TurnIntoMenu';
import { LinkEditor } from './LinkEditor';

import { Editor } from '@tiptap/react';
import { CellSelection } from '@tiptap/pm/tables';

type ActivePanel = 'none' | 'turnInto' | 'color' | 'link' | 'more';

interface FloatingToolbarProps {
    editor: Editor | null;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = memo(({ editor }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activePanel, setActivePanel] = useState<ActivePanel>('none');
    const [updateTick, setUpdateTick] = useState(0); // Force re-render for active states
    const toolbarRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const { refs, floatingStyles, update } = useFloating({
        placement: 'top',
        middleware: [offset(10), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    // Track selection changes
    useEffect(() => {
        if (!editor) return;

        const updateVisibility = () => {
            const { state } = editor;
            const { from, to, empty } = state.selection;

            if (empty || from === to) {
                setIsVisible(false);
                setActivePanel('none');
                return;
            }

            if (editor.isActive('codeBlock') || editor.isActive('image')) {
                setIsVisible(false);
                return;
            }

            // Hide toolbar when table context menu is open
            if (document.querySelector('.table-context-menu')) {
                setIsVisible(false);
                return;
            }

            // Hide toolbar for CellSelection (when row/col handles are clicked)
            if (state.selection instanceof CellSelection) {
                setIsVisible(false);
                return;
            }

            setIsVisible(true);
            setUpdateTick(t => t + 1); // Force re-render to update formatting button states
        };

        const forceUpdate = () => setUpdateTick(t => t + 1);

        editor.on('selectionUpdate', updateVisibility);
        editor.on('transaction', forceUpdate); // Catch format changes without selection movement
        editor.on('blur', () => {
            setTimeout(() => {
                if (!toolbarRef.current?.contains(document.activeElement) &&
                    !panelRef.current?.contains(document.activeElement)) {
                    setIsVisible(false);
                    setActivePanel('none');
                }
            }, 200);
        });

        return () => {
            editor.off('selectionUpdate', updateVisibility);
            editor.off('transaction', forceUpdate);
        };
    }, [editor]);

    // Position the floating element at the selection
    useEffect(() => {
        if (!editor || !isVisible) return;

        const virtualEl = {
            getBoundingClientRect() {
                const { from, to } = editor.state.selection;
                const start = editor.view.coordsAtPos(from);
                const end = editor.view.coordsAtPos(to);
                return {
                    x: start.left,
                    y: start.top,
                    width: end.right - start.left,
                    height: end.bottom - start.top,
                    top: start.top,
                    left: start.left,
                    right: end.right,
                    bottom: end.bottom,
                };
            },
            contextElement: editor.view.dom,
        };

        refs.setReference(virtualEl);
    }, [editor, isVisible, refs, editor?.state?.selection]);

    // Also update position on scroll of any ancestor
    useEffect(() => {
        if (!editor || !isVisible || !update) return;

        const scrollParents: Element[] = [];
        let el: Element | null = editor.view.dom;
        while (el) {
            if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
                scrollParents.push(el);
            }
            el = el.parentElement;
        }
        // Also listen on window scroll
        const onScroll = (e: Event) => {
            update();
            // Only close panel if scroll is OUTSIDE the panel (not inside the dropdown itself)
            if (panelRef.current && e.target instanceof Node && panelRef.current.contains(e.target)) {
                return; // scrolling inside the panel — keep it open
            }
            setActivePanel('none');
        };
        scrollParents.forEach((sp) => sp.addEventListener('scroll', onScroll as EventListener, { passive: true }));
        window.addEventListener('scroll', onScroll as EventListener, { passive: true });

        return () => {
            scrollParents.forEach((sp) => sp.removeEventListener('scroll', onScroll));
            window.removeEventListener('scroll', onScroll);
        };
    }, [editor, isVisible, update]);

    // Close panels on outside click
    useEffect(() => {
        if (activePanel === 'none') return;

        const handleClick = (e: MouseEvent) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(e.target as Node) &&
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                setActivePanel('none');
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [activePanel]);

    const togglePanel = useCallback((panel: ActivePanel) => {
        setActivePanel((prev) => (prev === panel ? 'none' : panel));
    }, []);

    if (!editor || !isVisible) return null;

    const blockLabel = getBlockTypeLabel(editor);

    return (
        <>
            <div
                ref={(node) => {
                    toolbarRef.current = node;
                    refs.setFloating(node);
                }}
                className="floating-toolbar"
                style={floatingStyles}
            >
                {/* Block type dropdown */}
                <button type="button"
                    className="block-type-btn"
                    onClick={() => togglePanel('turnInto')}
                >
                    {blockLabel}
                    <ChevronDown size={12} />
                </button>

                <div className="toolbar-divider" />

                {/* Formatting buttons */}
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <UnderlineIcon size={16} />
                </button>
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('code') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline Code"
                >
                    <Code size={16} />
                </button>

                <div className="toolbar-divider" />

                {editor.isActive('table') && (
                    <>
                        {editor.can().mergeCells() && (
                            <button type="button"
                                className="toolbar-btn"
                                onClick={() => editor.chain().focus().mergeCells().run()}
                                title="Merge cells"
                            >
                                <Merge size={16} />
                            </button>
                        )}
                        {editor.can().splitCell() && (
                            <button type="button"
                                className="toolbar-btn"
                                onClick={() => editor.chain().focus().splitCell().run()}
                                title="Split cell"
                            >
                                <Split size={16} />
                            </button>
                        )}
                        {(editor.can().mergeCells() || editor.can().splitCell()) && <div className="toolbar-divider" />}
                    </>
                )}

                {/* Link */}
                <button type="button"
                    className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
                    onClick={() => togglePanel('link')}
                    title="Link"
                >
                    <LinkIcon size={16} />
                </button>

                {/* Color */}
                <button type="button"
                    className={`toolbar-btn ${activePanel === 'color' ? 'active' : ''}`}
                    onClick={() => togglePanel('color')}
                    title="Color"
                >
                    <Palette size={16} />
                </button>

                {/* More options */}
                <button type="button"
                    className={`toolbar-btn ${activePanel === 'more' ? 'active' : ''}`}
                    onClick={() => togglePanel('more')}
                    title="More options"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Sub-panels — positioned RELATIVE to toolbar via absolute inside a wrapper */}
            {activePanel !== 'none' && (
                <div
                    ref={panelRef}
                    className="floating-toolbar-panel"
                    style={{
                        ...floatingStyles,
                        // Shift down below the toolbar
                        transform: `${floatingStyles.transform ?? ''} translateY(${(toolbarRef.current?.offsetHeight ?? 40) + 14}px)`,
                    }}
                >
                    {activePanel === 'turnInto' && (
                        <TurnIntoMenu
                            editor={editor}
                            onClose={() => setActivePanel('none')}
                        />
                    )}

                    {activePanel === 'color' && (
                        <div className="editor-dropdown">
                            <ColorPicker editor={editor} onClose={() => setActivePanel('none')} />
                        </div>
                    )}

                    {activePanel === 'link' && (
                        <div className="editor-dropdown">
                            <LinkEditor editor={editor} onClose={() => setActivePanel('none')} />
                        </div>
                    )}

                    {activePanel === 'more' && (
                        <div className="editor-dropdown">
                            <button type="button"
                                className={`dropdown-item ${editor.isActive('superscript') ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().toggleSuperscript().run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><Superscript size={16} /></span>
                                Superscript
                            </button>
                            <button type="button"
                                className={`dropdown-item ${editor.isActive('subscript') ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().toggleSubscript().run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><Subscript size={16} /></span>
                                Subscript
                            </button>
                            <div style={{ height: 1, background: 'hsl(var(--border))', margin: '4px 0' }} />
                            <button type="button"
                                className={`dropdown-item ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('left').run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><AlignLeft size={16} /></span>
                                Align left
                            </button>
                            <button type="button"
                                className={`dropdown-item ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('center').run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><AlignCenter size={16} /></span>
                                Align center
                            </button>
                            <button type="button"
                                className={`dropdown-item ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('right').run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><AlignRight size={16} /></span>
                                Align right
                            </button>
                            <button type="button"
                                className={`dropdown-item ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('justify').run();
                                    setActivePanel('none');
                                }}
                            >
                                <span className="dropdown-icon"><AlignJustify size={16} /></span>
                                Justify
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
});

FloatingToolbar.displayName = 'FloatingToolbar';
