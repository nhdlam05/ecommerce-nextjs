import Checkbox from 'atoms/Checkbox/Checkbox';
import { Gender } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { isNil } from 'lodash';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    defaultValue: Gender | null;
    onChange: (data: { gender: Gender[] | null }) => void;
}

const ANY_VALUE = 'gender_any';

const GENDER_LIST = [
    {
        key: ANY_VALUE,
        label: 'generic.any',
    },
    {
        key: Gender.Male,
        label: 'generic.male',
    },
    {
        key: Gender.Female,
        label: 'generic.female',
    },
];

const GenderFilter: React.FC<Props> = ({ defaultValue, onChange }) => {
    const { translate } = useTranslationWithContext();

    const [gender, setGender] = useState<Gender | null>(defaultValue);

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        if (value === ANY_VALUE && checked) {
            setGender(null);
            onChange({ gender: null });
            logFirebaseEvent('gender_filter_choice_clicked', {
                choice: null,
            });
        } else {
            const newGender = checked ? value : null;
            setGender(newGender);
            onChange({ gender: [newGender] });
            logFirebaseEvent('gender_filter_choice_clicked', {
                choice: newGender,
            });
        }
    };

    useEffect(() => {
        if (defaultValue) {
            setGender(defaultValue);
        } else {
            setGender(null);
        }
    }, [defaultValue]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.gender.title')}
                </Title>
            </div>
            <div className="FilterSelection--singleChoice-wrapper">
                {GENDER_LIST.map((item) => (
                    <Checkbox
                        id={item.key}
                        value={item.key}
                        type="radio"
                        variant="badge"
                        name="gender_filter"
                        key={item.key}
                        align="left"
                        checked={
                            (isNil(gender) && item.key === ANY_VALUE) ||
                            item.key === gender
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

export default GenderFilter;
