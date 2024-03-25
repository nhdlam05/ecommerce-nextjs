import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { withStyles } from '@mui/styles';
import { useDebounce, useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';
import './SearchName.scss';

const CustomSearchNameInput = withStyles({
    root: {
        background: 'white',
        borderRadius: '40px',
        fontFamily: 'TTNormsPro, sans-serif',
        color: '#516253',
    },
    notchedOutline: {
        border: 'transparent',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.13)',
    },
})(OutlinedInput);

const CustomModalSearchNameInput = withStyles({
    root: {
        background: 'white',
        borderRadius: '40px',
        fontFamily: 'TTNormsPro, sans-serif',
        color: '#516253',
        width: '100%',
        border: '1px solid rgba(0, 0, 0, 0.15)',
    },
    notchedOutline: {
        border: 'transparent',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.13)',
    },
})(OutlinedInput);

type FilterData = {
    name: string;
};

interface Props {
    defaultValue: string;
    onSubmit: (data: FilterData) => void;
    onClear: (filterNames: string[]) => void;
    variant?: 'modal' | 'normal';
    placeholder?: string;
}

const SearchName: React.FC<Props> = ({
    onSubmit,
    defaultValue,
    onClear,
    variant = 'normal',
    placeholder,
}) => {
    const { translate } = useTranslationWithContext();

    const [value, setValue] = useState('');
    const debouncedSearchName = useDebounce(value, 500);
    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    const handleClear = () => onClear(['name']);

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        } else {
            setValue('');
        }
    }, [defaultValue]);

    useEffect(() => {
        if (debouncedSearchName) {
            onSubmit({ name: value });
            setValue('');
        } else {
            handleClear();
        }
    }, [debouncedSearchName]);

    const SearchNameComponent =
        variant === 'modal'
            ? CustomModalSearchNameInput
            : CustomSearchNameInput;

    return (
        <div className="FilterBar--SearchName">
            <SearchNameComponent
                onChange={handleChange}
                placeholder={
                    placeholder ||
                    translate('provider.search.filter.search.name.placeholder')
                }
                value={value}
                startAdornment={
                    <InputAdornment position="start">
                        <AiOutlineSearch />
                    </InputAdornment>
                }
                endAdornment={
                    defaultValue && defaultValue.length ? (
                        <InputAdornment position="start">
                            <MdClear
                                className="cursor-pointer"
                                onClick={handleClear}
                            />
                        </InputAdornment>
                    ) : (
                        <></>
                    )
                }
            />
        </div>
    );
};

export default SearchName;
