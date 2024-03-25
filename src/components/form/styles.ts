import { experimentalStyled as styled } from '@mui/material/styles';

export const ProviderProfileLicenseUploaderWrapper = styled('div')<{
    isHover: boolean;
}>(({ theme, isHover }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(4),
    border: '2px dashed #E4C4B5',
    borderWidth: '2px',
    borderStyle: 'dashed',
    // borderColor: isHover ? '#81c784' : '#E4C4B5',
    borderColor: '#E4C4B5',
    opacity: isHover ? '0.8' : '1',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
    '& input': {
        position: 'absolute',
        width: '100%',
        zIndex: '2',
        opacity: '0',
        top: '0',
        height: '100%',
        cursor: 'pointer',
    },

    '&:hover': {
        '& .Button': {
            bottom: '0',
            background: '#b65a53',
        },
    },
}));

export const LicenseUploaderImageWrapper = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    position: 'relative',
    '& .Button': {
        position: 'absolute',
        height: '25px',
        width: '25px',
        right: '0',
        bottom: '-2px',
    },

    '& .Button--label': {
        fontSize: '0.1rem',
    },
}));
