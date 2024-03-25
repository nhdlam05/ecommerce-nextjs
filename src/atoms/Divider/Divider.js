import './_Divider.scss';

Divider.defaultProps = {
    invisible: false,
};

function Divider(props) {
    const mod_class = [
        'Divider',
        props.spacing !== undefined ? 'spacing-' + props.spacing : '',
        props.theme !== undefined ? 'theme-' + props.theme : '',
        props.invisible === true ? 'is-invisible' : '',
    ].join(' ');

    return <span className={mod_class}></span>;
}

export default Divider;
