import DynamicCard from 'atoms/Card/DynamicCard';
import { useTranslationWithContext } from 'hooks';

const UserArchivedCard = () => {
    const { translate } = useTranslationWithContext();

    return (
        <DynamicCard
            elements={[
                {
                    type: 'title',
                    text: '🗃',
                    align: 'center',
                    size: 'xxl',
                    sx: {
                        mt: 3,
                    },
                },
                {
                    type: 'title',
                    size: 'l',
                    align: 'center',
                    text: translate('archive.client.text'),
                },
                {
                    type: 'text',
                    size: 'm',
                    align: 'center',
                    text: translate('archive.client.hint'),
                },
            ]}
        />
    );
};

export default UserArchivedCard;
