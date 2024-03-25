import './IconText.scss';

function IconText({ icon, text, theme, align }) {
    const mod_class = [
        'IconText',
        theme !== undefined ? 'theme-' + theme : '',
        align !== undefined ? 'align-' + align : '',
    ].join(' ');

    return (
        <div className={mod_class}>
            <div className="IconText--item IconText--icon">{icon}</div>
            <div className="IconText--item IconText--text">{text}</div>
        </div>
    );
}

IconText.defaultProps = {
    theme: undefined, // success, error
    align: 'left', // center
};

export default IconText;
