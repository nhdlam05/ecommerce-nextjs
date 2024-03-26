import { styled } from '@mui/material/styles';
import {
    default as MTooltip,
    tooltipClasses,
    TooltipProps,
} from '@mui/material/Tooltip';

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
    <MTooltip enterTouchDelay={0} {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[4],
        fontSize: 11,
        padding: theme.spacing(2),
        borderRadius: '12px',
    },
}));

export default Tooltip;
