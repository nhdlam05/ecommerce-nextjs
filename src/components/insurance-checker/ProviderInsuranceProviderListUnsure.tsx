import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Text from 'atoms/Text/Text';
import {
    InsuranceCompanyCoverageResult,
    InsuranceCoverageConditionOutputType,
    InsuranceCoverageResultType,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useState } from 'react';

interface Props {
    result: InsuranceCompanyCoverageResult;
}

const ProviderInsuranceProviderListUnsure: React.FC<Props> = ({ result }) => {
    const { translate } = useTranslationWithContext();
    const defaultText = translate('insurance.checker.provider.list.unsure');
    const [isShown, setIsShown] = useState(false);

    const onToggle = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsShown(!isShown);
    };
    return (
        <>
            {result.resultType === InsuranceCoverageResultType.Unsure &&
            result.outputDetail?.providerListCondition.outputType ===
                InsuranceCoverageConditionOutputType.Unsure ? (
                <>
                    <Divider spacing="s" />
                    <Text size="xs">
                        {isShown
                            ? defaultText
                            : defaultText.substring(0, 45) + '....'}
                        <Button
                            size="xs"
                            variant="inline"
                            label={translate(
                                isShown ? 'generic.less' : 'generic.more'
                            ).toLowerCase()}
                            onClick={onToggle}
                        />
                    </Text>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ProviderInsuranceProviderListUnsure;
