import { useQuery } from '@apollo/client';
import Checkbox from 'atoms/Checkbox/Checkbox';
import { GET_ALL_DISODERS } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { Grid } from '@mui/material';
import Section from 'atoms/Section/Section';
import Button from 'atoms/Button/Button';

interface Props {
    defaultValues: string[];
    onChange: (data: { symptoms: string[] }) => void;
}

const SymptomsFilter: React.FC<Props> = ({ defaultValues, onChange }) => {
    const { translate } = useTranslationWithContext();
    const { data: allDisordersRes } = useQuery(GET_ALL_DISODERS);
    const [symptoms, setSymptoms] = useState<string[]>(defaultValues);
    const [viewAll, setViewAll] = useState(false);

    const handleSymptomChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newSymptoms = checked
            ? [...symptoms, value]
            : [...symptoms].filter((item: string) => item !== value);
        setSymptoms(newSymptoms);
        onChange({ symptoms: newSymptoms });
    };

    const onToggleViewAll = () => setViewAll(!viewAll);

    useEffect(() => {
        if (defaultValues) setSymptoms(defaultValues);
    }, [defaultValues]);

    if (!allDisordersRes) return <></>;

    const { allDisorders } = allDisordersRes;

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.topic.title')}{' '}
                    {symptoms.length > 0 ? `(${symptoms.length})` : ''}
                </Title>
            </div>
            <div className="FilterSelection--multiChoice-wrapper">
                <Grid
                    container
                    className={`FilterSelection--toggle ${
                        viewAll ? 'view-all' : ''
                    }`}
                >
                    {allDisorders.map((item: any) => (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            key={item.label}
                        >
                            <Checkbox
                                id={item.label}
                                value={item.key}
                                type="checkbox"
                                variant="inline"
                                align="left"
                                name={item.label}
                                defaultChecked={symptoms.includes(item.key)}
                                onChange={handleSymptomChange}
                            >
                                {item.label}
                            </Checkbox>
                        </Grid>
                    ))}
                </Grid>
                <Section spacingBottom="s">
                    <Button
                        variant="inline"
                        label={translate(
                            viewAll ? 'generic.showLess' : 'generic.showMore'
                        )}
                        onClick={onToggleViewAll}
                    />
                </Section>
            </div>
        </>
    );
};

export default SymptomsFilter;
