import { Box } from '@mui/material';
import Icon, { IconDown, IconUp } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    ChapterType,
    FunnelQuoteType,
    FunnelQuoteTypeDiscountInfo,
    InsurancePackage,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo } from 'react';
import { getPackageDescription } from 'util/insuranceCheckerHelpers';

interface Props {
    el: InsurancePackage;
    quoteType?: FunnelQuoteType;
    selectable: boolean;
    onToggle: (el: InsurancePackage) => void;
    isShown: boolean;
    forceFullInfoShown: boolean;
    chapterType?: ChapterType;
}

const CoverageDetail: React.FC<Props> = ({
    isShown,
    el,
    quoteType,
    selectable,
    onToggle,
    forceFullInfoShown,
    chapterType,
}) => {
    const { translate } = useTranslationWithContext();
    const fullInfoShown =
        (el.individualDiscountInfo && !selectable) || forceFullInfoShown;
    const description = useMemo(() => {
        return getPackageDescription({
            coverage: el,
            quoteType,
            chapterType,
        });
    }, [quoteType, el]);

    const onClick = () => {
        if (fullInfoShown) onToggle(el);
    };

    return (
        <div onClick={selectable ? undefined : onClick}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
            >
                <div>
                    <Title noMargin size="m">
                        {el.name}
                    </Title>
                    {!isShown && <Text size="s">{description}</Text>}
                </div>
                {fullInfoShown && (
                    <Icon
                        icon={isShown ? <IconUp /> : <IconDown />}
                        size="xxs"
                        onClick={onClick}
                    />
                )}
            </Box>
            {fullInfoShown && isShown ? (
                <Section spacingTop="s">
                    {el.individualDiscountInfo?.map(
                        (item: FunnelQuoteTypeDiscountInfo) => (
                            <Section spacingBottom="xs">
                                <Title size="s" noMargin>
                                    {translate(
                                        item.quoteType ===
                                            FunnelQuoteType.Coaching
                                            ? 'chapter.psychological.coaching'
                                            : 'chapter.psychotherapy'
                                    )}
                                </Title>
                                <Text size="xs">
                                    {item.discountInfo.description ||
                                        translate('generic.no.coverage')}
                                </Text>
                            </Section>
                        )
                    )}
                </Section>
            ) : (
                <></>
            )}
        </div>
    );
};

export default CoverageDetail;
