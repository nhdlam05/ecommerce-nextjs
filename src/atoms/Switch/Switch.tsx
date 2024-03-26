interface MyTypes {
    theme?: string;
    size: number;
    isOn: boolean;
}

function Switch({ theme, size, isOn }: MyTypes) {
    function getRandom(x: number, y: number) {
        return Math.pow(x, y);
    }

    return (
        <div>
            <p>{theme}</p>
            <p>{size}</p>
            <p>Random: {getRandom(4, 3)}</p>
            {isOn ? <p>Is ON! </p> : <p>is OFF</p>}
        </div>
    );
}

export default Switch;
