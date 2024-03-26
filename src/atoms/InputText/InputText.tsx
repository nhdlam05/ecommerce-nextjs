import TextField from '@mui/material/TextField';
import './_InputText.scss';

interface Props {
    className?: string;
    variant?: 'outlined' | 'standard' | 'filled' | undefined;
    id?: string;
    label?: string;
    type?: string;
    name?: string;
    error?: boolean;
    required?: boolean;
    autoComplete?: string;
    value?: any;
    helperText?: string;
    defaultValue?: any;
    placeholder?: string;
    onChange: (e: any) => void;
    onBlur?: (e: any) => void;
    onKeyDown?: (e: any) => void;
    fullWidth?: boolean;
    disabled?: boolean;
}

const InputText: React.FC<Props> = ({
    className = '',
    type,
    onChange,
    variant = 'outlined',
    fullWidth,
    ...others
}) => {
    const mod_class = [
        'InputText',
        className,
        fullWidth ? 'fullWidth' : '',
    ].join(' ');

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        if (type !== 'numberic') {
            onChange(event);
        } else {
            if (Number(value) || value === '' || value === '0') onChange(event);
        }
    };

    return (
        <div className={mod_class}>
            <TextField
                variant={variant}
                onChange={handleChange}
                type={type}
                {...others}
            />
        </div>
    );
};

export default InputText;
