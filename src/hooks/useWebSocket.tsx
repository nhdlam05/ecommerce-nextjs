import useWebSocket from 'react-use-websocket';

const DEFAULT_PHOENIXA_WEBSOCKET_URL = 'wss://phoenixa-dev.aepsy.com';

const useCustomWebSocket = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        process.env.REACT_APP_PHOENIXA_WEBSOCKET_URL ||
            DEFAULT_PHOENIXA_WEBSOCKET_URL
    );
    return { sendMessage, lastMessage, readyState };
};

export default useCustomWebSocket;
