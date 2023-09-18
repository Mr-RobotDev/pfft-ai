declare module '@guna81/react-ticker' {
  export interface ReactTickerProps {
    data: string[];
    speed: number;
    keyName?: string;
    // Add more prop types based on the library's documentation
  }

  export const ReactTicker: React.FC<ReactTickerProps>;
}
