import Checkbox from 'atoms/Checkbox/Checkbox';
import { DifferentBetweenTherapyAndCoachingModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { FunnelQuoteType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import { Translatable } from 'translation';
import Title from 'atoms/Title/Title';
import { Box } from '@mui/material';
import Icon, { IconInfoCircle } from 'atoms/Icon';
import { isNil } from 'lodash';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    defaultValue: FunnelQuoteType | null;
    onChange: (data: { quoteTypes: FunnelQuoteType[] | null }) => void;
}

type QuoteType = {
    [key: string]: Translatable;
};

const ANY_VALUE = 'quote_type_any' as FunnelQuoteType;

export const QUOTE_TYPES: QuoteType = {
    [ANY_VALUE]: 'generic.any',
    [FunnelQuoteType.Therapy]: 'generic.therapy',
    [FunnelQuoteType.Coaching]: 'generic.coaching',
};

const QuoteTypesFilter: React.FC<Props> = ({ defaultValue, onChange }) => {
    const [quoteType, setQuoteType] = useState<FunnelQuoteType | null>(
        defaultValue
    );
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        if (value === ANY_VALUE && checked) {
            setQuoteType(null);
            onChange({ quoteTypes: [] });
            logFirebaseEvent('offering_filter_choice_clicked', {
                choices: null,
            });
        } else {
            const newQuoteType = checked ? value : null;
            setQuoteType(newQuoteType);
            onChange({ quoteTypes: [newQuoteType] });
            logFirebaseEvent('offering_filter_choice_clicked', {
                choices: [newQuoteType],
            });
        }
    };

    const showLearnMoreModal = () => {
        showModal(<DifferentBetweenTherapyAndCoachingModal />, {
            isExtralModal: true,
        });
    };

    useEffect(() => {
        if (defaultValue) setQuoteType(defaultValue);
    }, [defaultValue]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Title size="m" noMargin>
                        {translate('provider.search.filter.quote.type.title')}
                    </Title>
                    <Box sx={{ ml: 1 }}>
                        <Icon
                            icon={<IconInfoCircle />}
                            theme="action"
                            size="xxs"
                            onClick={showLearnMoreModal}
                            className="cursor-pointer"
                        />
                    </Box>
                </Box>
            </div>
            <div className="FilterSelection--singleChoice-wrapper">
                {[
                    {
                        quoteType: ANY_VALUE,
                    },
                    {
                        quoteType: FunnelQuoteType.Therapy,
                    },
                    { quoteType: FunnelQuoteType.Coaching },
                ].map((item) => (
                    <Checkbox
                        id={item.quoteType}
                        value={item.quoteType}
                        type="radio"
                        variant="badge"
                        name={item.quoteType}
                        key={item.quoteType}
                        align="left"
                        checked={
                            (isNil(quoteType) &&
                                item.quoteType === ANY_VALUE) ||
                            item.quoteType === quoteType
                        }
                        onChange={handleChange}
                    >
                        {translate(QUOTE_TYPES[item.quoteType])}
                    </Checkbox>
                ))}
            </div>
        </>
    );
};

export default QuoteTypesFilter;
