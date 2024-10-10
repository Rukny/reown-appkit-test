import Image from "next/image";
import { useAppKit } from '@reown/appkit/react'

export default function ConnectWalletButton() {
  const { open } = useAppKit()

  return (
    <div>
      <button
        onClick={() => open()}
        className="btn btn-app-dark d-flex align-items-center shadow btn-lg border-white rounded-0 w-20 app-text"
        style={{ minHeight: 58 }}
      >
        <Image
          src="/images/wallet-logo.svg"
          height={30}
          width={30}
          alt="wallet logo"
          className="mr-3"
          quality={100}
          style={{ marginRight: "10px" }}
        />
        <span className="app-text" style={{ fontWeight: 400 }}>
          Connect Wallet
        </span>
      </button>
    </div>
  );
}
