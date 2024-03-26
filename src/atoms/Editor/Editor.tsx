import Placeholder from '@tiptap/extension-placeholder';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import IconButton from 'atoms/Button/IconButton';
import { IconPlus } from 'atoms/Icon';
import { usePlatform } from 'hooks';
import { useState } from 'react';
import './Editor.scss';
import MenuBar from './MenuBar';

interface Props {
    placeholder?: string;
}

const Editor: React.FC<Props> = ({ placeholder }) => {
    const [menuFooterShown, setMenuFooterShown] = useState(false);
    const { isDesktop } = usePlatform();
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
        ],
    });

    const handleFocus = () => {
        if (editor && editor.isActive('paragraph') && !isDesktop)
            setMenuFooterShown(true);
    };

    const handleBlur = () => {
        if (menuFooterShown) setMenuFooterShown(false);
    };

    const toggleMenuFooter = () => setMenuFooterShown(!menuFooterShown);

    return (
        <>
            <div className="Editor">
                {editor && isDesktop ? (
                    <BubbleMenu
                        editor={editor}
                        tippyOptions={{ duration: 100 }}
                    >
                        <MenuBar editor={editor} className="Editor--menu" />
                    </BubbleMenu>
                ) : (
                    <></>
                )}

                <EditorContent
                    editor={editor}
                    className="Editor--content"
                    // onFocus={handleFocus}
                    // onBlur={handleBlur}
                />
                {!menuFooterShown && isDesktop ? (
                    <div className="Editor--menuFooter">
                        <div className="Editor--shorthandWrapper">
                            <IconButton
                                icon={<IconPlus />}
                                theme="dark"
                                size="xs"
                                onClick={toggleMenuFooter}
                            />
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {menuFooterShown && isDesktop ? (
                    <div className="Editor--menuFooter">
                        <MenuBar
                            editor={editor}
                            className="Editor--menu"
                            onClose={toggleMenuFooter}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {menuFooterShown && !isDesktop ? (
                <div className="Editor--menuFooter">
                    <MenuBar editor={editor} className="Editor--menu" />
                </div>
            ) : (
                <></>
            )}
        </>
    );
};
export default Editor;
