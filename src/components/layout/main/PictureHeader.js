import './_PictureHeader.scss';
// import bgImage from "images/therapistPage/default_background.png";

export default function PictureHeader(props) {
    const mod_class = [
        'PictureHeader',
        props.size ? 'size-' + props.size : 'size-s',
        props.theme ? 'theme-' + props.theme : '',
        props.variant ? 'variant-' + props.variant : '',
    ].join(' ');

    return (
        <div
            className={mod_class}
            style={{
                backgroundImage: 'url(' + props.imageUrl + ')',
            }}
        ></div>
    );
}
