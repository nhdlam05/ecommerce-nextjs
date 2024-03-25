import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import Module from 'atoms/Module/Module';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { Optional } from 'model/common';
import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logFirebaseEvent } from 'service/auth';
import './DiscoveryCard.scss';

interface Props {
    path: string;
    name: string;
    description?: Optional<string>;
    picture: Optional<string>;
    callToActionText?: Optional<string>;
    badge?: any;
    align?: 'center' | 'left';
}

const DiscoveryCard: React.FC<Props> = ({
    path,
    name,
    description,
    picture,
    badge,
    align = 'left',
    callToActionText,
}) => {
    const history = useHistory();

    const goToPath = () => {
        logFirebaseEvent('user_journey_item_click', {
            name,
            path,
        });
        history.push(path);
    };

    return (
        <div className="DiscoveryCard">
            <Link to={path}>
                <Module radius="xl" highlighted>
                    {badge && badge}
                    {picture && <Image src={picture} size="m" align={align} />}
                    <Title size="m" noMargin align={align}>
                        {name}
                    </Title>
                    {description && (
                        <Text size="xs" align={align}>
                            {description}
                        </Text>
                    )}
                    {callToActionText && (
                        <div className="DiscoveryCard--action">
                            <Button
                                align="center"
                                size="s"
                                variant="naked"
                                label={callToActionText}
                                onClick={goToPath}
                            />
                        </div>
                    )}
                </Module>
            </Link>
        </div>
    );
};
export default DiscoveryCard;
