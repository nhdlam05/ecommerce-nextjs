import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

interface Props {
    children: React.ReactNode;
    onDrop: (data: any) => void;
    onHover?: VoidFunction;
}

const DragAndDropContainer: React.FC<Props> = ({
    children,
    onDrop,
    onHover,
}) => {
    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: [NativeTypes.FILE],
            drop(item: { files: any[] }) {
                if (onDrop) onDrop(item);
            },
            canDrop(item: any) {
                // TODO: add more logic if needed
                return true;
            },
            hover(item: any) {
                onHover && onHover();
            },
            collect: (monitor: DropTargetMonitor) => {
                // const item = monitor.getItem() as any;
                // if (item) {
                //     console.log('collect', item.files, item.items);
                // }

                return {
                    isOver: monitor.isOver(),
                    canDrop: monitor.canDrop(),
                };
            },
        }),
        [onDrop]
    );

    // TODO: add isActive styles
    // const isActive = canDrop && isOver;

    return <div ref={drop}>{children}</div>;
};

export default DragAndDropContainer;
