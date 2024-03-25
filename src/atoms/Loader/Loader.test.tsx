import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
    // or something more meaningful
    it('should render', () => {
        const { baseElement } = render(<Loader />);
        expect(baseElement).toBeDefined();
    });
});
