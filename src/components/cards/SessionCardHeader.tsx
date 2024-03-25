import { Box } from '@mui/material';
import Avatar from 'atoms/Avatar/Avatar';
import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import { Provider, UserFullInfo } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { buildUserNameWithFallback } from 'model/user';
import { CgChevronRight } from 'react-icons/cg';
import { Link } from 'react-router-dom';

interface Props {
    user?: UserFullInfo | Provider;
    channelId: string;
}

const SessionCardHeader: React.FC<Props> = ({ user, channelId }) => {
    const name = buildUserNameWithFallback(user as any);

    const { translate } = useTranslationWithContext();
    const { isUser } = useAccount();

    return (
        <Link to={`conversations/${channelId}`}>
            <div className="SessionCardHeader">
                <Box
                    display="flex"
                    sx={{ p: 2 }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box display="flex" sx={{ textAlign: 'left' }}>
                        <Avatar
                            src={user && user.userInfo?.avatar}
                            size="xxs"
                            name={name}
                        />
                        <Box sx={{ ml: 1 }}>
                            <Title size="s" noMargin>
                                {name}
                            </Title>
                            <Button
                                size="xs"
                                variant="inline"
                                label={translate(
                                    isUser
                                        ? 'generic.go.to.chat'
                                        : 'generic.go.to.profile'
                                )}
                            />
                        </Box>
                    </Box>
                    <span className="SessionCardHeader--BackButton">
                        <CgChevronRight size="22" />
                    </span>
                </Box>
            </div>
        </Link>
    );
};

export default SessionCardHeader;
