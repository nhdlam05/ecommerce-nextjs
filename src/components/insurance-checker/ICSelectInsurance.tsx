import { Box } from '@mui/material';
import Divider from 'atoms/Divider/Divider';
import Icon, { IconInsurance } from 'atoms/Icon';
import SelectInput from 'atoms/SelectInput/SelectInput';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { InsuranceCompany } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { Trans } from 'react-i18next';

interface Props {
    defaultValue?: string;
    insuranceList: Array<InsuranceCompany>;
    onSelect: (event: any) => void;
}

const ICSelectInsurance: React.FC<Props> = ({
    insuranceList,
    onSelect,
    defaultValue,
}) => {
    const { translate } = useTranslationWithContext();
    const getItems = () =>
        insuranceList.map((insurance: InsuranceCompany) => ({
            label: insurance.name,
            value: insurance.id,
        }));

    return (
        <div className="ICSelectInsurance">
            <Box display="flex" alignItems="flex-start">
                <Box sx={{ width: '100%', pr: 3 }}>
                    <Title size="s">
                        {translate('provider.insurance.checker.subtitle')}
                    </Title>
                    <Divider invisible spacing="xs" />
                    <div className="g_clearfix">
                        <div className="g_4_4">
                            <SelectInput
                                items={getItems()}
                                id="ICSelectInsurance"
                                value={null}
                                defaultValue={defaultValue}
                                displayEmpty
                                renderValue={() => (
                                    <>
                                        {translate(
                                            'provider.insurance.checker.input'
                                        )}
                                    </>
                                )}
                                onChange={onSelect}
                            />
                        </div>
                    </div>
                    <Divider invisible spacing="xxs" />

                    <Text size="xxs">
                        <Trans i18nKey="provider.insurance.checker.desc">
                            <a
                                href="https://aepsy.com/blog/versicherung-kosten-psychotherapie"
                                target="_blank"
                            />
                        </Trans>
                    </Text>
                </Box>
            </Box>
        </div>
    );
};

export default ICSelectInsurance;
