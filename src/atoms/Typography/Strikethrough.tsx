import { StrikethroughStyled } from './styles';
import { Props } from './Typography';

const Strikethrough: React.FC<Props> = (props) => {
    return <StrikethroughStyled {...props} />;
};

export default Strikethrough;
