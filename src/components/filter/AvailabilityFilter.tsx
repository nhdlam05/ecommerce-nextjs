import Checkbox from 'atoms/Checkbox/Checkbox';
import { SUPPORTED_AVAILABILITY_DATA } from 'constants/common';
import { AvailabilityType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { isNil } from 'lodash';
import { logFirebaseEvent } from 'service/auth';

const ANY_VALUE = 'availability_any';

interface Props {
    defaultValue: AvailabilityType;
    onChange: (data: { availability: AvailabilityType | null }) => void;
}

const AvailabilityFilter: React.FC<Props> = ({ defaultValue, onChange }) => {
    const [availability, setAvailability] = useState<AvailabilityType | null>(
        defaultValue
    );

    const { translate } = useTranslationWithContext();

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        if (value === ANY_VALUE && checked) {
            setAvailability(null);
            onChange({ availability: null });
            logFirebaseEvent('availability_filter_choice_clicked', {
                choice: null,
            });
        } else {
            const newAvailability = checked ? value : null;
            setAvailability(newAvailability);
            onChange({ availability: newAvailability });
            logFirebaseEvent('availability_filter_choice_clicked', {
                choice: newAvailability,
            });
        }
    };

    useEffect(() => {
        if (defaultValue) {
            setAvailability(defaultValue);
        } else {
            setAvailability(null);
        }
    }, [defaultValue]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.availability.title')}
                </Title>
            </div>
            <div className="FilterSelection--singleChoice-wrapper">
                {[
                    { label: 'generic.any', key: ANY_VALUE },
                    ...SUPPORTED_AVAILABILITY_DATA,
                ].map((item: any) => (
                    <Checkbox
                        id={item.key}
                        value={item.key}
                        type="radio"
                        variant="badge"
                        name={item.key}
                        key={item.key}
                        align="left"
                        checked={
                            (isNil(availability) && item.key === ANY_VALUE) ||
                            item.key === availability
                        }
                        onChange={handleChange}
                    >
                        {translate(item.label)}
                    </Checkbox>
                ))}
            </div>
        </>
    );
};

export default AvailabilityFilter;
