import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter, DialogFullHeader } from 'atoms/Dialog';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Tile from 'atoms/Tile';
import Title from 'atoms/Title/Title';
import {
    ChapterType,
    InsuranceCompany,
    InsurancePackage,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { getPackageDescription } from 'util/insuranceCheckerHelpers';

interface Props {
    insuranceCompany?: InsuranceCompany;
    onSkip: VoidFunction;
    onBack: VoidFunction;
    onReset: VoidFunction;
    onInsurancePackageSelected: (id?: string | null) => void;
    chapterType: ChapterType;
    defaultPackageId?: string;
}

const InsuranceCheckerDropdownPackageList: React.FC<Props> = ({
    insuranceCompany,
    onSkip,
    onReset,
    onInsurancePackageSelected,
    onBack,
    chapterType,
    defaultPackageId,
}) => {
    const { translate } = useTranslationWithContext();
    const [packageId, setPackageId] = useState<string | undefined>(
        defaultPackageId
    );

    const onSubmit = () => onInsurancePackageSelected(packageId);

    if (!insuranceCompany) return <></>;

    const { packages, name } = insuranceCompany;

    return (
        <>
            <DialogFullHeader
                title={translate('generic.select.your.package')}
                onBackButtonClick={onBack}
            />

            <DialogContent>
                <Section spacing="m">
                    {isEmpty(packages) ? (
                        <>
                            <Title size="l" align="center">
                                {translate({
                                    key: 'matching.step.select.insurance.no.covered.title',
                                    context: {
                                        companyName: name,
                                    },
                                })}
                            </Title>
                            <Text size="m" align="center">
                                {translate(
                                    'matching.step.select.insurance.no.covered.subtitle'
                                )}
                            </Text>
                            <DialogFooter>
                                <Button
                                    label={translate(
                                        'insurance.checker.button.select'
                                    )}
                                    onClick={onSkip}
                                />
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <Section spacingBottom="m">
                                <Tile
                                    radius="l"
                                    title={translate(
                                        'matching.step.select.insurance.no.package.title'
                                    )}
                                    subtitle={translate(
                                        'matching.step.select.insurance.no.package.subtitle'
                                    )}
                                    onClick={onSkip}
                                    titleSize="m"
                                    variant="modal"
                                    size="s"
                                />
                            </Section>
                            {packages?.map((item: InsurancePackage) => {
                                const subtitle = getPackageDescription({
                                    coverage: item,
                                    chapterType,
                                });
                                return (
                                    <Tile
                                        key={item.id}
                                        radius="l"
                                        title={item.name}
                                        subtitle={subtitle}
                                        onClick={() => setPackageId(item.id)}
                                        titleSize="m"
                                        variant="modal"
                                        size="s"
                                        className={
                                            packageId === item.id
                                                ? 'tile-active'
                                                : ''
                                        }
                                    />
                                );
                            })}
                            <DialogFooter>
                                <div>
                                    <Button
                                        label={translate(
                                            'insurance.checker.button.select'
                                        )}
                                        onClick={onSubmit}
                                    />
                                </div>
                                <Button
                                    label={translate(
                                        'insurance.checker.button.reset'
                                    )}
                                    onClick={onReset}
                                    variant="naked"
                                />
                            </DialogFooter>
                        </>
                    )}
                </Section>
            </DialogContent>
        </>
    );
};

export default InsuranceCheckerDropdownPackageList;
