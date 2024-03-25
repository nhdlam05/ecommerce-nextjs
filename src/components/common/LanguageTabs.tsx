import { Box } from '@mui/material';
import Icon, { IconCheck, IconError } from 'atoms/Icon';
import Tab from 'atoms/Tab';
import { LocalizedText, Maybe } from 'generated/graphql';
import { useMemo } from 'react';
import { find, get, isEmpty } from 'lodash';

interface Props {
    data?: Maybe<LocalizedText[]>;
    activeTab: string;
    onActiveTabChange: (activeTab: string) => void;
    languageCodes: string[];
}
const LanguageTabs: React.FC<Props> = ({
    data,
    activeTab,
    onActiveTabChange,
    languageCodes,
}) => {
    const list = useMemo(
        () =>
            languageCodes.map((code: string) => {
                const content = data
                    ? get(
                          find(
                              data,
                              (item: LocalizedText) => item.locale === code
                          ),
                          'content',
                          ''
                      )
                    : '';
                return {
                    label: code,
                    error: isEmpty(content),
                };
            }),
        [languageCodes]
    );

    return (
        <Box display="flex" sx={{ overflow: 'auto' }}>
            {list.map((item) => (
                <Box sx={{ mr: 1 }} key={item.label}>
                    <Tab
                        variant="outlined"
                        onClick={() => onActiveTabChange(item.label)}
                        active={activeTab === item.label}
                        label={item.label.toUpperCase()}
                        startSlot={
                            <Icon
                                icon={
                                    item.error ? <IconError /> : <IconCheck />
                                }
                                theme={item.error ? 'danger' : 'dark'}
                            />
                        }
                        theme={item.error ? 'danger' : 'dark'}
                    />
                </Box>
            ))}
        </Box>
    );
};
export default LanguageTabs;
