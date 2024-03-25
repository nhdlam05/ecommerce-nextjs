import Badge from 'atoms/Badge/Badge';
import Tile from 'atoms/Tile';
import { ContentItem, ContentPiece } from 'generated/graphql';
import ContentPieceIcon from 'pages/content-piece/ContentPieceDetailPage/components/ContentPieceIcon';
import { IoCheckmark } from 'react-icons/io5';

interface Props {
    item: ContentPiece;
}

const JourneyItemExtended: React.FC<Props> = ({ item }) => {
    function renderToolTopSlot(item: ContentItem) {
        const { numCompleted } = item.userContentStatus || {};

        return (
            <>
                <ContentPieceIcon type={item.type} />
                <div className="gf gf_v_top">
                    {item.category && (
                        <Badge
                            label={item.category}
                            size="xs"
                            direction="reverse"
                        />
                    )}
                    {!!numCompleted && (
                        <Badge
                            startSlot={<IoCheckmark />}
                            label={numCompleted}
                            size="xs"
                            direction="reverse"
                        />
                    )}
                </div>
            </>
        );
    }

    return (
        <Tile
            key={item.id}
            title={item.name}
            subtitle={item.subtitle || undefined}
            link={`/content/${item.id}`}
            topSlot={renderToolTopSlot(item)}
            titleSize={'m'}
        />
    );
};

export default JourneyItemExtended;
