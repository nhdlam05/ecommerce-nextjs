import IconButton from 'atoms/Button/IconButton';
import {
    IconBold,
    IconBulletList,
    IconClose,
    IconHeading,
    IconItalic,
    IconRedo,
    IconUndo,
} from 'atoms/Icon';

interface Props {
    editor: any;
    className: string;
    onClose?: VoidFunction;
}

const MenuBar: React.FC<Props> = ({ editor, className, onClose }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className={className}>
            <IconButton
                icon={<IconBold />}
                size="xs"
                theme="dark"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            />
            <IconButton
                icon={<IconItalic />}
                size="xs"
                theme="dark"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            />
            <IconButton
                icon={<IconHeading />}
                size="xs"
                theme="dark"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                    editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
                }
            />
            <IconButton
                icon={<IconBulletList />}
                size="xs"
                theme="dark"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            />
            <IconButton
                icon={<IconUndo />}
                size="xs"
                theme="dark"
                onClick={() => editor.chain().focus().undo().run()}
            />
            <IconButton
                icon={<IconRedo />}
                size="xs"
                theme="dark"
                onClick={() => editor.chain().focus().redo().run()}
            />
            {onClose && (
                <IconButton
                    icon={<IconClose />}
                    size="xs"
                    theme="dark"
                    onClick={onClose}
                />
            )}
        </div>
    );
};

export default MenuBar;
