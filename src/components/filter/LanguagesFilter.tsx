import { Grid } from '@mui/material';
import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import Title from 'atoms/Title/Title';
import { FULL_SUPPORTED_LANGUAGES, LIST_LANGUAGES } from 'constants/common';
import { Language } from 'generated/graphql';
import { useRenderLanguage, useTranslationWithContext } from 'hooks';
import { differenceBy } from 'lodash';
import { useEffect, useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import { disableByCountAndChecked } from 'util/globalHelpers';

interface Props {
    defaultValues: Language[];
    onChange: (data: { languages: Language[] }) => void;
}

const LanguagesFilter: React.FC<Props> = ({ defaultValues, onChange }) => {
    const [languages, setLanguages] = useState<Language[]>(defaultValues);
    const { translate } = useTranslationWithContext();
    const { renderLanguage } = useRenderLanguage();
    const [viewAll, setViewAll] = useState(false);

    const otherLanguages = differenceBy(
        LIST_LANGUAGES,
        FULL_SUPPORTED_LANGUAGES
    )
        .sort((a: Language, b: Language) =>
            renderLanguage(a, true).localeCompare(renderLanguage(b, true))
        )
        .map((l) => ({
            value: l,
            language: l,
        }));

    const fullSupportedLanguages = FULL_SUPPORTED_LANGUAGES.map((l) => ({
        value: l,
        language: l,
    }));

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newLanguages = checked
            ? [...languages, value]
            : [...languages].filter((item: Language) => item !== value);
        setLanguages(newLanguages);
        onChange({ languages: newLanguages });
        logFirebaseEvent('language_filter_choice_clicked', {
            choices: newLanguages,
        });
    };

    const onToggleViewAll = () => setViewAll(!viewAll);

    useEffect(() => {
        if (defaultValues) setLanguages(defaultValues);
    }, [defaultValues]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.language.title')}{' '}
                    {languages.length > 0 ? `(${languages.length})` : ''}
                </Title>
            </div>
            <div className="FilterSelection--multiChoice-wrapper">
                <Grid container>
                    {fullSupportedLanguages.map((item: any) => (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            key={item.value}
                        >
                            <Checkbox
                                id={item.language}
                                value={item.language}
                                type="checkbox"
                                variant="inline"
                                name={item.language}
                                align="left"
                                checked={languages.includes(item.language)}
                                onChange={handleChange}
                                disabled={disableByCountAndChecked(
                                    item.count,
                                    languages.includes(item.language)
                                )}
                            >
                                {renderLanguage(item.value)}
                            </Checkbox>
                        </Grid>
                    ))}
                </Grid>

                {viewAll && (
                    <>
                        <Divider />
                        <Grid container sx={{ mt: 2 }}>
                            {otherLanguages.map((item: any) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    key={item.value}
                                >
                                    <Checkbox
                                        id={item.language}
                                        value={item.language}
                                        type="checkbox"
                                        variant="inline"
                                        name={item.language}
                                        align="left"
                                        checked={languages.includes(
                                            item.language
                                        )}
                                        onChange={handleChange}
                                    >
                                        {renderLanguage(item.value)}
                                    </Checkbox>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                <Button
                    variant="inline"
                    label={translate(
                        viewAll ? 'generic.showLess' : 'generic.showMore'
                    )}
                    onClick={onToggleViewAll}
                />
            </div>
        </>
    );
};

export default LanguagesFilter;
