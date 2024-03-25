import Text from 'atoms/Text/Text';
import Tooltip from './Tooltip';
import { IconButton } from '@mui/material';
import Icon, { IconInfoCircle } from 'atoms/Icon';

interface Props {
    content: string | React.ReactNode;
}

const InformationTooltip: React.FC<Props> = ({ content }) => {
    return (
        <Tooltip title={<Text size="s">{content}</Text>}>
            <IconButton>
                <Icon icon={<IconInfoCircle />} size="tiny" theme="action" />
            </IconButton>
        </Tooltip>
    );
};

export default InformationTooltip;
