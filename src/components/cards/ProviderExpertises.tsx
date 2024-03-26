import Badge from 'atoms/Badge/Badge';
import { ProviderExpertise } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { take } from 'lodash';
import { useEffect, useState } from 'react';
import { Bagde, getNumberOfBadgesShouldBeRendered } from 'util/common';

interface Props {
    expertises: ProviderExpertise[];
    onShowMore?: VoidFunction;
}

const ProviderExpertises: React.FC<Props> = ({ expertises, onShowMore }) => {
    const { translate } = useTranslationWithContext();
    const [showMore, setShowMore] = useState(false);
    const [numberOfBadgesShouldBeRendered, setNumberOfBadgesShouldBeRendered] =
        useState(getNumberOfBadgesShouldBeRendered(expertises as Bagde[]));

    const [list, setList] = useState(
        take(expertises, numberOfBadgesShouldBeRendered)
    );

    const toggleShowMore = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        onShowMore && onShowMore();
        if (showMore) {
            setList(take(expertises, numberOfBadgesShouldBeRendered));
            setShowMore(false);
        } else {
            setList(expertises);
            setShowMore(true);
        }
    };

    useEffect(() => {
        const newNumber = getNumberOfBadgesShouldBeRendered(
            expertises as Bagde[]
        );
        setNumberOfBadgesShouldBeRendered(newNumber);
        setList(take(expertises, newNumber));
    }, [expertises]);

    return (
        <>
            {list.map((e) => (
                <Badge
                    key={e.key}
                    size="s"
                    label={e.label as string}
                    variant="outlined"
                    onClick={toggleShowMore}
                />
            ))}
            {list.length > 0 && (
                <Badge
                    size="s"
                    label={
                        showMore
                            ? translate('generic.less')
                            : translate('generic.more')
                    }
                    variant="cta"
                    onClick={toggleShowMore}
                />
            )}
        </>
    );
};

export default ProviderExpertises;
