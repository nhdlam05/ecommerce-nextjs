import Loader from 'atoms/Loader/Loader';
import Module from 'atoms/Module/Module';
import Tile from 'atoms/Tile';
import Title from 'atoms/Title/Title';
import { InsuranceCompany } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import './InsuranceCompanyInfo.scss';
import Icon, { IconPlus } from 'atoms/Icon';

interface Props {
    insuranceCompany?: InsuranceCompany;
    variant?: 'selectPage' | 'modal' | null;
    showInsuranceDetailModal: (id: string) => void;
}

const InsuranceCompanyInfo: React.FC<Props> = ({
    insuranceCompany,
    variant,
    showInsuranceDetailModal,
}) => {
    const { translate } = useTranslationWithContext();
    if (!insuranceCompany) return <Loader />;

    const { id, name } = insuranceCompany;

    return (
        <Module
            variant={variant}
            radius="xl"
            padding="m"
            onClick={() => showInsuranceDetailModal(id)}
            className="cursor-pointer"
            theme="purple"
        >
            <Tile
                title={
                    <Title size="m" noMargin>
                        {name} -{' '}
                        <Title tag="span" size="m" theme="soft">
                            {translate(
                                'insurance.company.info.add.your.package'
                            )}
                        </Title>
                    </Title>
                }
                subtitle={translate('insurance.company.info.to.see.full')}
                topRightSlot={<Icon theme="purple" icon={<IconPlus />} />}
                noMargin
            />
        </Module>
    );
};

export default InsuranceCompanyInfo;
