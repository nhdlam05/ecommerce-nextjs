import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './SelectInput.scss';

// interface Props extends SelectProps {
//     items: any[];
//     helperText?: string;
// }

const SelectInput: React.FC<any> = (props) => {
    const mod_class = ['Select'].join(' ');

    function renderMenuItem(element: any, index: number) {
        if (typeof element === 'string') {
            return (
                <MenuItem key={index} value={element}>
                    {element}
                </MenuItem>
            );
        } else {
            return (
                <MenuItem key={index} value={element.value}>
                    {element.label}
                </MenuItem>
            );
        }
    }

    return (
        <div className={mod_class}>
            <FormControl variant="outlined" error={props.error}>
                <InputLabel id={props.id}>{props.label}</InputLabel>
                <Select
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                        },
                    }}
                    labelId={props.id}
                    id={props.id + '_select'}
                    {...props}
                >
                    {props.placeholder && (
                        <MenuItem
                            disabled
                            value={props.placeholder}
                            key={props.placeholder}
                        >
                            {props.placeholder}
                        </MenuItem>
                    )}
                    {props.items &&
                        props.items.map((element: any, index: any) =>
                            renderMenuItem(element, index)
                        )}
                </Select>
                <FormHelperText error={props.error}>
                    {props.helperText}
                </FormHelperText>
            </FormControl>
        </div>
    );
};

export default SelectInput;
