import { CgChevronRight } from 'react-icons/cg';
import Tile, { TileProps } from './Tile';
import './Tile.scss';

const TileWithArrow: React.FC<TileProps> = (props) => {
    function renderEndSlot() {
        return (
            <span className="Tile--arrowIcon">
                <CgChevronRight />
            </span>
        );
    }

    return (
        <Tile className="TileWithArrow" endSlot={renderEndSlot()} {...props} />
    );
};

export default TileWithArrow;
