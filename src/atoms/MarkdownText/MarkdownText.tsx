import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import Text from '../Text/Text';
import './MarkdownText.scss';

interface Props {
    content: string;
    size?: string;
}

//todo: handle link to be opened in-app with InAppBrowser
const linkHandler = ({ ...props }) => (
    <Link target="_blank" to={{ pathname: props.href }}>
        {props.children}
    </Link>
);

const MarkdownText: React.FC<Props> = ({ content, size = 's' }) => {
    return (
        <Text tag="div" theme="dark" size={size}>
            <ReactMarkdown
                children={content}
                components={{
                    a: linkHandler,
                }}
                className="MarkdownText"
            />
        </Text>
    );
};

export default MarkdownText;
