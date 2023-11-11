import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
  height?:number;
  width?:number;
}
export const Connect = (props:Props) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div className='flex'
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className='bg-buttonGradient p-[3px] rounded-[30px]'>
                  <button className='bg-black text-rose-300 rounded-[30px] body-font font-comfort text-[1.5vw]' style={{
                    height:props.height?props.height:"6vh",
                    width:props.width?props.width:"14vw",
                  }} onClick={openConnectModal} type="button">
                    <p className='bg-winter bg-clip-text text-transparent'>Connect Wallet</p>
                   
                  </button>
                  </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="bg-black text-[1.2vw] font-sans p-2 rounded-[10px] " style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: "2vw",
                          height: "2vw",
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: "0.7vw",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: "2vw", height: "2vw" }}
                          />
                        )}
                      </div>
                    )}
                    <div className='bg-candy text-transparent bg-clip-text'>
                    <p className=''>{chain.name}</p></div>
                  </button>

                  <button onClick={openAccountModal} type="button">
                  <div className='bg-candy text-transparent bg-clip-text'>
                    <p>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}</p>
                      </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};