import {
    RiFacebookCircleFill,
    RiInstagramLine,
    RiLinkedinBoxFill,
} from 'react-icons/ri';
import './SocialMediaLinks.scss';

export default function SocialMediaLinks() {
    return (
        <ul className="SocialMediaLinks">
            <li className="SocialMediaLinks--item">
                <a
                    href="https://www.instagram.com/aepsy_/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <RiInstagramLine />
                </a>
            </li>
            <li className="SocialMediaLinks--item">
                <a
                    href="https://www.linkedin.com/company/aepsy/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <RiLinkedinBoxFill />
                </a>
            </li>
            <li className="SocialMediaLinks--item">
                <a
                    href="https://www.facebook.com/aepsyhealth"
                    target="_blank"
                    rel="noreferrer"
                >
                    <RiFacebookCircleFill />
                </a>
            </li>
        </ul>
    );
}
