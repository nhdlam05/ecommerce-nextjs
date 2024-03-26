import { Box } from '@mui/material';
import Button from 'atoms/Button/Button';
import BaseImage from 'atoms/Image/BaseImage';
import { usePlatform } from 'hooks';
import { BsFileEarmarkArrowDown } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import './ChatImagePreview.scss';

interface Props {
    url: string;
    name: string;
    height: number;
    onClose: VoidFunction;
    onDownload: (e: any) => void;
}

const ChatImagePreview: React.FC<Props> = ({
    url,
    name,
    height,
    onClose,
    onDownload,
}) => {
    const { isIos, isNativeApp } = usePlatform();
    return (
        <>
            <div className="ChatImagePreview--Backdrop" />
            <div className="ChatImagePreview" onClick={onClose}>
                <div
                    className="ChatImagePreview--ActionButtons"
                    style={{ top: isIos && isNativeApp ? 50 : 10 + 'px' }}
                >
                    <Box sx={{ mr: 1 }}>
                        <Button
                            label={<BsFileEarmarkArrowDown />}
                            theme="white"
                            shape="round"
                            onClick={onDownload}
                        />
                    </Box>
                    <Button
                        label={<CgClose />}
                        theme="white"
                        shape="round"
                        onClick={onClose}
                    />
                </div>
                <div
                    className={`ChatImagePreview--Image ${
                        height > window.innerHeight ? 'big-size' : ''
                    }`}
                >
                    <BaseImage
                        classes="ChatImagePreview--ImageInner"
                        src={url}
                        alt={name}
                        // the img source has been loaded when ChatItemImage rendered
                        // no need to wait for loading again
                        hasLoader={false}
                    />
                </div>
            </div>
        </>
    );
};

export default ChatImagePreview;
