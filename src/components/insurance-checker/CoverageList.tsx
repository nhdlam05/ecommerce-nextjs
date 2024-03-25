import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import Table from 'atoms/Table/Table';
import Text from 'atoms/Text/Text';
import {
    ChapterType,
    FunnelQuoteType,
    InsurancePackage,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';
import { NoCoverPackage } from './ICInsuranceDetail';
import CoverageDetail from './CoverageDetail';
import { useState } from 'react';

interface Props {
    packages: Array<InsurancePackage>;
    selectable?: boolean;
    selectedValue?: InsurancePackage | NoCoverPackage;
    setSelectedValue: (
        selectedValue: InsurancePackage | NoCoverPackage
    ) => void;
    defaultValue?: string;
    quoteType?: FunnelQuoteType;
    forceFullInfoShown?: boolean; // TODO: remove it after the full info always visible
    chapterType?: ChapterType;
}
const CoverageList: React.FC<Props> = ({
    defaultValue,
    packages,
    selectable = false,
    selectedValue,
    setSelectedValue,
    quoteType,
    forceFullInfoShown = false,
    chapterType,
}) => {
    const [itemViewing, setItemViewing] = useState<string>();
    const { translate } = useTranslationWithContext();

    const getDefaultCheck = (el: any) => {
        if (el.id === defaultValue) return true;
        return selectedValue?.id ? selectedValue.name === el.name : false;
    };

    const onToggle = (el: InsurancePackage) => {
        setItemViewing(itemViewing === el.id ? undefined : el.id);
    };

    if (isEmpty(packages)) {
        return (
            <div>
                <Text tag="p" size="s">
                    {translate('coverage.list.no.info')}
                </Text>
                <Divider spacing="xs" invisible />
                <Text tag="p" size="s">
                    {translate('coverage.list.send.a.message')}
                </Text>
                <Divider spacing="xs" invisible />
            </div>
        );
    }
    return (
        <>
            <Table variant="block">
                {packages.map((el) => {
                    return (
                        <div key={el.name}>
                            <Checkbox
                                selectable={selectable}
                                value={el.name}
                                name="CoverageList"
                                id={`CoverageList_${el.name}`}
                                type="radio"
                                variant="tile"
                                align="left"
                                theme="purple"
                                onChange={() => setSelectedValue(el)}
                                defaultChecked={getDefaultCheck(el)}
                            >
                                <CoverageDetail
                                    isShown={el.id === itemViewing}
                                    el={el}
                                    quoteType={quoteType}
                                    selectable={selectable}
                                    onToggle={onToggle}
                                    forceFullInfoShown={forceFullInfoShown}
                                    chapterType={chapterType}
                                />
                            </Checkbox>
                        </div>
                    );
                })}
            </Table>
        </>
    );
};

export default CoverageList;
