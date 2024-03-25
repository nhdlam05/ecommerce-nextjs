import './HeroIcon.scss';

HeroIcon.defaultProps = {
    align: 'left',
    size: 'l',
};

function HeroIcon(props) {
    const mod_class = [
        'HeroIcon',
        props.align !== undefined ? 'align-' + props.align : '',
        props.size !== undefined ? 'size-' + props.size : '',
        props.theme !== undefined ? 'theme-' + props.theme : '',
        props.inactive !== undefined ? 'is-inactive' : '',
    ].join(' ');

    return <div className={mod_class}>{props.children}</div>;
}

export default HeroIcon;
