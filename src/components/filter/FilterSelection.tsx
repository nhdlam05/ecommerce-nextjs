import Button from 'atoms/Button/Button';
import Icon, { IconFilterAdjust } from 'atoms/Icon';
import './FilterSelection.scss';
import Title from 'atoms/Title/Title';
import { useContext, useEffect, useState } from 'react';
import { DialogMode, ModalContext } from 'context/modal';
import FilterSelectionDetail from './FilterSelectionDetail';
import { usePlatform } from 'hooks';
import { isArray, isBoolean, isEmpty, isNil, isString } from 'lodash';
import SearchName from './SearchName';
import { FunnelQuoteType, FunnelSearchSource } from 'generated/graphql';
import { LIST_SEARCH_VALUE } from 'model/search';

export type FilterConfigType = {
    searchName?: boolean;
    topic?: boolean;
    quoteTypes?: boolean;
    availability?: boolean;
    chapterType?: boolean;
    languages?: boolean;
    location?: boolean;
    insurances?: boolean;
    basicInsuranceCoverageChoice?: boolean;
    symptoms?: boolean;
    gender?: boolean;
};

const FILTER_CONFIG: FilterConfigType = {
    searchName: true,
    topic: true,
    quoteTypes: true,
    availability: true,
    chapterType: true,
    languages: true,
    location: true,
    insurances: true,
    basicInsuranceCoverageChoice: false,
    symptoms: true,
    gender: true,
};

interface Props {
    filterConfig?: FilterConfigType;
    searchValue: any;
    updateSearch: (input: any) => void;
    onClearSearchValue: (filterNames: string[]) => void;
    onReset: VoidFunction;
    preferredQuoteType: FunnelQuoteType;
    searchSource: FunnelSearchSource;
}

const FilterSelection: React.FC<Props> = ({
    searchValue,
    filterConfig,
    updateSearch,
    onClearSearchValue,
    onReset,
    preferredQuoteType,
    searchSource,
}) => {
    const config = { ...FILTER_CONFIG, ...filterConfig };

    const { isDesktop } = usePlatform();
    const { showModal, hideModal } = useContext(ModalContext);
    const [filterCount, setFilterCount] = useState(0);

    const onFilterReset = () => {
        setFilterCount(0);
        onReset();
    };

    const onClick = () => {
        showModal(
            <FilterSelectionDetail
                onClearSearchValue={onFilterReset}
                updateSearch={updateSearch}
                filterConfig={config}
                onClose={hideModal}
                searchValue={searchValue}
                preferredQuoteType={preferredQuoteType}
                searchSource={searchSource}
            />,
            {
                mode: DialogMode.Custom,
                className: 'FilterSelectionDetail',
            }
        );
    };

    useEffect(() => {
        if (searchValue) {
            const newFilter = LIST_SEARCH_VALUE.filter((item: any) => {
                const value = searchValue[item];
                if (isArray(value) || isString(value)) {
                    return !isEmpty(value);
                }
                if (isBoolean(value)) {
                    return true;
                }
                return !isNil(value);
            });
            if (newFilter) setFilterCount(newFilter.length);
        }
    }, [searchValue]);

    return (
        <div className="FilterSelection">
            {config.searchName && (
                <div className="FilterSelection--searcrName">
                    <SearchName
                        defaultValue={searchValue.name}
                        onSubmit={updateSearch}
                        onClear={onClearSearchValue}
                    />
                </div>
            )}
            {filterCount > 0 && (
                <div className="FilterSelection--badge">
                    <Title size="xs" noMargin theme="white">
                        {filterCount}
                    </Title>
                </div>
            )}

            <Button
                onClick={onClick}
                size={isDesktop ? 'm' : 's'}
                theme="ghosted"
                radius="xs"
                label="Filter"
                variant="outlined"
                icon={<Icon icon={<IconFilterAdjust />} size="xs" />}
            />
        </div>
    );
};

export default FilterSelection;
