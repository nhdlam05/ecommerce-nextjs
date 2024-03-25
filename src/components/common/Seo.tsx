import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';

interface Props {
    title: string;
    description?: string;
    meta?: any;

    author?: string;
}

const Seo: React.FC<Props> = ({
    description = '',
    meta = [],
    title,
    author,
}) => {
    const { pathname } = useLocation();
    return (
        <Helmet
            title={title}
            titleTemplate={`%s`}
            defer={false}
            meta={[
                {
                    name: `description`,
                    content: description,
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: description,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: author,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: description,
                },
            ].concat(meta)}
        >
            <link
                rel="canonical"
                href={`${process.env.REACT_APP_APP_URL}${pathname}`}
            />
        </Helmet>
    );
};

export default Seo;
