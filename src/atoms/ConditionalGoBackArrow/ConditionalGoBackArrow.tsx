import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router';
import Button from '../Button/Button';

interface Props {
    forceShowBackButton?: boolean;
}

const ConditionalGoBackArrow: React.FC<Props> = ({ forceShowBackButton }) => {
    const history = useHistory();
    const [canGoBack] = useState(
        forceShowBackButton || history.action === 'PUSH'
    );
    const onBack = () => history.goBack();

    if (canGoBack)
        return (
            <Button
                label={<IoIosArrowBack size="26" />}
                variant="naked"
                size="s"
                onClick={onBack}
                classes="ConditionalGoBackArrow"
            />
        );

    return <></>;
};

export default ConditionalGoBackArrow;
