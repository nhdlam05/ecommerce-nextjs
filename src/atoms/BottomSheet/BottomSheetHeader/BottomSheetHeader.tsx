import { Box } from '@mui/material';
import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import React from 'react';
import { CgChevronLeft, CgClose } from 'react-icons/cg';
import { Translatable } from 'translation';
import './BottomSheetHeader.scss';

interface Props {
    title?: string | Translatable;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
    onCloseButtonClick?: () => void;
    hasCloseButton?: boolean;
}
const BottomSheetHeader: React.FC<Props> = ({
    showBackButton = false,
    title,
    onBackButtonClick,
    onCloseButtonClick,
    hasCloseButton = true,
}) => {
    const backButtonClass = [
        'BottomSheetHeader--back BottomSheetHeader--icon',
        Boolean(onBackButtonClick) && 'is-visible',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className="BottomSheetHeader" style={{ position: 'relative' }}>
            <div className="BottomSheetHeader--dragIndicator"></div>
            <Box sx={{ position: 'absolute', left: 0, top: '-10px' }}>
                <div className={backButtonClass}>
                    <Button
                        size="l"
                        variant="inline"
                        label={<CgChevronLeft size="25" />}
                        onClick={onBackButtonClick}
                    />
                </div>
            </Box>

            {/* Title */}
            <div>
                {title && (
                    <Title noMargin align="center" size="s" tag="p">
                        <>{title}</>
                    </Title>
                )}
            </div>

            <Box sx={{ position: 'absolute', right: 0, top: '-10px' }}>
                {/* Cross to close */}
                {hasCloseButton && (
                    <div className="BottomSheetHeader--close BottomSheetHeader--icon">
                        <Button
                            size="l"
                            variant="inline"
                            label={<CgClose size="22" />}
                            onClick={onCloseButtonClick}
                        />
                    </div>
                )}
            </Box>

            {title && <div className="BottomSheetHeader--divider"> </div>}
        </div>
    );
};

export default BottomSheetHeader;
