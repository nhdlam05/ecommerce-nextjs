import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from 'react-share';

import './SocialSharing.scss';

import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { useLocation } from 'react-router';

interface Props {
    theme?: 'dark';
    align?: 'center';
    size?: 'l';
    title?: string;
}

const SocialSharing: React.FC<Props> = ({
    theme = 'dark',
    align = 'center',
    size = 'l',
    title = '',
}) => {
    const { pathname } = useLocation();

    const mod_class = [
        'SocialSharing',
        align !== undefined ? 'align-' + align : '',
        size !== undefined ? 'size-' + size : '',
        theme !== undefined ? 'theme-' + theme : '',
    ].join(' ');

    function getTitle() {
        if (title) return title;
        if (document) return document.title;
        return '';
    }

    function getURL() {
        return `${process.env.REACT_APP_AEPSY_APP_URL}/${pathname}/?utm_medium=share`;
    }

    function getHastags() {
        return 'aepsy';
    }

    return (
        <div className={mod_class}>
            <ul>
                {/* Facebook */}
                <li className="SocialSharing--list">
                    <FacebookShareButton
                        url={getURL()}
                        quote={getTitle()}
                        hashtag={getHastags()}
                    >
                        <span className="SocialSharing--icon">
                            <FaFacebook />
                        </span>
                    </FacebookShareButton>
                </li>

                {/* Whatsapp */}
                <li className="SocialSharing--list">
                    <WhatsappShareButton url={getURL()} title={getTitle()}>
                        <span className="SocialSharing--icon">
                            <FaWhatsapp />
                        </span>
                    </WhatsappShareButton>
                </li>

                {/* Linkedin */}
                <li className="SocialSharing--list">
                    <LinkedinShareButton url={getURL()} title={getTitle()}>
                        <span className="SocialSharing--icon">
                            <FaLinkedin />
                        </span>
                    </LinkedinShareButton>
                </li>

                {/* Twitter */}
                <li className="SocialSharing--list">
                    <TwitterShareButton
                        url={getURL()}
                        title={getTitle()}
                        //  hashtag={getHastags()}
                    >
                        <span className="SocialSharing--icon">
                            <FaTwitter />
                        </span>
                    </TwitterShareButton>
                </li>

                {/* Mail */}
                <li className="SocialSharing--list">
                    <EmailShareButton url={getURL()} subject={getTitle()}>
                        <span className="SocialSharing--icon">
                            <HiOutlineMail />
                        </span>
                    </EmailShareButton>
                </li>
            </ul>
        </div>
    );
};

export default SocialSharing;
